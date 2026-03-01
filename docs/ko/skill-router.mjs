#!/usr/bin/env node

/**
 * oh-my-study-with-me Skill Router
 *
 * OMC(oh-my-claudecode) 스타일의 다중 패턴 매칭 키워드 감지기.
 *
 * 매칭 방식 (우선순위 순):
 * 1. 콜론 패턴: "study : 카프카", "lab:es" (명시적 호출)
 * 2. 키워드 패턴: "카프카 공부하자", "블로그 써줘" (자연어 호출)
 *
 * 오탐 방지:
 * - 코드 블록 (``` ```) 제거 후 매칭
 * - 워드 바운더리(\b) 사용
 * - 우선순위: 긴 패턴(study-vault) > 짧은 패턴(study)
 * - 키워드 매칭은 문맥 확인 (학습 의도가 있는 경우만)
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = join(__dirname, "..");
const SKILLS_DIR = join(PLUGIN_ROOT, "skills");

// ─────────────────────────────────────────────
// 스킬 정의: 라우팅 + 키워드 패턴
// ─────────────────────────────────────────────

const SKILL_DEFINITIONS = {
  "study-vault": {
    file: "study-vault/SKILL.md",
    desc: "Study Vault (사전 노트 생성)",
    // 키워드 패턴: \b로 워드 바운더리 보장
    keywords: [
      /\bstudy[\s-]?vault\b/i,
      /\b스터디[\s-]?볼트\b/,
      /\b사전[\s]?노트\b/,
      /\b노트[\s]?생성\b/,
      /\bvault[\s]?생성\b/i,
      /\b볼트[\s]?만들/,
    ],
    // 구문 패턴: 여러 단어 조합
    phrases: [
      /책\s*.{0,10}(전체|구조|조감|개요)\s*.{0,10}(파악|정리|노트|생성)/,
      /vault\s*.{0,10}(만들|생성|시작)/i,
    ],
  },

  study: {
    file: "study/SKILL.md",
    desc: "Deep Study (First Principles 학습)",
    keywords: [
      /\bdeep[\s-]?study\b/i,
      /\bfirst[\s-]?principles?\b/i,
      /\b학습[\s]?세션\b/,
      /\b딥[\s]?스터디\b/,
      /\b퍼스트[\s]?프린시플/,
    ],
    phrases: [
      /(?:책|pdf|챕터|chapter)\s*.{0,15}(?:공부|학습|읽|시작|이어)/i,
      /(?:공부|학습)\s*.{0,10}(?:하자|시작|하고|할래|해줘|하겠)/,
      /(?:깊이|깊게|제대로)\s*.{0,10}(?:공부|학습|파고|파자|파보)/,
      /(?:이전|지난)\s*.{0,10}(?:학습|공부)\s*.{0,10}(?:이어|계속|continue)/i,
    ],
  },

  "setup-quiz": {
    file: "setup-quiz/SKILL.md",
    desc: "Setup Quiz (Slack 퀴즈 시스템)",
    keywords: [
      /\bsetup[\s-]?quiz\b/i,
      /\b퀴즈[\s]?시스템\b/,
      /\b퀴즈[\s]?설정\b/,
      /\b퀴즈[\s]?셋업\b/,
      /\b복습[\s]?시스템\b/,
      /\bspaced[\s-]?repetition\b/i,
      /\bleitner\b/i,
    ],
    phrases: [
      /(?:슬랙|slack)\s*.{0,15}(?:퀴즈|quiz|복습)/i,
      /(?:일일|매일|daily)\s*.{0,10}(?:퀴즈|quiz|복습)/i,
      /(?:퀴즈|quiz)\s*.{0,15}(?:구축|만들|설정|셋업|setup)/i,
      /(?:간격|반복)\s*.{0,10}(?:복습|학습|시스템)/,
    ],
  },

  blog: {
    file: "blog/SKILL.md",
    desc: "Blog (기술 블로그 글쓰기)",
    keywords: [
      /\b블로그\b/,
      /\b기술[\s]?글\b/,
      /\btech[\s-]?blog\b/i,
    ],
    phrases: [
      /(?:블로그|기술\s*글)\s*.{0,15}(?:쓰|작성|시작|써줘|쓰자)/,
      /(?:글|포스트|아티클)\s*.{0,10}(?:쓰자|써줘|작성|시작)/,
      /(?:초안|리뷰|검수)\s*.{0,10}(?:해줘|하자|시작|보자)/,
    ],
  },

  lab: {
    file: "lab/SKILL.md",
    desc: "Lab (실습 환경 구축)",
    keywords: [
      /\blab\b/i,
      /\b실습[\s]?환경\b/,
      /\b랩[\s]?환경\b/,
    ],
    phrases: [
      /(?:docker|도커)\s*.{0,15}(?:실습|환경|구축|띄우|올려|만들)/i,
      /(?:kafka|카프카|es|elasticsearch|mysql|redis|레디스)\s*.{0,15}(?:실습|환경|구축|띄우|올려|셋업)/i,
      /(?:실습|환경)\s*.{0,15}(?:구축|만들|셋업|시작|띄우|올려)/,
      /(?:kafka|카프카|es|elasticsearch|mysql|redis|레디스)\s*.{0,10}(?:lab|랩)\b/i,
    ],
  },
};

// 우선순위: 긴 이름 먼저 (study-vault > study), 구체적 스킬 먼저 (setup-quiz > study)
const SKILL_PRIORITY = [
  "study-vault",
  "setup-quiz",
  "blog",
  "lab",
  "study", // study는 가장 넓은 패턴이므로 마지막
];

// ─────────────────────────────────────────────
// 유틸리티 함수
// ─────────────────────────────────────────────

/**
 * 코드 블록 제거 (OMC 동일 방식)
 * - 펜스드 코드 블록 (```)
 * - 틸드 코드 블록 (~~~)
 * - 인라인 코드 (`...`)
 */
