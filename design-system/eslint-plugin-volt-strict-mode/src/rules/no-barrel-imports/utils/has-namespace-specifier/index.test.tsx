import type { TSESTree } from '@typescript-eslint/utils';

import { hasNamespaceSpecifier } from '../has-namespace-specifier';

function makeDeclaration(
	specifiers: TSESTree.ImportDeclaration['specifiers'],
): TSESTree.ImportDeclaration {
	return {
		type: 'ImportDeclaration',
		importKind: 'value',
		specifiers,
		source: { type: 'Literal', value: '@atlaskit/flag' },
	} as TSESTree.ImportDeclaration;
}

describe('hasNamespaceSpecifier', () => {
	it('returns true for import * as X', () => {
		const node = makeDeclaration([
			{
				type: 'ImportNamespaceSpecifier',
				local: { type: 'Identifier', name: 'Flag' },
			} as TSESTree.ImportNamespaceSpecifier,
		]);

		expect(hasNamespaceSpecifier(node)).toBe(true);
	});

	it('returns false for named imports', () => {
		const node = makeDeclaration([
			{
				type: 'ImportSpecifier',
				imported: { type: 'Identifier', name: 'FlagGroup' },
				local: { type: 'Identifier', name: 'FlagGroup' },
			} as TSESTree.ImportSpecifier,
		]);

		expect(hasNamespaceSpecifier(node)).toBe(false);
	});

	it('returns false for default imports', () => {
		const node = makeDeclaration([
			{
				type: 'ImportDefaultSpecifier',
				local: { type: 'Identifier', name: 'Flag' },
			} as TSESTree.ImportDefaultSpecifier,
		]);

		expect(hasNamespaceSpecifier(node)).toBe(false);
	});

	it('returns false when there are no specifiers', () => {
		expect(hasNamespaceSpecifier(makeDeclaration([]))).toBe(false);
	});
});
