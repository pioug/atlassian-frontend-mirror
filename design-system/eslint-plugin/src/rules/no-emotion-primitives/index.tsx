import type { Rule } from 'eslint';
import { literal } from 'eslint-codemod-utils';
import type * as ESTree from 'eslint-codemod-utils';
import type { FromSchema, JSONSchema } from 'json-schema-to-ts';

import { createLintRule } from '../utils/create-rule';

const schema = {
	type: 'array',
	items: [
		{
			type: 'object',
			properties: {
				autofix: {
					type: 'boolean',
				},
			},
			additionalProperties: false,
		},
	],
} as const satisfies JSONSchema;

type Config = {
	autofix: boolean;
};

const defaultConfig: Config = {
	autofix: false,
};

function readConfig(context: Rule.RuleContext): Config {
	const [config] = context.options as FromSchema<typeof schema>;
	return Object.assign({}, defaultConfig, config);
}

export const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-emotion-primitives',
		type: 'problem',
		fixable: 'code',
		docs: {
			description: 'Ensures usage of Compiled Primitives import instead of Emotion entrypoint.',
			severity: 'warn',
			recommended: false,
		},
		messages: {
			'no-emotion-primitives':
				'Use @atlaskit/primitives/compiled instead of @atlaskit/primitives. Refer to go/akcss for more information.',
		},
		schema,
	},
	create(context) {
		const config = readConfig(context);

		return {
			ImportDeclaration(node: ESTree.ImportDeclaration) {
				const importSource = node.source.value as string;
				if (importSource !== '@atlaskit/primitives') {
					return;
				}

				context.report({
					node: node.source,
					messageId: 'no-emotion-primitives',
					fix(fixer) {
						if (!config.autofix) {
							return null;
						}

						const newSource = literal('@atlaskit/primitives/compiled');
						return fixer.replaceText(
							node.source,
							newSource.raw || "'@atlaskit/primitives/compiled'",
						);
					},
				});
			},
		};
	},
});

export default rule;
