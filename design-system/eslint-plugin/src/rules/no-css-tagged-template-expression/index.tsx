import { createLintRule } from '../utils/create-rule';

import { createNoTaggedTemplateExpressionRule } from './create-no-tagged-template-expression-rule';
import { isSupportedImport } from './is-supported-import';

const rule = createLintRule({
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
  },
  create: createNoTaggedTemplateExpressionRule(
    isSupportedImport('css'),
    'unexpectedTaggedTemplate',
  ),
});

export default rule;
