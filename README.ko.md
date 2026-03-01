<p align="center">
  <a href="README.md">English</a> · 한국어 · <a href="README.ja.md">日本語</a> · <a href="README.zh.md">中文</a>
</p>

<div align="center">

# oh-my-study-with-me

[![GitHub stars](https://img.shields.io/github/stars/lsh1215/oh-my-study-with-me?style=flat&color=yellow)](https://github.com/lsh1215/oh-my-study-with-me/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**Claude Code를 위한 First Principles 학습 플러그인.**

*여러 소스를 조사한다. 깊이 공부한다. 이해를 검증한다. 명료하게 쓴다.*

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
| URL들을 주면 | 모든 소스를 수집하고, 교차 분석하여 종합 정리를 생성한다 |
| 책 PDF를 열면 | 원리를 추출하고, 소크라테스식 대화를 시작한다 |
| "이 글 공부해줘"라고 말하면 | URL을 가져와 구조를 분석하고, 깊이 파고든다 |
| GitHub 레포를 알려주면 | 아키텍처, README, 핵심 설계를 분석한다 |
| 챕터를 끝마치면 | Feynman 테스트, 코드 챌린지, 또는 설계 문제로 검증한다 |
| 틀린 부분이 있으면 | 약점 개념을 기록하고, 다음 세션에 다시 다룬다 |
| 글을 쓰고 싶으면 | Toulmin 논증 구조로 블로그를 작성하고, Notion에 저장한다 |
| 직접 실습하고 싶으면 | 모니터링이 포함된 Docker 실습 환경을 구동한다 |

**명령어를 외울 필요가 없다.** 원하는 것을 자연어로 말하면 된다.

---

## 스킬

| 스킬 | 기능 |
|-------|-------------|
| `research` | 멀티소스 리서치 & 종합 — URL, GitHub 레포, 웹 검색, 교차 분석 |
| `study` | 심층 학습 세션 — PDF/URL/GitHub 읽기, First Principles 대화, 유형별 검증, 메타인지 추적 |
| `study-vault` | 사전 학습 노트 생성 — 대시보드, 빠른 참조, 개념 비교, 연습 문제. PDF, URL, GitHub 지원 |
| `setup-quiz` | ⚠️ *실험적* — Slack 일일 퀴즈 시스템, GitHub Actions + Leitner 간격 반복법 |
| `blog` | 기술 블로그 작성 — Orwell 명료성, Toulmin 논증, Steel Man 반론, Notion 연동 |
| `lab` | Docker 실습 환경 — Kafka, ES, MySQL, Redis + Prometheus + Grafana |

---

## 호출 방법

스킬을 호출하는 네 가지 방법:

**`swm` 접두사** (권장)
```
swm:research kafka consensus
swm:study kafka
swm:study https://article.com/deep-dive
swm:blog kafka producer
swm:lab redis
```

**슬래시 명령어** (명시적)
```
/oh-my-study-with-me:research kafka
/oh-my-study-with-me:study kafka
/oh-my-study-with-me:blog kafka producer
```

**콜론 패턴** (스킬 이름 직접 입력)
```
research : kafka consensus
study : kafka
blog : kafka producer
lab : redis
```

**자연어** (그냥 말하기)
```
카프카 합의 프로토콜에 대해 리서치해줘
카프카 책 공부하자
이 GitHub 레포 분석해줘
프로듀서에 대해 블로그 쓰고 노션에 저장해줘
Redis 실습 환경 만들어줘
```

영어와 한국어 모두 지원한다.

---

## 소스 지원

| 소스 유형 | research | study | study-vault |
|------------|----------|-------|-------------|
| 다수의 URL | ✅ 주요 | — | — |
| 단일 웹 URL | ✅ | ✅ | ✅ |
| GitHub 레포 | ✅ | ✅ | ✅ |
| YouTube (최선) | ✅ | ✅ | — |
| PDF | — (study 사용) | ✅ | ✅ |
| 자유 텍스트 | ✅ | ✅ | — |

---

## 워크플로우

```
research ─── 여러 소스를 수집하고 종합한다
  └── 리서치 요약 + 소스 노트
                    ↓
study-vault ─── 먼저 소스의 전체 구조를 파악한다
  └── Dashboard + Quick-Reference + Concept-Compare + Practice
                    ↓
study ─── 각 섹션을 깊이 파고든다 (🟦🟩🟨🟥⬜ 메타인지)
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
- PDF, URL, 또는 GitHub 레포 중 하나 이상의 학습 자료
- Docker (`lab` 스킬 전용)
- Slack + GitHub Actions (`setup-quiz` 스킬 전용)
- Notion MCP (`blog` Notion 연동용 — 선택 사항, 없으면 로컬 파일로 저장)

---

## 라이선스

MIT — [LICENSE](LICENSE) 참고

---

<div align="center">

**넓게 조사하고. 깊이 공부하고. 솔직하게 검증하고. 명료하게 써라.**

</div>
