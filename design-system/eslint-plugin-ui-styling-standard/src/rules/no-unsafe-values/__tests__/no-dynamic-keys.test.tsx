import { typescriptEslintTester } from '../../__tests__/utils/_tester';
import rule from '../index';

typescriptEslintTester.run(
  'no-unsafe-values',
  // @ts-expect-error
  rule,
  {
    valid: [
      {
        name: 'key is an identifier',
        code: `
          import { css } from '@compiled/react';

          const styles = css({
            color: 'blue',
          });
        `,
      },
      {
        name: 'key is a literal',
        code: `
          import { css } from '@compiled/react';

          const styles = css({
            'color': 'blue',
          });
        `,
      },
      {
        name: 'key is an allow listed value',
        code: `
          import { css } from '@compiled/react';
          import { media } from 'my-package';

          const styles = css({
            [media.above.xxs]: { height: '2px' }
          });
        `,
        options: [
          {
            allowedDynamicKeys: [['my-package', 'media']],
          },
        ],
      },
      {
        name: 'key is a simple, statically resolvable CSS var',
        code: `
          import { css } from '@compiled/react';

          const myVar = '--my-var';
          const styles = css({
            [myVar]: 'red'
          });
        `,
      },
      {
        name: 'key is on the default allow list',
        code: `
          import { css } from '@compiled/react';
          import { media } from '@atlaskit/primitives/responsive';

          const styles = css({
            [media.above.xxs]: { height: '2px' }
          });
        `,
        options: [
          {
            allowedDynamicKeys: [],
          },
        ],
      },
    ],
    invalid: [
      {
        name: 'key is a template literal',
        code: `
          import { css } from '@compiled/react';

          const something = 'selector';
          const styles = css({
            [\`\${something} > p\`]: {
              color: 'blue',
            },
          });
        `,
        errors: [{ messageId: 'no-dynamic-keys' }],
      },
      {
        name: 'nested key is a template literal',
        code: `
          import { css } from '@compiled/react';

          const something = 'selector';
          const styles = css({
            button: {
              p: {
                [\`\${something} > p\`]: {
                  color: 'blue',
                },
              },
            },
          });
        `,
        errors: [{ messageId: 'no-dynamic-keys' }],
      },
      {
        name: 'key is an identifier for a string literal',
        code: `
          import { css } from '@compiled/react';

          const something = 'selector';
          const styles = css({
            [something]: {
              color: 'blue',
            },
          });
        `,
        errors: [{ messageId: 'no-dynamic-keys' }],
      },
      {
        name: 'nested key is an identifier for a string literal',
        code: `
          import { css } from '@compiled/react';

          const something = 'selector';
          const styles = css({
            button: {
              p: {
                [something]: {
                  color: 'blue',
                },
              },
            },
          });
        `,
        errors: [{ messageId: 'no-dynamic-keys' }],
      },
      {
        name: 'key is a string literal inside square brackets',
        code: `
          import { css } from '@compiled/react';

          const styles = css({
            ['color']: 'blue',
          });
        `,
        errors: [{ messageId: 'no-dynamic-keys' }],
      },
      {
        name: 'key is a concatenation of string literals',
        code: `
          import { css } from '@compiled/react';

          const styles = css({
            ['col' + 'or']: 'blue',
          });
        `,
        errors: [{ messageId: 'no-dynamic-keys' }],
      },
      {
        name: 'nested key is a string literal inside square brackets',
        code: `
          import { css } from '@compiled/react';

          const styles = css({
            button: {
              p: {
                ['color']: 'blue',
              },
            },
          });
        `,
        errors: [{ messageId: 'no-dynamic-keys' }],
      },
      {
        name: 'key is an import from a non-allow-listed library',
        code: `
          import { css } from '@compiled/react';
          import { media } from 'my-package';

          const styles = css({
            [media.above.xxs]: { height: '2px' }
          });
        `,
        errors: [{ messageId: 'no-dynamic-keys' }],
        options: [
          {
            allowedDynamicKeys: [],
          },
        ],
      },
      {
        name: 'key is a non-allow-listed import from an allow-listed library',
        code: `
          import { css } from '@compiled/react';
          import { mediaNext as media } from 'my-package';

          const styles = css({
            [media.above.xxs]: { height: '2px' }
          });
        `,
        errors: [{ messageId: 'no-dynamic-keys' }],
        options: [
          {
            allowedDynamicKeys: [['my-package', 'media']],
          },
        ],
      },
      {
        name: 'key is from a nested entrypoint of an allow-listed library',
        code: `
          import { css } from '@compiled/react';
          import { media } from 'my-package/primitives/responsive';

          const styles = css({
            [media.above.xxs]: { height: '2px' }
          });
        `,
        errors: [{ messageId: 'no-dynamic-keys' }],
        options: [
          {
            allowedDynamicKeys: [['my-package/primitives', 'media']],
          },
        ],
      },
    ],
  },
);
