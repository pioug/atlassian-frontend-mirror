import type { TSESTree } from '@typescript-eslint/utils';

import { getImportedName } from '../get-imported-name';

type ImportSpecifierNode =
	| TSESTree.ImportSpecifier
	| TSESTree.ImportDefaultSpecifier
	| TSESTree.ImportNamespaceSpecifier;

export type AugmentedSpecifier = ImportSpecifierNode & { importKind?: 'type' | 'value' };

/**
 * Build an import statement string for a set of specifiers targeting `path`.
 *
 * Handles `import type` + default+named (TS1363) by rebinding defaults as
 * `{ default as Local }` named imports when needed.
 */
export function buildImportStatement({
	specs,
	path,
	quoteChar,
	isTypeImport = false,
}: {
	specs: AugmentedSpecifier[];
	path: string;
	quoteChar: string;
	isTypeImport?: boolean;
}): string {
	const defaultSpecs = specs.filter(
		(spec): spec is AugmentedSpecifier & TSESTree.ImportDefaultSpecifier =>
			spec.type === 'ImportDefaultSpecifier',
	);
	const namedSpecsFromInput = specs.filter(
		(spec): spec is AugmentedSpecifier & TSESTree.ImportSpecifier =>
			spec.type === 'ImportSpecifier',
	);

	const seenDefaultLocals = new Set<string>();
	const uniqueDefaultSpecs = defaultSpecs.filter((spec) => {
		if (seenDefaultLocals.has(spec.local.name)) {
			return false;
		}
		seenDefaultLocals.add(spec.local.name);
		return true;
	});

	const mustRebindAllDefaultsAsNamed =
		isTypeImport && uniqueDefaultSpecs.length > 0 && namedSpecsFromInput.length > 0;

	const [primaryDefaultCandidate, ...extraDefaults] = uniqueDefaultSpecs;
	const primaryDefault = mustRebindAllDefaultsAsNamed ? undefined : primaryDefaultCandidate;
	const defaultsToRebind = mustRebindAllDefaultsAsNamed ? uniqueDefaultSpecs : extraDefaults;

	const rebindAsNamed: Array<AugmentedSpecifier & TSESTree.ImportSpecifier> = defaultsToRebind.map(
		(spec) =>
			({
				type: 'ImportSpecifier',
				imported: {
					type: 'Identifier',
					name: 'default',
				} as TSESTree.Identifier,
				local: spec.local,
				importKind: spec.importKind,
			}) as AugmentedSpecifier & TSESTree.ImportSpecifier,
	);
	const namedSpecs = [...namedSpecsFromInput, ...rebindAsNamed];

	const formatNamed = (spec: AugmentedSpecifier & TSESTree.ImportSpecifier): string => {
		const imported = getImportedName(spec);
		const local = spec.local.name;
		const isInlineType = spec.importKind === 'type' && !isTypeImport;
		const prefix = isInlineType ? 'type ' : '';
		return imported === local ? `${prefix}${imported}` : `${prefix}${imported} as ${local}`;
	};

	const namedImports = namedSpecs
		.map(formatNamed)
		.filter((name) => name.length > 0)
		.join(', ');

	const hasDefault = !!primaryDefault;
	const hasNamed = namedImports.length > 0;

	if (!hasDefault && !hasNamed) {
		return '';
	}

	const typeKeyword = isTypeImport ? 'type ' : '';

	if (hasDefault && hasNamed) {
		return `import ${typeKeyword}${primaryDefault.local.name}, { ${namedImports} } from ${quoteChar}${path}${quoteChar};`;
	}
	if (hasDefault) {
		return `import ${typeKeyword}${primaryDefault.local.name} from ${quoteChar}${path}${quoteChar};`;
	}
	return `import ${typeKeyword}{ ${namedImports} } from ${quoteChar}${path}${quoteChar};`;
}
