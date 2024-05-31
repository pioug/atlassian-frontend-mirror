import { ESLintUtils } from '@typescript-eslint/utils';

type Options = [
	{
		types: string[];
	},
];

const rule = ESLintUtils.RuleCreator.withoutDocs<Options, 'noAsTypecast'>({
	defaultOptions: [{ types: [] }],
	meta: {
		type: 'problem',
		docs: {
			description: 'Avoid typecasting to specified.',
			recommended: 'error',
		},
		messages: {
			noAsTypecast:
				'Avoid "as {{nodeName}}" typecasting as it has led to production issues. Instead check the type or use type predicates.',
		},
		schema: [
			{
				type: 'object',
				properties: {
					types: {
						type: 'array',
					},
				},
				additionalProperties: false,
			},
		],
	},
	create: function (context, [options]) {
		return {
			TSAsExpression(node) {
				if (
					node.typeAnnotation.type === 'TSTypeReference' &&
					node.typeAnnotation.typeName.type === 'Identifier' &&
					options.types.includes(node.typeAnnotation.typeName.name)
				) {
					context.report({
						node: node,
						messageId: 'noAsTypecast',
						data: {
							nodeName: node.typeAnnotation.typeName.name,
						},
					});
				}
			},
		};
	},
});

module.exports = rule;
