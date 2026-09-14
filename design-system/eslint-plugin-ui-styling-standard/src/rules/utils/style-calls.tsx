import type { Rule, SourceCode } from 'eslint';
import type * as ESTree from 'eslint-codemod-utils';

import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';

type StyleFunctionName = 'css' | 'cssMap' | 'keyframes' | 'styled' | 'xcss';

export type StyleCall = {
	importSource: string;
	node: ESTree.CallExpression;
	styleFunction: StyleFunctionName;
};

const styleFunctionNames = new Set<StyleFunctionName>([
	'css',
	'cssMap',
	'keyframes',
	'styled',
	'xcss',
]);
const defaultStyledImportSources = new Set(['@emotion/styled', 'styled' + '-components']);
const styleCallsBySourceCode = new WeakMap<object, readonly StyleCall[]>();

/**
 * Visit imported style calls without resolving every CallExpression against its current scope.
 *
 * ESLint has already linked import bindings to all of their references. Building this index once
 * per source file makes each styling rule proportional to the number of style calls instead of the
 * number of all calls in the file.
 */
export function getStyleCalls(context: Rule.RuleContext): readonly StyleCall[] {
	const sourceCode = getSourceCode(context);
	let styleCalls = styleCallsBySourceCode.get(sourceCode);

	if (!styleCalls) {
		styleCalls = buildStyleCallIndex(sourceCode);
		styleCallsBySourceCode.set(sourceCode, styleCalls);
	}

	return styleCalls;
}

function buildStyleCallIndex(sourceCode: SourceCode): readonly StyleCall[] {
	const styleCalls: StyleCall[] = [];
	const seenCalls = new Set<ESTree.CallExpression>();
	const { scopeManager } = sourceCode;
	if (!scopeManager) {
		return styleCalls;
	}

	for (const statement of sourceCode.ast.body) {
		if (statement.type !== 'ImportDeclaration' || typeof statement.source.value !== 'string') {
			continue;
		}

		const importSource = statement.source.value;
		for (const specifier of statement.specifiers) {
			const styleFunction = getStyleFunctionFromSpecifier(specifier, importSource);
			if (!styleFunction) {
				continue;
			}

			const [variable] = scopeManager.getDeclaredVariables(specifier);
			if (!variable) {
				continue;
			}

			for (const reference of variable.references) {
				const call = getStyleCall(
					reference.identifier as ESTree.Identifier & Rule.NodeParentExtension,
					styleFunction,
				);
				if (!call || seenCalls.has(call)) {
					continue;
				}

				seenCalls.add(call);
				styleCalls.push({ importSource, node: call, styleFunction });
			}
		}
	}

	return styleCalls;
}

function getStyleFunctionFromSpecifier(
	specifier: ESTree.ImportDeclaration['specifiers'][number],
	importSource: string,
): StyleFunctionName | null {
	if (
		specifier.type === 'ImportSpecifier' &&
		specifier.imported.type === 'Identifier' &&
		styleFunctionNames.has(specifier.imported.name as StyleFunctionName)
	) {
		return specifier.imported.name as StyleFunctionName;
	}

	if (specifier.type !== 'ImportDefaultSpecifier') {
		return null;
	}

	if (styleFunctionNames.has(specifier.local.name as StyleFunctionName)) {
		return specifier.local.name as StyleFunctionName;
	}

	return defaultStyledImportSources.has(importSource) ? 'styled' : null;
}

function getStyleCall(
	identifier: ESTree.Identifier & Rule.NodeParentExtension,
	styleFunction: StyleFunctionName,
): ESTree.CallExpression | null {
	let callee: ESTree.Node & Rule.NodeParentExtension = identifier;
	let parent = callee.parent;

	while (parent?.type === 'MemberExpression' && parent.object === callee) {
		callee = parent as ESTree.MemberExpression & Rule.NodeParentExtension;
		parent = callee.parent;
	}

	if (parent?.type !== 'CallExpression' || parent.callee !== callee) {
		return null;
	}

	if (
		styleFunction === 'styled' &&
		parent.parent?.type === 'CallExpression' &&
		parent.parent.callee === parent
	) {
		return parent.parent;
	}

	return parent;
}
