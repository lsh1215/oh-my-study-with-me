<p align="center">
  <a href="README.md">English</a> · <a href="README.ko.md">한국어</a> · 日本語 · <a href="README.zh.md">中文</a>
</p>

<div align="center">

# oh-my-study-with-me

[![GitHub stars](https://img.shields.io/github/stars/lsh1215/oh-my-study-with-me?style=flat&color=yellow)](https://github.com/lsh1215/oh-my-study-with-me/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**Claude Code 向け First Principles 学習プラグイン。**

*本を読む。原理を抽出する。理解を検証する。繰り返す。*

[はじめる](#はじめる) · [スキル](#スキル) · [ワークフロー](#ワークフロー)

</div>

---

## はじめる

**ステップ 1:** マーケットプレイスを登録する
```
/plugin marketplace add https://github.com/lsh1215/oh-my-study-with-me
```

**ステップ 2:** プラグインをインストールする
```
/plugin install oh-my-study-with-me
```

以上です。学習を始めましょう。短縮エイリアスは **`swm`** です。

---

## できること

| あなたが...すると | 自動的に... |
|-------------|---------------------|
| 本の PDF を開く | 原理を抽出し、ソクラテス式対話を開始する |
| 「study kafka」と言う | 本を見つけ、前回の続きから再開する |
| 章を読み終える | Feynman テスト、コード課題、または設計問題で理解を検証する |
| 間違いを犯す | 弱い概念を記録し、次のセッションで再確認する |
| それについて書きたい | Toulmin 論証法でブログの下書きを作成する |
| 実際に試したい | 監視ツール付きの Docker ラボを起動する |

**コマンドを暗記する必要はありません。** やりたいことを自然な言葉で伝えるだけです。

---

## スキル

| スキル | 内容 |
|-------|-------------|
| `study` | 深い学習セッション — PDF 読み込み、First Principles 対話、タイプ別検証、メタ認知トラッキング |
| `study-vault` | 事前学習ノート生成 — ダッシュボード、クイックリファレンス、概念比較、練習問題 |
| `setup-quiz` | ⚠️ *実験的* — Slack 日次クイズシステム、GitHub Actions + Leitner 間隔反復法 |
| `blog` | 技術ブログ執筆 — Orwell の明確さ、Toulmin 論証、Steel Man 反論 |
| `lab` | Docker ラボ環境 — Kafka、ES、MySQL、Redis と Prometheus + Grafana |

---

## 呼び出し方

任意のスキルを呼び出す 4 つの方法:

**`swm` プレフィックス**（推奨）
```
swm:study kafka
swm:blog kafka producer
swm:lab redis
```

**スラッシュコマンド**（明示的）
```
/oh-my-study-with-me:study kafka
/oh-my-study-with-me:blog kafka producer
```

**コロンパターン**（スキル名のみ）
```
study : kafka
blog : kafka producer
lab : redis
```

**自然言語**（話しかけるだけ）
```
Let's study the Kafka book
Write a blog post about producers
Spin up a Redis lab
```

英語と韓国語の両方に対応しています。

---

## ワークフロー

```
study-vault ─── まず本全体の構造を把握する
  └── Dashboard + Quick-Reference + Concept-Compare + Practice
                    ↓
study ─── 各章を深く掘り下げる (🟦🟩🟨🟥⬜ メタ認知)
  ├── 検証 → quiz_bank.json
  │                    ↓
  │   setup-quiz ─── GitHub Actions による Slack 日次クイズ
  │
  ├── 「実際に試したい」 → lab
  │                          ↓
  │   lab ─── Docker Compose → 監視 → 観察 → 分析
  │
  └── 学習メモ → study-notes/
                         ↓
      blog ─── スケルトン → 下書き → Kill Your Darlings → Notion
```

---

## メタ認知トラッキング

学習したすべての概念が個別にトラッキングされます:

| バッジ | 意味 | 正答率 |
|-------|---------|----------|
| 🟦 | 習得済み | 90%以上（3回以上） |
| 🟩 | 良好 | 70〜89% |
| 🟨 | 普通 | 40〜69% |
| 🟥 | 弱い | 0〜39% |
| ⬜ | 未テスト | — |

弱い概念は次のセッションで自動的に優先されます。

---

## 必要なもの

- [Claude Code](https://docs.anthropic.com/claude-code) CLI
- プロジェクトの `books/` ディレクトリにある本の PDF
- Docker（`lab` スキルのみ）
- Slack + GitHub Actions（`setup-quiz` スキルのみ）

---

## ライセンス

MIT — [LICENSE](LICENSE) を参照

---

<div align="center">

**深く読む。誠実に検証する。明確に書く。**

</div>
