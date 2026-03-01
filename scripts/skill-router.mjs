#!/usr/bin/env node

/**
 * oh-my-study-with-me Skill Router
 *
 * OMC (oh-my-claudecode) style multi-pattern matching keyword detector.
 *
 * Matching methods (in priority order):
 * 1. Colon pattern: "study : kafka", "lab:es" (explicit invocation)
 * 2. Keyword pattern: "let's study kafka", "write a blog" (natural language)
 *
 * False positive prevention:
 * - Code blocks (``` ```) stripped before matching
 * - Word boundaries (\b) used
 * - Priority: longer patterns (study-vault) > shorter patterns (study)
 * - Keyword matching checks context (only when learning intent is present)
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = join(__dirname, "..");
const SKILLS_DIR = join(PLUGIN_ROOT, "skills");

// ─────────────────────────────────────────────
// Skill definitions: routing + keyword patterns
// ─────────────────────────────────────────────

const SKILL_DEFINITIONS = {
  "study-vault": {
    file: "study-vault/SKILL.md",
    desc: "Study Vault (pre-study note generation)",
    // Keyword patterns: \b ensures word boundaries (EN + KO)
    keywords: [
      /\bstudy[\s-]?vault\b/i,
      /\bpre[\s-]?study[\s]?notes?\b/i,
      /\bnote[\s]?generation\b/i,
      /\bvault[\s]?generat/i,
      /\bcreate[\s]?vault\b/i,
      // Korean
      /\b스터디[\s-]?볼트\b/,
      /\b사전[\s]?노트\b/,
      /\b노트[\s]?생성\b/,
      /\bvault[\s]?생성\b/i,
      /\b볼트[\s]?만들/,
    ],
    // Phrase patterns: multi-word combinations (EN + KO)
    phrases: [
      /book\s*.{0,10}(overview|structure|outline)\s*.{0,10}(note|generat|creat)/i,
      /vault\s*.{0,10}(creat|generat|start|build)/i,
      /structured\s*.{0,10}notes?\b/i,
      // Korean
      /책\s*.{0,10}(전체|구조|조감|개요)\s*.{0,10}(파악|정리|노트|생성)/,
      /vault\s*.{0,10}(만들|생성|시작)/i,
    ],
  },

  study: {
    file: "study/SKILL.md",
    desc: "Deep Study (First Principles learning)",
    keywords: [
      /\bdeep[\s-]?study\b/i,
      /\bfirst[\s-]?principles?\b/i,
      /\bstudy[\s]?session\b/i,
      // Korean
      /\b학습[\s]?세션\b/,
      /\b딥[\s]?스터디\b/,
      /\b퍼스트[\s]?프린시플/,
    ],
    phrases: [
      /(?:book|pdf|chapter)\s*.{0,15}(?:study|learn|read|start|continu)/i,
      /(?:study|learn)\s*.{0,10}(?:kafka|elasticsearch|redis|mysql|java|kotlin|spring)/i,
      /(?:deep|thorough|proper)(?:ly)?\s*.{0,10}(?:study|learn|dig|understand)/i,
      /(?:previous|last)\s*.{0,10}(?:study|learn|session)\s*.{0,10}(?:continu|resume|pick up)/i,
      /let'?s\s+(?:study|learn)\b/i,
      // Korean
      /(?:책|pdf|챕터|chapter)\s*.{0,15}(?:공부|학습|읽|시작|이어)/i,
      /(?:공부|학습)\s*.{0,10}(?:하자|시작|하고|할래|해줘|하겠)/,
      /(?:깊이|깊게|제대로)\s*.{0,10}(?:공부|학습|파고|파자|파보)/,
      /(?:이전|지난)\s*.{0,10}(?:학습|공부)\s*.{0,10}(?:이어|계속|continue)/i,
    ],
  },

  "setup-quiz": {
    file: "setup-quiz/SKILL.md",
    desc: "Setup Quiz (Slack quiz system)",
    keywords: [
      /\bsetup[\s-]?quiz\b/i,
      /\bquiz[\s]?system\b/i,
      /\bquiz[\s]?setup\b/i,
      /\breview[\s]?system\b/i,
      /\bspaced[\s-]?repetition\b/i,
      /\bleitner\b/i,
      // Korean
      /\b퀴즈[\s]?시스템\b/,
      /\b퀴즈[\s]?설정\b/,
      /\b퀴즈[\s]?셋업\b/,
      /\b복습[\s]?시스템\b/,
    ],
    phrases: [
      /(?:slack)\s*.{0,15}(?:quiz|review|repetition)/i,
      /(?:daily)\s*.{0,10}(?:quiz|review|repetition)/i,
      /(?:quiz)\s*.{0,15}(?:build|create|setup|set up|configur)/i,
      /(?:spaced|interval)\s*.{0,10}(?:review|repetition|system)/i,
      // Korean
      /(?:슬랙|slack)\s*.{0,15}(?:퀴즈|quiz|복습)/i,
      /(?:일일|매일|daily)\s*.{0,10}(?:퀴즈|quiz|복습)/i,
      /(?:퀴즈|quiz)\s*.{0,15}(?:구축|만들|설정|셋업|setup)/i,
      /(?:간격|반복)\s*.{0,10}(?:복습|학습|시스템)/,
    ],
  },

  blog: {
    file: "blog/SKILL.md",
    desc: "Blog (technical blog writing)",
    keywords: [
      /\bblog\b/i,
      /\btech[\s-]?blog\b/i,
      /\bblog[\s]?post\b/i,
      // Korean
      /\b블로그\b/,
      /\b기술[\s]?글\b/,
    ],
    phrases: [
      /(?:blog|tech\s*post|article)\s*.{0,15}(?:writ|draft|start|creat)/i,
      /(?:writ|draft)\s*.{0,10}(?:blog|post|article)/i,
      /(?:draft|review|proofread)\s*.{0,10}(?:the\s)?(?:post|article|blog)/i,
      // Korean
      /(?:블로그|기술\s*글)\s*.{0,15}(?:쓰|작성|시작|써줘|쓰자)/,
      /(?:글|포스트|아티클)\s*.{0,10}(?:쓰자|써줘|작성|시작)/,
      /(?:초안|리뷰|검수)\s*.{0,10}(?:해줘|하자|시작|보자)/,
    ],
  },

  lab: {
    file: "lab/SKILL.md",
    desc: "Lab (hands-on environment setup)",
    keywords: [
      /\blab\b/i,
      /\blab[\s]?environment\b/i,
      /\bhands[\s-]?on[\s]?env/i,
      // Korean
      /\b실습[\s]?환경\b/,
      /\b랩[\s]?환경\b/,
    ],
    phrases: [
      /(?:docker)\s*.{0,15}(?:lab|environment|setup|spin|start|creat)/i,
      /(?:kafka|elasticsearch|mysql|redis)\s*.{0,15}(?:lab|environment|setup|spin|start|creat)/i,
      /(?:lab|environment)\s*.{0,15}(?:build|creat|setup|start|spin|launch)/i,
      /(?:spin|start|launch|set)\s*.{0,10}(?:up\s)?(?:a\s)?(?:kafka|elasticsearch|mysql|redis)\s*.{0,10}(?:lab|env)/i,
      // Korean
      /(?:docker|도커)\s*.{0,15}(?:실습|환경|구축|띄우|올려|만들)/i,
      /(?:kafka|카프카|es|elasticsearch|mysql|redis|레디스)\s*.{0,15}(?:실습|환경|구축|띄우|올려|셋업)/i,
      /(?:실습|환경)\s*.{0,15}(?:구축|만들|셋업|시작|띄우|올려)/,
      /(?:kafka|카프카|es|elasticsearch|mysql|redis|레디스)\s*.{0,10}(?:lab|랩)\b/i,
    ],
  },
};

// Priority: longer names first (study-vault > study), specific skills first (setup-quiz > study)
const SKILL_PRIORITY = [
  "study-vault",
  "setup-quiz",
  "blog",
  "lab",
  "study", // study has the broadest patterns, so it goes last
];

// ─────────────────────────────────────────────
// Utility functions
// ─────────────────────────────────────────────

/**
 * Remove code blocks (same approach as OMC)
 * - Fenced code blocks (```)
 * - Tilde code blocks (~~~)
 * - Inline code (`...`)
 */
