#!/usr/bin/env node
/* oxlint-disable */
/* eslint-disable -- Hand-run analysis script that produced this plan's measurements.
   Kept verbatim so its output stays reproducible; it is not shipped code. */
/**
 * Phase 2 / §0.2 — classify the "residue": the unsafe-selector patterns that have no
 * `of S` guard form and were therefore counted as per-site human judgement work.
 *
 * The plan sizes the residue at 1,149 lines in 516 files, produced by PATTERN PRESENCE
 * ONLY (`rg -cF` over the seven residue signals, deduped because one line can carry two).
 * That number has never been filtered for guardability or reachability. Elsewhere in the
 * same plan the candidate:violation ratio is ~50:1, so an unfiltered presence count is not
 * decision-grade. This script filters it.
 *
 * Every residue row lands in exactly one of four buckets:
 *
 *   codemod-able          The guard can go INSIDE the pattern's argument, so the row belongs
 *                         to the transform rather than the residue. Chiefly `:has()`:
 *                         `&:has(> *)` -> `&:has(> *:not(:where(S)))`, and positional pseudos
 *                         nested inside a `:has()` argument, which take the ordinary §0.2
 *                         `of S` rewrite one level down.
 *   deterministically-safe Provably cannot be affected by a top-layer host, by a rule a script
 *                         can apply. Three sub-rules: (a) the match is not a CSS selector at
 *                         all (comment, prose, mock data, ESLint AST selector); (b) `:nth-of-type`
 *                         whose type selector is a tag the host does not use; (c) a `:has(> X)`
 *                         argument the host element provably cannot satisfy.
 *   unreachable           Owner package has no path to a migrated adopter (filter 1), or the row
 *                         lives inside one of the three `wrapped` adopters, where the host sits in
 *                         a DS-owned wrapper and cannot reach a consumer selector.
 *   needs-judgement       The real residue.
 *
 * BUCKET PRECEDENCE (a row is assigned by the first rule that fires):
 *   1. deterministically-safe (not-a-selector / comment)
 *   2. deterministically-safe (pattern-specific proof)
 *   3. codemod-able
 *   4. unreachable
 *   5. needs-judgement
 * `unreachable` therefore reads as "rows that would otherwise need judgement, but are in a
 * package the codemod does not even scope in" — the informative reading. Filter 1 prunes only
 * ~6-7% globally, so do not expect much from it.
 *
 * HOST GROUND TRUTH (read from @atlaskit/top-layer, not assumed):
 *   - popover host:  <div popover={mode} id role aria-label aria-labelledby data-testid
 *                     style css className={cx(<internal xcss>)}>   (src/popover/popover.tsx:401)
 *   - dialog host:   <dialog id aria-label aria-labelledby css style>
 *                                                        (src/dialog/dialog-content.tsx:273)
 *   - surface content is rendered INSIDE the host (popover-surface wraps children in its own
 *     div), so for a `> X` argument only the host element itself is a candidate match; consumer
 *     content sits at depth >= 2.
 *   - `role`, `data-testid`, `id` and `aria-label` are CONSUMER-SUPPLIED, so a compound
 *     qualified only by those is host-matchable. A consumer *class* is not reachable: the host's
 *     className is `cx()` over DS-internal xcss only.
 *
 * MEASUREMENT BASIS — must match the plan's scale table exactly:
 *   rg -g '*.ts' -g '*.tsx' -g '*.css' -g '!**\/node_modules/**'
 * Excluding node_modules is essential. Traversing it (`rg -uu`) inflates the union ~4x and is
 * the single cause of every wrong number in earlier drafts of this plan. Do not "fix" this by
 * removing the exclusion.
 *
 * Read-only over the repo. Writes JSON to stdout (and --out), progress + tables to stderr.
 *
 * Usage:
 *   node platform/packages/design-system/top-layer/notes/plans/unsafe-selectors-prework/scripts/classify-residue.mjs \
 *     --out platform/packages/design-system/top-layer/notes/plans/unsafe-selectors-prework/residue-classification.json
 *
 * Flags:
 *   --out <path>       also write the JSON to <path>
 *   --repo <path>      repo root (default: `git rev-parse --show-toplevel`)
 *   --scope <path>     filter1 scope JSON (default: ../filter1-scope.json)
 *   --print-bucket <bucket>[:<pattern>]  dump the rows in a bucket to stderr, for eyeballing
 *   --sample-has <n>   emit n evenly-spaced `:has()` rows for manual sampling (default 30)
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

// ---------------------------------------------------------------------------
// args
// ---------------------------------------------------------------------------

const argv = process.argv.slice(2);
const argVal = (n) => {
	const i = argv.indexOf(n);
	return i === -1 ? undefined : argv[i + 1];
};
const log = (...a) => console.error('[classify-residue]', ...a);

const REPO = argVal('--repo')
	? path.resolve(argVal('--repo'))
	: execFileSync('git', ['rev-parse', '--show-toplevel'], {
			cwd: path.dirname(new URL(import.meta.url).pathname),
			encoding: 'utf8',
		}).trim();

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const SCOPE_JSON = argVal('--scope') ?? path.join(SCRIPT_DIR, '..', 'filter1-scope.json');
const SAMPLE_HAS = Number(argVal('--sample-has') ?? 30);

// ---------------------------------------------------------------------------
// the seven residue signals — verbatim from the plan's §0.2 residue table
// ---------------------------------------------------------------------------

/**
 * rg -e arguments. Order matters only for the dedupe precedence below.
 */
