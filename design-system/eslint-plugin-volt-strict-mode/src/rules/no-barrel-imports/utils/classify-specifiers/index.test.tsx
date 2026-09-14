import type { TSESTree } from '@typescript-eslint/utils';

import type { BarrelSourceInfo } from '../barrel-sources';
import { classifySpecifiers } from '../classify-specifiers';

const barrel: BarrelSourceInfo = {
	packageName: '@atlaskit/flag',
	barrelKey: '',
	exports: {
		default: {
			'entry-point': '/flag',
			name: 'Flag',
			type: 'component',
			voltCompliant: true,
			consumersMigrated: false,
		},
		FlagGroup: {
			'entry-point': '/flag-group',
			name: 'FlagGroup',
			type: 'component',
			voltCompliant: true,
			consumersMigrated: false,
		},
		Button: {
			'entry-point': '/button',
			name: 'Button',
			type: 'component',
			voltCompliant: false,
			consumersMigrated: false,
		},
		Spinner: {
			'entry-point': '/spinner',
			name: 'Spinner',
			type: 'component',
			voltCompliant: true,
			consumersMigrated: true,
		},
		UnmappedType: {
			name: 'UnmappedType',
			type: 'type',
			voltCompliant: false,
			consumersMigrated: false,
		},
	},
};

function makeDeclaration(
	specifiers: TSESTree.ImportDeclaration['specifiers'],
	importKind: 'type' | 'value' = 'value',
): TSESTree.ImportDeclaration {
	return {
		type: 'ImportDeclaration',
		importKind,
		specifiers,
		source: { type: 'Literal', value: '@atlaskit/flag' },
	} as TSESTree.ImportDeclaration;
}

describe('classifySpecifiers', () => {
	it('marks voltCompliant:true defaults as autofixable destinations', () => {
		const def = {
			type: 'ImportDefaultSpecifier',
			local: { type: 'Identifier', name: 'Flag' },
		} as TSESTree.ImportDefaultSpecifier;
		const [result] = classifySpecifiers(makeDeclaration([def]), barrel);

		expect(result.destination).toBe('@atlaskit/flag/flag');
		expect(result.warnOnly).toBeUndefined();
		expect(result.incomplete).toBeUndefined();
		expect(result.kind).toBe('value');
	});

	it('marks voltCompliant:false mapped exports as warnOnly', () => {
		const named = {
			type: 'ImportSpecifier',
			imported: { type: 'Identifier', name: 'Button' },
			local: { type: 'Identifier', name: 'Button' },
			importKind: 'value',
		} as TSESTree.ImportSpecifier;
		const [result] = classifySpecifiers(makeDeclaration([named]), barrel);

		expect(result.destination).toBe('@atlaskit/flag/button');
		expect(result.warnOnly).toBe(true);
	});

	it('marks consumersMigrated:true as warnOnly for the voltCompliant gate', () => {
		const named = {
			type: 'ImportSpecifier',
			imported: { type: 'Identifier', name: 'Spinner' },
			local: { type: 'Identifier', name: 'Spinner' },
			importKind: 'value',
		} as TSESTree.ImportSpecifier;
		const [result] = classifySpecifiers(makeDeclaration([named]), barrel, 'voltCompliant');

		expect(result.destination).toBe('@atlaskit/flag/spinner');
		expect(result.warnOnly).toBe(true);
	});

	it('marks consumersMigrated:true as autofixable for the consumersMigrated gate', () => {
		const named = {
			type: 'ImportSpecifier',
			imported: { type: 'Identifier', name: 'Spinner' },
			local: { type: 'Identifier', name: 'Spinner' },
			importKind: 'value',
		} as TSESTree.ImportSpecifier;
		const [result] = classifySpecifiers(makeDeclaration([named]), barrel, 'consumersMigrated');

		expect(result.destination).toBe('@atlaskit/flag/spinner');
		expect(result.warnOnly).toBeUndefined();
	});

	it('marks voltCompliant-only symbols as warnOnly for the consumersMigrated gate', () => {
		const def = {
			type: 'ImportDefaultSpecifier',
			local: { type: 'Identifier', name: 'Flag' },
		} as TSESTree.ImportDefaultSpecifier;
		const [result] = classifySpecifiers(makeDeclaration([def]), barrel, 'consumersMigrated');

		expect(result.destination).toBe('@atlaskit/flag/flag');
		expect(result.warnOnly).toBe(true);
	});

	it('marks config entries without entry-point as incomplete', () => {
		const named = {
			type: 'ImportSpecifier',
			imported: { type: 'Identifier', name: 'UnmappedType' },
			local: { type: 'Identifier', name: 'UnmappedType' },
			importKind: 'type',
		} as TSESTree.ImportSpecifier;
		const [result] = classifySpecifiers(makeDeclaration([named]), barrel);

		expect(result.incomplete).toBe(true);
		expect(result.destination).toBeUndefined();
		expect(result.kind).toBe('type');
	});

	it('leaves unknown symbols as unmapped remainders', () => {
		const named = {
			type: 'ImportSpecifier',
			imported: { type: 'Identifier', name: 'Unknown' },
			local: { type: 'Identifier', name: 'Unknown' },
			importKind: 'value',
		} as TSESTree.ImportSpecifier;
		const [result] = classifySpecifiers(makeDeclaration([named]), barrel);

		expect(result.destination).toBeUndefined();
		expect(result.warnOnly).toBeUndefined();
		expect(result.incomplete).toBeUndefined();
		expect(result.kind).toBe('value');
	});

	it('skips namespace specifiers', () => {
		const ns = {
			type: 'ImportNamespaceSpecifier',
			local: { type: 'Identifier', name: 'Flag' },
		} as TSESTree.ImportNamespaceSpecifier;
		expect(classifySpecifiers(makeDeclaration([ns]), barrel)).toEqual([]);
	});
});
