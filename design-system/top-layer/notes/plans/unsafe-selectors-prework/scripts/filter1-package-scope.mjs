#!/usr/bin/env node
/* oxlint-disable */
/* eslint-disable -- Hand-run analysis script that produced this plan's measurements.
   Kept verbatim so its output stays reproducible; it is not shipped code. */
/**
 * Phase 2 — filter 1: package-level reachability scope for the positional-selector codemod.
 *
 * Deterministic, no judgement, no bundler. Answers: which AFM packages have a
 * dependency/import path to a MIGRATED top-layer adopter, and therefore can host a
 * top-layer surface in their DOM subtree?
 *
 * Method (three passes, unioned):
 *   1. Enumerate every package.json in the repo (via `git ls-files`, node_modules excluded).
 *   2. Reverse transitive closure over `dependencies` + `devDependencies` seeded from the
 *      migrated-adopter set. Only workspace-internal names are followed (an external npm
 *      package cannot lead back into the repo).
 *   3. A single `rg` pass for adopter *import specifiers*, because many jira/confluence/
 *      product source trees import @atlaskit packages without declaring them (hoisting).
 *      Each matched file is attributed to its nearest ancestor package.json.
 *
 * Then joins against the candidate signal: `rg --count` MATCHING LINES for
 *   first-child|last-child|nth-child|nth-of-type|only-child
 * over *.ts / *.tsx / *.css, bucketed in-scope vs out-of-scope, on two file populations
 * (`repoWideIgnoreOff` = primary, `trackedSourceOnly`). See CANDIDATE_BASES below.
 *
 * `node_modules` is excluded from every basis. Traversing it (`rg -uu`) inflates the total
 * ~4x (12,770 vs 3,119) and is irreproducible across machines — it is the reason the plan's
 * original scale table read ~11,838. Do not "fix" this by removing the exclusion.
 *
 * Idempotent: read-only over the repo; writes JSON to stdout (and to --out if given).
 * Progress goes to stderr, data to stdout.
 *
 * Usage (from anywhere):
 *   node platform/packages/design-system/top-layer/notes/plans/unsafe-selectors-prework/scripts/filter1-package-scope.mjs \
 *     --out platform/packages/design-system/top-layer/notes/plans/unsafe-selectors-prework/filter1-scope.json
 *
 * Flags:
 *   --out <path>          also write the JSON to <path>
 *   --repo <path>         repo root (default: auto-detected via `git rev-parse --show-toplevel`)
 *   --include-partial     add the "in-progress" adopters (menu, inline-message) to the seed set
 *   --max-depth <n>       cap the reverse dependency closure at n hops (default: unbounded).
 *                         `--max-depth 1` = "declares an adopter as a direct dependency", which
 *                         is the aggressive-prune sensitivity variant.
 *   --no-candidates       skip both (slow, ~30s each) candidate-signal joins
 *   --list-out-of-scope   include the full out-of-scope package name list in the JSON
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

// ---------------------------------------------------------------------------
// Adopter set — source of truth:
//   platform/packages/design-system/top-layer/notes/decisions/migration-roadmap.md
// "Migrated (FF)? = Yes" means the package ships a top-layer code path (imports
// @atlaskit/top-layer and branches on `platform-dst-top-layer`).
// ---------------------------------------------------------------------------

/**
 * Ships a top-layer code path today. These are the codemod's reachability seeds.
 */
const MIGRATED = [
	'@atlaskit/popup',
	'@atlaskit/tooltip',
	'@atlaskit/modal-dialog',
	'@atlaskit/dropdown-menu',
	'@atlaskit/flag',
	'@atlaskit/spotlight',
	'@atlaskit/select',
	'@atlaskit/datetime-picker',
	'@atlaskit/inline-dialog',
	'@atlaskit/avatar-group',
	'@atlaskit/react-select',
	'@atlaskit/drawer',
];

/**
 * The target primitive itself. Any package that imports it directly can render a
 * top-layer surface without going through an adopter, so it is a seed too.
 */
const PRIMITIVE = ['@atlaskit/top-layer'];

/**
 * No package-local adapter, but exercised under the flag in tests / renders inside
 * top-layer popovers. Off by default; add with --include-partial for sensitivity.
 */