const SIGNALS = [
	{ id: 'has', rg: ':has\\(', plan: 547 },
	{ id: 'nth-of-type', rg: 'nth-of-type', plan: 268 },
	{ id: 'empty', rg: ':empty', plan: 176 },
	{ id: 'only-child', rg: 'only-child', plan: 81 },
	{ id: 'adjacent-sibling', rg: '& \\+ ', plan: 77 },
	{ id: 'global-styles', rg: 'injectGlobal|createGlobalStyle', plan: 24 },
	{ id: 'general-sibling', rg: '& ~ ', plan: 6 },
];

const GLOBS = ['*.ts', '*.tsx', '*.css'];

/**
 * Host element tag names. Anything else cannot participate in an `:nth-of-type` count.
 */
const HOST_TAGS = new Set(['div', 'dialog']);

/**
 * Attribute / id selectors the host CAN satisfy, because the adopter forwards them from the
 * consumer. A compound qualified only by one of these is NOT provably safe.
 */
const HOST_REACHABLE_ATTR = /\[\s*(role|data-testid|id|aria-label|aria-labelledby|popover)\b/i;

/**
 * The three `wrapped` adopters: host lives in a DS-owned wrapper, unreachable from consumer CSS.
 */
const WRAPPED_ADOPTERS = new Set([
	'@atlaskit/react-select',
	'@atlaskit/datetime-picker',
	'@atlaskit/avatar-group',
]);

/**
 * Positional pseudos that DO have a specificity-neutral `of S` form (§0.2).
 */
const GUARDABLE_POSITIONAL = /:(?:nth-last-child|nth-child|first-child|last-child)\b/;
/**
 * Positional / structural pseudos that do NOT (§0.2 residue).
 */
const UNGUARDABLE_POSITIONAL = /:(?:only-child|nth-of-type|nth-last-of-type|empty)\b/;

const HTML_TAGS = new Set(
	`a abbr address area article aside audio b base bdi bdo blockquote body br button canvas
	caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em embed
	fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe
	img input ins kbd label legend li link main map mark menu meta meter nav noscript object ol
	optgroup option output p param picture pre progress q rp rt ruby s samp script search section
	select slot small source span strong style sub summary sup table tbody td template textarea
	tfoot th thead time title tr track u ul var video wbr
	circle clipPath defs ellipse foreignObject g line linearGradient marker mask path pattern
	polygon polyline radialGradient rect stop svg text tspan use`
		.split(/\s+/)
		.filter(Boolean),
);

/**
 * Void elements can never have children, so `:empty` on them can never flip.
 */
const VOID_TAGS = new Set([
	'area',
	'base',
	'br',
	'col',
	'embed',
	'hr',
	'img',
	'input',
	'link',
	'meta',
	'param',
	'source',
	'track',
	'wbr',
]);

// ---------------------------------------------------------------------------
// 1. collect residue rows (one row per matching line, same basis as the plan)
// ---------------------------------------------------------------------------

function rgLines(patterns) {
	const args = ['-n', '--no-heading', '--no-messages'];
	for (const g of GLOBS) args.push('-g', g);
	args.push('-g', '!**/node_modules/**');
	for (const p of patterns) args.push('-e', p);
	args.push('.');
	let out = '';
	try {
		out = execFileSync('rg', args, {
			cwd: REPO,
			encoding: 'utf8',
			maxBuffer: 512 * 1024 * 1024,
		});
	} catch (e) {
		if (e.status === 1) return [];
		throw e;
	}
	const rows = [];
	for (const line of out.split('\n')) {
		if (!line) continue;
		// "./path/to/file.ts:123:text"
		const m = /^(.+?):(\d+):([\s\S]*)$/.exec(line);
		if (!m) continue;
		rows.push({ file: m[1].replace(/^\.\//, ''), line: Number(m[2]), text: m[3] });
	}
	return rows;
}

log('collecting residue rows (rg over *.ts,*.tsx,*.css, node_modules excluded)…');
const allRows = rgLines(SIGNALS.map((s) => s.rg));
log(`residue union: ${allRows.length} lines in ${new Set(allRows.map((r) => r.file)).size} files`);

// per-signal presence, to reproduce the plan's per-pattern figures
const SIGNAL_RE = {
	has: /:has\(/,
	'nth-of-type': /nth-of-type/,
	empty: /:empty/,
	'only-child': /only-child/,
	'adjacent-sibling': /& \+ /,
	'global-styles': /injectGlobal|createGlobalStyle/,
	'general-sibling': /& ~ /,
};

for (const r of allRows) {
	r.signals = SIGNALS.filter((s) => SIGNAL_RE[s.id].test(r.text)).map((s) => s.id);
	// dedupe precedence: SIGNALS order (`:has(` first — it is the class furthest from a rewrite)
	r.primary = r.signals[0];
}

// ---------------------------------------------------------------------------
// 2. package attribution + filter 1 scope
// ---------------------------------------------------------------------------

log('attributing files to owning packages…');
const pkgJsonPaths = execFileSync('git', ['ls-files', '*package.json'], {
	cwd: REPO,
	encoding: 'utf8',
	maxBuffer: 256 * 1024 * 1024,
})
	.split('\n')
	.filter((p) => p && !p.includes('node_modules/') && path.basename(p) === 'package.json');

/**
 * dir -> name
 */
const pkgDirToName = new Map();
for (const p of pkgJsonPaths) {
	const dir = path.dirname(p);
	let name = null;
	try {
		name = JSON.parse(readFileSync(path.join(REPO, p), 'utf8')).name ?? null;
	} catch {
		/* unparsable: still a package boundary */
	}
	pkgDirToName.set(dir === '.' ? '' : dir, name);
}
log(`package boundaries: ${pkgDirToName.size}`);

const inScopeDirs = new Set();
let scopeMeta = { available: false };
if (existsSync(SCOPE_JSON)) {
	const scope = JSON.parse(readFileSync(SCOPE_JSON, 'utf8'));
	for (const entry of scope.inScopePackages ?? []) {
		const [, dir] = entry.split('\t');
		if (dir !== undefined) inScopeDirs.add(dir);
	}
	scopeMeta = {
		available: true,
		path: path.relative(REPO, SCOPE_JSON),
		inScopePackages: scope.inScopePackagesCount,
		outOfScopePackages: scope.outOfScopePackages,
		adopterSeeds: scope.adopters?.seedsUsedCount,
	};
	log(`filter1 scope loaded: ${inScopeDirs.size} in-scope package dirs`);
} else {
	log(`WARNING: filter1 scope JSON not found at ${SCOPE_JSON} — 'unreachable' will be 0`);
}

function ownerOf(file) {
	let dir = path.dirname(file);
	for (;;) {
		if (pkgDirToName.has(dir)) return { dir, name: pkgDirToName.get(dir) };
		if (dir === '.' || dir === '' || dir === '/') break;
		const next = path.dirname(dir);
		if (next === dir) break;
		dir = next;
	}
	return { dir: '', name: pkgDirToName.get('') ?? null };
}

for (const r of allRows) {
	const owner = ownerOf(r.file);
	r.owner = owner.name;
	r.ownerDir = owner.dir;
	r.inScope = inScopeDirs.size === 0 ? true : inScopeDirs.has(owner.dir);
	r.wrapped = WRAPPED_ADOPTERS.has(owner.name ?? '');
}

// ---------------------------------------------------------------------------
// 3. shared lexical helpers
// ---------------------------------------------------------------------------

const isCommentLine = (t) => /^\s*(\/\/|\/\*|\*\/|\*(?!\/)|<!--|#\s)/.test(t);

/**
 * File is an ESLint rule / AST-selector context, where `:has()` is an esquery selector.
 */
const isEslintAstFile = (f) =>
	/eslint-plugin|eslint-rules?\/|\/rules?\/[^/]*\/index\.tsx?$|esquery/.test(f);

/**
 * esquery AST node names that can appear inside `:has()` in an ESLint rule.
 */
const AST_NODE_RE =
	/\b(JSXElement|JSXFragment|JSXAttribute|MethodDefinition|CallExpression|MemberExpression|Identifier|Literal|Program|VariableDeclarator|VariableDeclaration|Property|ImportDeclaration|ExportNamedDeclaration|TSTypeAnnotation|TSInterfaceDeclaration|ClassDeclaration|ArrowFunctionExpression|FunctionDeclaration|ObjectExpression|ArrayExpression|ReturnStatement|TaggedTemplateExpression|TemplateLiteral|Decorator|ClassBody|BlockStatement)\b/;

/**
 * Non-CSS uses of a `:token` substring: URLs, ids, error strings, test names, snake_case keys.
 * Deliberately conservative — anything that could plausibly be a selector stays a selector.
 */
function notACssSelector(text, token) {
	const idx = text.indexOf(token);
	if (idx === -1) return null;

	// `:empty-container-count`, `:empty_value`, `:empty_after_lift` — the pseudo is not terminated.
	const after = text.slice(idx + token.length, idx + token.length + 1);
	if (/[A-Za-z0-9_-]/.test(after)) return 'pseudo-name-not-terminated';

	// the compound immediately before the pseudo
	const before = text.slice(0, idx);
	const compound = /([A-Za-z0-9_$\-.#\][*&="'|^~:()]*)$/.exec(before)?.[1] ?? '';

	// a CSS type selector cannot start with a digit: `712020:empty`, `client:root:actions:empty`
	const lastSeg =
		compound
			.split(/[.#\][>+~\s]/)
			.filter(Boolean)
			.pop() ?? '';
	if (/^\d/.test(lastSeg)) return 'invalid-css-ident-digit-start';

	// URL / query-string / path context
	if (/[/?](?=[^\]]*$)/.test(before.slice(-80)) && !/\.css$/.test('')) {
		// `\?[\w=]` and not a bare `?`, so optional chaining (`element?.querySelector(...)`) is not
		// mistaken for a query string. That bug pruned a real DOM query,
		// `querySelector(':scope > span:last-child:empty')`, which a host insertion genuinely breaks.
		if (/https?:|\/gateway\/|\/api\/|\?[\w=]|\.\.\//.test(before.slice(-80))) return 'url-or-path';
	}

	// jest / test / message string context — the token is data, not a rule
	if (
		/(?:^|[^\w$])(?:expect|it|test|describe|toBe|toEqual|toHaveTextContent|toContain|endsWith|startsWith|includes|new Error|throw new Error|console\.(?:log|warn|error))\s*\(/.test(
			text,
		) &&
		!/querySelector|\.matches\(|\.closest\(|locator\(/.test(text)
	) {
		return 'test-or-message-string';
	}

	// JSX prop / object value that is plainly an identifier, not a selector
	if (
		/(?:testId|data-testid|accountId|avatarUrl|filePath|__id|id|context|name)\s*[:=]/.test(text)
	) {
		if (!/querySelector|locator\(|\.matches\(|css|styled|\{\s*$/.test(text)) {
			return 'identifier-value-not-selector';
		}
	}

	return null;
}

/**
 * Balanced-paren extraction of a functional-pseudo argument starting at `openIdx` (the `(`).
 */
function balancedArg(text, openIdx) {
	let depth = 0;
	for (let i = openIdx; i < text.length; i++) {
		const c = text[i];
		if (c === '(') depth++;
		else if (c === ')') {
			depth--;
			if (depth === 0) return text.slice(openIdx + 1, i);
		}
	}
	return null; // unterminated on this line
}

/**
 * Split a selector list on top-level commas (ignoring commas inside () and []).
 */
function topLevelSplit(sel, sep = ',') {
	const out = [];
	let depth = 0;
	let cur = '';
	for (const c of sel) {
		if (c === '(' || c === '[') depth++;
		else if (c === ')' || c === ']') depth--;
		if (c === sep && depth === 0) {
			out.push(cur);
			cur = '';
		} else cur += c;
	}
	out.push(cur);
	return out;
}

/**
 * Does this selector branch use a sibling combinator at top level?
 */
function hasTopLevelSiblingCombinator(branch) {
	let depth = 0;
	for (const c of branch) {
		if (c === '(' || c === '[') depth++;
		else if (c === ')' || c === ']') depth--;
		else if ((c === '+' || c === '~') && depth === 0) return true;
	}
	return false;
}

/**
 * Leading type selector of a compound, or null.
 */
function leadingType(compound) {
	const m = /^([*]|[A-Za-z][A-Za-z0-9-]*)/.exec(compound.trim());
	return m ? m[1] : null;
}

/**
 * The compound selector immediately preceding index `i`.
 *
 * Boundary characters end the previous compound: combinators, commas, whitespace, and — this is
 * the part that is easy to get wrong — quotes, backticks, parens and braces. Without the quote /
 * paren boundary, `renderer.page.locator('p:nth-of-type(2)')` scans back to `renderer` instead of
 * `p`, and `:not(:nth-of-type(1))` scans back past the `:not(`.
 */
function precedingCompound(text, i) {
	const raw = /([A-Za-z0-9_$\-.#\]["'`=|^~*&:(){}]*)$/.exec(text.slice(0, i))?.[1] ?? '';
	return raw.split(/[>+~,\s'"`(){}]/).pop() ?? '';
}

// ---------------------------------------------------------------------------
// 4. per-pattern classifiers
// ---------------------------------------------------------------------------

/**
 * Checked-in build output / codegen, not hand-written source. Fixing these means regenerating
 * them, so they are not per-site judgement work. One of them matters disproportionately:
 * `platform/services/frontkit-dashboard/prebuilt/index.<hash>.css` is a 75 KB MINIFIED bundle on a
 * SINGLE line, so it contributes one "line" to the residue while carrying a whole stylesheet.
 */
/**
 * A linter/ratchet rule's own pattern table or test fixture. These files carry selector STRINGS
 * that are matched against other code, never applied as CSS, so no host can affect them. Verified
 * by enumeration: all 16 residue rows under these paths are pattern constants or rule fixtures.
 */
const isLintRuleSource = (f) => /(?:eslint-plugin[^/]*|ratcheting)\/src\/rules\//.test(f);

const isGeneratedArtifact = (f) =>
	/(?:^|\/)(?:prebuilt|dist|__generated__)\//.test(f) ||
	/\.codegen\.tsx?$|declaration\.d\.tsx?$|\.min\.css$/.test(f);

const SAFE = (reason, detail) => ({ bucket: 'deterministically-safe', reason, detail });
const CODEMOD = (reason, detail) => ({ bucket: 'codemod-able', reason, detail });
const JUDGE = (reason, detail) => ({ bucket: 'needs-judgement', reason, detail });

/**
 * `:nth-of-type` — THE headline deterministic rule.
 *
 * `:nth-of-type` counts siblings OF THE SAME ELEMENT TYPE. The top-layer host is a `<div>`
 * (popover) or a `<dialog>`. So `p:nth-of-type(2)`, `li:nth-of-type(…)`, `tr:nth-of-type(…)`,
 * `span:nth-of-type(…)` etc. cannot shift when a host is inserted as a sibling: the host's tag
 * does not participate in their count. Only `div:nth-of-type`, `dialog:nth-of-type`, and forms
 * with NO type selector (which group by whatever type the matched element happens to be, and a
 * matched `<div>` does collide with the host) can shift.
 */
function classifyNthOfType(r) {
	const text = r.text;
	if (isCommentLine(text)) return SAFE('comment-or-doc');

	// every `:nth-of-type(` occurrence on the line; the line is safe only if ALL are safe
	const occ = [];
	const re = /:nth-of-type\s*\(/g;
	let m;
	while ((m = re.exec(text))) occ.push(m.index);

	if (occ.length === 0) {
		// `nth-of-type` present without the pseudo syntax: prose, rule names, disable comments
		return SAFE('not-a-css-selector', 'no `:nth-of-type(` pseudo on the line');
	}

	const types = [];
	let anyShiftable = false;
	for (const i of occ) {
		const t = leadingType(precedingCompound(text, i));
		types.push(t ?? '(none)');
		if (t === null || t === '*') anyShiftable = true;
		else if (HOST_TAGS.has(t.toLowerCase())) anyShiftable = true;
		else if (!HTML_TAGS.has(t.toLowerCase()) && !t.includes('-')) {
			// unknown identifier and not a custom-element name: treat as unresolved
			anyShiftable = true;
		}
	}

	if (!anyShiftable) {
		return SAFE('type-selector-not-host-tag', types.join(','));
	}
	return JUDGE('type-selector-collides-or-absent', types.join(','));
}

/**
 * `:empty` — the host flips `E:empty` only if a host can be inserted as a child of E.
 * Deterministic sub-rules only. The strong narrowing argument (an ANCHORED host is inserted
 * beside its trigger, and the trigger is itself a child of E, so E was never `:empty` and the
 * match cannot flip — leaving only IN-PLACE adopters in an otherwise-empty container) is NOT
 * scriptable per site, because it needs to know which adopter renders there. It is reported in
 * the write-up as a narrowing note, not applied as a bucket.
 */
function classifyEmpty(r) {
	const text = r.text;
	if (isCommentLine(text)) return SAFE('comment-or-doc');

	const why = notACssSelector(text, ':empty');
	if (why) return SAFE('not-a-css-selector', why);

	// a list of pseudo-class names (type/tooling manifests), not applied CSS
	if (/cssPseudos|PSEUDO|pseudoClasses|readonly \[/.test(text)) {
		return SAFE('not-a-css-selector', 'pseudo-name-manifest');
	}

	// void element: can never have children, so `:empty` can never flip
	const t = leadingType(precedingCompound(text, text.indexOf(':empty')));
	if (t && VOID_TAGS.has(t.toLowerCase())) return SAFE('void-element-always-empty', t);

	return JUDGE('host-mounting-flips-the-match');
}

/**
 * `:only-child` — no specificity-neutral guard (`:nth-child(1 of S):nth-last-child(1 of S)` is
 * (0,2,0) vs (0,1,0), so it fails §0.3 gate 2), and `:only-child` is TYPE-AGNOSTIC: it counts
 * every sibling regardless of tag, so unlike `:nth-of-type` there is no type-based prune.
 * Only the not-a-selector rule can fire.
 */
function classifyOnlyChild(r) {
	const text = r.text;
	if (isCommentLine(text)) return SAFE('comment-or-doc');
	if (!/:only-child\b/.test(text)) {
		return SAFE('not-a-css-selector', 'bare word `only-child`, no pseudo-class');
	}
	const why = notACssSelector(text, ':only-child');
	if (why) return SAFE('not-a-css-selector', why);
	// `.matches(':only-child')` in a unit test asserting DOM shape — a test, not a style rule
	if (/\.matches\(\s*['"`]:only-child/.test(text)) {
		return SAFE('not-a-css-selector', 'dom-assertion-in-test');
	}
	return JUDGE('no-specificity-neutral-guard');
}

/**
 * `& + X` / `& ~ X` — needs the PARENT's child list, which the selector does not describe.
 */
function classifySibling(r, token) {
	const text = r.text;
	if (isCommentLine(text)) return SAFE('comment-or-doc');
	if (/@ts-expect-error|eslint-disable/.test(text) && !/\{\s*$/.test(text)) {
		return SAFE('comment-or-doc', 'inline suppression comment');
	}
	return JUDGE('needs-parent-child-list', token);
}

/**
 * `injectGlobal` / `createGlobalStyle` — unscoped global CSS. The judgement unit is the file.
 */
function classifyGlobal(r) {
	const text = r.text;
	if (isCommentLine(text)) return SAFE('comment-or-doc');
	if (/^\s*(import|export)\b/.test(text) || /from ['"]/.test(text)) {
		return SAFE('not-a-rule', 'import/re-export of the API, carries no selector');
	}
	return JUDGE('unscoped-global-css');
}

/**
 * `:has()` — the biggest and most interesting class (547 of 1,149).
 *
 * A host H can change the truth of `E:has(A)` in exactly two ways:
 *   (i)  H, or something in H's subtree, satisfies A relative to E;
 *   (ii) H's presence changes whether a REAL element satisfies A — i.e. A contains a
 *        positional/structural pseudo.
 *
 * Both are fixable IN-ARGUMENT, which is what makes most of this class part of the transform:
 *   - positional pseudo inside A -> apply the ordinary §0.2 `of S` rewrite one level down;
 *   - `> X` where H itself can match X -> `> X:not(:where(S))`;
 *   - descendant A -> append `:not(:where([popover], dialog, [popover] *, dialog *, …))` to the
 *     rightmost compound of every top-level branch. §0.2 already specifies this descendant form.
 * All three are appends to the rightmost compound of each branch: mechanical given a selector
 * parser, and zero-specificity because `:where()` is weightless (§0.3).
 *
 * What is genuinely NOT guardable in-argument:
 *   - a top-level SIBLING combinator inside A (`:has(+ X)`, `:has(~ X)`). A host inserted between
 *     E and X breaks the adjacency, and there is no `+ X of S` form — the same dead end as `& + X`.
 *   - an INTERPOLATED argument (`:has(${SEL})`): the branch structure is unknown at the selector
 *     site, so appending to "the rightmost compound" is not safe (if SEL is a comma list, only its
 *     last branch gets guarded).
 *   - a SELF-REFERENTIAL argument (`:has(> &)`, `:has(&)`): `&` resolves to the enclosing rule's
 *     own selector, so the guard target is not local.
 *   - an argument carrying `:only-child` / `:nth-of-type` / `:empty`, which have no guard form at
 *     any nesting depth.
 */
function classifyHas(r) {
	if (isGeneratedArtifact(r.file)) {
		return SAFE('generated-build-artifact-not-hand-written-source', r.file);
	}
	if (isLintRuleSource(r.file)) {
		return SAFE('lint-rule-pattern-table-or-fixture-not-applied-css', r.file);
	}
	const text = r.text;
	if (isCommentLine(text)) return SAFE('comment-or-doc');

	// a test title / prose sentence that happens to name the selector, e.g.
	// `it('… so the :has(+) selector matches', …)`
	if (/(?:^|[^\w$])(?:it|test|describe|expect|toBe|toEqual|new Error)\s*\(\s*['"`]/.test(text)) {
		return SAFE('not-a-css-selector', 'test-title-or-prose');
	}

	// `body:has(X)` / `html:has(X)` / `:root:has(X)` are INVARIANT. The top layer is a painting
	// concept, not a DOM relocation: the host stays a descendant of <body>, and the flag-off
	// @atlaskit/portal container is appended to document.body too. So whether X exists somewhere
	// under <body> does not change when the host moves.
	if (/(?:^|[^-\w])(?:body|html|:root)(?:\.[\w-]+|\[[^\]]*\])*:has\(/.test(text)) {
		return SAFE('root-scoped-has-is-invariant', 'host stays inside <body> either way');
	}

	// ESLint / esquery AST selector, not CSS
	if (AST_NODE_RE.test(text) || (isEslintAstFile(r.file) && !/css|styled|\.css$/.test(text))) {
		if (AST_NODE_RE.test(text)) return SAFE('not-a-css-selector', 'esquery-ast-selector');
	}

	const occ = [];
	const re = /:has\s*\(/g;
	let m;
	while ((m = re.exec(text))) occ.push(re.lastIndex - 1);
	if (occ.length === 0) return SAFE('not-a-css-selector', 'no `:has(` pseudo on the line');

	// worst verdict across all `:has()` on the line wins
	let worst = null;
	const rank = { 'deterministically-safe': 0, 'codemod-able': 1, 'needs-judgement': 2 };
	const take = (v) => {
		if (!worst || rank[v.bucket] > rank[worst.bucket]) worst = v;
	};

	for (const openIdx of occ) {
		const arg = balancedArg(text, openIdx);
		if (arg === null) {
			take(JUDGE('unterminated-argument-on-line', 'multiline selector'));
			continue;
		}
		if (arg.trim() === '') {
			take(SAFE('not-a-css-selector', 'empty `:has()` — API reference or type text'));
			continue;
		}
		if (/\$\{/.test(arg)) {
			take(JUDGE('interpolated-argument', arg.slice(0, 60)));
			continue;
		}
		if (/(^|[\s>+~,(])&/.test(arg)) {
			take(JUDGE('self-referential-argument', arg.slice(0, 60)));
			continue;
		}
		if (UNGUARDABLE_POSITIONAL.test(arg)) {
			take(JUDGE('argument-carries-unguardable-positional', arg.slice(0, 60)));
			continue;
		}

		const branches = topLevelSplit(arg).map((b) => b.trim());
		let branchVerdict = null;
		for (const b of branches) {
			if (!b) continue;
			if (hasTopLevelSiblingCombinator(b)) {
				branchVerdict = JUDGE('sibling-combinator-in-argument', b.slice(0, 60));
				break;
			}
			if (GUARDABLE_POSITIONAL.test(b)) {
				branchVerdict = branchVerdict ?? CODEMOD('nested-positional-takes-of-S', b.slice(0, 60));
				continue;
			}
			// direct-child argument: only the host ELEMENT is a candidate (surface content is
			// deeper), so a compound the host cannot satisfy is provably safe.
			const isDirectChild = /^>/.test(b);
			const compound = b.replace(/^>\s*/, '').trim();
			const singleCompound = !/[\s>]/.test(compound);
			if (isDirectChild && singleCompound) {
				const t = leadingType(compound);
				const hostCouldMatch =
					compound === '*' ||
					(t && HOST_TAGS.has(t.toLowerCase())) ||
					HOST_REACHABLE_ATTR.test(compound) ||
					/^#/.test(compound) ||
					(!t && !/^[.#[]/.test(compound));
				if (!hostCouldMatch) {
					branchVerdict = branchVerdict ?? SAFE('host-cannot-match-direct-child', compound);
					continue;
				}
				branchVerdict = CODEMOD('guard-host-in-direct-child-argument', compound);
				continue;
			}
			// `> C …` where C itself is a compound the host cannot be: the host would have to BE C
			// to put anything under it into A's reach, so the whole branch is provably unreachable
			// even though A continues deeper.
			if (isDirectChild) {
				const first = compound.split(/[\s>]/)[0];
				const ft = leadingType(first);
				const hostCouldBeFirst =
					first === '*' ||
					(ft && HOST_TAGS.has(ft.toLowerCase())) ||
					HOST_REACHABLE_ATTR.test(first) ||
					/^#/.test(first) ||
					(!ft && !/^[.#[]/.test(first));
				if (!hostCouldBeFirst) {
					branchVerdict = branchVerdict ?? SAFE('host-cannot-match-direct-child', first);
					continue;
				}
			}
			// descendant-reaching argument: the host's subtree is consumer surface content, so it
			// can satisfy A; §0.2's descendant guard (`[popover] *`, `dialog *`) appends to the
			// rightmost compound.
			branchVerdict = CODEMOD('guard-subtree-in-descendant-argument', b.slice(0, 60));
		}
		take(branchVerdict ?? JUDGE('unclassified-argument', arg.slice(0, 60)));
	}
	return worst;
}

// ---------------------------------------------------------------------------
// 5. run the classifiers
// ---------------------------------------------------------------------------

function classifyFor(r, signal) {
	if (isGeneratedArtifact(r.file)) {
		return SAFE('generated-build-artifact-not-hand-written-source', r.file);
	}
	if (isLintRuleSource(r.file)) {
		return SAFE('lint-rule-pattern-table-or-fixture-not-applied-css', r.file);
	}
	switch (signal) {
		case 'has':
			return classifyHas(r);
		case 'nth-of-type':
			return classifyNthOfType(r);
		case 'empty':
			return classifyEmpty(r);
		case 'only-child':
			return classifyOnlyChild(r);
		case 'adjacent-sibling':
			return classifySibling(r, '& +');
		case 'general-sibling':
			return classifySibling(r, '& ~');
		case 'global-styles':
			return classifyGlobal(r);
		default:
			return JUDGE('unknown-pattern');
	}
}

const BUCKET_RANK = {
	'deterministically-safe': 0,
	'codemod-able': 1,
	unreachable: 2,
	'needs-judgement': 3,
};

/**
 * A line can carry two residue patterns (30 of the 1,149 do). The plan deduped them to one row,
 * so a deduped row must take the WORST verdict across every pattern present on it — otherwise a
 * line like `'& table:nth-of-type(1):empty'` would be pruned by the `:nth-of-type` type rule while
 * its unguardable `:empty` half silently disappeared.
 */
function classify(r) {
	let worst = null;
	for (const s of r.signals) {
		const v = classifyFor(r, s);
		if (!worst || BUCKET_RANK[v.bucket] > BUCKET_RANK[worst.bucket]) {
			worst = { ...v, signal: s };
		}
	}
	return worst ?? JUDGE('unknown-pattern');
}

for (const r of allRows) {
	if (isGeneratedArtifact(r.file) || isLintRuleSource(r.file)) {
		r.bucket = 'deterministically-safe';
		r.reason = isGeneratedArtifact(r.file)
			? 'generated-build-artifact-not-hand-written-source'
			: 'lint-rule-pattern-table-or-fixture-not-applied-css';
		r.decidedBy = 'file-path';
		continue;
	}
	const v = classify(r);
	r.bucket = v.bucket;
	r.reason = v.reason;
	r.detail = v.detail;
	r.decidedBy = v.signal;
	// precedence step 4: an otherwise-judgement row in an unreachable package
	if (r.bucket === 'needs-judgement') {
		if (r.wrapped) {
			r.bucket = 'unreachable';
			r.reason = 'wrapped-adopter-host-in-ds-owned-wrapper';
		} else if (!r.inScope) {
			r.bucket = 'unreachable';
			r.reason = 'no-path-to-a-migrated-adopter';
		}
	}
}

// ---------------------------------------------------------------------------
// 6. aggregate
// ---------------------------------------------------------------------------

const BUCKETS = ['codemod-able', 'deterministically-safe', 'unreachable', 'needs-judgement'];

function tally(rows) {
	const t = Object.fromEntries(BUCKETS.map((b) => [b, 0]));
	for (const r of rows) t[r.bucket]++;
	return t;
}

/**
 * Per-pattern on the PRESENCE basis (a line carrying two patterns counts in both).
 */
const perPatternPresence = {};
for (const s of SIGNALS) {
	const rows = allRows.filter((r) => r.signals.includes(s.id));
	perPatternPresence[s.id] = {
		planLines: s.plan,
		measuredLines: rows.length,
		files: new Set(rows.map((r) => r.file)).size,
		// a presence-basis row is bucketed by the classifier for THAT pattern, not the line's primary
		buckets: tally(
			rows.map((r) => {
				const fake = r;
				const v = classifyFor(fake, s.id);
				let bucket = v.bucket;
				if (bucket === 'needs-judgement' && (fake.wrapped || !fake.inScope)) {
					bucket = 'unreachable';
				}
				return { bucket };
			}),
		),
	};
}

/**
 * Per-pattern on the DEDUPED basis (each of the 1,149 lines counted once, primary signal).
 */
const perPatternDeduped = {};
for (const s of SIGNALS) {
	const rows = allRows.filter((r) => r.primary === s.id);
	perPatternDeduped[s.id] = {
		lines: rows.length,
		files: new Set(rows.map((r) => r.file)).size,
		buckets: tally(rows),
		reasons: Object.entries(
			rows.reduce(
				(a, r) => ((a[`${r.bucket}/${r.reason}`] = (a[`${r.bucket}/${r.reason}`] ?? 0) + 1), a),
				{},
			),
		)
			.sort((a, b) => b[1] - a[1])
			.map(([k, v]) => ({ reason: k, lines: v })),
	};
}

const totals = tally(allRows);

// ------- the `:nth-of-type` type-selector analysis, reported standalone -------
const nthRows = allRows.filter((r) => r.signals.includes('nth-of-type'));
const nthTypeHistogram = {};
for (const r of nthRows) {
	const re = /:nth-of-type\s*\(/g;
	let m;
	let found = false;
	while ((m = re.exec(r.text))) {
		found = true;
		const t = leadingType(precedingCompound(r.text, m.index)) ?? '(no type selector)';
		const key = t === '*' ? '* (universal)' : t;
		nthTypeHistogram[key] = (nthTypeHistogram[key] ?? 0) + 1;
	}
	if (!found)
		nthTypeHistogram['(not a pseudo — prose/rule-name)'] =
			(nthTypeHistogram['(not a pseudo — prose/rule-name)'] ?? 0) + 1;
}
const nthAnalysis = {
	basis: 'occurrences (a line can carry several `:nth-of-type`)',
	hostTags: [...HOST_TAGS],
	rule: 'the host tag must participate in the count for the index to shift; `div`/`dialog`/`*`/no-type can, every other tag cannot',
	typeHistogram: Object.entries(nthTypeHistogram)
		.sort((a, b) => b[1] - a[1])
		.map(([type, occurrences]) => ({
			type,
			occurrences,
			verdict:
				type === '(no type selector)' || type === '* (universal)'
					? 'can shift'
					: type === '(not a pseudo — prose/rule-name)'
						? 'not a selector'
						: HOST_TAGS.has(type.toLowerCase())
							? 'can shift (host tag)'
							: 'cannot shift',
		})),
	linesPruned: perPatternPresence['nth-of-type'].buckets['deterministically-safe'],
	linesSurviving:
		perPatternPresence['nth-of-type'].buckets['needs-judgement'] +
		perPatternPresence['nth-of-type'].buckets.unreachable,
};

// ------- `:has()` sampling frame, for the manual pass -------
const hasRows = allRows.filter((r) => r.signals.includes('has'));
const hasByReason = hasRows.reduce((a, r) => {
	const v = classifyHas(r);
	a[`${v.bucket}/${v.reason}`] = (a[`${v.bucket}/${v.reason}`] ?? 0) + 1;
	return a;
}, {});
const step = Math.max(1, Math.floor(hasRows.length / SAMPLE_HAS));
const hasSample = hasRows
	.filter((_, i) => i % step === 0)
	.slice(0, SAMPLE_HAS)
	.map((r) => {
		const v = classifyHas(r);
		return {
			site: `${r.file}:${r.line}`,
			selector: /:has\s*\(/.exec(r.text)
				? r.text.trim().slice(0, 140)
				: r.text.trim().slice(0, 140),
			bucket: v.bucket,
			reason: v.reason,
		};
	});

const out = {
	generatedBy:
		'platform/packages/design-system/top-layer/notes/plans/unsafe-selectors-prework/scripts/classify-residue.mjs',
	repoRoot: REPO,
	question:
		'How much of the 1,149-line / 516-file §0.2 residue is genuinely per-site judgement work, after removing what is mechanically handleable or deterministically safe?',
	measurementBasis: {
		rg: `rg -n -g '*.ts' -g '*.tsx' -g '*.css' -g '!**/node_modules/**' -e <signal>`,
		nodeModulesExcluded: true,
		note: 'Identical basis to the plan scale table. Traversing node_modules inflates the union ~4x and caused every wrong number in earlier drafts.',
	},
	hostGroundTruth: {
		popover: 'div[popover] — platform/packages/design-system/top-layer/src/popover/popover.tsx:401',
		dialog: 'dialog — platform/packages/design-system/top-layer/src/dialog/dialog-content.tsx:273',
		consumerControlledAttributes: ['role', 'data-testid', 'id', 'aria-label', 'aria-labelledby'],
		consumerClassesUnreachable:
			'host className is cx() over DS-internal xcss only, so a consumer semantic class can never land on the host',
		surfaceContentDepth:
			'popover-surface wraps children in its own div, so for a `> X` argument only the host element itself is a candidate match',
	},
	bucketPrecedence: [
		'deterministically-safe (not-a-selector / comment)',
		'deterministically-safe (pattern-specific proof)',
		'codemod-able',
		'unreachable (filter 1 / wrapped adopter)',
		'needs-judgement',
	],
	filter1: scopeMeta,
	residue: {
		lines: allRows.length,
		files: new Set(allRows.map((r) => r.file)).size,
		planLines: 1149,
		planFiles: 516,
		reproducesPlan: allRows.length === 1149,
	},
	totals,
	perPatternDeduped,
	perPatternPresence,
	nthOfTypeAnalysis: nthAnalysis,
	hasAnalysis: {
		lines: hasRows.length,
		byReason: Object.entries(hasByReason)
			.sort((a, b) => b[1] - a[1])
			.map(([reason, lines]) => ({ reason, lines })),
		sampleSize: hasSample.length,
		samplingMethod: `every ${step}th of the ${hasRows.length} \`:has(\` lines in rg order, for manual verification that the mechanical in-argument rewrite is correct at that site`,
		sample: hasSample,
	},
	judgementRowsByPackage: Object.entries(
		allRows
			.filter((r) => r.bucket === 'needs-judgement')
			.reduce((a, r) => ((a[r.owner ?? r.ownerDir] = (a[r.owner ?? r.ownerDir] ?? 0) + 1), a), {}),
	)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 40)
		.map(([pkg, lines]) => ({ pkg, lines })),
	judgementRows: allRows
		.filter((r) => r.bucket === 'needs-judgement')
		.map((r) => ({ site: `${r.file}:${r.line}`, pattern: r.primary, reason: r.reason })),
};

const json = JSON.stringify(out, null, '\t');
const outPath = argVal('--out');
if (outPath) {
	writeFileSync(path.resolve(REPO, outPath), json + '\n');
	log(`wrote ${outPath}`);
}
process.stdout.write(json + '\n');

// ---------------------------------------------------------------------------
// 7. stderr tables
// ---------------------------------------------------------------------------

log('');
log('pattern             total  codemod  det-safe  unreach  judgement');
for (const s of SIGNALS) {
	const p = perPatternPresence[s.id];
	log(
		`${s.id.padEnd(19)} ${String(p.measuredLines).padStart(5)}  ${String(p.buckets['codemod-able']).padStart(7)}  ${String(p.buckets['deterministically-safe']).padStart(8)}  ${String(p.buckets.unreachable).padStart(7)}  ${String(p.buckets['needs-judgement']).padStart(9)}`,
	);
}
log('');
log(
	`DEDUPED TOTAL ${allRows.length}: codemod-able ${totals['codemod-able']}, deterministically-safe ${totals['deterministically-safe']}, unreachable ${totals.unreachable}, needs-judgement ${totals['needs-judgement']}`,
);

const printBucket = argVal('--print-bucket');
if (printBucket) {
	const [b, pat] = printBucket.split(':');
	for (const r of allRows) {
		if (r.bucket === b && (!pat || r.primary === pat)) {
			console.error(
				`${r.bucket} | ${r.reason} | ${r.file}:${r.line} | ${r.text.trim().slice(0, 150)}`,
			);
		}
	}
}