function removeCodeBlocks(text) {
  let result = text.replace(/```[\s\S]*?```/g, "");
  result = result.replace(/~~~[\s\S]*?~~~/g, "");
  result = result.replace(/`[^`]+`/g, "");
  return result;
}

/**
 * Extract prompt text from stdin
 */
function extractPrompt(input) {
  try {
    const data = JSON.parse(input);
    // Support Claude Code hook JSON structure
    return (data.prompt || data.message || "").trim();
  } catch {
    return input.trim();
  }
}

/**
 * Colon pattern matching: "study : kafka", "swm study : kafka", "lab:es"
 * Supports both bare skill names and "swm <skill>" prefix.
 * Returns: { skill, args } or null
 */
function matchColonPattern(text) {
  for (const skillName of SKILL_PRIORITY) {
    const escapedName = skillName.replace("-", "[-\\s]?");
    // Match: "study : kafka" or "swm study : kafka" or "swm:study kafka"
    const patterns = [
      new RegExp(`^\\s*${escapedName}\\s*:\\s*(.*)`, "is"),
      new RegExp(`^\\s*swm\\s+${escapedName}\\s*:\\s*(.*)`, "is"),
      new RegExp(`^\\s*swm\\s*:\\s*${escapedName}\\s+(.*)`, "is"),
      new RegExp(`^\\s*swm\\s*:\\s*${escapedName}\\s*$`, "is"),
    ];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return { skill: skillName, args: (match[1] || "").trim() };
      }
    }
  }
  return null;
}

/**
 * Keyword pattern matching: detect skills from natural language
 * Returns: { skill, args } or null
 *
 * OMC approach: word boundaries + priority traversal
 */
function matchKeywordPattern(text) {
  const lowerText = text.toLowerCase();

  for (const skillName of SKILL_PRIORITY) {
    const def = SKILL_DEFINITIONS[skillName];

    // Step 1: Keyword matching (single words/terms)
    for (const regex of def.keywords) {
      if (regex.test(text)) {
        return { skill: skillName, args: "" };
      }
    }

    // Step 2: Phrase pattern matching (multi-word combinations)
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
 * Read skill file and generate activation message
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
      message: `[SKILL ERROR] Could not find file: ${skillPath}`,
    };
  }

  const message = [
    `[MAGIC KEYWORD: ${skillName}]`,
    "",
    `**${def.desc} mode activated**`,
    "",
    `Follow the skill instructions below exactly.`,
    args
      ? `Arguments: ${args}`
      : "(No arguments — ask the user to choose in Phase 0)",
    "",
    "---",
    "",
    skillContent,
  ].join("\n");

  return { continue: true, message };
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────

function main() {
  // Read stdin
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

  // Strip code blocks (false positive prevention)
  const cleanPrompt = removeCodeBlocks(prompt);

  // Step 1: Colon pattern (explicit invocation, highest priority)
  const colonMatch = matchColonPattern(cleanPrompt);
  if (colonMatch) {
    console.log(JSON.stringify(activateSkill(colonMatch.skill, colonMatch.args)));
    return;
  }

  // Step 2: Keyword/phrase pattern (natural language invocation)
  const keywordMatch = matchKeywordPattern(cleanPrompt);
  if (keywordMatch) {
    console.log(JSON.stringify(activateSkill(keywordMatch.skill, keywordMatch.args)));
    return;
  }

  // No match — pass through
  console.log(JSON.stringify({ continue: true }));
}

main();