const IN_PROGRESS = ['@atlaskit/menu', '@atlaskit/inline-message'];

/**
 * Explicitly not migrated per the roadmap. Never seeds. Recorded for the report.
 */
const DEFERRED = [
	'@atlaskit/blanket',
	'@atlaskit/onboarding',
	'@atlaskit/banner',
	'@atlaskit/navigation-system',
];

/**
 * Legacy layering infra, replaced by the new stack. Never seeds.
 */
const LEGACY_INFRA = ['@atlaskit/portal', '@atlaskit/layering', '@atlaskit/popper'];

const CANDIDATE_REGEX = 'first-child|last-child|nth-child|nth-of-type|only-child';
const CANDIDATE_GLOBS = ['*.ts', '*.tsx', '*.css'];

// ---------------------------------------------------------------------------
// args
// ---------------------------------------------------------------------------

const argv = process.argv.slice(2);
const argVal = (name) => {
	const i = argv.indexOf(name);
	return i === -1 ? undefined : argv[i + 1];
};
const hasFlag = (name) => argv.includes(name);

const log = (...args) => console.error('[filter1]', ...args);

function detectRepoRoot() {
	const explicit = argVal('--repo');
	if (explicit) return path.resolve(explicit);
	try {
		return execFileSync('git', ['rev-parse', '--show-toplevel'], {
			cwd: path.dirname(new URL(import.meta.url).pathname),
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'ignore'],
		}).trim();
	} catch {
		throw new Error('could not detect repo root; pass --repo <path>');
	}
}

const REPO = detectRepoRoot();
log('repo root:', REPO);

/**
 * git and rg both get noisy on this repo's fsmonitor; swallow stderr, keep stdout.
 */
function run(cmd, args, { allowFail = false } = {}) {
	try {
		return execFileSync(cmd, args, {
			cwd: REPO,
			encoding: 'utf8',
			maxBuffer: 1024 * 1024 * 512,
			stdio: ['ignore', 'pipe', 'ignore'],
		});
	} catch (err) {
		// rg exits 1 when there are no matches; git ls-files can warn but still print.
		if (allowFail && typeof err.stdout === 'string') return err.stdout;
		throw err;
	}
}

// ---------------------------------------------------------------------------
// Pass 1 — enumerate packages
// ---------------------------------------------------------------------------

log('pass 1: enumerating package.json files via git ls-files');

const pkgJsonPaths = run('git', ['ls-files', 'package.json', '**/package.json'], {
	allowFail: true,
})
	.split('\n')
	.map((s) => s.trim())
	.filter(Boolean)
	.filter((p) => !p.includes('node_modules/'))
	.sort();

log(`  found ${pkgJsonPaths.length} package.json files`);

/**
 * @type {Map<string, {name: string|null, dir: string, jsonPath: string, deps: string[]}>}
 */
const byDir = new Map();
/**
 * name -> array of dirs (duplicates are real in AFM: jira vendors some names)
 */
const dirsByName = new Map();
let unnamed = 0;
let unparsable = 0;

for (const jsonPath of pkgJsonPaths) {
	let json;
	try {
		json = JSON.parse(readFileSync(path.join(REPO, jsonPath), 'utf8'));
	} catch {
		unparsable += 1;
		continue;
	}
	const dir = path.posix.dirname(jsonPath) === '.' ? '' : path.posix.dirname(jsonPath);
	const name = typeof json.name === 'string' ? json.name : null;
	if (!name) unnamed += 1;
	const deps = [
		...Object.keys(json.dependencies ?? {}),
		...Object.keys(json.devDependencies ?? {}),
	];
	byDir.set(dir, { name, dir, jsonPath, deps });
	if (name) {
		if (!dirsByName.has(name)) dirsByName.set(name, []);
		dirsByName.get(name).push(dir);
	}
}

log(`  parsed ${byDir.size} packages (${unnamed} unnamed, ${unparsable} unparsable)`);

const duplicateNames = [...dirsByName.entries()].filter(([, dirs]) => dirs.length > 1).length;
log(`  ${dirsByName.size} distinct package names, ${duplicateNames} names claimed by >1 directory`);

