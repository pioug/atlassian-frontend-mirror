import path from 'path';

import testRule from '../../../../__tests__/utils/_test-rule';
import { messages, ruleName } from '../../index';

const plugin = path.resolve(__dirname, '../../../../index.tsx');

testRule({
  plugins: [plugin],
  ruleName,
  config: [true, { shouldEnsureFallbackUsage: false }],
  accept: [
    {
      code: 'color: var(--my-css-variable);',
      description: 'should allow CSS variables that are not token-like',
    },
    {
      code: 'color: var(--my-css-variable, red);',
      description: 'should not care about fallbacks with non-tokens',
    },
  ],
  reject: [
    {
      code: 'color: var(--ds-test);',
      message: messages.invalidToken('--ds-test'),
      description: 'should not allow tokens that do not exist',
    },
  ],
});

testRule({
  plugins: [plugin],
  ruleName,
  config: [true, { shouldEnsureFallbackUsage: true }],
  accept: [
    {
      code: 'color: var(--my-css-variable);',
      description: 'should allow CSS variables that are not token-like',
    },
    {
      code: 'color: var(--my-css-variable, red);',
      description: 'should not care about fallbacks with non-tokens',
    },
  ],
  reject: [
    {
      code: 'color: var(--ds-test, red);',
      message: messages.invalidToken('--ds-test'),
      description: 'should not allow tokens that do not exist',
    },
  ],
});
