import type { Rule } from 'eslint';
import type { CallExpression } from 'estree';

import { getScope } from '@atlaskit/eslint-utils/context-compat';
import { getImportSources, isStyled } from '@atlaskit/eslint-utils/is-supported-import';

import { createLintRule } from '../utils/create-rule';

type RuleModule = Rule.RuleModule;

const isEmptyStyledExpression = (node: CallExpression): boolean => {
	const [firstArg] = node.arguments;
	if (node.arguments.length === 0) {
		return true;
	} else if (node.arguments.length === 1 && firstArg?.type === 'ArrayExpression') {
		return firstArg.elements.length === 0;
	} else if (node.arguments.length === 1 && firstArg?.type === 'ObjectExpression') {
		return firstArg.properties.length === 0;
	}
	return false;
};

const createNoEmptyStyledExpressionRule =
	(
		isEmptyStyledExpression: (node: CallExpression) => boolean,
		messageId: string,
	): RuleModule['create'] =>
	(context) => {
		const importSources = getImportSources(context);

		return {
			'CallExpression[callee.type="MemberExpression"]': (node: CallExpression) => {
				const { references } = getScope(context, node);

				// If we have styled.div(...), make sure `callee` only refers to the
				// `styled` part instead of the whole `styled.div` expression.
				const callee = node.callee.type === 'MemberExpression' ? node.callee.object : node.callee;

				if (!isStyled(callee, references, importSources)) {
					return;
				}

				if (!isEmptyStyledExpression(node)) {
					return;
				}

				context.report({
					messageId,
					node,
				});
			},
		};
	};

const noEmptyStyledExpressionRule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-empty-styled-expression',
		docs: {
			description:
				'Forbids any styled expression to be used when passing empty arguments to styled.div() (or other JSX elements).',
			removeFromPresets: true, // effectively disable this rule here, this is configured by `@atlaskit/ui-styling-standard` instead
		},
		messages: {
			unexpected:
				'Found an empty expression, or empty object argument passed to `styled` function call. This unnecessarily causes a major performance penalty - please use a plain JSX element or a React fragment instead (e.g. `<div>Hello</div>` or `<>Hello</>`).',
		},
		type: 'problem',
		schema: [
			{
				type: 'object',
				properties: {
					importSources: {
						type: 'array',
						items: [
							{
								type: 'string',
							},
						],
					},
				},
				additionalProperties: false,
			},
		],
	},
	create: createNoEmptyStyledExpressionRule(isEmptyStyledExpression, 'unexpected'),
});

export default noEmptyStyledExpressionRule;
