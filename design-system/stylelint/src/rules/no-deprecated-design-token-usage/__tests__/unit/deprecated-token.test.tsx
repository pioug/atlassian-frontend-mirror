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
    path: 'color.text.lowEmphasis',
    state: 'deprecated',
    replacement: 'color.text.subtlest',
  },
  {
    path: 'color.background.boldWarning.resting',
    state: 'deprecated',
    replacement: 'color.background.warning.bold.[default]',
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
      code: 'color: var(--my-css-variable);',
      description: 'should allow CSS variables that are not token-like',
    },
    {
      code: 'color: var(--ds-test);',
      description: 'should ignore tokens that do not exist',
    },
    {
      code: 'color: var(--ds-text-accent-blue);',
      description: 'should allow tokens that are not deprecated',
    },
    {
      code: 'color: var(--ds-overlay);',
      description: 'should allow tokens that are deleted',
    },
  ],
  reject: [
    {
      code: 'color: var(--ds-text-highEmphasis);',
      description: 'should not allow token that is deprecated',
      message: messages.invalidToken('--ds-text-highEmphasis', '--ds-text'),
    },
    {
      code: 'color: var(--ds-background-boldWarning-resting);',
      description: 'should not allow token that is deprecated',
      message: messages.invalidToken(
        '--ds-background-boldWarning-resting',
        '--ds-background-warning-bold',
      ),
    },
    {
      code: 'color: var(--ds-text-lowEmphasis);',
      description: 'should not allow token that is deprecated',
      message: messages.invalidToken(
        '--ds-text-lowEmphasis',
        '--ds-text-subtlest',
      ),
    },
  ],
});

testRule({
  plugins: [plugin],
  ruleName,
  config: [true],
  accept: [
    {
      code: 'color: var(--my-css-variable, red);',
      description: 'should not care about fallbacks with non-tokens',
    },
    {
      code: 'color: var(--ds-test, black);',
      description: 'should ignore tokens with fallbacks that do not exist',
    },
    {
      code: 'color: var(--ds-text-accent-blue, blue);',
      description:
        'should allow tokens that are not deprecated, with a fallback',
    },
    {
      code: 'color: var(--ds-overlay, white);',
      description: 'should allow tokens that are deleted, with a fallback',
    },
  ],
  reject: [
    {
      code: 'color: var(--ds-text-highEmphasis, grey);',
      description: 'should not allow token that is deprecated, with a fallback',
      message: messages.invalidToken('--ds-text-highEmphasis', '--ds-text'),
    },
  ],
});