/**
 * Sorted list of package dirs, longest first, for nearest-ancestor attribution.
 */
const pkgDirs = [...byDir.keys()];
const pkgDirSet = new Set(pkgDirs);

/**
 * Product roots + repo root. When a source file's nearest ancestor package.json is one
 * of these, the file lives in a source tree with no owning package — that is the
 * "ancestor fallback" the report counts.
 */
const productRoots = new Set(
	['', ...pkgDirs.filter((d) => d !== '' && !d.includes('/'))].filter((d) => pkgDirSet.has(d)),
);

/**
 * file path (posix, repo-relative) -> owning package dir, or null
 */
const ownerCache = new Map();
function ownerDirOf(filePath) {
	if (ownerCache.has(filePath)) return ownerCache.get(filePath);
	let dir = path.posix.dirname(filePath);
	while (true) {
		if (pkgDirSet.has(dir)) {
			ownerCache.set(filePath, dir);
			return dir;
		}
		if (dir === '' || dir === '.' || dir === '/') break;
		const next = path.posix.dirname(dir);
		if (next === dir) break;
		dir = next;
	}
	// repo root package.json is always present in AFM, but be defensive
	const fallback = pkgDirSet.has('') ? '' : null;
	ownerCache.set(filePath, fallback);
	return fallback;
}

// ---------------------------------------------------------------------------
// Pass 2 — reverse transitive dependency closure from the adopter seeds
// ---------------------------------------------------------------------------

const seedNames = [...MIGRATED, ...PRIMITIVE, ...(hasFlag('--include-partial') ? IN_PROGRESS : [])];
const seedSet = new Set(seedNames);

log(`pass 2: reverse dependency closure from ${seedSet.size} seeds`);

const presentSeeds = seedNames.filter((n) => dirsByName.has(n));
const missingSeeds = seedNames.filter((n) => !dirsByName.has(n));
if (missingSeeds.length)
	log('  WARNING: seeds with no package.json in repo:', missingSeeds.join(', '));

/**
 * reverse edge: depName -> Set of dependent package dirs
 */
const dependentsOf = new Map();
for (const pkg of byDir.values()) {
	for (const dep of pkg.deps) {
		if (!dirsByName.has(dep)) continue; // external npm dep: cannot lead back into repo
		if (!dependentsOf.has(dep)) dependentsOf.set(dep, new Set());
		dependentsOf.get(dep).add(pkg.dir);
	}
}

const maxDepthRaw = argVal('--max-depth');
const maxDepth = maxDepthRaw === undefined ? Infinity : Number(maxDepthRaw);
if (!Number.isFinite(maxDepth) && maxDepthRaw !== undefined) {
	throw new Error(`--max-depth must be a number, got ${maxDepthRaw}`);
}

/**
 * BFS over reverse edges, level by level. Frontier is package *dirs*; seeds map name -> dirs.
 */
const depClosureDirs = new Set();
let frontier = [];
for (const seed of presentSeeds) {
	for (const d of dirsByName.get(seed)) {
		if (!depClosureDirs.has(d)) {
			depClosureDirs.add(d);
			frontier.push(d);
		}
	}
}
/**
 * hop 0 = the adopters themselves; hop 1 = direct dependents; etc.
 */
const depClosureByHop = [frontier.length];
for (let hop = 1; hop <= maxDepth && frontier.length > 0; hop += 1) {
	const next = [];
	for (const dir of frontier) {
		const name = byDir.get(dir)?.name;
		if (!name) continue;
		const dependents = dependentsOf.get(name);
		if (!dependents) continue;
		for (const d of dependents) {
			if (!depClosureDirs.has(d)) {
				depClosureDirs.add(d);
				next.push(d);
			}
		}
	}
	depClosureByHop.push(next.length);
	frontier = next;
}

log(
	`  dependency closure: ${depClosureDirs.size} packages ` +
		`(maxDepth=${
			maxDepth === Infinity ? 'unbounded' : maxDepth
		}, new-per-hop [${depClosureByHop.join(', ')}])`,
);

// ---------------------------------------------------------------------------
// Pass 3 — import-specifier grep (single rg pass)
// ---------------------------------------------------------------------------

log('pass 3: rg over adopter import specifiers');

