import { isKeyframes } from '@atlaskit/eslint-utils/is-supported-import';

import {
	createNoTaggedTemplateExpressionRule,
	noTaggedTemplateExpressionRuleSchema,
} from '../utils/create-no-tagged-template-expression-rule';
import { createLintRule } from '../utils/create-rule';

const rule: import('eslint').Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-keyframes-tagged-template-expression',
		fixable: 'code',
		type: 'problem',
		docs: {
			description:
				'Disallows any `keyframe` tagged template expressions that originate from Emotion, Styled Components or Compiled',
			recommended: false,
			severity: 'error',
		},
		messages: {
			unexpectedTaggedTemplate: 'Unexpected `keyframes` tagged template expression',
		},
		schema: noTaggedTemplateExpressionRuleSchema,
	},
	create: createNoTaggedTemplateExpressionRule(isKeyframes, 'unexpectedTaggedTemplate'),
});

export default rule;
