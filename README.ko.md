<p align="center">
  <a href="README.md">English</a> · 한국어 · <a href="README.ja.md">日本語</a> · <a href="README.zh.md">中文</a>
</p>

<div align="center">

# oh-my-study-with-me

[![GitHub stars](https://img.shields.io/github/stars/lsh1215/oh-my-study-with-me?style=flat&color=yellow)](https://github.com/lsh1215/oh-my-study-with-me/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**Claude Code를 위한 First Principles 학습 플러그인.**

*책을 읽는다. 원리를 추출한다. 이해를 검증한다. 반복한다.*

[시작하기](#시작하기) · [스킬](#스킬) · [워크플로우](#워크플로우)

</div>

---

## 시작하기

**Step 1:** 마켓플레이스를 등록한다
```
/plugin marketplace add https://github.com/lsh1215/oh-my-study-with-me
```

**Step 2:** 플러그인을 설치한다
```
/plugin install oh-my-study-with-me
```

이게 전부다. 이제 공부를 시작하면 된다. 단축 별칭은 **`swm`**이다.

---

## 무엇을 하는가

| 당신이... | 자동으로... |
|-------------|---------------------|
| 책 PDF를 열면 | 원리를 추출하고, 소크라테스식 대화를 시작한다 |
| "study kafka"라고 말하면 | 책을 찾아서, 마지막으로 학습한 곳부터 이어서 진행한다 |
| 챕터를 끝마치면 | Feynman 테스트, 코드 챌린지, 또는 설계 문제로 검증한다 |
| 틀린 부분이 있으면 | 약점 개념을 기록하고, 다음 세션에 다시 다룬다 |
| 글을 쓰고 싶으면 | Toulmin 논증 구조로 블로그 초안을 작성한다 |
| 직접 실습하고 싶으면 | 모니터링이 포함된 Docker 실습 환경을 구동한다 |

**명령어를 외울 필요가 없다.** 원하는 것을 자연어로 말하면 된다.

---

## 스킬

| 스킬 | 기능 |
|-------|-------------|
| `study` | 심층 학습 세션 — PDF 읽기, First Principles 대화, 유형별 검증, 메타인지 추적 |
| `study-vault` | 사전 학습 노트 생성 — 대시보드, 빠른 참조, 개념 비교, 연습 문제 |
| `setup-quiz` | ⚠️ *실험적* — Slack 일일 퀴즈 시스템, GitHub Actions + Leitner 간격 반복법 |
| `blog` | 기술 블로그 작성 — Orwell 명료성, Toulmin 논증, Steel Man 반론 |
| `lab` | Docker 실습 환경 — Kafka, ES, MySQL, Redis + Prometheus + Grafana |

---

## 호출 방법

스킬을 호출하는 네 가지 방법:

**`swm` 접두사** (권장)
```
swm:study kafka
swm:blog kafka producer
swm:lab redis
```

**슬래시 명령어** (명시적)
```
/oh-my-study-with-me:study kafka
/oh-my-study-with-me:blog kafka producer
```

**콜론 패턴** (스킬 이름 직접 입력)
```
study : kafka
blog : kafka producer
lab : redis
```

**자연어** (그냥 말하기)
```
Let's study the Kafka book
Write a blog post about producers
Spin up a Redis lab
```

영어와 한국어 모두 지원한다.

---

## 워크플로우

```
study-vault ─── 먼저 책의 전체 구조를 파악한다
  └── Dashboard + Quick-Reference + Concept-Compare + Practice
                    ↓
study ─── 각 챕터를 깊이 파고든다 (🟦🟩🟨🟥⬜ 메타인지)
  ├── 검증 → quiz_bank.json
  │                    ↓
  │   setup-quiz ─── GitHub Actions를 통한 Slack 일일 퀴즈
  │
  ├── "직접 해보고 싶다" → lab
  │                          ↓
  │   lab ─── Docker Compose → 모니터링 → 관찰 → 분석
  │
  └── 학습 메모 → study-notes/
                         ↓
      blog ─── 골격 작성 → 초안 → Kill Your Darlings → Notion
```

---

## 메타인지 추적

학습하는 모든 개념은 개별적으로 추적된다:

| 배지 | 의미 | 정확도 |
|-------|---------|----------|
| 🟦 | 완전 숙지 | 90% 이상 (3회 이상 시도) |
| 🟩 | 양호 | 70-89% |
| 🟨 | 보통 | 40-69% |
| 🟥 | 취약 | 0-39% |
| ⬜ | 미테스트 | — |

취약한 개념은 다음 세션에서 자동으로 우선 처리된다.

---

## 요구사항

- [Claude Code](https://docs.anthropic.com/claude-code) CLI
- 프로젝트의 `books/` 디렉터리에 저장된 책 PDF
- Docker (`lab` 스킬 전용)
- Slack + GitHub Actions (`setup-quiz` 스킬 전용)

---

## 라이선스

MIT — [LICENSE](LICENSE) 참고

---

<div align="center">

**깊이 읽고. 솔직하게 검증하고. 명료하게 써라.**

</div>