const escaped = seedNames.map((n) => n.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&'));
const specifierRe = `['"\`](?:${escaped.join('|')})(?:/[^'"\`]*)?['"\`]`;

const grepOut = run(
	'rg',
	[
		'--no-messages',
		'--files-with-matches',
		'-g',
		'*.ts',
		'-g',
		'*.tsx',
		'-g',
		'*.js',
		'-g',
		'*.jsx',
		'-g',
		'*.mjs',
		'-g',
		'*.cjs',
		'-g',
		'!node_modules',
		'-e',
		specifierRe,
		'.',
	],
	{ allowFail: true },
);

const grepFiles = grepOut
	.split('\n')
	.map((s) => s.trim().replace(/^\.\//, ''))
	.filter(Boolean);

log(`  ${grepFiles.length} files import an adopter specifier`);

const grepClosureDirs = new Set();
let grepAttributedDirect = 0;
let grepAttributedFallback = 0; // nearest ancestor is a product root / repo root
let grepUnattributed = 0;
for (const f of grepFiles) {
	const owner = ownerDirOf(f);
	if (owner === null) {
		grepUnattributed += 1;
		continue;
	}
	if (productRoots.has(owner)) grepAttributedFallback += 1;
	else grepAttributedDirect += 1;
	grepClosureDirs.add(owner);
}

log(
	`  grep closure: ${grepClosureDirs.size} packages ` +
		`(direct attribution ${grepAttributedDirect}, ancestor fallback to a product/repo root ${grepAttributedFallback}, unattributed ${grepUnattributed})`,
);

// ---------------------------------------------------------------------------
// Union
// ---------------------------------------------------------------------------

const inScopeDirs = new Set([...depClosureDirs, ...grepClosureDirs]);
const onlyDep = [...depClosureDirs].filter((d) => !grepClosureDirs.has(d)).length;
const onlyGrep = [...grepClosureDirs].filter((d) => !depClosureDirs.has(d)).length;
const both = [...depClosureDirs].filter((d) => grepClosureDirs.has(d)).length;

log(
	`union: ${inScopeDirs.size} in scope of ${byDir.size} total ` +
		`(dep-only ${onlyDep}, grep-only ${onlyGrep}, both ${both})`,
);

const productOf = (dir) => (dir === '' ? '<repo-root>' : dir.split('/')[0]);

const perProduct = {};
for (const dir of byDir.keys()) {
	const p = productOf(dir);
	perProduct[p] ??= {
		packages: 0,
		inScope: 0,
		candidateLinesInScope: 0,
		candidateLinesOutOfScope: 0,
	};
	perProduct[p].packages += 1;
	if (inScopeDirs.has(dir)) perProduct[p].inScope += 1;
}

// ---------------------------------------------------------------------------
// Candidate-signal join
// ---------------------------------------------------------------------------

/**
 * `rg --count` counts matching LINES (a line with two matches counts once), which is the
 * same basis as the plan's scale table. Two file populations are measured:
 *
 *   - `repoWideIgnoreOff` (PRIMARY) — ignore files disabled so nothing in-repo is hidden,
 *     `node_modules` excluded because installed third-party packages are not AFM code and
 *     the codemod can never touch them.
 *   - `trackedSourceOnly` — rg defaults, i.e. `.gitignore` respected, so build output
 *     (`dist/`, `tsDist/`) is excluded too.
 *
 * `node_modules` is NEVER included. Traversing it (`rg -uu`) inflates the total ~4x and is
 * the entire reason the plan's scale table reads ~11.8k instead of ~3.1k. See the report.
 */
const CANDIDATE_BASES = [
	{ key: 'repoWideIgnoreOff', primary: true, rgArgs: ['--no-ignore'] },
	{ key: 'trackedSourceOnly', primary: false, rgArgs: [] },
];

function measureCandidates({ key, rgArgs }) {
	const candArgs = ['--no-messages', '--count', ...rgArgs];
	for (const g of CANDIDATE_GLOBS) candArgs.push('-g', g);
	// `!node_modules` alone does not match nested paths — the `**/` form is required.
	candArgs.push('-g', '!**/node_modules/**', '-e', CANDIDATE_REGEX, '.');
	const candOut = run('rg', candArgs, { allowFail: true });

	let linesIn = 0;
	let linesOut = 0;
	let linesUnattributed = 0;
	let filesIn = 0;
	let filesOut = 0;
	let filesUnattributed = 0;
	let filesViaFallback = 0;
	let linesViaFallback = 0;
	/**
	 * owning package dir -> candidate lines, for the out-of-scope side only
	 */
	const outByOwner = new Map();
	/**
	 * product -> {in, out}, filled only for the primary basis
	 */
	const byProduct = new Map();

	for (const row of candOut.split('\n')) {
		if (!row.trim()) continue;
		const idx = row.lastIndexOf(':');
		if (idx === -1) continue;
		const file = row.slice(0, idx).replace(/^\.\//, '');
		const n = Number(row.slice(idx + 1));
		if (!Number.isFinite(n)) continue;
		const owner = ownerDirOf(file);
		if (owner === null) {
			linesUnattributed += n;
			filesUnattributed += 1;
			continue;
		}
		if (productRoots.has(owner)) {
			filesViaFallback += 1;
			linesViaFallback += n;
		}
		const p = productOf(owner);
		if (!byProduct.has(p)) byProduct.set(p, { in: 0, out: 0 });
		if (inScopeDirs.has(owner)) {
			linesIn += n;
			filesIn += 1;
			byProduct.get(p).in += n;
		} else {
			linesOut += n;
			filesOut += 1;
			byProduct.get(p).out += n;
			outByOwner.set(owner, (outByOwner.get(owner) ?? 0) + n);
		}
	}

	const total = linesIn + linesOut + linesUnattributed;
	log(
		`  [${key}] candidate lines: ${linesIn} in scope / ${linesOut} out of scope / ` +
			`${linesUnattributed} unattributed — prune ratio ${
				total === 0 ? 0 : ((linesOut + linesUnattributed) / total).toFixed(4)
			}`,
	);

	return {
		stats: {
			basis: key,
			rgIgnoreFilesDisabled: rgArgs.includes('--no-ignore'),
			nodeModulesIncluded: false,
			regex: CANDIDATE_REGEX,
			globs: CANDIDATE_GLOBS,
			countedAs: 'matching lines (rg --count), same basis as the plan scale table',
			totalLines: total,
			linesInScope: linesIn,
			linesOutOfScope: linesOut,
			linesUnattributed,
			filesInScope: filesIn,
			filesOutOfScope: filesOut,
			filesUnattributed,
			filesAttributedViaAncestorFallback: filesViaFallback,
			linesAttributedViaAncestorFallback: linesViaFallback,
			// fraction of candidate lines the filter removes from the codemod's blast radius
			pruneRatio: total === 0 ? 0 : Number(((linesOut + linesUnattributed) / total).toFixed(4)),
			// every out-of-scope package that owns candidate lines, biggest first — this is the
			// whole population the filter buys you, so it is short enough to list in full.
			outOfScopeOwners: [...outByOwner.entries()]
				.sort((a, b) => b[1] - a[1])
				.map(([dir, lines]) => ({ name: byDir.get(dir)?.name ?? `<unnamed:${dir}>`, dir, lines })),
		},
		byProduct,
	};
}

let candidate = null;
const candidateByBasis = {};
if (!hasFlag('--no-candidates')) {
	log('join: rg candidate-selector passes (the slow step, ~30s each)');
	for (const basis of CANDIDATE_BASES) {
		const { stats, byProduct } = measureCandidates(basis);
		candidateByBasis[basis.key] = stats;
		if (basis.primary) {
			candidate = stats;
			for (const [p, v] of byProduct) {
				perProduct[p] ??= {
					packages: 0,
					inScope: 0,
					candidateLinesInScope: 0,
					candidateLinesOutOfScope: 0,
				};
				perProduct[p].candidateLinesInScope = v.in;
				perProduct[p].candidateLinesOutOfScope = v.out;
			}
		}
	}
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

const nameFor = (dir) => byDir.get(dir)?.name ?? `<unnamed:${dir || '<repo-root>'}>`;
/**
 * Both lists are ~10k / ~4k entries, so each entry is encoded as a single
 * `"<name>\t<dir>"` string. `{name, dir}` objects would triple the file size for no
 * extra information.
 *
 * The output is pretty-printed one entry per line, and must stay that way. An earlier
 * revision collapsed these two arrays onto a single line to save ~50KB, which produced a
 * 1MB line inside a `.json` file under `platform/packages/`.
 *
 * The `issue-automat` ENGHEALTH job greps every such file with unanchored, greedy patterns
 * and copies each `git grep --only-matching` hit verbatim into a Jira description. That one
 * line therefore matched all four patterns of the `@atlassiansox/engagekit-ts` campaign rule
 * and produced matches of up to 688KB. Jira rejected the description with
 * CONTENT_LIMIT_EXCEEDED, which failed the "Platform - Automat - Shard 3 of 6" step on master
 * for every team in that shard and got this whole plan reverted.
 */
const encode = (dir) => `${nameFor(dir)}\t${dir || '.'}`;
const inScopeList = [...inScopeDirs].sort().map(encode);
const outOfScopeDirs = [...byDir.keys()].filter((d) => !inScopeDirs.has(d)).sort();
const outOfScopeList = outOfScopeDirs.map(encode);

const result = {
	generatedBy:
		'platform/packages/design-system/top-layer/notes/plans/unsafe-selectors-prework/scripts/filter1-package-scope.mjs',
	repoRoot: REPO,
	deterministic: true,
	adopterSource: 'platform/packages/design-system/top-layer/notes/decisions/migration-roadmap.md',
	adopters: {
		migrated: MIGRATED,
		primitive: PRIMITIVE,
		inProgress: IN_PROGRESS,
		inProgressIncludedInSeeds: hasFlag('--include-partial'),
		deferredOrUnmigrated: DEFERRED,
		legacyInfraNotSeeded: LEGACY_INFRA,
		seedsUsed: seedNames,
		seedsUsedCount: seedNames.length,
		seedsResolvedToWorkspacePackages: presentSeeds,
		seedsMissingFromWorkspace: missingSeeds,
	},
	packages: {
		total: byDir.size,
		distinctNames: dirsByName.size,
		unnamed,
		unparsable,
		namesClaimedByMultipleDirs: duplicateNames,
	},
	reach: {
		maxDepth: maxDepth === Infinity ? 'unbounded' : maxDepth,
		depClosureNewPackagesPerHop: depClosureByHop,
		depClosurePackages: depClosureDirs.size,
		importGrepPackages: grepClosureDirs.size,
		unionInScope: inScopeDirs.size,
		depOnly: onlyDep,
		grepOnly: onlyGrep,
		both,
		importGrepFiles: grepFiles.length,
		importGrepFilesAttributedDirect: grepAttributedDirect,
		importGrepFilesAttributedViaAncestorFallback: grepAttributedFallback,
		importGrepFilesUnattributed: grepUnattributed,
		importSpecifierRegex: specifierRe,
	},
	inScopePackagesCount: inScopeDirs.size,
	outOfScopePackages: outOfScopeDirs.length,
	perProduct,
	candidateSignal: candidate,
	candidateSignalByBasis: candidateByBasis,
	listEncoding: '"<package name>\\t<repo-relative dir>"',
	inScopePackages: inScopeList,
	outOfScopePackageList: hasFlag('--list-out-of-scope') ? outOfScopeList : undefined,
};

const json = `${JSON.stringify(result, null, 2)}\n`;
process.stdout.write(json);

const out = argVal('--out');
if (out) {
	const outPath = path.isAbsolute(out) ? out : path.join(REPO, out);
	writeFileSync(outPath, json);
	log('wrote', outPath);
}

log(
	`SUMMARY: ${inScopeDirs.size}/${byDir.size} packages in scope (${outOfScopeDirs.length} pruned) from ` +
		`${seedNames.length} adopter seeds; candidate lines ` +
		`${
			candidate
				? `${candidate.linesInScope} in / ${
						candidate.linesOutOfScope + candidate.linesUnattributed
					} out (prune ratio ${candidate.pruneRatio})`
				: 'not computed (--no-candidates)'
		}`,
);

if (!existsSync(path.join(REPO, 'platform'))) {
	log('WARNING: no platform/ directory at repo root — is --repo correct?');
}
