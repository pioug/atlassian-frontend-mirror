/**
 * @jest-environment node
 */
import fs from 'fs';
import os from 'os';
import path from 'path';

import { getPackageRootForBarrel } from '../get-package-root-for-barrel';
import { isRootPackageBarrel } from '../is-root-package-barrel';

describe('getPackageRootForBarrel', () => {
	it.each([
		['/repo/packages/my-pkg/src/index.ts', '/repo/packages/my-pkg'],
		['/repo/packages/my-pkg/src/index.tsx', '/repo/packages/my-pkg'],
		['/repo/packages/my-pkg/src/index.js', '/repo/packages/my-pkg'],
		['/repo/packages/my-pkg/src/index.jsx', '/repo/packages/my-pkg'],
	])('returns the package root for a root barrel %s', (filename, expected) => {
		expect(getPackageRootForBarrel(filename)).toBe(expected);
	});

	it('normalises Windows separators', () => {
		expect(getPackageRootForBarrel('C:\\repo\\my-pkg\\src\\index.tsx')).toBe('C:/repo/my-pkg');
	});

	it.each([
		// nested barrel — parent dir is not `src`
		'/repo/packages/my-pkg/src/components/index.tsx',
		// non-index file directly under src
		'/repo/packages/my-pkg/src/entry.tsx',
		// index not under a src directory
		'/repo/packages/my-pkg/lib/index.tsx',
		// unsupported extension
		'/repo/packages/my-pkg/src/index.mts',
		// degenerate: no package root above src
		'src/index.ts',
		// empty
		'',
	])('returns null for non-root-barrel path %s', (filename) => {
		expect(getPackageRootForBarrel(filename)).toBeNull();
	});
});

describe('isRootPackageBarrel', () => {
	it('trusts the path shape when the file does not exist on disk (RuleTester-style synthetic paths)', () => {
		expect(isRootPackageBarrel('/non/existent/packages/my-pkg/src/index.tsx')).toBe(true);
	});

	it('returns false for a non-root-barrel synthetic path', () => {
		expect(isRootPackageBarrel('/non/existent/packages/my-pkg/src/components/index.tsx')).toBe(
			false,
		);
	});

	it('returns false for empty filename', () => {
		expect(isRootPackageBarrel('')).toBe(false);
	});
});

describe('isRootPackageBarrel — non-index "." export target (facade packages)', () => {
	let tmpRoot: string;

	beforeEach(() => {
		tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'volt-root-barrel-'));
	});

	afterEach(() => {
		fs.rmSync(tmpRoot, { recursive: true, force: true });
	});

	function writePkg(exportsField: unknown, entryRelPath: string): string {
		const pkgDir = path.join(tmpRoot, 'my-pkg');
		fs.mkdirSync(path.join(pkgDir, 'src'), { recursive: true });
		fs.writeFileSync(
			path.join(pkgDir, 'package.json'),
			JSON.stringify({ name: '@scope/my-pkg', exports: exportsField }),
		);
		const entry = path.join(pkgDir, entryRelPath);
		fs.mkdirSync(path.dirname(entry), { recursive: true });
		fs.writeFileSync(entry, 'export const x = 1;\n');
		return entry;
	}

	it('treats the string-form "." target (src/atlassian-context.tsx) as a root barrel', () => {
		const entry = writePkg({ '.': './src/atlassian-context.tsx' }, 'src/atlassian-context.tsx');
		expect(isRootPackageBarrel(entry)).toBe(true);
	});

	it('treats the conditional-object "." target as a root barrel', () => {
		const entry = writePkg(
			{ '.': { types: './src/atlassian-context.d.ts', default: './src/atlassian-context.tsx' } },
			'src/atlassian-context.tsx',
		);
		expect(isRootPackageBarrel(entry)).toBe(true);
	});

	it('still recognises a conventional src/index.tsx root barrel on disk', () => {
		const entry = writePkg({ '.': './src/index.tsx' }, 'src/index.tsx');
		expect(isRootPackageBarrel(entry)).toBe(true);
	});

	it('does NOT treat a non-"." subpath entry as a root barrel', () => {
		// package exposes ./multipart via a subpath, entry is not the "." target
		const pkgDir = path.join(tmpRoot, 'my-pkg');
		fs.mkdirSync(path.join(pkgDir, 'src', 'multipart'), { recursive: true });
		fs.writeFileSync(
			path.join(pkgDir, 'package.json'),
			JSON.stringify({
				name: '@scope/my-pkg',
				exports: {
					'.': './src/atlassian-context.tsx',
					'./multipart': './src/multipart/index.tsx',
				},
			}),
		);
		fs.writeFileSync(path.join(pkgDir, 'src', 'atlassian-context.tsx'), 'export const x = 1;\n');
		const subpathEntry = path.join(pkgDir, 'src', 'multipart', 'index.tsx');
		fs.writeFileSync(subpathEntry, 'export const y = 1;\n');
		expect(isRootPackageBarrel(subpathEntry)).toBe(false);
	});

	it('returns false when the file is not the "." target and not an index barrel', () => {
		const pkgDir = path.join(tmpRoot, 'my-pkg');
		fs.mkdirSync(path.join(pkgDir, 'src'), { recursive: true });
		fs.writeFileSync(
			path.join(pkgDir, 'package.json'),
			JSON.stringify({ name: '@scope/my-pkg', exports: { '.': './src/entry.tsx' } }),
		);
		fs.writeFileSync(path.join(pkgDir, 'src', 'entry.tsx'), 'export const x = 1;\n');
		const other = path.join(pkgDir, 'src', 'other.tsx');
		fs.writeFileSync(other, 'export const z = 1;\n');
		expect(isRootPackageBarrel(other)).toBe(false);
	});
});
