/* eslint-disable require-unicode-regexp */
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

// looksLikeJson regexes
const JSON_START_REGEX = /^[{[]/;
const JSON_END_REGEX = /[}\]]$/;

// html regexes
const HTML_DOCTYPE_REGEX = /<!doctype\s+html/i;
const HTML_TAG_REGEX = /<\/?(?:html|head|body|div|span|script|style|section|template)\b/i;

// css regexes
const CSS_AT_RULE_REGEX = /@[\w-]+\s+[^{]+\{/;
const CSS_SELECTOR_PROPERTY_REGEX =
	/[.#]?[-_a-zA-Z][-_a-zA-Z0-9\s,.:#>+~*\[\]='"]+\{[^}]*\b(?:color|display|margin|padding|font|background|border|width|height|grid|flex)\s*:/;
const CSS_PROPERTY_REGEX =
	/\b(?:color|display|margin|padding|font-size|background|border|width|height)\s*:\s*[^;{}]+;/;

// sql regexes
const SQL_SELECT_FROM_REGEX = /\bSELECT\b[\s\S]+\bFROM\b/i;
const SQL_DML_REGEX =
	/\b(?:INSERT\s+INTO|UPDATE\b[\s\S]+\bSET\b|DELETE\s+FROM|CREATE\s+TABLE|ALTER\s+TABLE)\b/i;
const SQL_CLAUSE_REGEX = /\b(?:JOIN|WHERE|GROUP\s+BY|ORDER\s+BY|LIMIT)\b/i;

// typescript regexes
const TS_INTERFACE_TYPE_REGEX = /\b(?:interface|type)\s+[A-Z_$][\w$]*(?:\s*[=<{])/;
const TS_IMPORT_EXPORT_TYPE_REGEX = /\bimport\s+type\b|\bexport\s+type\b/;
const TS_TYPED_VAR_REGEX = /\b(?:const|let|var)\s+[\w$]+\s*:\s*[A-Za-z_$][\w$<>|\[\],\s]*/;
const TS_RETURN_TYPE_REGEX =
	/\)\s*:\s*(?:Promise<)?[A-Za-z_$][\w$<>|\[\],\s]*(?:>|\s)?\s*=>?\s*[{;]/;
const TS_ADVANCED_REGEX = /\b(?:as\s+const|implements\s+[A-Z_$]|enum\s+[A-Z_$])/;
const TS_ACCESS_MODIFIER_REGEX = /\b(?:private|protected|public|readonly)\s+[\w$]+\s*=/;
const TS_TYPED_ARROW_PARAM_REGEX =
	/\([^)]{0,500}\b[\w$]+\??:\s*[A-Za-z_$][\w$<>{}\[\]|&,\s.?]{0,200}[^)]{0,500}\)\s*(?::\s*[A-Za-z_$][\w$<>{}\[\]|&,\s.?]{0,200})?\s*=>/;

// javascript regexes
const JS_VAR_REGEX = /\b(?:const|let|var)\s+[\w$]+\s*=/;
const JS_FUNCTION_REGEX = /\bfunction\s*[\w$]*\s*\([^)]*\)\s*\{/;
const JS_ARROW_REGEX = /=>\s*(?:\{|[\w$'"`(])/;
const JS_IMPORT_EXPORT_REGEX = /\b(?:import|export)\s+(?:[\w${}*,\s]+\s+from\s+)?['"][^'"]+['"]/;
const JS_COMMON_API_REGEX = /\b(?:console\.log|document\.|window\.|require\()|\bmodule\.exports\b/;

// python regexes
const PY_DEF_REGEX = /^\s*def\s+[a-zA-Z_]\w*\([^)]*\)\s*:/m;
const PY_CLASS_REGEX = /^\s*class\s+[A-Z_]\w*(?:\([^)]*\))?\s*:/m;
const PY_IMPORT_REGEX = /^\s*(?:from\s+[\w.]+\s+import\s+\w+|import\s+[\w.]+)/m;
const PY_CONTROL_REGEX = /^\s*(?:if|elif|else|for|while|try|except)\b[^\n]*:\s*$/m;
const PY_PRINT_REGEX = /\bprint\([^)]*\)/;

// java regexes
const JAVA_CLASS_REGEX = /\bpublic\s+(?:final\s+)?class\s+[A-Z]\w*/;
const JAVA_MAIN_REGEX = /\bpublic\s+static\s+void\s+main\s*\(\s*String\[\]/;
const JAVA_PRINTLN_REGEX = /\bSystem\.out\.println\s*\(/;
const JAVA_MEMBER_REGEX =
	/\b(?:private|protected|public)\s+(?:static\s+)?(?:final\s+)?[A-Z]\w*(?:<[^>]+>)?\s+\w+\s*[;(=]/;

// go regexes
const GO_PACKAGE_REGEX = /^\s*package\s+\w+/m;
const GO_FUNC_REGEX =
	/\bfunc\s+(?:\([^)]*\)\s*)?[A-Za-z_]\w*\s*\([^)]*\)\s*(?:[A-Za-z_*\[\]]+\s*)?\{/;
const GO_PRINTLN_REGEX = /\bfmt\.(?:Println|Printf)\s*\(/;
const GO_IMPORT_REGEX = /\bimport\s+\(\s*[\s\S]*?\)/;

// ruby regexes
const RUBY_DEF_REGEX = /^\s*def\s+[a-z_]\w*[!?=]?/m;
const RUBY_CLASS_REGEX = /^\s*class\s+[A-Z]\w*(?:\s*<\s*[A-Z]\w*)?/m;
const RUBY_END_REGEX = /^\s*end\s*$/m;
const RUBY_COMMON_API_REGEX = /\b(?:puts|require|attr_reader|attr_accessor)\b/;
const RUBY_BLOCK_REGEX = /\bdo\s*\|[^|]+\|/;

// rust regexes
const RUST_FN_REGEX = /\bfn\s+[a-z_]\w*\s*\([^)]*\)\s*(?:->\s*[A-Za-z_:<>]+\s*)?\{/;
const RUST_LET_MUT_REGEX = /\blet\s+mut\s+\w+/;
const RUST_PRINTLN_REGEX = /\bprintln!\s*\(/;
const RUST_USE_REGEX = /\buse\s+(?:std|crate|super)::/;
const RUST_STRUCT_REGEX = /\b(?:impl|pub\s+struct|enum)\s+[A-Z]\w*/;

// shell regexes
const SHELL_SHEBANG_REGEX = /^#!\/usr\/bin\/(?:env\s+)?(?:ba|z|k)?sh\b/m;
const SHELL_CONTROL_REGEX = /^\s*(?:if|for|while)\b[\s\S]+\b(?:then|do)\b/m;
const SHELL_FI_DONE_REGEX = /^\s*(?:fi|done)\s*$/m;
const SHELL_COMMAND_REGEX = /\b(?:echo|export|cd|grep|sed|awk|curl)\b[\s\S]*(?:\$\w+|&&|\|)/;
const SHELL_VAR_REGEX = /\$\{?[A-Z_][A-Z0-9_]*\}?/;

const hasPattern = (code: string, pattern: RegExp): boolean => {
	// Reset stateful regexes so repeated tests always start at the beginning.
	pattern.lastIndex = 0;
	return pattern.test(code);
};

const scorePatterns = (code: string, patterns: Array<[RegExp, number]>): number =>
	patterns.reduce((score, [pattern, value]) => score + (hasPattern(code, pattern) ? value : 0), 0);

const looksLikeHtmlTagPair = (code: string): boolean => {
	const openTags = new Set<string>();
	// Ignored via go/ees019
	// eslint-disable-next-line e18e/prefer-static-regex
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

	if (!JSON_START_REGEX.test(trimmed) || !JSON_END_REGEX.test(trimmed)) {
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
				[HTML_DOCTYPE_REGEX, 5],
				[HTML_TAG_REGEX, 2],
			]) + (looksLikeHtmlTagPair(code) ? 3 : 0),
	},
	{
		language: 'css',
		score: scorePatterns(code, [
			[CSS_AT_RULE_REGEX, 3],
			[CSS_SELECTOR_PROPERTY_REGEX, 5],
			[CSS_PROPERTY_REGEX, 3],
		]),
	},
	{
		language: 'sql',
		score: scorePatterns(code, [
			[SQL_SELECT_FROM_REGEX, 5],
			[SQL_DML_REGEX, 5],
			[SQL_CLAUSE_REGEX, 2],
		]),
	},
	{
		language: 'typescript',
		score: scorePatterns(code, [
			[TS_INTERFACE_TYPE_REGEX, 5],
			[TS_IMPORT_EXPORT_TYPE_REGEX, 4],
			[TS_TYPED_VAR_REGEX, 4],
			[TS_RETURN_TYPE_REGEX, 3],
			[TS_ADVANCED_REGEX, 3],
			[TS_ACCESS_MODIFIER_REGEX, 5],
			[TS_TYPED_ARROW_PARAM_REGEX, 5],
		]),
	},
	{
		language: 'javascript',
		score: scorePatterns(code, [
			[JS_VAR_REGEX, 3],
			[JS_FUNCTION_REGEX, 3],
			[JS_ARROW_REGEX, 3],
			[JS_IMPORT_EXPORT_REGEX, 3],
			[JS_COMMON_API_REGEX, 3],
		]),
	},
	{
		language: 'python',
		score: scorePatterns(code, [
			[PY_DEF_REGEX, 5],
			[PY_CLASS_REGEX, 4],
			[PY_IMPORT_REGEX, 3],
			[PY_CONTROL_REGEX, 2],
			[PY_PRINT_REGEX, 2],
		]),
	},
	{
		language: 'java',
		score: scorePatterns(code, [
			[JAVA_CLASS_REGEX, 5],
			[JAVA_MAIN_REGEX, 5],
			[JAVA_PRINTLN_REGEX, 4],
			[JAVA_MEMBER_REGEX, 3],
		]),
	},
	{
		language: 'go',
		score: scorePatterns(code, [
			[GO_PACKAGE_REGEX, 5],
			[GO_FUNC_REGEX, 5],
			[GO_PRINTLN_REGEX, 3],
			[GO_IMPORT_REGEX, 2],
		]),
	},
	{
		language: 'ruby',
		score: scorePatterns(code, [
			[RUBY_DEF_REGEX, 4],
			[RUBY_CLASS_REGEX, 3],
			[RUBY_END_REGEX, 3],
			[RUBY_COMMON_API_REGEX, 3],
			[RUBY_BLOCK_REGEX, 2],
		]),
	},
	{
		language: 'rust',
		score: scorePatterns(code, [
			[RUST_FN_REGEX, 5],
			[RUST_LET_MUT_REGEX, 3],
			[RUST_PRINTLN_REGEX, 4],
			[RUST_USE_REGEX, 3],
			[RUST_STRUCT_REGEX, 3],
		]),
	},
	{
		language: 'shell',
		score: scorePatterns(code, [
			[SHELL_SHEBANG_REGEX, 6],
			[SHELL_CONTROL_REGEX, 4],
			[SHELL_FI_DONE_REGEX, 3],
			[SHELL_COMMAND_REGEX, 3],
			[SHELL_VAR_REGEX, 2],
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
