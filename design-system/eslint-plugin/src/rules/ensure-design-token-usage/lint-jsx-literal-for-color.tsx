import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { getScope, getSourceCode } from '@atlaskit/eslint-utils/context-compat';

import { getIsException } from '../utils/get-is-exception';
import { includesHardCodedColor } from '../utils/includes-hard-coded-color';
import { isDecendantOfPrimitive } from '../utils/is-decendant-of-primitive';
import { isDecendantOfSvgElement } from '../utils/is-decendant-of-svg-element';
import { isHardCodedColor } from '../utils/is-hard-coded-color';

import { getTokenSuggestion } from './get-token-suggestion';
import type { RuleConfig } from './types';

/**
 * Check if the JSXAttribute is a 'color' prop on a Tag component imported from @atlaskit/tag
 */
const isTagComponentColorProp = (
	jsxAttributeNode: Rule.Node,
	context: Rule.RuleContext,
): boolean => {
	if (!isNodeOfType(jsxAttributeNode, 'JSXAttribute')) {
		return false;
	}

	// Check if the attribute name is 'color'
	const attributeName =
		typeof jsxAttributeNode.name.name === 'string'
			? jsxAttributeNode.name.name
			: jsxAttributeNode.name.name.name;

	if (attributeName !== 'color') {
		return false;
	}

	// Find the JSXOpeningElement
	let currentNode = jsxAttributeNode.parent;
	while (currentNode && !isNodeOfType(currentNode, 'JSXOpeningElement')) {
		currentNode = currentNode.parent;
	}

	if (!currentNode || !isNodeOfType(currentNode, 'JSXOpeningElement')) {
		return false;
	}

	// Get the component name
	const elementName = isNodeOfType(currentNode.name, 'JSXIdentifier')
		? currentNode.name.name
		: null;

	if (!elementName) {
		return false;
	}

	// Check if the component is imported from @atlaskit/tag (scope-based resolution)
	const scope = getScope(context, jsxAttributeNode);
	const variable = scope.variables.find((v) => v.name === elementName);
	if (variable?.defs?.length) {
		for (const def of variable.defs) {
			if (
				def.type === 'ImportBinding' &&
				def.parent &&
				isNodeOfType(def.parent, 'ImportDeclaration')
			) {
				const importSource = def.parent.source.value;
				if (typeof importSource === 'string' && importSource.match(/^@atlaskit\/tag(\/|$)/)) {
					return true;
				}
			}
		}
	}

	// Fallback: scan AST for ImportDeclaration (more reliable when scope differs e.g. in some monorepo/parser setups)
	const sourceCode = getSourceCode(context);
	const ast = sourceCode.ast;
	if (ast?.body) {
		for (const node of ast.body) {
			if (!isNodeOfType(node, 'ImportDeclaration')) {
				continue;
			}
			const source = node.source?.value;
			if (typeof source !== 'string' || !source.match(/^@atlaskit\/tag(\/|$)/)) {
				continue;
			}
			const hasMatchingImport = node.specifiers?.some(
				(s) =>
					(s.type === 'ImportDefaultSpecifier' && s.local?.name === elementName) ||
					(s.type === 'ImportSpecifier' && s.local?.name === elementName),
			);
			if (hasMatchingImport) {
				return true;
			}
		}
	}

	return false;
};

// JSXAttribute > Literal
export const lintJSXLiteralForColor = (
	node: Rule.Node,
	context: Rule.RuleContext,
	config: RuleConfig,
): void => {
	// To force the correct node type
	if (node.type !== 'Literal') {
		return;
	}

	// Changed this condition to properly handle both direct literals and expression containers
	const parent = isNodeOfType(node.parent, 'JSXExpressionContainer')
		? node.parent.parent
		: node.parent;

	if (!isNodeOfType(parent, 'JSXAttribute')) {
		return;
	}

	if (isDecendantOfSvgElement(parent)) {
		return;
	}

	// Box backgroundColor prop accepts token names directly - don't lint against this
	if (isDecendantOfPrimitive(parent, context)) {
		return;
	}

	if (
		['alt', 'src', 'label', 'key', 'appearance'].includes(
			typeof parent.name.name === 'string' ? parent.name.name : parent.name.name.name,
		)
	) {
		return;
	}

	const isException = getIsException(config.exceptions);
	if (isException(parent)) {
		return;
	}

	// Bypass Tag component color prop from @atlaskit/tag
	if (isTagComponentColorProp(parent, context)) {
		return;
	}

	// We only care about hex values
	if (typeof node.value !== 'string') {
		return;
	}

	if (isHardCodedColor(node.value) || includesHardCodedColor(node.value)) {
		context.report({
			messageId: 'hardCodedColor',
			node,
			suggest: getTokenSuggestion(node, node.value, config),
		});
		return;
	}
};
