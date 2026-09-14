import type { TSESTree } from '@typescript-eslint/utils';

import { type AugmentedSpecifier, buildImportStatement } from '../build-import-statement';

describe('buildImportStatement', () => {
	it('builds a default import', () => {
		const specs: AugmentedSpecifier[] = [
			{
				type: 'ImportDefaultSpecifier',
				local: { type: 'Identifier', name: 'Flag' },
			} as TSESTree.ImportDefaultSpecifier,
		];

		expect(
			buildImportStatement({
				specs,
				path: '@atlaskit/flag/flag',
				quoteChar: "'",
			}),
		).toBe("import Flag from '@atlaskit/flag/flag';");
	});

	it('builds a named import with an alias', () => {
		const specs: AugmentedSpecifier[] = [
			{
				type: 'ImportSpecifier',
				imported: { type: 'Identifier', name: 'FlagGroup' },
				local: { type: 'Identifier', name: 'Group' },
				importKind: 'value',
			} as AugmentedSpecifier & TSESTree.ImportSpecifier,
		];

		expect(
			buildImportStatement({
				specs,
				path: '@atlaskit/flag/flag-group',
				quoteChar: "'",
			}),
		).toBe("import { FlagGroup as Group } from '@atlaskit/flag/flag-group';");
	});

	it('builds an import type statement', () => {
		const specs: AugmentedSpecifier[] = [
			{
				type: 'ImportSpecifier',
				imported: { type: 'Identifier', name: 'FlagProps' },
				local: { type: 'Identifier', name: 'FlagProps' },
				importKind: 'type',
			} as AugmentedSpecifier & TSESTree.ImportSpecifier,
		];

		expect(
			buildImportStatement({
				specs,
				path: '@atlaskit/flag/types',
				quoteChar: "'",
				isTypeImport: true,
			}),
		).toBe("import type { FlagProps } from '@atlaskit/flag/types';");
	});

	it('keeps inline type modifiers on value imports', () => {
		const specs: AugmentedSpecifier[] = [
			{
				type: 'ImportSpecifier',
				imported: { type: 'Identifier', name: 'Box' },
				local: { type: 'Identifier', name: 'Box' },
				importKind: 'value',
			} as AugmentedSpecifier & TSESTree.ImportSpecifier,
			{
				type: 'ImportSpecifier',
				imported: { type: 'Identifier', name: 'BoxProps' },
				local: { type: 'Identifier', name: 'BoxProps' },
				importKind: 'type',
			} as AugmentedSpecifier & TSESTree.ImportSpecifier,
		];

		expect(
			buildImportStatement({
				specs,
				path: '@atlaskit/primitives/box',
				quoteChar: "'",
			}),
		).toBe("import { Box, type BoxProps } from '@atlaskit/primitives/box';");
	});

	it('returns an empty string when there are no usable specs', () => {
		expect(
			buildImportStatement({
				specs: [],
				path: '@atlaskit/flag/flag',
				quoteChar: "'",
			}),
		).toBe('');
	});
});
