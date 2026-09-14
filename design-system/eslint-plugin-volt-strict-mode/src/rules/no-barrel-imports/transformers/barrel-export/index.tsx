/* eslint-disable @repo/internal/react/require-jsdoc */
import type { TSESTree } from '@typescript-eslint/utils';
import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { barrelSourceMap } from '../../utils/barrel-sources';
import type { AugmentedSpecifier } from '../../utils/build-import-statement';
import {
	type ClassifiedSpecifier,
	classifySpecifiers,
	type ReadinessGate,
} from '../../utils/classify-specifiers';
import { getImportedName } from '../../utils/get-imported-name';
import { toDestinationSpecifier } from '../../utils/to-destination-specifier';

type Ref = {
	node: TSESTree.ExportNamedDeclaration;
	source: string;
	autofixable: ClassifiedSpecifier[];
	remaining: ClassifiedSpecifier[];
	quoteChar: string;
	declarationExportKind: 'type' | 'value';
};

type LintOptions = {
	context: Rule.RuleContext;
	readinessGate?: ReadinessGate;
	fixStyle?: 'suggest' | 'autofix';
};

/**
 * Handles `export { … } from 'barrel'` declarations by adapting their specifiers to the
 * import-shaped representation shared by the barrel mapping and rewrite utilities.
 */
export const BarrelExport = {
	lint(
		node: Rule.Node,
		{ context, readinessGate = 'voltCompliant', fixStyle = 'suggest' }: LintOptions,
	): void {
		const ref = check(node, context.sourceCode, readinessGate);
		if (!ref) {
			return;
		}

		const fix = createFix(ref);
		context.report({
			node: ref.node.source as unknown as Rule.Node,
			messageId: 'preferEntryPoint',
			data: { source: ref.source },
			...(fixStyle === 'autofix'
				? { fix }
				: {
						suggest: [
							{
								messageId: 'preferEntryPointSuggest',
								fix,
							},
						],
					}),
		});
	},
};

function check(
	node: Rule.Node,
	sourceCode: Rule.RuleContext['sourceCode'],
	readinessGate: ReadinessGate,
): Ref | undefined {
	if (!isNodeOfType(node, 'ExportNamedDeclaration')) {
		return undefined;
	}

	const exportNode = node as unknown as TSESTree.ExportNamedDeclaration;
	if (!exportNode.source || exportNode.specifiers.length === 0) {
		return undefined;
	}

	const source = String(exportNode.source.value);
	const barrel = barrelSourceMap.get(source);
	if (!barrel) {
		return undefined;
	}

	const importNode = toImportDeclaration(exportNode);
	const classified = classifySpecifiers(importNode, barrel, readinessGate);
	const autofixable = classified.filter(
		(item) => item.destination && !item.warnOnly && !item.incomplete,
	);
	if (autofixable.length === 0) {
		return undefined;
	}

	return {
		node: exportNode,
		source,
		autofixable,
		remaining: classified.filter((item) => item.warnOnly || item.incomplete || !item.destination),
		quoteChar: sourceCode.getText(exportNode.source as never)[0] ?? "'",
		declarationExportKind: exportNode.exportKind === 'type' ? 'type' : 'value',
	};
}

function toImportDeclaration(node: TSESTree.ExportNamedDeclaration): TSESTree.ImportDeclaration {
	const specifiers = node.specifiers
		.filter((spec): spec is TSESTree.ExportSpecifier => spec.type === 'ExportSpecifier')
		.map(
			(spec) =>
				({
					type: 'ImportSpecifier',
					imported: spec.local,
					local: spec.exported,
					importKind: spec.exportKind,
				}) as unknown as TSESTree.ImportSpecifier,
		);

	return {
		type: 'ImportDeclaration',
		source: node.source,
		specifiers,
		importKind: node.exportKind,
	} as unknown as TSESTree.ImportDeclaration;
}

function createFix(ref: Ref): (fixer: Rule.RuleFixer) => Rule.Fix[] {
	return (fixer) => {
		const byDestination = new Map<string, ClassifiedSpecifier[]>();
		for (const item of ref.autofixable) {
			if (!item.destination) {
				continue;
			}
			const group = byDestination.get(item.destination) ?? [];
			group.push(item);
			byDestination.set(item.destination, group);
		}

		const newStatements: string[] = [];
		for (const [destination, items] of byDestination) {
			const allType = items.every((item) => item.kind === 'type');
			const statement = buildExportStatement({
				specs: items.map(toDestinationSpecifier),
				path: destination,
				quoteChar: ref.quoteChar,
				isTypeExport: ref.declarationExportKind === 'type' || allType,
			});
			if (statement) {
				newStatements.push(statement);
			}
		}

		if (ref.remaining.length > 0) {
			const allType = ref.remaining.every((item) => item.kind === 'type');
			const statement = buildExportStatement({
				specs: ref.remaining.map((item) => item.spec),
				path: ref.source,
				quoteChar: ref.quoteChar,
				isTypeExport: ref.declarationExportKind === 'type' || allType,
			});
			if (statement) {
				newStatements.push(statement);
			}
		}

		return newStatements.length > 0
			? [fixer.replaceText(ref.node as never, newStatements.join('\n'))]
			: [];
	};
}

function buildExportStatement({
	specs,
	path,
	quoteChar,
	isTypeExport,
}: {
	specs: AugmentedSpecifier[];
	path: string;
	quoteChar: string;
	isTypeExport: boolean;
}): string {
	const names = specs.map((spec) => {
		if (spec.type === 'ImportDefaultSpecifier') {
			return `default as ${spec.local.name}`;
		}
		if (spec.type !== 'ImportSpecifier') {
			return '';
		}

		const imported = getImportedName(spec);
		const exported = spec.local.name;
		const inlineType = spec.importKind === 'type' && !isTypeExport ? 'type ' : '';
		return imported === exported
			? `${inlineType}${imported}`
			: `${inlineType}${imported} as ${exported}`;
	});
	const namedExports = names.filter(Boolean).join(', ');
	if (!namedExports) {
		return '';
	}

	const typeKeyword = isTypeExport ? 'type ' : '';
	return `export ${typeKeyword}{ ${namedExports} } from ${quoteChar}${path}${quoteChar};`;
}
