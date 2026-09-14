/* eslint-disable @repo/internal/react/require-jsdoc */
import type { TSESTree } from '@typescript-eslint/utils';
import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { barrelSourceMap } from '../../utils/barrel-sources';
import { buildImportStatement } from '../../utils/build-import-statement';
import {
	type ClassifiedSpecifier,
	classifySpecifiers,
	type ReadinessGate,
} from '../../utils/classify-specifiers';
import { hasNamespaceSpecifier } from '../../utils/has-namespace-specifier';
import { toDestinationSpecifier } from '../../utils/to-destination-specifier';

type Ref = {
	node: TSESTree.ImportDeclaration;
	source: string;
	packageName: string;
	autofixable: ClassifiedSpecifier[];
	remaining: ClassifiedSpecifier[];
	quoteChar: string;
	declarationImportKind: 'type' | 'value';
};

type Check =
	| {
			success: false;
			ref: undefined;
	  }
	| {
			success: true;
			ref: Ref;
	  };

type LintOptions = {
	context: Rule.RuleContext;
	readinessGate?: ReadinessGate;
	/**
	 * `suggest` — IDE quick-fix only (Stage 1 warn rule).
	 * `autofix` — applied by `--fix` / lint-on-save (Stage 2 error rule).
	 */
	fixStyle?: 'suggest' | 'autofix';
};

export const BarrelImport: {
	lint(node: Rule.Node, options: LintOptions): void;
	_check(
		node: Rule.Node,
		sourceCode: Rule.RuleContext['sourceCode'],
		readinessGate: ReadinessGate,
	): Check;
	_fix(ref: Ref, context: Rule.RuleContext): (fixer: Rule.RuleFixer) => Rule.Fix[];
} = {
	lint(
		node: Rule.Node,
		{ context, readinessGate = 'voltCompliant', fixStyle = 'suggest' }: LintOptions,
	): void {
		const { success, ref } = BarrelImport._check(node, context.sourceCode, readinessGate);

		if (!success) {
			return;
		}

		const fix = BarrelImport._fix(ref, context);

		context.report({
			node: ref.node.source as unknown as Rule.Node,
			messageId: 'preferEntryPoint',
			data: {
				source: ref.source,
			},
			...(fixStyle === 'autofix'
				? { fix }
				: {
						// Suggestion (not autofix): selectable quick-fix in the IDE,
						// but not applied by --fix / lint-on-save.
						suggest: [
							{
								messageId: 'preferEntryPointSuggest',
								fix,
							},
						],
					}),
		});
	},

	_check(
		node: Rule.Node,
		sourceCode: Rule.RuleContext['sourceCode'],
		readinessGate: ReadinessGate,
	): Check {
		if (!isNodeOfType(node, 'ImportDeclaration')) {
			return { success: false, ref: undefined };
		}

		const importNode = node as unknown as TSESTree.ImportDeclaration;
		const source = String(importNode.source.value);
		const barrel = barrelSourceMap.get(source);
		if (!barrel) {
			return { success: false, ref: undefined };
		}

		// A namespace binding cannot be rewritten to entry-points, and it is not carried
		// through `remaining`, so bail out rather than emit a fix that would drop it.
		if (hasNamespaceSpecifier(importNode)) {
			return { success: false, ref: undefined };
		}

		if (importNode.specifiers.length === 0) {
			return { success: false, ref: undefined };
		}

		const classified = classifySpecifiers(importNode, barrel, readinessGate);
		const autofixable = classified.filter((c) => c.destination && !c.warnOnly && !c.incomplete);

		// Only report what we can rewrite. Symbols outside the readiness gate or without a
		// mapped entry-point leave the consumer no action to take, so they stay silent and
		// only ride along as `remaining` when a sibling symbol triggers a report.
		if (autofixable.length === 0) {
			return { success: false, ref: undefined };
		}

		const remaining = classified.filter((c) => c.warnOnly || c.incomplete || !c.destination);

		const quoteChar = sourceCode.getText(importNode.source as never)[0] ?? "'";

		return {
			success: true,
			ref: {
				node: importNode,
				source,
				packageName: barrel.packageName,
				autofixable,
				remaining,
				quoteChar,
				declarationImportKind: importNode.importKind === 'type' ? 'type' : 'value',
			},
		};
	},

	_fix(ref: Ref, _context: Rule.RuleContext) {
		return (fixer: Rule.RuleFixer) => {
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
				const specs = items.map(toDestinationSpecifier);
				const allType = items.every((item) => item.kind === 'type');
				const isTypeImport = ref.declarationImportKind === 'type' || allType;
				const statement = buildImportStatement({
					specs,
					path: destination,
					quoteChar: ref.quoteChar,
					isTypeImport,
				});
				if (statement) {
					newStatements.push(statement);
				}
			}

			if (ref.remaining.length > 0) {
				const remainingSpecs = ref.remaining.map((item) => item.spec);
				const allType = ref.remaining.every((item) => item.kind === 'type');
				const isTypeImport = ref.declarationImportKind === 'type' || allType;
				const remainingStatement = buildImportStatement({
					specs: remainingSpecs,
					path: ref.source,
					quoteChar: ref.quoteChar,
					isTypeImport,
				});
				if (remainingStatement) {
					newStatements.push(remainingStatement);
				}
			}

			if (newStatements.length === 0) {
				return [];
			}

			return [fixer.replaceText(ref.node as never, newStatements.join('\n'))];
		};
	},
};
