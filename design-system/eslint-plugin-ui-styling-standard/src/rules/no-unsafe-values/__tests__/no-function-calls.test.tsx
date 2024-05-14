import { typescriptEslintTester } from '../../__tests__/utils/_tester';
import rule from '../index';

typescriptEslintTester.run(
  'no-unsafe-values',
  // @ts-expect-error
  rule,
  {
    valid: [
      {
        name: 'whitelisted function call as value',
        code: `
          import { css } from '@compiled/react';
          import { token } from '@atlaskit/tokens';
          const styles = css({
            height: token('test'),
          });
        `,
        options: [
          {
            allowedFunctionCalls: [['@atlaskit/tokens', 'token']],
          },
        ],
      },
      {
        name: 'whitelisted function call as value (variant)',
        code: `
          import { css } from '@compiled/react';
          import { token } from '@atlaskit/tokens';
          const styles = css(() => ({
            height: token('test'),
          }));
        `,
        options: [
          {
            allowedFunctionCalls: [['@atlaskit/tokens', 'token']],
          },
        ],
      },
      {
        name: 'whitelisted function call in template literal in value',
        code: `
          import { css } from '@compiled/react';
          import { token } from '@atlaskit/tokens';
          const styles = css({
            height: \`\${token('test')}px\`,
          });
        `,
        options: [
          {
            allowedFunctionCalls: [['@atlaskit/tokens', 'token']],
          },
        ],
      },
      {
        name: 'multiple whitelisted functions',
        code: `
          import { css } from '@compiled/react';
          import { token } from '@atlaskit/tokens';
          // We are unlikely to ever do this but I couldn't think of a better example
          import { tokenNext } from '@atlaskit/tokens-next';

          const styles = css({
            height: token('test'),
            width: tokenNext('test')
          });
        `,
        options: [
          {
            allowedFunctionCalls: [
              ['@atlaskit/tokens', 'token'],
              ['@atlaskit/tokens-next', 'tokenNext'],
            ],
          },
        ],
      },
      {
        name: 'whitelisted functions with aliasing',
        code: `
          import { css } from '@compiled/react';
          import { token } from '@atlaskit/tokens';
          // We are unlikely to ever do this but I couldn't think of a better example
          import { token as tokenNext } from '@atlaskit/tokens-next';

          const styles = css({
            height: token('test'),
            width: tokenNext('test')
          });
        `,
        options: [
          {
            allowedFunctionCalls: [
              ['@atlaskit/tokens', 'token'],
              ['@atlaskit/tokens-next', 'token'],
            ],
          },
        ],
      },
      {
        name: 'identifier resolving to whitelisted function call',
        code: `
          import { css } from '@compiled/react';
          import { token } from '@atlaskit/tokens';

          const height = token('test');

          const styles = css({
            height
          });
        `,
        options: [
          {
            allowedFunctionCalls: [['@atlaskit/tokens', 'token']],
          },
        ],
      },
      {
        name: 'interpolation with identifier resolving to whitelisted function call',
        code: `
          import { css, keyframes } from '@compiled/react';

          const fadeIn = keyframes({
            '0%': {
              opacity: 0
            },
            '100%': {
              opacity: 1
            }
          });

          const styles = css({
            animation: \`\${fadeIn} 1s\`
          });
        `,
        options: [
          {
            allowedFunctionCalls: [['@compiled/react', 'keyframes']],
          },
        ],
      },
      {
        name: 'layers from @atlaskit/theme/constants',
        code: `
          import { css } from '@compiled/react';
          import { layers } from '@atlaskit/theme/constants';

          const layerStyles = css({
            zIndex: layers.modal(),
          });
        `,
      },
    ],
    invalid: [
      {
        name: 'function call as value',
        code: `
          import { css } from '@compiled/react';

          function myFunction() {
            return '5px';
          }

          const styles = css({
            height: myFunction(),
          });
        `,
        errors: [{ messageId: 'no-function-calls' }],
      },
      {
        name: 'function call in template literal in value',
        code: `
          import { css } from '@compiled/react';

          function myFunction() {
            return 5;
          }

          const styles = css({
            height: \`\${myFunction()}px\`,
          });
        `,
        errors: [{ messageId: 'no-function-calls' }],
      },
      {
        name: 'function call in variable as value',
        code: `
          import { css } from '@compiled/react';

          function runFunction() { return '5px'; }
          const myFunction = runFunction();

          const styles = css({
            height: myFunction,
          });
        `,
        errors: [{ messageId: 'no-function-calls' }],
      },
      {
        name: 'immediately-invoked function expression (IIFE) as value',
        code: `
          import { css } from '@compiled/react';

          const styles = css({
            height: (() => 'red')(),
          });
        `,
        errors: [{ messageId: 'no-function-calls' }],
      },
      {
        name: 'function call as value with same name as whitelisted function, but from wrong library',
        code: `
          import { css } from '@compiled/react';
          import { token } from 'wrong-library';

          const styles = css({
            height: token('test'),
          });
        `,
        options: [
          {
            allowedFunctionCalls: [['@atlaskit/tokens', 'token']],
          },
        ],
        errors: [{ messageId: 'no-function-calls' }],
      },
      {
        name: 'tagged template expression in value',
        code: `
          import { css } from '@compiled/react';

          const styles = css({
            height: someFunction\`color: blue\`,
          });
        `,
        errors: [{ messageId: 'no-function-calls' }],
      },
      {
        name: 'tagged template expression in variable',
        code: `
          import { css } from '@compiled/react';

          const height = someFunction\`color: blue\`

          const styles = css({
            height,
          });
        `,
        errors: [{ messageId: 'no-function-calls' }],
      },
      {
        name: 'tagged template expression even if it is an allowed function',
        code: `
          import { css } from '@compiled/react';
          import { someFunction } from 'my-package';

          const height = someFunction\`color: blue\`

          const styles = css({
            height,
          });
        `,
        errors: [{ messageId: 'no-function-calls' }],
        options: [{ allowedFunctionCalls: [['my-package', 'someFunction']] }],
      },
    ],
  },
);
