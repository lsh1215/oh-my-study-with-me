---
description: GitHub Actions와 Slack을 연동한 일일 복습 퀴즈 시스템을 구축합니다. Leitner System 기반 간격 반복으로 학습 내용을 자동 복습합니다. 사용자가 퀴즈 시스템, 복습 자동화, spaced repetition을 언급하면 이 스킬을 사용합니다.
user-invocable: true
---

# Setup Quiz - 슬랙 일일 복습 퀴즈 시스템 구축

인자: $ARGUMENTS

## 개요
학습한 내용을 잊지 않도록, GitHub Actions + Slack으로 매일 저녁 8시에 복습 퀴즈를 보내는 시스템을 구축한다.
Leitner System 기반 간격 반복(Spaced Repetition)으로 약한 부분은 자주, 체득한 부분은 드물게 출제한다.

## 전체 아키텍처

```
[/oh-my-study-with-me:study 학습 세션]
  Phase 3 검증 → 퀴즈 자동 생성 → quizzes/quiz_bank.json 저장
                                          ↓
[GitHub Actions - 매일 20:00 KST 크론]
  1) 어제 퀴즈 스레드 읽기 (Slack API conversations.replies)
  2) 답변에서 키워드 매칭 → 정답/오답 판정
  3) quiz_bank.json Leitner Box 업데이트
  4) 오늘 복습 대상 퀴즈 1개 선택
  5) Slack 전용 채널에 발송
  6) 변경사항 자동 커밋 + 푸시
```

## Step 1: 사전 준비 확인

사용자에게 아래 항목을 확인한다:

### 1-1. Slack App 생성
- https://api.slack.com/apps 에서 "Create New App" → "From scratch"
- App 이름: `StudyWithMe Quiz Bot` (또는 원하는 이름)
- Workspace: 사용자의 워크스페이스 선택

### 1-2. Bot Token Scopes 설정
OAuth & Permissions 에서 아래 Bot Token Scopes 추가:
- `chat:write` - 메시지 발송
- `channels:history` - 채널 메시지 읽기 (스레드 답변 확인용)
- `channels:join` - 채널 참여

### 1-3. Bot 설치 및 토큰 획득
- "Install to Workspace" 클릭
- `xoxb-` 로 시작하는 Bot User OAuth Token 복사

### 1-4. Slack 전용 채널 생성
- `#daily-quiz` 채널 생성 (또는 원하는 이름)
- 봇을 채널에 초대: `/invite @StudyWithMe Quiz Bot`
- 채널 ID 확인 (채널 이름 우클릭 → 채널 세부정보 → 하단에 채널 ID)

### 1-5. GitHub Secrets 설정
리포지토리 Settings → Secrets and variables → Actions 에서:
- `SLACK_BOT_TOKEN`: Bot User OAuth Token (xoxb-...)
- `SLACK_CHANNEL_ID`: 전용 채널 ID (C로 시작)

사용자에게 위 항목을 모두 완료했는지 확인한 후 다음 단계로 진행한다.

## Step 2: 퀴즈 뱅크 구조 생성

### 2-1. 디렉토리 생성
```
quizzes/
├── quiz_bank.json          # 퀴즈 데이터
├── quiz_runner.py          # 퀴즈 선택 + 발송 + 채점 스크립트
└── README.md               # 사용법
```

### 2-2. quiz_bank.json 초기 구조
```json
{
  "metadata": {
    "version": 1,
    "last_updated": null,
    "total_quizzes": 0,
    "stats": {
      "total_asked": 0,
      "total_correct": 0,
      "total_wrong": 0
    }
  },
  "quizzes": []
}
```

### 2-3. 개별 퀴즈 스키마
```json
{
  "id": "kafka-001",
  "category": "카프카",
  "book": "카프카 핵심 가이드",
  "chapter": "Ch3. 프로듀서",
  "type": "concept",
  "question": "카프카가 JVM 힙 대신 OS 페이지 캐시를 활용하는 이유는?",
  "hint": "JVM의 어떤 문제를 피하려는 걸까?",
  "answer": "JVM 힙을 크게 잡으면 GC pause가 길어져 지연이 발생하고, 객체 오버헤드로 메모리 효율이 낮다. OS 페이지 캐시는 GC 없이 커널이 관리하며, 브로커 재시작 시에도 캐시가 유지된다.",
  "keywords": ["GC", "가비지", "힙", "heap", "페이지 캐시", "page cache", "커널"],
  "min_keyword_match": 2,
  "box": 1,
  "next_review": "2026-03-02",
  "times_asked": 0,
  "times_correct": 0,
  "last_asked": null,
  "slack_message_ts": null
}
```

## Step 3: quiz_runner.py 작성

Python 스크립트로 아래 기능을 구현한다:

