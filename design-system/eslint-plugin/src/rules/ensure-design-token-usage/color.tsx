import type { Rule } from 'eslint';
import { node as generate, isNodeOfType, type Property } from 'eslint-codemod-utils';

import { getScope, getSourceCode } from '@atlaskit/eslint-utils/context-compat';

import { getIsException } from '../utils/get-is-exception';
import {
	includesHardCodedColor,
	isHardCodedColor,
	isLegacyColor,
	isLegacyNamedColor,
} from '../utils/is-color';
import { isLegacyElevation } from '../utils/is-elevation';
import {
	isChildOfType,
	isDecendantOfGlobalToken,
	isDecendantOfPrimitive,
	isDecendantOfStyleBlock,
	isDecendantOfSvgElement,
} from '../utils/is-node';

import type { RuleConfig } from './types';

type Suggestion = {
	shouldReturnSuggestion: boolean;
} & Rule.SuggestionReportDescriptor;

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

// TemplateLiteral > Identifier
export const lintTemplateIdentifierForColor = (
	node: Rule.Node,
	context: Rule.RuleContext,
	config: RuleConfig,
): void => {
	if (node.type !== 'Identifier') {
		return;
	}

	if (isDecendantOfGlobalToken(node) || !isDecendantOfStyleBlock(node)) {
		return;
	}

	const elevation = isLegacyElevation(node.name);

	if (elevation) {
		context.report({
			messageId: 'legacyElevation',
			node,
			data: {
				example: getElevationTokenExample(elevation),
			},
			fix: (fixer) => {
				if (isChildOfType(node, 'TemplateLiteral') && node.range) {
					return fixer.replaceTextRange(
						[node.range[0] - 2, node.range[1] + 1],
						`background-color: \${token('${elevation.background}')};
${' '.repeat(getNodeColumn(node) - 2)}box-shadow: \${token('${elevation.shadow}')}`,
					);
				}

				return null;
			},
		});
	}

	const isException = getIsException(config.exceptions);

	if (isLegacyColor(node.name) || (isLegacyNamedColor(node.name) && !isException(node))) {
		context.report({
			messageId: 'hardCodedColor',
			node,
			suggest: getTokenSuggestion(node, node.name, config),
		});
		return;
	}
};

