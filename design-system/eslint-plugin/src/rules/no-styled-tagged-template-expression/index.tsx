import {
  createNoTaggedTemplateExpressionRule,
  noTaggedTemplateExpressionRuleSchema,
} from '../utils/create-no-tagged-template-expression-rule';
import { createLintRule } from '../utils/create-rule';
import { isStyled } from '../utils/is-supported-import';

const rule = createLintRule({
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
      unexpectedTaggedTemplate:
        'Unexpected `styled` tagged template expression',
    },
    schema: noTaggedTemplateExpressionRuleSchema,
  },
  create: createNoTaggedTemplateExpressionRule(
    isStyled,
    'unexpectedTaggedTemplate',
  ),
});

export default rule;
