/**
 * Codemod: fix-import-order
 *
 * Replicates the `import/order` ESLint rule config used in platform/eslint.config.cjs.
 *
 * Rule config:
 *   newlines-between: 'always'  (default for most files)
 *   alphabetize: { order: 'asc', caseInsensitive: true }
 *   pathGroups:
 *     - { pattern: 'react', group: 'external', position: 'before' }
 *     - { pattern: '{@atlaskit,@atlassian,@af}/**', group: 'external', position: 'after' }
 *   pathGroupsExcludedImportTypes: ['builtin']
 *
 * Groups (in order):
 *   1. builtin        — 'node:*' or known node builtins (fs, path, os, etc.)
 *   2. react          — 'react' / 'react-dom' / 'react/*' (external/before)
 *   3. external       — npm packages (not @atlaskit/@atlassian/@af)
 *   4. atlassian      — @atlaskit/*, @atlassian/*, @af/* (external/after)
 *   5. internal       — absolute paths that aren't npm (rare in AFM)
 *   6. parent         — '../'
 *   7. sibling        — './'
 *   8. index          — '.'
 *   9. object/type    — `import type` (kept in their natural group)
 *
 * Usage:
 *   npx jscodeshift \
 *     --transform platform/packages/design-system/tokens/codemods/fix-import-order/transform.ts \
 *     --parser tsx \
 *     --extensions ts,tsx \
 *     <files or directories>
 */

import type { API, FileInfo, ImportDeclaration } from 'jscodeshift';

export const parser = 'tsx';

// ---------------------------------------------------------------------------
// Group classification
// ---------------------------------------------------------------------------

const NODE_BUILTINS = new Set([
	'assert',
	'buffer',
	'child_process',
	'cluster',
	'console',
	'constants',
	'crypto',
	'dgram',
	'dns',
	'domain',
	'events',
	'fs',
	'http',
	'https',
	'module',
	'net',
	'os',
	'path',
	'perf_hooks',
	'process',
	'punycode',
	'querystring',
	'readline',
	'repl',
	'stream',
	'string_decoder',
	'sys',
	'timers',
	'tls',
	'tty',
	'url',
	'util',
	'v8',
	'vm',
	'worker_threads',
	'zlib',
]);

type Group = 'builtin' | 'react' | 'external' | 'atlassian' | 'parent' | 'sibling' | 'index';

function getGroup(source: string): Group {
	// node: protocol builtins
	if (source.startsWith('node:')) return 'builtin';

	// relative imports
	if (source === '.') return 'index';
	if (source.startsWith('./')) return 'sibling';
	if (source.startsWith('../')) return 'parent';

	// Atlassian scoped packages (external/after group)
	if (
		source.startsWith('@atlaskit/') ||
		source.startsWith('@atlassian/') ||
		source.startsWith('@af/')
	) {
		return 'atlassian';
	}

	// react group (external/before)
	const rootPkg = source.split('/')[0];
	if (rootPkg === 'react' || rootPkg === 'react-dom' || source.startsWith('react/')) {
		return 'react';
	}

	// node builtin (no prefix)
	if (NODE_BUILTINS.has(rootPkg)) return 'builtin';

	// everything else is external
	return 'external';
}

// Numeric rank for sorting groups — lower = higher in file
const GROUP_RANK: Record<Group, number> = {
	builtin: 0,
	react: 1,
	external: 2,
	atlassian: 3,
	parent: 4,
	sibling: 5,
	index: 6,
};

// ---------------------------------------------------------------------------
// Alphabetical sort within a group
// ---------------------------------------------------------------------------

function sortKey(source: string): string {
	return source.toLowerCase();
}

// ---------------------------------------------------------------------------
// Transformer
// ---------------------------------------------------------------------------

