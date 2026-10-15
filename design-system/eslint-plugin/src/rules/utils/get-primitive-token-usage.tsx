import type { Rule, Scope } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { getScope } from '@atlaskit/eslint-utils/context-compat';

const spacingTokens = new Set([
	'space.0',
	'space.025',
	'space.050',
	'space.075',
	'space.100',
	'space.150',
	'space.200',
	'space.250',
	'space.300',
	'space.400',
	'space.500',
	'space.600',
	'space.800',
	'space.1000',
]);
const paddingProps = new Set([
	'padding',
	'paddingBlock',
	'paddingBlockStart',
	'paddingBlockEnd',
	'paddingInline',
	'paddingInlineStart',
	'paddingInlineEnd',
]);
const tokenProps = new Set([
	...paddingProps,
	'backgroundColor',
	'space',
	'rowSpace',
	'gap',
	'rowGap',
	'columnGap',
	'color',
	'size',
	'weight',
	'all',
	'inline',
	'block',
]);
const components = new Map([
	['Box', 'box'],
	['Inline', 'inline'],
	['Stack', 'stack'],
	['Flex', 'flex'],
	['Grid', 'grid'],
	['Bleed', 'bleed'],
	['Text', 'text'],
	['MetricText', 'metric-text'],
	['Pressable', 'pressable'],
	['Anchor', 'anchor'],
]);
const textSizes: Record<string, string> = {
	small: 'font.body.small',
	medium: 'font.body',
	large: 'font.body.large',
};
const metricSizes: Record<string, string> = {
	small: 'font.metric.small',
	medium: 'font.metric.medium',
	large: 'font.metric.large',
};
const textWeights: Record<string, string> = {
	regular: 'font.weight.regular',
	medium: 'font.weight.medium',
	semibold: 'font.weight.semibold',
	bold: 'font.weight.bold',
};
const bleedTokens: Record<string, string> = {
	'space.025': 'space.negative.025',
	'space.050': 'space.negative.050',
	'space.100': 'space.negative.100',
	'space.150': 'space.negative.150',
	'space.200': 'space.negative.200',
};

type TokenMapping = {
	tokenName: string;
	getReplacementValue: (tokenName: string) => string | undefined;
};

function fromMapping(value: string, mapping: Record<string, string>): TokenMapping | undefined {
	if (!Object.prototype.hasOwnProperty.call(mapping, value)) {
		return;
	}
	return {
		tokenName: mapping[value],
		getReplacementValue: (tokenName) =>
			Object.keys(mapping).find((key) => mapping[key] === tokenName),
	};
}

function getTokenMapping(
	component: string,
	compiled: boolean,
	prop: string,
	value: string,
): TokenMapping | undefined {
	if (component === 'Text') {
		if (prop === 'size') {
			return fromMapping(value, textSizes);
		}
		if (prop === 'weight') {
			return fromMapping(value, textWeights);
		}
		if (prop === 'color' && value !== 'inherit') {
			return {
				tokenName: value,
				getReplacementValue: (name) => (/^color\.(text|link)(\.|$)/.test(name) ? name : undefined),
			};
		}
	}
	if (component === 'MetricText' && prop === 'size') {
		return fromMapping(value, metricSizes);
	}
	if (component === 'Bleed' && ['all', 'inline', 'block'].includes(prop)) {
		return fromMapping(value, bleedTokens);
	}
	if (component === 'Box' || (!compiled && ['Anchor', 'Pressable'].includes(component))) {
		if (prop === 'backgroundColor') {
			return {
				tokenName: value,
				getReplacementValue: (name) =>
					/^(color\.(background|blanket|skeleton)|elevation\.surface)(\.|$)/.test(name) ||
					name === 'utility.elevation.surface.current'
						? name
						: undefined,
			};
		}
		if (paddingProps.has(prop)) {
			return {
				tokenName: value,
				getReplacementValue: (name) => (spacingTokens.has(name) ? name : undefined),
			};
		}
	}
	if (
		(component === 'Inline' && ['space', 'rowSpace'].includes(prop)) ||
		(component === 'Stack' && prop === 'space') ||
		(['Flex', 'Grid'].includes(component) && ['gap', 'rowGap', 'columnGap'].includes(prop))
	) {
		return {
			tokenName: value,
			getReplacementValue: (name) => (spacingTokens.has(name) ? name : undefined),
		};
	}
}

// Resolve only explicit string props on imported primitives, respecting aliases and shadowing.
export function getPrimitiveTokenUsage(
	node: Rule.Node,
	context: Rule.RuleContext,
): (TokenMapping & { node: Rule.Node }) | undefined {
	if (
		!isNodeOfType(node, 'JSXAttribute') ||
		node.name.type !== 'JSXIdentifier' ||
		!tokenProps.has(node.name.name) ||
		!node.value
	) {
		return;
	}

	const value = node.value.type === 'JSXExpressionContainer' ? node.value.expression : node.value;
	if (value.type !== 'Literal' || typeof value.value !== 'string') {
		return;
	}
	const opening = node.parent;
	if (!isNodeOfType(opening, 'JSXOpeningElement')) {
		return;
	}
	const tag = opening.name;
	const namespace = tag.type === 'JSXMemberExpression';
	const identifier = namespace ? tag.object : tag;
	if (identifier.type !== 'JSXIdentifier') {
		return;
	}

	let scope: Scope.Scope | null = getScope(context, node);
	while (scope) {
		const variable = scope.set.get(identifier.name);
		if (!variable) {
			scope = scope.upper;
			continue;
		}
		for (const def of variable.defs) {
			if (def.type !== 'ImportBinding' || def.parent?.type !== 'ImportDeclaration') {
				continue;
			}
			const source = String(def.parent.source.value);
			const compiled = source.startsWith('@atlaskit/primitives/compiled');
			const barrel =
				source === '@atlaskit/primitives' || source === '@atlaskit/primitives/compiled';
			let component: string | undefined;
			if (namespace && def.node.type === 'ImportNamespaceSpecifier') {
				component = tag.property.name;
			} else if (!namespace && def.node.type === 'ImportSpecifier') {
				component = def.node.imported.name;
			} else if (!namespace && def.node.type === 'ImportDefaultSpecifier' && !compiled) {
				component = [...components].find(
					([name, path]) =>
						!['Grid', 'Bleed'].includes(name) && source === `@atlaskit/primitives/${path}`,
				)?.[0];
			}
			const path = component && components.get(component);
			if (
				!component ||
				!path ||
				(!barrel &&
					source !== `@atlaskit/primitives/${compiled ? 'compiled/' : ''}${path}` &&
					!(component === 'Flex' && source === '@atlaskit/primitives/components/flex'))
			) {
				continue;
			}
			const mapping = getTokenMapping(component, compiled, node.name.name, value.value);
			return mapping && { ...mapping, node: value as Rule.Node };
		}
		// A local binding shadows any import in an outer scope.
		return;
	}
}
