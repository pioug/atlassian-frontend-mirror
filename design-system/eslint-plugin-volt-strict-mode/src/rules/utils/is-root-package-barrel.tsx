import fs from 'fs';
import path from 'path';

import { getPackageRootForBarrel } from './get-package-root-for-barrel';

/**
 * A package's root barrel entry point (`<pkg>/src/index.{ts,tsx,js,jsx}`) is the
 * package's public API surface. Aggregating and re-exporting the package's
 * modules is the entry point's explicit job, so the Volt Strict Mode rules that
 * discourage re-exports (`no-re-exports`) and multiple exports per file
 * (`no-multiple-exports`) intentionally exempt it. Consumers should still import
 * from subpaths, but the barrel itself must not be forced to annotate every
 * re-export with a deprecation migration-shim marker.
 *
 * "Root package barrel" is defined narrowly, per the requested scope:
 *   1. the file is named `index` with a `.ts`/`.tsx`/`.js`/`.jsx` extension, AND
 *   2. its immediate parent directory is `src`, AND
 *   3. the directory that CONTAINS that `src` folder (the package root) has a
 *      sibling `package.json` — i.e. `src` sits directly at a package root.
 *
 * Nested barrels (e.g. `src/components/index.tsx`) and `index` files that are
 * not directly under a package's `src` are NOT exempt.
 *
 * True if `filename` is a root package barrel that sits at a real package root,
 * verified by the presence of a sibling `package.json`.
 *
 * When the file does not exist on disk (e.g. the synthetic paths ESLint's
 * `RuleTester` uses in unit tests), the filesystem `package.json` check cannot
 * be performed, so we fall back to the path-shape check alone. This keeps the
 * rule deterministically testable while still requiring a genuine package root
 * for real lint runs.
 */
export function isRootPackageBarrel(filename: string): boolean {
	const packageRoot = getPackageRootForBarrel(filename);
	if (packageRoot != null) {
		const packageJsonPath = path.posix.join(packageRoot, 'package.json');

		// If the barrel file itself is not on disk we are almost certainly running
		// under RuleTester with a synthetic filename; trust the path shape.
		let barrelExistsOnDisk = false;
		try {
			barrelExistsOnDisk = fs.existsSync(filename);
		} catch {
			barrelExistsOnDisk = false;
		}
		if (!barrelExistsOnDisk) {
			return true;
		}

		try {
			if (fs.existsSync(packageJsonPath)) {
				return true;
			}
		} catch {
			// fall through to the "." export-target check below
		}
	}

	// Some packages expose a facade whose public entry point is NOT literally
	// named `index` (e.g. `<pkg>/src/atlassian-context.tsx` mapped as the
	// package.json `.` export). That file is still the package's root barrel —
	// the public API surface — so it should be exempt from the re-export rules
	// exactly like a conventional `src/index.*` barrel. Resolve the nearest
	// `package.json` and treat the file as a root barrel when it is the `.`
	// (main) export target.
	return isMainExportTarget(filename);
}

/**
 * True when `filename` is the file that the nearest ancestor `package.json`'s
 * `.` (main) export resolves to. Walks up from the file's directory to find the
 * owning `package.json`, then compares its `.` export target(s) against the
 * file. Filesystem-backed; returns false for synthetic/non-existent paths.
 */
function isMainExportTarget(filename: string): boolean {
	if (!filename) {
		return false;
	}
	const normalised = filename.split(/[\\/]+/).join('/');
	let dir = path.posix.dirname(normalised);
	// Walk up looking for the owning package.json (bounded to avoid infinite loops).
	for (let i = 0; i < 50; i++) {
		const pkgJsonPath = path.posix.join(dir, 'package.json');
		let exists = false;
		try {
			exists = fs.existsSync(pkgJsonPath);
		} catch {
			exists = false;
		}
		if (exists) {
			let pkg: unknown;
			try {
				pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
			} catch {
				return false;
			}
			const targets = collectDotExportTargets((pkg as { exports?: unknown }).exports);
			return targets.some((target) => {
				const resolved = path.posix.normalize(path.posix.join(dir, target));
				return resolved === normalised;
			});
		}
		const parent = path.posix.dirname(dir);
		if (parent === dir) {
			break;
		}
		dir = parent;
	}
	return false;
}

/**
 * Collect the string file targets for the package.json `.` export, supporting
 * the shorthand string form and the conditional object form
 * (e.g. `{ ".": { "types": "...", "default": "./src/x.tsx" } }`).
 */
function collectDotExportTargets(exportsField: unknown): string[] {
	if (exportsField == null) {
		return [];
	}
	// `exports: "./src/index.ts"` shorthand (whole package is the `.` export).
	if (typeof exportsField === 'string') {
		return [exportsField];
	}
	if (typeof exportsField !== 'object') {
		return [];
	}
	const dot = (exportsField as Record<string, unknown>)['.'];
	if (dot == null) {
		return [];
	}
	return flattenExportTargets(dot);
}

function flattenExportTargets(node: unknown): string[] {
	if (typeof node === 'string') {
		return [node];
	}
	if (node != null && typeof node === 'object') {
		return Object.values(node as Record<string, unknown>).flatMap(flattenExportTargets);
	}
	return [];
}
