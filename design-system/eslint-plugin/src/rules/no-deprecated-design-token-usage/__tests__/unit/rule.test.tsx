import renameMapping from '@atlaskit/tokens/rename-mapping';

import { tester } from '../../../__tests__/utils/_tester';
import rule from '../../index';

// Mock rename mapping in case it changes
jest.mock('@atlaskit/tokens/rename-mapping', () => ({
  __esModule: true,
  default: [
    {
      path: 'tokenName.old',
      state: 'deprecated',
      replacement: 'tokenName.new',
    },
    {
      path: 'testing.no.replacement',
      state: 'deprecated',
    },
    {
      path: 'tokenName.test.defaults',
      state: 'deprecated',
      replacement: 'tokenName.foo.[default]',
    },
    {
      path: 'tokenName.test.middle.defaults',
      state: 'deprecated',
      replacement: 'tokenName.[default].foo',
    },
    {
      path: 'tokenName.deleted',
      state: 'deleted',
      replacement: 'tokenName.oh.no',
    },
    {
      path: 'tokenName.color.[default]',
      state: 'deprecated',
      replacement: 'tokenName.color.foo',
    },
    {
      path: 'tokenName.active',
      state: 'active',
    },
  ],
}));

const oldTokenName = renameMapping[0].path;
const newTokenName = renameMapping[0].replacement;

tester.run('no-deprecated-design-token-usage', rule, {
  valid: [
    { code: `token('tokenName.new')` },
    { code: `token('color.text')` },
    { code: `token('color.text', N800)` },
    { code: `css({ color: token('color.text') });` },
    { code: `css\`color: token('color.text')\`;` },
    // Deleted tokens should not error
    { code: `token('tokenName.deleted')` },
    // Active tokens should not error
    { code: `token('tokenName.active')` },
  ],
  invalid: [
    {
      code: `token('${oldTokenName}');`,
      output: `token('${newTokenName}');`,
      errors: [{ messageId: 'tokenRenamed' }],
    },
    // Warnings are triggered for deprecated tokens with no replacement
    {
      code: `token('testing.no.replacement');`,
      errors: [{ messageId: 'tokenDeprecated' }],
    },
    // Ensures that [defaults] are correctly omitted in user-facing messages
    {
      code: `token('tokenName.test.defaults');`,
      output: `token('tokenName.foo');`,
      errors: [
        {
          message:
            'The token "tokenName.test.defaults" is deprecated in favour of "tokenName.foo".',
        },
      ],
    },
    // Ensures that [defaults] are correctly omitted from the middle of a token name in user-facing messages
    {
      code: `token('tokenName.test.middle.defaults');`,
      output: `token('tokenName.foo');`,
      errors: [
        {
          message:
            'The token "tokenName.test.middle.defaults" is deprecated in favour of "tokenName.foo".',
        },
      ],
    },
    {
      code: `token('${oldTokenName}', N800);`,
      output: `token('${newTokenName}', N800);`,
      errors: [{ messageId: 'tokenRenamed' }],
    },
    {
      code: `css\` color: \${token('${oldTokenName}')}; \``,
      output: `css\` color: \${token('${newTokenName}')}; \``,
      errors: [{ messageId: 'tokenRenamed' }],
    },
    {
      code: `css({ color: token('${oldTokenName}', N800) });`,
      output: `css({ color: token('${newTokenName}', N800) });`,
      errors: [{ messageId: 'tokenRenamed' }],
    },
    {
      code: `css({ color: token('${oldTokenName}', fallback) })`,
      output: `css({ color: token('${newTokenName}', fallback) })`,
      errors: [{ messageId: 'tokenRenamed' }],
    },
    {
      code: `css({ color: token('${oldTokenName}', getColor()) })`,
      output: `css({ color: token('${newTokenName}', getColor()) })`,
      errors: [{ messageId: 'tokenRenamed' }],
    },
    {
      code: `css({ color: token('${oldTokenName}', 'blue') })`,
      output: `css({ color: token('${newTokenName}', 'blue') })`,
      errors: [{ messageId: 'tokenRenamed' }],
    },
    // Ensures that [default] is correctly omitted from token names
    {
      code: `token('tokenName.color');`,
      output: `token('tokenName.color.foo');`,
      errors: [
        {
          message:
            'The token "tokenName.color" is deprecated in favour of "tokenName.color.foo".',
        },
      ],
    },
  ],
});
