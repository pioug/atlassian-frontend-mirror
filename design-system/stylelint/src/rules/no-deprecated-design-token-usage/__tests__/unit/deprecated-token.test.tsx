jest.mock('@atlaskit/tokens/rename-mapping', (): typeof renameMapper => [
  {
    path: 'color.text.highEmphasis',
    state: 'deprecated',
    replacement: 'color.text.[default]',
  },
  {
    path: 'color.background.subtleBrand.hover',
    state: 'deprecated',
    replacement: 'color.background.brand.[default].hovered',
  },
  {
    path: 'color.background.subtleDanger.resting',
    state: 'deprecated',
    replacement: 'color.background.danger.[default].[default]',
  },
  {
    path: 'shadow.overlay',
    state: 'deleted',
    replacement: 'elevation.shadow.overlay',
  },
]);

import path from 'path';

import type renameMapper from '@atlaskit/tokens/rename-mapping';

import testRule from '../../../../__tests__/utils/_test-rule';
import { messages, ruleName } from '../../index';

const plugin = path.resolve(__dirname, '../../../../index.tsx');

testRule({
  plugins: [plugin],
  ruleName,
  config: [true, {}],
  fix: true,
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
      fixed: 'color: var(--ds-text);',
      description: 'should not allow token that is deprecated',
      message: messages.invalidToken('--ds-text-highEmphasis', '--ds-text'),
    },
    {
      code: 'color: var(--ds-background-subtleBrand-hover);',
      fixed: 'color: var(--ds-background-brand-hovered);',
      description: 'should not allow token that is deprecated',
      message: messages.invalidToken(
        '--ds-background-subtleBrand-hover',
        '--ds-background-brand-hovered',
      ),
    },
    {
      code: 'color: var(--ds-background-subtleDanger-resting);',
      fixed: 'color: var(--ds-background-danger);',
      description: 'should not allow token that is deprecated',
      message: messages.invalidToken(
        '--ds-background-subtleDanger-resting',
        '--ds-background-danger',
      ),
    },
  ],
});

testRule({
  plugins: [plugin],
  ruleName,
  config: [true, {}],
  fix: true,
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
      fixed: 'color: var(--ds-text, grey);',
      description: 'should not allow token that is deprecated, with a fallback',
      message: messages.invalidToken('--ds-text-highEmphasis', '--ds-text'),
    },
    {
      code: 'color: var(--ds-background-subtleBrand-hover, blue);',
      fixed: 'color: var(--ds-background-brand-hovered, blue);',
      description: 'should not allow token that is deprecated',
      message: messages.invalidToken(
        '--ds-background-subtleBrand-hover',
        '--ds-background-brand-hovered',
      ),
    },
    {
      code: 'color: var(--ds-background-subtleDanger-resting, red);',
      fixed: 'color: var(--ds-background-danger, red);',
      description: 'should not allow token that is deprecated',
      message: messages.invalidToken(
        '--ds-background-subtleDanger-resting',
        '--ds-background-danger',
      ),
    },
  ],
});
