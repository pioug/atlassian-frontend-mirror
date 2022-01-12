import path from 'path';

import testRule from '../../../../__tests__/utils/_test-rule';
import { messages, ruleName } from '../../index';

const plugin = path.resolve(__dirname, '../../../../index.tsx');

testRule({
  plugins: [plugin],
  ruleName,
  config: [false],
  accept: [
    {
      code: `
        .evil {
          color: var(--ds-fake-news);
          color: var(--ds-text-highEmphasis);
          color: var(--ds-text-highEmphasis, red);
        }
      `,
      description: 'should not do any checks when isEnabled is false',
    },
  ],
});

testRule({
  plugins: [plugin],
  ruleName,
  config: [true],
  accept: [
    {
      code: 'color: var(--ds-text-highEmphasis);',
      description: 'should accept missing fallbacks by default',
    },
  ],
  reject: [
    {
      code: 'color: var(--ds-text-highEmphasis, black);',
      description: 'should reject fallbacks by default',
      message: messages.hasFallback,
    },
  ],
});