// ObjectExpression
export const lintObjectForColor = (
	propertyNode: Property,
	context: Rule.RuleContext,
	config: RuleConfig,
): void => {
	let propertyKey = '';

	if (propertyNode.key.type === 'Identifier') {
		propertyKey = propertyNode.key.name.toString();
	}

	const node = propertyNode.value as Rule.Node;

	// ObjectExpression > Property > Literal
	if (node.type === 'Literal') {
		const nodeVal = node.value?.toString() || '';
		const isException = getIsException(config.exceptions);

		if ((isHardCodedColor(nodeVal) || includesHardCodedColor(nodeVal)) && !isException(node)) {
			context.report({
				messageId: 'hardCodedColor',
				node,
				suggest: getTokenSuggestion(node, `'${nodeVal}'`, config),
			});
		}
		return;
	}

	const isException = getIsException(config.exceptions);

	// ObjectExpression > Property > CallExpression
	if (node.type === 'CallExpression') {
		if (!isNodeOfType(node.callee, 'Identifier')) {
			return;
		}

		if (!isLegacyNamedColor(node.callee.name) || isException(node)) {
			return;
		}

		context.report({
			messageId: 'hardCodedColor',
			node: node,
			suggest: getTokenSuggestion(node, `${node.callee.name}()`, config),
		});
		return;
	}

	// Template literals are already handled by 'TemplateLiteral > Identifier' in the main file
	if (node.type === 'TemplateLiteral') {
		return;
	}

	let identifierNode: Rule.Node | null = null;

	// ObjectExpression > Property > MemberExpression
	if (node.type === 'MemberExpression') {
		if (node.property.type !== 'Identifier') {
			context.report({
				messageId: 'hardCodedColor',
				node: node,
				suggest: getTokenSuggestion(node, generate(node).toString(), config),
			});

			return;
		}

		identifierNode = node.property as Rule.Node;
	}

	if (node.type === 'Identifier') {
		// identifier is the key and not the value
		if (node.name === propertyKey) {
			return;
		}

		identifierNode = node;
	}

	// ObjectExpression > Property > MemberExpression > Identifier
	// ObjectExpression > Property > Identifier
	if (identifierNode?.type === 'Identifier') {
		if (
			(isHardCodedColor(identifierNode.name) ||
				includesHardCodedColor(identifierNode.name) ||
				isLegacyColor(identifierNode.name)) &&
			!isException(identifierNode)
		) {
			context.report({
				messageId: 'hardCodedColor',
				node: identifierNode,
				suggest: getTokenSuggestion(identifierNode, identifierNode.name, config),
			});

			return;
		}
	}

	return;
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

// JSXExpressionContainer > MemberExpression
export const lintJSXMemberForColor = (
	node: Rule.Node,
	context: Rule.RuleContext,
	config: RuleConfig,
): void => {
	// To force the correct node type
	if (node.type !== 'MemberExpression') {
		return;
	}

	if (!isNodeOfType(node.property, 'Identifier')) {
		return;
	}

	if (
		isLegacyColor(node.property.name) ||
		(isNodeOfType(node.object, 'Identifier') &&
			node.object.name === 'colors' &&
			isLegacyNamedColor(node.property.name))
	) {
		context.report({
			messageId: 'hardCodedColor',
			node,
			suggest: getTokenSuggestion(node, generate(node).toString(), config),
		});

		return;
	}
};

// JSXExpressionContainer > Identifier
export const lintJSXIdentifierForColor = (
	node: Rule.Node,
	context: Rule.RuleContext,
	config: RuleConfig,
): void => {
	// To force the correct node type
	if (node.type !== 'Identifier') {
		return;
	}

	const isException = getIsException(config.exceptions);
	if (isException(node)) {
		return;
	}

	if (isLegacyColor(node.name) || includesHardCodedColor(node.name)) {
		context.report({
			messageId: 'hardCodedColor',
			node,
			suggest: getTokenSuggestion(node, node.name, config),
		});
		return;
	}
};

export const getElevationTokenExample = (
	elevation: Exclude<ReturnType<typeof isLegacyElevation>, false>,
) => `\`\`\`
import { token } from '@atlaskit/tokens';

css({
  backgroundColor: token('${elevation.background}');
  boxShadow: token('${elevation.shadow}');
});
\`\`\``;

export const getTokenSuggestion = (
	node: Rule.Node,
	reference: string,
	config: RuleConfig,
): Suggestion[] =>
	[
		{
			shouldReturnSuggestion:
				!isDecendantOfGlobalToken(node) && config.shouldEnforceFallbacks === false,
			desc: `Convert to token`,
			fix: (fixer: Rule.RuleFixer) =>
				fixer.replaceText(
					isNodeOfType(node.parent, 'MemberExpression') ? node.parent : node,
					isNodeOfType(node.parent, 'JSXAttribute') ? `{token('')}` : `token('')`,
				),
		},
		{
			shouldReturnSuggestion:
				!isDecendantOfGlobalToken(node) && config.shouldEnforceFallbacks === true,
			desc: `Convert to token with fallback`,
			fix: (fixer: Rule.RuleFixer) =>
				fixer.replaceText(
					isNodeOfType(node.parent, 'MemberExpression') ? node.parent : node,
					isNodeOfType(node.parent, 'JSXAttribute')
						? `{token('', ${reference})}`
						: `token('', ${reference})`,
				),
		},
	].filter(filterSuggestion);

const filterSuggestion = ({ shouldReturnSuggestion }: Suggestion) => shouldReturnSuggestion;

const getNodeColumn = (node: Rule.Node) => (node.loc ? node.loc.start.column : 0);