export default function transformer(file: FileInfo, api: API): string {
	const j = api.jscodeshift;
	const root = j(file.source);

	// Collect all top-level import declarations
	const body = root.find(j.Program).get('body') as { value: (ImportDeclaration | unknown)[] };
	const allNodes = body.value;

	// Find contiguous blocks of imports (there may be gaps with code between them)
	// We sort within each contiguous block independently.
	const blocks: { start: number; end: number; nodes: ImportDeclaration[] }[] = [];
	let blockStart = -1;
	let blockNodes: ImportDeclaration[] = [];

	for (let i = 0; i < allNodes.length; i++) {
		const node = allNodes[i];
		if (j.ImportDeclaration.check(node)) {
			if (blockStart === -1) blockStart = i;
			blockNodes.push(node as ImportDeclaration);
		} else {
			if (blockStart !== -1) {
				blocks.push({ start: blockStart, end: i - 1, nodes: blockNodes });
				blockStart = -1;
				blockNodes = [];
			}
		}
	}
	if (blockStart !== -1) {
		blocks.push({ start: blockStart, end: allNodes.length - 1, nodes: blockNodes });
	}

	if (blocks.length === 0) return file.source;

	let changed = false;

	for (const block of blocks) {
		const { nodes } = block;

		// Sort: primary = group rank, secondary = alphabetical source
		const sorted = [...nodes].sort((a, b) => {
			const ga = GROUP_RANK[getGroup(a.source.value as string)];
			const gb = GROUP_RANK[getGroup(b.source.value as string)];
			if (ga !== gb) return ga - gb;
			return sortKey(a.source.value as string) < sortKey(b.source.value as string) ? -1 : 1;
		});

		// Check if order changed
		const orderChanged = sorted.some((n, i) => n !== nodes[i]);
		if (orderChanged) changed = true;

		// Replace the block nodes in-place
		allNodes.splice(block.start, nodes.length, ...sorted);

		// Now fix newlines between groups.
		// Rule: exactly one blank line between groups, no blank lines within a group.
		for (let i = 1; i < sorted.length; i++) {
			const prev = sorted[i - 1];
			const curr = sorted[i];
			const prevGroup = getGroup(prev.source.value as string);
			const currGroup = getGroup(curr.source.value as string);
			const needsBlank = prevGroup !== currGroup;

			// leadingComments on curr may carry the blank line — use innerComments trick.
			// We control newlines via the node's `loc` — actually jscodeshift uses
			// `recast` which preserves original whitespace. We need to manipulate
			// the comment/blank-line between nodes by inserting/removing a blank
			// comment node. The standard recast approach: add an empty line by
			// inserting a `\n` in trailingComments of prev node, or by checking
			// existing leading blank lines on curr.

			// Recast blank line control: set extra.trailingNewlines on prev node.
			// This is the cleanest supported way.
			if (!(prev as any).extra) (prev as any).extra = {};
			(prev as any).extra.trailingNewlines = needsBlank ? 1 : 0;
			if (orderChanged) changed = true;
		}
	}

	if (!changed) return file.source;

	// Use recast's print to regenerate — but we need to ensure blank lines
	// between groups are correct. The most reliable approach with jscodeshift/recast
	// is to work at the source string level after getting the modified AST printed,
	// then post-process the import block.
	//
	// Strategy: print the file, then find the import block and normalise blank lines.

	const printed = root.toSource({ quote: 'single', trailingComma: true });

	// Post-process: normalise blank lines in import sections
	return normaliseImportNewlines(printed);
}

// ---------------------------------------------------------------------------
// Post-process: fix blank lines in the printed output
// ---------------------------------------------------------------------------

function normaliseImportNewlines(source: string): string {
	const lines = source.split('\n');
	const result: string[] = [];
	let i = 0;

	while (i < lines.length) {
		const line = lines[i];
		const trimmed = line.trim();

		if (
			!trimmed.startsWith('import ') &&
			!trimmed.startsWith('import{') &&
			!trimmed.startsWith('import type ')
		) {
			result.push(line);
			i++;
			continue;
		}

		// We're at the start of an import statement (possibly multi-line).
		// Collect the full import statement.
		const importLines: string[] = [line];
		let j = i + 1;

		// Handle multi-line imports (ending with ';')
		if (!trimmed.endsWith(';')) {
			while (j < lines.length && !lines[j].trimEnd().endsWith(';')) {
				importLines.push(lines[j]);
				j++;
			}
			if (j < lines.length) {
				importLines.push(lines[j]);
				j++;
			}
		} else {
			j = i + 1;
		}

		const fullImport = importLines.join('\n');
		const sourceMatch = fullImport.match(/from\s+['"]([^'"]+)['"]/);
		const currSource = sourceMatch ? sourceMatch[1] : null;
		const currGroup = currSource ? getGroup(currSource) : null;

		// Look at the previous import in result to determine group boundary
		// Find last import line in result
		const prevImportLine = findLastImportLine(result);
		if (prevImportLine !== null) {
			const prevSourceMatch = prevImportLine.match(/from\s+['"]([^'"]+)['"]/);
			const prevSource = prevSourceMatch ? prevSourceMatch[1] : null;
			const prevGroup = prevSource ? getGroup(prevSource) : null;

			if (currGroup && prevGroup) {
				// Remove any existing blank lines between prev import and this one
				while (result.length > 0 && result[result.length - 1].trim() === '') {
					result.pop();
				}
				// Add exactly one blank line if different groups
				if (currGroup !== prevGroup) {
					result.push('');
				}
			}
		}

		for (const l of importLines) result.push(l);
		i = j;
	}

	return result.join('\n');
}

function findLastImportLine(lines: string[]): string | null {
	for (let i = lines.length - 1; i >= 0; i--) {
		const t = lines[i].trim();
		if (t === '') continue;
		if (t.endsWith(';') && t.includes('from ')) return t;
		// might be last line of multiline import
		if (t.endsWith("';") || t.endsWith('";')) {
			return (
				lines
					.slice(0, i + 1)
					.reverse()
					.find((l) => l.trim().startsWith('import')) || null
			);
		}
		break;
	}
	return null;
}
