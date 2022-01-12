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
      code: 'color: var(--ds-text-highEmphasis);',
      description: 'should allow tokens used without a fallback',
    },
    {
      code: `
        background: 
          linear-gradient(
            var(--ds-accent-subtleBlue),
            var(--ds-accent-boldBlue)
          );
      `,
      description:
        'should allow tokens used without a fallback inside a function',
    },
  ],
  reject: [
    {
      code: 'color: var(--ds-text-highEmphasis, red);',
      message: messages.hasFallback,
      description: 'should not allow tokens used with a fallback',
    },
    {
      code: `
        background: 
          linear-gradient(
            var(--ds-accent-subtleBlue, lightBlue),
            var(--ds-accent-boldBlue, blue)
          );
      `,
      description:
        'should not allow tokens used with a fallback inside a function',
      warnings: [
        { message: messages.hasFallback },
        { message: messages.hasFallback },
      ],
    },
  ],
});
