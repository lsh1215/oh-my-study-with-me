# oh-my-study-with-me

First Principles 기반 기술 학습 플러그인 for Claude Code.

책 PDF 학습, 구조화된 노트 생성, Slack 일일 퀴즈, 기술 블로그 글쓰기, Docker 실습 환경을 하나의 워크플로우로 통합합니다.

## 스킬 목록

| 스킬 | 호출 | 설명 |
|------|------|------|
| **study** | `/oh-my-study-with-me:study` | First Principles 기반 학습 세션 (PDF → 원리 추출 → 소크라테스 대화 → 유형별 검증) |
| **study-vault** | `/oh-my-study-with-me:study-vault` | 책 PDF에서 구조화된 학습 노트 사전 생성 (대시보드, 빠른참조, 개념비교, 연습문제) |
| **setup-quiz** | `/oh-my-study-with-me:setup-quiz` | GitHub Actions + Slack 일일 복습 퀴즈 시스템 구축 (Leitner 간격 반복) |
| **blog** | `/oh-my-study-with-me:blog` | 기술 블로그 글쓰기 (Orwell 문체 + Toulmin 논증 + Steel Man 반박) |
| **lab** | `/oh-my-study-with-me:lab` | Docker Compose 기반 실습 환경 (Kafka, ES, MySQL, Redis + 모니터링) |

## 설치

```bash
# 로컬 테스트
claude --plugin-dir /path/to/oh-my-study-with-me

# 마켓플레이스에서 설치
claude plugin install oh-my-study-with-me@marketplace-name
```

## 사용법

### 슬래시 커맨드로 호출

```
/oh-my-study-with-me:study 카프카
/oh-my-study-with-me:study-vault 카프카 Ch3-Ch5
/oh-my-study-with-me:blog 카프카 프로듀서
/oh-my-study-with-me:lab kafka
/oh-my-study-with-me:setup-quiz
```

### 콜론 패턴으로 호출

```
study : 카프카
study-vault : 카프카
blog : 카프카 프로듀서
lab : kafka
```

### 자연어로 호출

```
카프카 책 공부하자
블로그 써줘
redis 실습 환경 띄워줘
슬랙 퀴즈 시스템 만들자
이전 학습 이어서 하자
```

## 워크플로우

```
study-vault (사전 노트) ─── 책 전체 구조 파악
  └── 대시보드 + 빠른참조 + 개념비교 + 연습문제
                    ↓
study (학습 세션) ─── 개념별 메타인지 추적 (🟦🟩🟨🟥⬜)
  ├── Phase 3 검증 → quiz_bank.json 자동 저장
  │                       ↓
  │   setup-quiz ─── GitHub Actions 매일 Slack 퀴즈 발송
  │
  ├── "직접 해보고 싶다" → lab 실습 환경 구축
  │                          ↓
  │   lab ─── Docker Compose → 모니터링 → 관찰 → 분석
  │
  └── Phase 4 학습 메모 → study-notes/ 저장
                                ↓
      blog ─── 뼈대 → 초안 → Kill Your Darlings → Notion
```

## 데이터 구조

플러그인이 설치된 프로젝트에 아래 디렉토리가 생성됩니다:

```
your-project/
├── books/                    # 책 PDF (카테고리별)
├── study-notes/              # 챕터별 학습 메모
├── study-vault/              # 구조화된 사전 노트
├── quizzes/quiz_bank.json    # 간격 반복 퀴즈 뱅크
├── tracking/                 # 개념별 메타인지 대시보드
└── labs/                     # Docker 실습 환경
```

## 플러그인 구조

```
oh-my-study-with-me/
├── .claude-plugin/
│   └── plugin.json           # 매니페스트
├── skills/
│   ├── index.md              # 스킬 인덱스 + 연동 관계
│   ├── study/SKILL.md
│   ├── study-vault/SKILL.md
│   ├── setup-quiz/SKILL.md
│   ├── blog/SKILL.md
│   └── lab/SKILL.md
├── hooks/
│   └── hooks.json            # skill-router 훅 설정
└── scripts/
    └── skill-router.mjs      # 다중 패턴 매칭 라우터
```

## 패턴 매칭

skill-router는 OMC(oh-my-claudecode) 스타일의 다중 패턴 매칭을 지원합니다:

1. **콜론 패턴** (최우선): `study : 카프카`
2. **키워드 패턴**: `블로그`, `실습 환경`, `퀴즈 시스템` 등
3. **구문 패턴**: `카프카 책 공부하자`, `redis 실습 환경 띄워줘` 등

오탐 방지:
- 코드 블록 (```, ~~~, `` ` ``) 내용 제거 후 매칭
- 워드 바운더리(`\b`) 사용
- 우선순위 기반 매칭 (study-vault > setup-quiz > blog > lab > study)

## License

[MIT](LICENSE)
