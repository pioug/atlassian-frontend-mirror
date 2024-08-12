import type { Rule } from 'eslint';

import { isKeyframes } from '@atlaskit/eslint-utils/is-supported-import';

import { createNoExportedRule } from '../utils/create-no-exported-rule/main';
import { createLintRule } from '../utils/create-rule';

const noExportedKeyframesRule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-exported-keyframes',
		type: 'problem',
		docs: {
			description:
				'Forbid exporting `keyframes` function calls. Exporting `css` function calls can result in unexpected behaviour at runtime, and is not statically analysable.',
			removeFromPresets: true, // effectively disable this rule here, this is overriden by `@atlaskit/ui-styling-standard` instead
		},
		messages: {
			unexpected:
				"`keyframes` can't be exported - this will cause unexpected behaviour at runtime. Instead, please move your `keyframes(...)` code to the same file where these styles are being used.",
		},
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
	create: createNoExportedRule(isKeyframes, 'unexpected'),
});

export default noExportedKeyframesRule;
