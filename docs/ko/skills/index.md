---
description: oh-my-study-with-me 플러그인의 전체 스킬 인덱스와 연동 관계를 보여줍니다.
user-invocable: true
---

# oh-my-study-with-me 스킬 인덱스

이 플러그인은 First Principles 기반 기술 학습을 위한 통합 워크플로우를 제공합니다.

---

## 스킬 카탈로그

### 📖 학습 (study)
| 스킬 | 호출 | 설명 |
|---|---|---|
| [study](study/SKILL.md) | `/oh-my-study-with-me:study` | First Principles 기반 학습 세션 (PDF→원리→대화→검증) + 개념별 메타인지 추적 |
| [study-vault](study-vault/SKILL.md) | `/oh-my-study-with-me:study-vault` | 책 PDF → 구조화된 학습 노트 사전 생성 (대시보드/빠른참조/개념비교) |
| [setup-quiz](setup-quiz/SKILL.md) | `/oh-my-study-with-me:setup-quiz` | Slack 일일 복습 퀴즈 시스템 구축 (GitHub Actions + Leitner) |

### ✍️ 글쓰기 (writing)
| 스킬 | 호출 | 설명 |
|---|---|---|
| [blog](blog/SKILL.md) | `/oh-my-study-with-me:blog` | 기술 블로그 글쓰기 (오웰+Toulmin+Steel Man+담백한 문체) |

### 🔬 실습 (lab)
| 스킬 | 호출 | 설명 |
|---|---|---|
| [lab](lab/SKILL.md) | `/oh-my-study-with-me:lab` | Docker Compose 기반 실습 환경 (Kafka/ES/MySQL/Redis+모니터링) |

---

## 단축 호출

skill-router 훅이 활성화되어 있으면 아래 패턴으로도 호출 가능합니다:

```
study : 카프카          →  /oh-my-study-with-me:study 카프카
study-vault : 카프카    →  /oh-my-study-with-me:study-vault 카프카
blog : 카프카 프로듀서   →  /oh-my-study-with-me:blog 카프카 프로듀서
lab : kafka             →  /oh-my-study-with-me:lab kafka
```

---

## 연동 관계

```
/study-vault (사전 노트 생성) ─── 책 읽기 전 구조화된 노트 먼저 생성
  └── 대시보드 + 빠른참조 + 개념비교 + 개념/실습 노트
                    ↓ (노트를 기반으로 깊은 학습)
/study (학습 세션) ─── 개념별 메타인지 추적 (🟦🟩🟨🟥⬜)
  ├── Phase 3 검증 → quiz_bank.json에 퀴즈 자동 저장
  │                       ↓
  │   /setup-quiz (퀴즈 시스템)
  │     └── GitHub Actions → 매일 Slack으로 복습 퀴즈 발송 + 키워드 채점
  │
  ├── Phase 3 검증 중 "직접 해보고 싶다" → /lab 실습 환경 구축
  │                                          ↓
  │   /lab (실습 환경)
  │     └── Docker Compose 기동 → 모니터링 → 테스트 → 관찰 → 분석
  │
  └── Phase 4 학습 메모 → study-notes/에 소재 저장
                                ↓ (블로그로 쓰고 싶을 때)
      /blog (블로그 글쓰기) ─── 별도 호출
        └── 뼈대 → 초안 → Kill Your Darlings 검수 → Notion 저장
```

---

## 데이터 구조

| 경로 | 용도 | 형식 |
|------|------|------|
| `books/*/` | 책 PDF (카테고리별 정리) | PDF |
| `books/*/{book}_progress.md` | 학습 진행 추적 | Markdown |
| `study-notes/{cat}/{book}/` | 챕터별 학습 메모 | Markdown |
| `study-vault/{cat}/{book}/` | 구조화된 사전 노트 | Markdown |
| `quizzes/quiz_bank.json` | 간격 반복 퀴즈 뱅크 | JSON |
| `tracking/{category}.md` | 개념별 메타인지 대시보드 | Markdown |
| `labs/{tech}/` | Docker 실습 환경 | Docker Compose |
