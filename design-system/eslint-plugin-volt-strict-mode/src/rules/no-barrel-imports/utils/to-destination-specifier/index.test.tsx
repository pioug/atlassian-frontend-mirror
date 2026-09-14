import type { TSESTree } from '@typescript-eslint/utils';

import type { AugmentedSpecifier } from '../build-import-statement';
import type { ClassifiedSpecifier } from '../classify-specifiers';
import { toDestinationSpecifier } from '../to-destination-specifier';

/**
 * typescript-eslint v8 widened `ImportSpecifier.imported` to
 * `Identifier | StringLiteral`. These fixtures are always identifiers, so this
 * narrows for the assertions below.
 */
function importedNameOf(specifier: TSESTree.Node): string {
	return ((specifier as TSESTree.ImportSpecifier).imported as TSESTree.Identifier).name;
}

function named(imported: string, local: string = imported): AugmentedSpecifier {
	return {
		type: 'ImportSpecifier',
		imported: { type: 'Identifier', name: imported },
		local: { type: 'Identifier', name: local },
		importKind: 'value',
	} as AugmentedSpecifier & TSESTree.ImportSpecifier;
}

function defaultSpec(local: string): AugmentedSpecifier {
	return {
		type: 'ImportDefaultSpecifier',
		local: { type: 'Identifier', name: local },
	} as TSESTree.ImportDefaultSpecifier;
}

function item(partial: Partial<ClassifiedSpecifier> & Pick<ClassifiedSpecifier, 'spec'>) {
	return {
		spec: partial.spec,
		kind: partial.kind ?? 'value',
		destination: partial.destination,
		isDefaultExport: partial.isDefaultExport,
		entryPointName: partial.entryPointName,
	} as ClassifiedSpecifier;
}

describe('toDestinationSpecifier', () => {
	it('rebinds a named barrel export as a default import', () => {
		const result = toDestinationSpecifier(item({ spec: named('IconTile'), isDefaultExport: true }));

		expect(result.type).toBe('ImportDefaultSpecifier');
		expect(result.local.name).toBe('IconTile');
	});

	it('keeps the local alias when rebinding as a default import', () => {
		const result = toDestinationSpecifier(
			item({ spec: named('IconTile', 'Tile'), isDefaultExport: true }),
		);

		expect(result.type).toBe('ImportDefaultSpecifier');
		expect(result.local.name).toBe('Tile');
	});

	it('leaves an existing default specifier untouched', () => {
		const spec = defaultSpec('Flag');

		expect(toDestinationSpecifier(item({ spec, isDefaultExport: true }))).toBe(spec);
	});

	it('renames to the name the entry-point exports, preserving the local binding', () => {
		const result = toDestinationSpecifier(
			item({ spec: named('NewLozengeColor'), entryPointName: 'LozengeColor' }),
		);

		expect(result.type).toBe('ImportSpecifier');
		expect(importedNameOf(result)).toBe('LozengeColor');
		expect(result.local.name).toBe('NewLozengeColor');
	});

	it('rebinds a default specifier as named when the entry-point uses a named export', () => {
		const result = toDestinationSpecifier(
			item({ spec: defaultSpec('Checkbox'), entryPointName: 'Checkbox' }),
		);

		expect(result.type).toBe('ImportSpecifier');
		expect(importedNameOf(result)).toBe('Checkbox');
		expect(result.local.name).toBe('Checkbox');
	});

	it('returns the original specifier when the destination name already matches', () => {
		const spec = named('FlagGroup', 'Group');

		expect(toDestinationSpecifier(item({ spec, entryPointName: 'FlagGroup' }))).toBe(spec);
	});

	it('returns the original specifier when no destination shape was recorded', () => {
		const spec = named('FlagGroup');

		expect(toDestinationSpecifier(item({ spec }))).toBe(spec);
	});
});
