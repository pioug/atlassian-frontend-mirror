import type { TSESTree } from '@typescript-eslint/utils';

import { getSpecifierKind } from '../get-specifier-kind';

function makeDeclaration(
	importKind: 'type' | 'value',
	specifiers: TSESTree.ImportDeclaration['specifiers'],
): TSESTree.ImportDeclaration {
	return {
		type: 'ImportDeclaration',
		importKind,
		specifiers,
		source: { type: 'Literal', value: '@atlaskit/flag' },
	} as TSESTree.ImportDeclaration;
}

describe('getSpecifierKind', () => {
	it('returns type when the declaration is import type', () => {
		const named = {
			type: 'ImportSpecifier',
			imported: { type: 'Identifier', name: 'FlagProps' },
			local: { type: 'Identifier', name: 'FlagProps' },
			importKind: 'value',
		} as TSESTree.ImportSpecifier;
		const node = makeDeclaration('type', [named]);

		expect(getSpecifierKind(node, named)).toBe('type');
	});

	it('returns type for an inline type named specifier', () => {
		const named = {
			type: 'ImportSpecifier',
			imported: { type: 'Identifier', name: 'FlagProps' },
			local: { type: 'Identifier', name: 'FlagProps' },
			importKind: 'type',
		} as TSESTree.ImportSpecifier;
		const node = makeDeclaration('value', [named]);

		expect(getSpecifierKind(node, named)).toBe('type');
	});

	it('returns value for a normal value specifier', () => {
		const named = {
			type: 'ImportSpecifier',
			imported: { type: 'Identifier', name: 'FlagGroup' },
			local: { type: 'Identifier', name: 'FlagGroup' },
			importKind: 'value',
		} as TSESTree.ImportSpecifier;
		const node = makeDeclaration('value', [named]);

		expect(getSpecifierKind(node, named)).toBe('value');
	});

	it('returns value for a default specifier on a value import', () => {
		const def = {
			type: 'ImportDefaultSpecifier',
			local: { type: 'Identifier', name: 'Flag' },
		} as TSESTree.ImportDefaultSpecifier;
		const node = makeDeclaration('value', [def]);

		expect(getSpecifierKind(node, def)).toBe('value');
	});
});
