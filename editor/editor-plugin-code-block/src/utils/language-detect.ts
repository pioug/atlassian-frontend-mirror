/* eslint-disable require-unicode-regexp */
import { fg } from '@atlaskit/platform-feature-flags';

type LanguageId =
	| 'css'
	| 'go'
	| 'html'
	| 'java'
	| 'javascript'
	| 'json'
	| 'python'
	| 'ruby'
	| 'rust'
	| 'shell'
	| 'sql'
	| 'typescript';

type LanguageScore = {
	language: LanguageId;
	score: number;
};

// Conservative weighted-regex heuristic for common high-confidence snippets, not a full classifier.
// Ambiguous snippets intentionally return null so users can select the language manually.
const MAX_DETECTION_CHARS = 10_000;
const MIN_DETECTION_SCORE = 3; // Require at least one medium-confidence signal before auto-selecting.
const MIN_SCORE_GAP = 2; // Avoid auto-selecting when top two languages are too close to distinguish.

const hasPattern = (code: string, pattern: RegExp): boolean => {
	// Reset stateful regexes so repeated tests always start at the beginning.
	pattern.lastIndex = 0;
	return pattern.test(code);
};

const scorePatterns = (code: string, patterns: Array<[RegExp, number]>): number =>
	patterns.reduce((score, [pattern, value]) => score + (hasPattern(code, pattern) ? value : 0), 0);

const scoreEnhancedTypeScriptPatterns = (code: string): number =>
	fg('platform_editor_code_block_dogfooding_patch')
		? scorePatterns(code, [
				[/\b(?:private|protected|public|readonly)\s+[\w$]+\s*=/, 5],
				[
					/\([^)]{0,500}\b[\w$]+\??:\s*[A-Za-z_$][\w$<>{}\[\]|&,\s.?]{0,200}[^)]{0,500}\)\s*(?::\s*[A-Za-z_$][\w$<>{}\[\]|&,\s.?]{0,200})?\s*=>/,
					5,
				],
			])
		: 0;

const looksLikeHtmlTagPair = (code: string): boolean => {
	const openTags = new Set<string>();
	const tagPattern = /<\/?([a-z][a-z0-9-]*)\b[^<>]{0,500}>/gi;
	let match: RegExpExecArray | null;

	while ((match = tagPattern.exec(code)) !== null) {
		const [tag, tagName] = match;

		if (tag.endsWith('/>')) {
			continue;
		}

		if (tag.startsWith('</')) {
			if (openTags.has(tagName.toLowerCase())) {
				return true;
			}
		} else {
			openTags.add(tagName.toLowerCase());
		}
	}

	return false;
};

const looksLikeJson = (code: string): boolean => {
	const trimmed = code.trim();

	if (!/^[{[]/.test(trimmed) || !/[}\]]$/.test(trimmed)) {
		return false;
	}

	try {
		const parsed = JSON.parse(trimmed);
		return parsed !== null && typeof parsed === 'object';
	} catch {
		return false;
	}
};

