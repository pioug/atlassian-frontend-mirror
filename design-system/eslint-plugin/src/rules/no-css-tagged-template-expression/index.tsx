import { isCss } from '@atlaskit/eslint-utils/is-supported-import';

import { createLintRule } from '../utils/create-lint-rule';
import { createNoTaggedTemplateExpressionRule } from '../utils/create-no-tagged-template-expression-rule/create-no-tagged-template-expression-rule';
import { noTaggedTemplateExpressionRuleSchema } from '../utils/create-no-tagged-template-expression-rule/no-tagged-template-expression-rule-schema';

const rule: import('eslint').Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-css-tagged-template-expression',
		fixable: 'code',
		type: 'problem',
		docs: {
			description:
				'Disallows any `css` tagged template expressions that originate from Emotion, Styled Components or Compiled',
			recommended: false,
			severity: 'error',
		},
		messages: {
			unexpectedTaggedTemplate: 'Unexpected `css` tagged template expression',
		},
		schema: noTaggedTemplateExpressionRuleSchema,
	},
	create: createNoTaggedTemplateExpressionRule(isCss, 'unexpectedTaggedTemplate'),
});

export default rule;
