import { isStyled } from '@atlaskit/eslint-utils/is-supported-import';

import { createLintRule } from '../utils/create-lint-rule';
import { createNoTaggedTemplateExpressionRule } from '../utils/create-no-tagged-template-expression-rule/create-no-tagged-template-expression-rule';
import { noTaggedTemplateExpressionRuleSchema } from '../utils/create-no-tagged-template-expression-rule/no-tagged-template-expression-rule-schema';

const rule: import('eslint').Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-styled-tagged-template-expression',
		fixable: 'code',
		type: 'problem',
		docs: {
			description:
				'Disallows any `styled` tagged template expressions that originate from Emotion, Styled Components or Compiled',
			recommended: false,
			severity: 'error',
		},
		messages: {
			unexpectedTaggedTemplate: 'Unexpected `styled` tagged template expression',
		},
		schema: noTaggedTemplateExpressionRuleSchema,
	},
	create: createNoTaggedTemplateExpressionRule(isStyled, 'unexpectedTaggedTemplate'),
});

export default rule;
