jest.mock('@atlaskit/tokens/rename-mapping', (): RenameMap[] => [
  {
    path: 'color.text.highEmphasis',
    state: 'deprecated',
    replacement: 'color.text.[default]',
  },
  {
    path: 'shadow.overlay',
    state: 'deleted',
    replacement: 'elevation.shadow.overlay',
  },
]);

import path from 'path';

import tokens from '@atlaskit/tokens/token-names';

import testRule from '../../../../__tests__/utils/_test-rule';
import { messages, ruleName } from '../../index';

const plugin = path.resolve(__dirname, '../../../../index.tsx');

type Token = keyof typeof tokens | string;
type RenameMap = {
  path: string;
  state: 'deprecated' | 'deleted';
  replacement: Token;
};

testRule({
  plugins: [plugin],
  ruleName,
  config: [true, { shouldEnsureFallbackUsage: true }],
  accept: [
    {
      code: 'color: var(--ds-text, red);',
      description: 'should allow active tokens used with a fallback',
    },
    {
      code: 'color: var(--ds-text-highEmphasis, black);',
      description: 'should allow deprecated tokens used with a fallback',
    },
    {
      code: `
        background:
          linear-gradient(
            var(--ds-background-accent-blue, lightBlue),
            var(--ds-background-accent-blue-bold, blue)
          );
      `,
      description: 'should allow tokens used with a fallback inside a function',
    },
  ],
  reject: [
    {
      code: 'color: var(--ds-text);',
      message: messages.missingFallback,
      description: 'should not allow tokens used without a fallback',
    },
    {
      code: 'color: var(--ds-text-highEmphasis);',
      description: 'should not allow deprecated tokens used without a fallback',
      message: messages.missingFallback,
    },
    {
      code: `
        background:
          linear-gradient(
            var(--ds-background-accent-blue),
            var(--ds-background-accent-blue-bold)
          );
      `,
      description:
        'should not allow tokens used without a fallback inside a function',
      warnings: [
        { message: messages.missingFallback },
        { message: messages.missingFallback },
      ],
    },
  ],
});
