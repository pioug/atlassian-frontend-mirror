/**
 * @jest-environment node
 */
import type { TSESTree } from '@typescript-eslint/utils';

import { getImportedName } from '../get-imported-name';

describe('getImportedName', () => {
	it('returns the identifier name for a normal named import', () => {
		const spec = {
			type: 'ImportSpecifier',
			imported: { type: 'Identifier', name: 'FlagGroup' },
			local: { type: 'Identifier', name: 'FlagGroup' },
		} as TSESTree.ImportSpecifier;

		expect(getImportedName(spec)).toBe('FlagGroup');
	});

	it('returns the local alias target name from the imported identifier', () => {
		const spec = {
			type: 'ImportSpecifier',
			imported: { type: 'Identifier', name: 'FlagGroup' },
			local: { type: 'Identifier', name: 'Group' },
		} as TSESTree.ImportSpecifier;

		expect(getImportedName(spec)).toBe('FlagGroup');
	});

	it('returns the string value for a literal imported name', () => {
		const spec = {
			type: 'ImportSpecifier',
			imported: { type: 'Literal', value: 'FlagGroup' },
			local: { type: 'Identifier', name: 'FlagGroup' },
		} as unknown as TSESTree.ImportSpecifier;

		expect(getImportedName(spec)).toBe('FlagGroup');
	});
});