function removeCodeBlocks(text) {
  let result = text.replace(/```[\s\S]*?```/g, "");
  result = result.replace(/~~~[\s\S]*?~~~/g, "");
  result = result.replace(/`[^`]+`/g, "");
  return result;
}

/**
 * stdin에서 프롬프트 텍스트 추출
 */
function extractPrompt(input) {
  try {
    const data = JSON.parse(input);
    // Claude Code hook JSON 구조 지원
    return (data.prompt || data.message || "").trim();
  } catch {
    return input.trim();
  }
}

/**
 * 콜론 패턴 매칭: "study : 카프카", "lab:es"
 * 반환: { skill, args } 또는 null
 */
function matchColonPattern(text) {
  for (const skillName of SKILL_PRIORITY) {
    const escapedName = skillName.replace("-", "[-\\s]?");
    const pattern = new RegExp(
      `^\\s*${escapedName}\\s*:\\s*(.*)`,
      "is"
    );
    const match = text.match(pattern);
    if (match) {
      return { skill: skillName, args: match[1].trim() };
    }
  }
  return null;
}

/**
 * 키워드 패턴 매칭: 자연어에서 스킬 감지
 * 반환: { skill, args } 또는 null
 *
 * OMC 방식: 워드 바운더리 + 우선순위 순회
 */
function matchKeywordPattern(text) {
  const lowerText = text.toLowerCase();

  for (const skillName of SKILL_PRIORITY) {
    const def = SKILL_DEFINITIONS[skillName];

    // 1단계: 키워드 매칭 (단일 단어/용어)
    for (const regex of def.keywords) {
      if (regex.test(text)) {
        return { skill: skillName, args: "" };
      }
    }

    // 2단계: 구문 패턴 매칭 (여러 단어 조합)
    if (def.phrases) {
      for (const regex of def.phrases) {
        if (regex.test(text)) {
          return { skill: skillName, args: "" };
        }
      }
    }
  }

  return null;
}

/**
 * 스킬 파일을 읽고 활성화 메시지 생성
 */
function activateSkill(skillName, args) {
  const def = SKILL_DEFINITIONS[skillName];
  const skillPath = join(SKILLS_DIR, def.file);

  let skillContent = "";
  try {
    skillContent = readFileSync(skillPath, "utf8");
  } catch {
    return {
      continue: true,
      message: `[SKILL ERROR] ${skillPath} 파일을 찾을 수 없습니다.`,
    };
  }

  const message = [
    `[MAGIC KEYWORD: ${skillName}]`,
    "",
    `**${def.desc} 모드 활성화**`,
    "",
    `아래 스킬 지시를 정확히 따라 진행한다.`,
    args
      ? `인자: ${args}`
      : "(인자 없음 — Phase 0에서 사용자에게 선택을 묻는다)",
    "",
    "---",
    "",
    skillContent,
  ].join("\n");

  return { continue: true, message };
}

// ─────────────────────────────────────────────
// 메인
// ─────────────────────────────────────────────

function main() {
  // stdin 읽기
  let input = "";
  try {
    input = readFileSync("/dev/stdin", "utf8").trim();
  } catch {
    console.log(JSON.stringify({ continue: true }));
    return;
  }

  const prompt = extractPrompt(input);
  if (!prompt) {
    console.log(JSON.stringify({ continue: true }));
    return;
  }

  // 코드 블록 제거 (오탐 방지)
  const cleanPrompt = removeCodeBlocks(prompt);

  // 1단계: 콜론 패턴 (명시적 호출, 최우선)
  const colonMatch = matchColonPattern(cleanPrompt);
  if (colonMatch) {
    console.log(JSON.stringify(activateSkill(colonMatch.skill, colonMatch.args)));
    return;
  }

  // 2단계: 키워드/구문 패턴 (자연어 호출)
  const keywordMatch = matchKeywordPattern(cleanPrompt);
  if (keywordMatch) {
    console.log(JSON.stringify(activateSkill(keywordMatch.skill, keywordMatch.args)));
    return;
  }

  // 매칭 없음 — 통과
  console.log(JSON.stringify({ continue: true }));
}

main();
