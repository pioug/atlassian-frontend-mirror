jest.mock('@atlaskit/tokens/rename-mapping', (): typeof renameMapper => [
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

jest.mock('@atlaskit/tokens/token-names', (): Record<string, string> => {
  const mockTokens: Record<string, string> = {};
  [
    'color.text.highEmphasis',
    'color.text',
    'shadow.overlay',
    'elevation.shadow.overlay',
    'color.text.accent.blue',
    'color.background.accent.blue',
    'color.background.accent.blue.bold',
  ].forEach(token => {
    const getCSSCustomProperty = jest.requireActual(
      '@atlaskit/tokens/token-ids',
    ).getCSSCustomProperty;
    mockTokens[token] = getCSSCustomProperty(token);
  });
  return mockTokens;
});

jest.mock(
  '@atlaskit/tokens/token-default-values',
  (): Record<string, string> => ({
    'color.text': '#172B4D',
  }),
);

import path from 'path';

import type renameMapper from '@atlaskit/tokens/rename-mapping';

import testRule from '../../../../__tests__/utils/_test-rule';
import { messages, ruleName } from '../../index';

const plugin = path.resolve(__dirname, '../../../../index.tsx');

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

testRule({
  plugins: [plugin],
  ruleName,
  config: [true, { shouldEnsureFallbackUsage: true }],
  fix: true,
  reject: [
    {
      code: 'color: var(--ds-text);',
      fixed: 'color: var(--ds-text, #172B4D);',
      message: messages.missingFallback,
      description:
        'should automatically add a fallback that matches the default value from the light theme stylesheet',
    },
  ],
});

testRule({
  plugins: [plugin],
  ruleName,
  config: [true, { fallbackUsage: 'forced' }],
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

testRule({
  plugins: [plugin],
  ruleName,
  config: [true, { fallbackUsage: 'forced' }],
  fix: true,
  reject: [
    {
      code: 'color: var(--ds-text);',
      fixed: 'color: var(--ds-text, #172B4D);',
      message: messages.missingFallback,
      description:
        'should automatically add a fallback that matches the default value from the light theme stylesheet',
    },
  ],
});
