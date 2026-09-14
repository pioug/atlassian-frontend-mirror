/** @jest-environment node */
import * as ts from 'typescript';

import { isExportNameDeprecatedInFile, isNodeDeprecated } from '../jsdoc';

// eslint-disable-next-line no-unused-vars
type FileSystem = import('../types').FileSystem;

function makeFs(files: Record<string, string>): FileSystem {
	return {
		existsSync: (p: string) => p in files,
		readFileSync(path: string): string {
			if (!(path in files)) {
				throw new Error(`ENOENT: ${path}`);
			}
			return files[path];
		},
		realpathSync: (p: string) => p,
		statSync: (p: string) => ({ isFile: () => p in files, mtimeMs: 1 }),
		readdirSync: () => [],
		execSync: () => null,
		cache: {},
	};
}

function firstStatement(source: string): { node: ts.Statement; text: string } {
	const sourceFile = ts.createSourceFile('test.tsx', source, ts.ScriptTarget.Latest, true);
	return { node: sourceFile.statements[0], text: source };
}

describe('isNodeDeprecated', () => {
	it('detects a JSDoc @deprecated tag on a re-export statement', () => {
		const { node, text } = firstStatement(
			`/** @deprecated use the subpath */\nexport { Foo } from './foo';\n`,
		);
		expect(isNodeDeprecated(node, text)).toBe(true);
	});

	it('detects @deprecated even when an unrelated block comment precedes the JSDoc', () => {
		const { node, text } = firstStatement(
			`/* eslint-disable some-rule -- ticket */\n/** @deprecated */\nexport { Foo } from './foo';\n`,
		);
		expect(isNodeDeprecated(node, text)).toBe(true);
	});

	it('returns false for a non-deprecated statement', () => {
		const { node, text } = firstStatement(`export { Foo } from './foo';\n`);
		expect(isNodeDeprecated(node, text)).toBe(false);
	});

	it('does not match a look-alike tag like @deprecatedFoo', () => {
		const { node, text } = firstStatement(`/** @deprecatedFoo */\nexport { Foo } from './foo';\n`);
		expect(isNodeDeprecated(node, text)).toBe(false);
	});
});

describe('isExportNameDeprecatedInFile', () => {
	const FILE = '/pkg/src/file.tsx';

	it('detects a deprecated named re-export', () => {
		const fs = makeFs({
			[FILE]: `/** @deprecated */\nexport { FlagGroupContext } from '../internal/flag-group-context';\n`,
		});
		expect(
			isExportNameDeprecatedInFile({ filePath: FILE, exportName: 'FlagGroupContext', fs }),
		).toBe(true);
	});

	it('matches by the exported (aliased) name, not the source name', () => {
		const fs = makeFs({
			[FILE]: `/** @deprecated */\nexport { Original as Public } from './x';\n`,
		});
		expect(isExportNameDeprecatedInFile({ filePath: FILE, exportName: 'Public', fs })).toBe(true);
		expect(isExportNameDeprecatedInFile({ filePath: FILE, exportName: 'Original', fs })).toBe(
			false,
		);
	});

	it('detects a deprecated local declaration', () => {
		const fs = makeFs({
			[FILE]: `/** @deprecated */\nexport const Thing = 1;\nexport const Other = 2;\n`,
		});
		expect(isExportNameDeprecatedInFile({ filePath: FILE, exportName: 'Thing', fs })).toBe(true);
		expect(isExportNameDeprecatedInFile({ filePath: FILE, exportName: 'Other', fs })).toBe(false);
	});

	it('detects a deprecated default export assignment', () => {
		const fs = makeFs({
			[FILE]: `const x = 1;\n/** @deprecated */\nexport default x;\n`,
		});
		expect(isExportNameDeprecatedInFile({ filePath: FILE, exportName: 'default', fs })).toBe(true);
	});

	it('returns false when the file cannot be read', () => {
		const fs = makeFs({});
		expect(isExportNameDeprecatedInFile({ filePath: FILE, exportName: 'Thing', fs })).toBe(false);
	});

	describe('reExportsOnly', () => {
		it('ignores a deprecated local variable declaration', () => {
			const fs = makeFs({
				[FILE]: `/** @deprecated use a different API */\nexport const Thing = () => {};\n`,
			});
			// Default behaviour still flags the API deprecation.
			expect(isExportNameDeprecatedInFile({ filePath: FILE, exportName: 'Thing', fs })).toBe(true);
			// re-exports-only ignores the local declaration's API deprecation.
			expect(
				isExportNameDeprecatedInFile({
					filePath: FILE,
					exportName: 'Thing',
					fs,
					reExportsOnly: true,
				}),
			).toBe(false);
		});

		it('ignores a deprecated local function/class declaration', () => {
			const fs = makeFs({
				[FILE]: `/** @deprecated */\nexport function foo() {}\n/** @deprecated */\nexport class Bar {}\n`,
			});
			expect(
				isExportNameDeprecatedInFile({
					filePath: FILE,
					exportName: 'foo',
					fs,
					reExportsOnly: true,
				}),
			).toBe(false);
			expect(
				isExportNameDeprecatedInFile({
					filePath: FILE,
					exportName: 'Bar',
					fs,
					reExportsOnly: true,
				}),
			).toBe(false);
		});

		it('ignores a deprecated local `export default` assignment', () => {
			const fs = makeFs({
				[FILE]: `const x = 1;\n/** @deprecated */\nexport default x;\n`,
			});
			expect(isExportNameDeprecatedInFile({ filePath: FILE, exportName: 'default', fs })).toBe(
				true,
			);
			expect(
				isExportNameDeprecatedInFile({
					filePath: FILE,
					exportName: 'default',
					fs,
					reExportsOnly: true,
				}),
			).toBe(false);
		});

		it('still flags a deprecated named re-export', () => {
			const fs = makeFs({
				[FILE]: `/** @deprecated import from the subpath */\nexport { Thing } from './thing';\n`,
			});
			expect(
				isExportNameDeprecatedInFile({
					filePath: FILE,
					exportName: 'Thing',
					fs,
					reExportsOnly: true,
				}),
			).toBe(true);
		});

		it('still flags a deprecated `export { default as name } from` re-export', () => {
			const fs = makeFs({
				[FILE]: `/** @deprecated */\nexport { default as Thing } from './thing';\n`,
			});
			expect(
				isExportNameDeprecatedInFile({
					filePath: FILE,
					exportName: 'Thing',
					fs,
					reExportsOnly: true,
				}),
			).toBe(true);
		});
	});
});