const getLanguageScores = (code: string): LanguageScore[] => [
	{
		language: 'json',
		score: looksLikeJson(code) ? 8 : 0,
	},
	{
		language: 'html',
		score:
			scorePatterns(code, [
				[/<!doctype\s+html/i, 5],
				[/<\/?(?:html|head|body|div|span|script|style|section|template)\b/i, 2],
			]) + (looksLikeHtmlTagPair(code) ? 3 : 0),
	},
	{
		language: 'css',
		score: scorePatterns(code, [
			[/@[\w-]+\s+[^{]+\{/, 3],
			[
				/[.#]?[-_a-zA-Z][-_a-zA-Z0-9\s,.:#>+~*\[\]='"]+\{[^}]*\b(?:color|display|margin|padding|font|background|border|width|height|grid|flex)\s*:/,
				5,
			],
			[
				/\b(?:color|display|margin|padding|font-size|background|border|width|height)\s*:\s*[^;{}]+;/,
				3,
			],
		]),
	},
	{
		language: 'sql',
		score: scorePatterns(code, [
			[/\bSELECT\b[\s\S]+\bFROM\b/i, 5],
			[
				/\b(?:INSERT\s+INTO|UPDATE\b[\s\S]+\bSET\b|DELETE\s+FROM|CREATE\s+TABLE|ALTER\s+TABLE)\b/i,
				5,
			],
			[/\b(?:JOIN|WHERE|GROUP\s+BY|ORDER\s+BY|LIMIT)\b/i, 2],
		]),
	},
	{
		language: 'typescript',
		score:
			scorePatterns(code, [
				[/\b(?:interface|type)\s+[A-Z_$][\w$]*(?:\s*[=<{])/, 5],
				[/\bimport\s+type\b|\bexport\s+type\b/, 4],
				[/\b(?:const|let|var)\s+[\w$]+\s*:\s*[A-Za-z_$][\w$<>|\[\],\s]*/, 4],
				[/\)\s*:\s*(?:Promise<)?[A-Za-z_$][\w$<>|\[\],\s]*(?:>|\s)?\s*=>?\s*[{;]/, 3],
				[/\b(?:as\s+const|implements\s+[A-Z_$]|enum\s+[A-Z_$])/, 3],
			]) + scoreEnhancedTypeScriptPatterns(code),
	},
	{
		language: 'javascript',
		score: scorePatterns(code, [
			[/\b(?:const|let|var)\s+[\w$]+\s*=/, 3],
			[/\bfunction\s*[\w$]*\s*\([^)]*\)\s*\{/, 3],
			[/=>\s*(?:\{|[\w$'"`(])/, 3],
			[/\b(?:import|export)\s+(?:[\w${}*,\s]+\s+from\s+)?['"][^'"]+['"]/, 3],
			[/\b(?:console\.log|document\.|window\.|require\()|\bmodule\.exports\b/, 3],
		]),
	},
	{
		language: 'python',
		score: scorePatterns(code, [
			[/^\s*def\s+[a-zA-Z_]\w*\([^)]*\)\s*:/m, 5],
			[/^\s*class\s+[A-Z_]\w*(?:\([^)]*\))?\s*:/m, 4],
			[/^\s*(?:from\s+[\w.]+\s+import\s+\w+|import\s+[\w.]+)/m, 3],
			[/^\s*(?:if|elif|else|for|while|try|except)\b[^\n]*:\s*$/m, 2],
			[/\bprint\([^)]*\)/, 2],
		]),
	},
	{
		language: 'java',
		score: scorePatterns(code, [
			[/\bpublic\s+(?:final\s+)?class\s+[A-Z]\w*/, 5],
			[/\bpublic\s+static\s+void\s+main\s*\(\s*String\[\]/, 5],
			[/\bSystem\.out\.println\s*\(/, 4],
			[
				/\b(?:private|protected|public)\s+(?:static\s+)?(?:final\s+)?[A-Z]\w*(?:<[^>]+>)?\s+\w+\s*[;(=]/,
				3,
			],
		]),
	},
	{
		language: 'go',
		score: scorePatterns(code, [
			[/^\s*package\s+\w+/m, 5],
			[/\bfunc\s+(?:\([^)]*\)\s*)?[A-Za-z_]\w*\s*\([^)]*\)\s*(?:[A-Za-z_*\[\]]+\s*)?\{/, 5],
			[/\bfmt\.(?:Println|Printf)\s*\(/, 3],
			[/\bimport\s+\(\s*[\s\S]*?\)/, 2],
		]),
	},
	{
		language: 'ruby',
		score: scorePatterns(code, [
			[/^\s*def\s+[a-z_]\w*[!?=]?/m, 4],
			[/^\s*class\s+[A-Z]\w*(?:\s*<\s*[A-Z]\w*)?/m, 3],
			[/^\s*end\s*$/m, 3],
			[/\b(?:puts|require|attr_reader|attr_accessor)\b/, 3],
			[/\bdo\s*\|[^|]+\|/, 2],
		]),
	},
	{
		language: 'rust',
		score: scorePatterns(code, [
			[/\bfn\s+[a-z_]\w*\s*\([^)]*\)\s*(?:->\s*[A-Za-z_:<>]+\s*)?\{/, 5],
			[/\blet\s+mut\s+\w+/, 3],
			[/\bprintln!\s*\(/, 4],
			[/\buse\s+(?:std|crate|super)::/, 3],
			[/\b(?:impl|pub\s+struct|enum)\s+[A-Z]\w*/, 3],
		]),
	},
	{
		language: 'shell',
		score: scorePatterns(code, [
			[/^#!\/usr\/bin\/(?:env\s+)?(?:ba|z|k)?sh\b/m, 6],
			[/^\s*(?:if|for|while)\b[\s\S]+\b(?:then|do)\b/m, 4],
			[/^\s*(?:fi|done)\s*$/m, 3],
			[/\b(?:echo|export|cd|grep|sed|awk|curl)\b[\s\S]*(?:\$\w+|&&|\|)/, 3],
			[/\$\{?[A-Z_][A-Z0-9_]*\}?/, 2],
		]),
	},
];

export const detectLanguage = (code: string): LanguageId | null => {
	const trimmedCode = code.trim();

	if (trimmedCode.length < 8) {
		return null;
	}

	const codeForDetection = trimmedCode.slice(0, MAX_DETECTION_CHARS);
	const [best, secondBest] = getLanguageScores(codeForDetection)
		.filter(({ score }) => score > 0)
		.sort((a, b) => b.score - a.score);

	if (!best || best.score < MIN_DETECTION_SCORE) {
		return null;
	}

	if (secondBest && best.score - secondBest.score < MIN_SCORE_GAP) {
		return null;
	}

	return best.language;
};
