---
description: Sets up a daily review quiz system integrating GitHub Actions and Slack. Automatically reviews study content using Leitner System-based spaced repetition. Use this skill when the user mentions a quiz system, review automation, or spaced repetition.
user-invocable: true
---

# Setup Quiz - Slack Daily Review Quiz System Setup

Arguments: $ARGUMENTS

## Overview
To prevent forgetting what you've studied, this system sends a daily review quiz to Slack every evening at 8 PM via GitHub Actions. Using Leitner System-based spaced repetition, weaker areas are tested more frequently while well-mastered areas appear less often.

## Overall Architecture

```
[/oh-my-study-with-me:study session]
  Phase 3 Verification → Auto-generate quiz → Save to quizzes/quiz_bank.json
                                                        ↓
[GitHub Actions - Daily cron at 20:00 KST]
  1) Read yesterday's quiz thread (Slack API conversations.replies)
  2) Keyword matching from replies → Grade correct/incorrect
  3) Update quiz_bank.json Leitner Box
  4) Select 1 quiz for today's review
  5) Send to dedicated Slack channel
  6) Auto-commit + push changes
```

## Step 1: Pre-requisites Check

Confirm the following items with the user:

### 1-1. Create Slack App
- Go to https://api.slack.com/apps → "Create New App" → "From scratch"
- App name: `StudyWithMe Quiz Bot` (or any name you prefer)
- Workspace: select the user's workspace

### 1-2. Configure Bot Token Scopes
Add the following Bot Token Scopes under OAuth & Permissions:
- `chat:write` - send messages
- `channels:history` - read channel messages (for checking thread replies)
- `channels:join` - join channels

### 1-3. Install Bot and Get Token
- Click "Install to Workspace"
- Copy the Bot User OAuth Token starting with `xoxb-`

### 1-4. Create a Dedicated Slack Channel
- Create a `#daily-quiz` channel (or any name you prefer)
- Invite the bot to the channel: `/invite @StudyWithMe Quiz Bot`
- Find the channel ID (right-click channel name → Channel details → Channel ID at the bottom)

### 1-5. Configure GitHub Secrets
In repository Settings → Secrets and variables → Actions:
- `SLACK_BOT_TOKEN`: Bot User OAuth Token (xoxb-...)
- `SLACK_CHANNEL_ID`: Dedicated channel ID (starts with C)

Confirm that the user has completed all the above items before proceeding to the next step.

## Step 2: Create Quiz Bank Structure

### 2-1. Directory Structure
```
quizzes/
├── quiz_bank.json          # Quiz data
├── quiz_runner.py          # Quiz selection + sending + grading script
└── README.md               # Usage guide
```

### 2-2. quiz_bank.json Initial Structure
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

### 2-3. Individual Quiz Schema
```json
{
  "id": "kafka-001",
  "category": "Kafka",
  "book": "Kafka: The Definitive Guide",
  "chapter": "Ch3. Producers",
  "type": "concept",
  "question": "Why does Kafka use OS page cache instead of JVM heap?",
  "hint": "What JVM problem is it trying to avoid?",
  "answer": "A large JVM heap causes long GC pauses leading to latency, and object overhead reduces memory efficiency. The OS page cache is managed by the kernel without GC, and the cache persists even after a broker restart.",
  "keywords": ["GC", "garbage", "heap", "page cache", "kernel"],
  "min_keyword_match": 2,
  "box": 1,
  "next_review": "2026-03-02",
  "times_asked": 0,
  "times_correct": 0,
  "last_asked": null,
  "slack_message_ts": null
}
```

## Step 3: Write quiz_runner.py

Implement the following functionality as a Python script:

### 3-1. Grade Previous Quiz (check_previous_quiz)
```python
"""
1. Find the most recent quiz with a slack_message_ts in quiz_bank.json.
2. Fetch the replies in that thread using Slack API conversations.replies.
3. Match keywords from user replies (not bot messages).
4. If min_keyword_match or more keywords match, mark as correct.
5. Correct → box += 1 (max 5), Incorrect → box = 1
6. Update next_review based on box:
   - Box 1: +1 day, Box 2: +3 days, Box 3: +7 days, Box 4: +14 days, Box 5: +30 days
7. Reply to the Slack thread with grading result:
   - Correct: "✅ Correct! [keyword match result] → Moving to Box {n}"
   - Incorrect: "❌ Not quite! Answer: {answer} → Reset to Box 1"
   - No reply: "⏰ No answer was submitted. → Reset to Box 1"
"""
```

### 3-2. Select Today's Quiz (select_quiz)
```python
"""
1. Filter quizzes where next_review <= today's date.
2. Priority: lower box (weaker areas) > least recently asked.
3. If no quizzes qualify, send only a "No quizzes to review today!" message.
4. Return the selected quiz.
"""
```

### 3-3. Send to Slack (send_quiz)
```python
"""
Send to the dedicated channel using Slack chat.postMessage API.

Message format:
---
🧠 *Today's Review Quiz* #{times_asked + 1}
📚 {book} - {chapter}
🏷️ Type: {type} | 📦 Box {box}

> {question}

💡 *Hint*: {hint}

_Please write your answer in the thread. It will be graded tomorrow._
---

After sending:
1. Retrieve message.ts from the response and save to slack_message_ts in quiz_bank.json.
2. The answer will be revealed together when grading the next day.
"""
```

### 3-4. Main Execution Flow
```python
"""
1. check_previous_quiz()  # Grade yesterday's quiz
2. quiz = select_quiz()   # Select today's quiz
3. send_quiz(quiz)        # Send to Slack
4. Save quiz_bank.json
"""
```

### 3-5. Required Libraries
- `requests` (Slack API calls)
- Standard library: `json`, `datetime`, `os`

## Step 4: Write GitHub Actions Workflow

`.github/workflows/daily-quiz.yml`:

```yaml
name: Daily Quiz

on:
  schedule:
    # Every day at 11:00 UTC = 20:00 KST
    - cron: '0 11 * * *'
  workflow_dispatch: # Can also be triggered manually

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

## Step 5: Integrate with /oh-my-study-with-me:study Skill

In Phase 3 (Verification) of the study skill, include logic to automatically add the verification questions used during that phase to quiz_bank.json.

### Quiz Generation Rules
- Create quizzes based on the verification questions used in Phase 3.
- Always include keywords in each quiz (5-8 key concept terms).
- Set min_keyword_match to approximately 30% of the keyword count (e.g., 7 keywords → min 2).
- ID format: `{category}-{sequence}` (e.g., kafka-001, redis-003).
- Initialize box to 1 and next_review to tomorrow's date.
- Duplicate prevention: do not add a quiz if the same question already exists.

## Step 6: Verify Setup Complete

Once all files are created:
1. Run `python quizzes/quiz_runner.py` for local testing (environment variables must be set)
2. Push to GitHub
3. Manually trigger the "Daily Quiz" workflow from the Actions tab
4. Confirm the quiz arrives in the Slack channel

## Notes
- Never put SLACK_BOT_TOKEN directly in the code. Always use GitHub Secrets.
- If quiz_bank.json is empty, send a message: "No quizzes registered yet. Start studying with /oh-my-study-with-me:study!"
- GitHub Actions cron does not guarantee exact timing (up to 15 minutes delay).
