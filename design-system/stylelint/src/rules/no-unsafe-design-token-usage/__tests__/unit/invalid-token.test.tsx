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
    {
      code: 'color: var(--ds-overlay);',
      message: messages.invalidToken('--ds-overlay'),
      description: 'should not allow tokens that are in the deleted state',
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
    {
      code: 'color: var(--ds-overlay, white);',
      message: messages.invalidToken('--ds-overlay'),
      description: 'should not allow tokens that are in the deleted state',
    },
  ],
});
