import type { TSESTree } from '@typescript-eslint/utils';

import type { AugmentedSpecifier } from '../build-import-statement';
import type { ClassifiedSpecifier } from '../classify-specifiers';
import { getImportedName } from '../get-imported-name';

/**
 * Adapt a specifier to the form its destination entry-point actually exports.
 *
 * A barrel commonly renames what it re-exports — `export { default as Foo }` or
 * `export { Props as TextFieldProps }` — so preserving the specifier as written at the
 * barrel would produce an import that does not resolve at the entry-point.
 */
export function toDestinationSpecifier(item: ClassifiedSpecifier): AugmentedSpecifier {
	const { spec } = item;

	if (item.isDefaultExport) {
		if (spec.type === 'ImportDefaultSpecifier') {
			return spec;
		}
		return asSpecifier({
			type: 'ImportDefaultSpecifier',
			local: spec.local,
			importKind: spec.importKind,
		});
	}

	if (!item.entryPointName) {
		return spec;
	}

	if (spec.type === 'ImportSpecifier' && getImportedName(spec) === item.entryPointName) {
		return spec;
	}

	return asSpecifier({
		type: 'ImportSpecifier',
		imported: { type: 'Identifier', name: item.entryPointName },
		local: spec.local,
		importKind: spec.importKind,
	});
}

function asSpecifier(value: {
	type: string;
	local: TSESTree.Identifier;
	importKind?: 'type' | 'value';
	imported?: { type: string; name: string };
}): AugmentedSpecifier {
	return value as unknown as AugmentedSpecifier;
}
