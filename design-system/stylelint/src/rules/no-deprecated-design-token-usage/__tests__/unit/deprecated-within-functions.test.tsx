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
  {
    path: 'color.accent.subtleBlue',
    state: 'deprecated',
    replacement: 'color.background.accent.blue.[default]',
  },
  {
    path: 'color.accent.boldBlue',
    state: 'deprecated',
    replacement: 'color.background.accent.blue.bold',
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
  config: [true],
  accept: [
    {
      code: `
        background:
          linear-gradient(
            var(--ds-background-accent-blue),
            var(--ds-background-accent-blue-bold)
          );
      `,
      description:
        'should allow non-deprecated tokens used without a fallback inside a function',
    },
    {
      code: `
        background:
          linear-gradient(
            var(--ds-background-accent-blue, lightBlue),
            var(--ds-background-accent-blue-bold, blue)
          );
      `,
      description:
        'should allow non-deprecated tokens used with a fallback inside a function',
    },
  ],
  reject: [
    {
      code: `
        background:
          linear-gradient(
            var(--ds-accent-subtleBlue),
            var(--ds-accent-boldBlue)
          );
      `,
      description:
        'should not allow deprecated tokens used without a fallback inside a function',
      warnings: [
        {
          message: messages.invalidToken(
            '--ds-accent-subtleBlue',
            '--ds-background-accent-blue',
          ),
        },
        {
          message: messages.invalidToken(
            '--ds-accent-boldBlue',
            '--ds-background-accent-blue-bold',
          ),
        },
      ],
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
        'should not allow deprecated tokens used with a fallback inside a function',
      warnings: [
        {
          message: messages.invalidToken(
            '--ds-accent-subtleBlue',
            '--ds-background-accent-blue',
          ),
        },
        {
          message: messages.invalidToken(
            '--ds-accent-boldBlue',
            '--ds-background-accent-blue-bold',
          ),
        },
      ],
    },
  ],
});