### 3-1. 어제 퀴즈 채점 (check_previous_quiz)
```python
"""
1. quiz_bank.json에서 slack_message_ts가 있는 가장 최근 퀴즈를 찾는다.
2. Slack API conversations.replies로 해당 스레드의 답변을 가져온다.
3. 봇 메시지가 아닌 사용자 답변에서 keywords 매칭.
4. min_keyword_match 이상 매칭되면 정답 처리.
5. 정답 → box += 1 (최대 5), 오답 → box = 1
6. next_review를 box에 따라 업데이트:
   - Box 1: +1일, Box 2: +3일, Box 3: +7일, Box 4: +14일, Box 5: +30일
7. Slack 스레드에 채점 결과 리플라이:
   - 정답: "✅ 정답! [키워드 매칭 결과] → Box {n}으로 이동"
   - 오답: "❌ 아쉽! 정답: {answer} → Box 1로 리셋"
   - 답변 없음: "⏰ 답변이 없었어요. → Box 1로 리셋"
"""
```

### 3-2. 오늘의 퀴즈 선택 (select_quiz)
```python
"""
1. next_review <= 오늘 날짜인 퀴즈들을 필터링.
2. 우선순위: box가 낮은 것(약한 부분) > 오래 안 물어본 것.
3. 해당하는 퀴즈가 없으면 "오늘은 복습할 퀴즈가 없습니다!" 메시지만 발송.
4. 선택된 퀴즈 반환.
"""
```

### 3-3. 슬랙 발송 (send_quiz)
```python
"""
Slack chat.postMessage API로 전용 채널에 발송.

메시지 포맷:
---
🧠 *오늘의 복습 퀴즈* #{times_asked + 1}
📚 {book} - {chapter}
🏷️ 유형: {type} | 📦 Box {box}

> {question}

💡 *힌트*: {hint}

_스레드에 답변을 작성해주세요. 내일 채점됩니다._
---

발송 후:
1. 응답에서 message.ts를 받아 quiz_bank.json의 slack_message_ts에 저장.
2. 정답은 다음 날 채점 시 함께 공개.
"""
```

### 3-4. 메인 실행 흐름
```python
"""
1. check_previous_quiz()  # 어제 퀴즈 채점
2. quiz = select_quiz()   # 오늘 퀴즈 선택
3. send_quiz(quiz)        # 슬랙 발송
4. quiz_bank.json 저장
"""
```

### 3-5. 필요 라이브러리
- `requests` (Slack API 호출)
- 표준 라이브러리: `json`, `datetime`, `os`

## Step 4: GitHub Actions 워크플로우 작성

`.github/workflows/daily-quiz.yml`:

```yaml
name: Daily Quiz

on:
  schedule:
    # 매일 11:00 UTC = 20:00 KST
    - cron: '0 11 * * *'
  workflow_dispatch: # 수동 실행 가능

jobs:
  send-quiz:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Install dependencies
        run: pip install requests

      - name: Run quiz
        env:
          SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}
          SLACK_CHANNEL_ID: ${{ secrets.SLACK_CHANNEL_ID }}
        run: python quizzes/quiz_runner.py

      - name: Commit quiz bank updates
        run: |
          git config user.name "quiz-bot"
          git config user.email "quiz-bot@github-actions"
          git add quizzes/quiz_bank.json
          git diff --staged --quiet || git commit -m "quiz: update quiz bank $(date +%Y-%m-%d)"
          git push
```

## Step 5: /oh-my-study-with-me:study 스킬 연동

study 스킬의 Phase 3 (검증) 단계에서, 검증에 사용한 질문을 자동으로 quiz_bank.json에 추가하는 로직을 포함한다.

### 퀴즈 생성 규칙
- Phase 3에서 사용한 검증 질문을 기반으로 퀴즈를 만든다.
- 각 퀴즈에 keywords를 반드시 포함한다 (핵심 개념어 5~8개).
- min_keyword_match는 키워드 수의 약 30%로 설정 (예: 키워드 7개 → min 2).
- id 형식: `{카테고리}-{순번}` (예: kafka-001, redis-003).
- box는 1, next_review는 내일 날짜로 초기화.
- 중복 방지: 같은 question이 이미 있으면 추가하지 않는다.

## Step 6: 구축 완료 확인

모든 파일이 생성되면:
1. `python quizzes/quiz_runner.py`로 로컬 테스트 (환경변수 세팅 필요)
2. GitHub에 푸시
3. Actions 탭에서 "Daily Quiz" 워크플로우 수동 실행
4. Slack 채널에 퀴즈가 도착하는지 확인

## 주의사항
- SLACK_BOT_TOKEN은 절대 코드에 직접 넣지 않는다. 반드시 GitHub Secrets 사용.
- quiz_bank.json이 비어있으면 "아직 등록된 퀴즈가 없습니다. /oh-my-study-with-me:study로 학습을 시작하세요!" 메시지를 보낸다.
- GitHub Actions 크론은 정확한 시간 보장이 안 될 수 있다 (최대 15분 지연).
