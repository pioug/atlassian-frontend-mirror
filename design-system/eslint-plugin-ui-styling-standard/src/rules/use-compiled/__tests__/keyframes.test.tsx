import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

const importSources = ['@emotion/core', '@emotion/react', 'styled-components'];

tester.run('keyframes API - fixable', rule, {
  valid: [],
  invalid: importSources.flatMap((importSource) => [
    {
      name: `[${importSource}] styles are a plain object with literal values`,
      code: `
        import { keyframes } from '${importSource}';

        const fadeIn = keyframes({
          from: {
            opacity: 0,
          },
          to: {
            opacity: 1,
          }
        });
      `,
      output: `
        import { keyframes } from '@compiled/react';

        const fadeIn = keyframes({
          from: {
            opacity: 0,
          },
          to: {
            opacity: 1,
          }
        });
      `,
      errors: [{ messageId: 'use-compiled' }],
      options: [{ canAutoFix: true }],
    },
  ]),
});

/**
 * These test cases have no auto-fix because we are considering
 * them unsafe to automatically convert.
 */
tester.run('keyframes API - not fixable', rule, {
  valid: [],
  invalid: importSources.flatMap((importSource) => [
    {
      name: `[${importSource}] function as style argument`,
      code: `
        import { keyframes } from '${importSource}';

        const Component = keyframes(() => ({
          from: {
            opacity: 0,
          },
          to: {
            opacity: 1,
          }
        }));
      `,
      errors: [{ messageId: 'use-compiled' }],
      options: [{ canAutoFix: true }],
    },
    {
      name: `[${importSource}] function as style object value`,
      code: `
        import { keyframes } from '${importSource}';

        const Component = keyframes({
          from: {
            opacity: () => 0,
          },
          to: {
            opacity: 1,
          }
        });
      `,
      errors: [{ messageId: 'use-compiled' }],
      options: [{ canAutoFix: true }],
    },
    {
      name: `[${importSource}] identifier as style object value`,
      code: `
        import { keyframes } from '${importSource}';

        const startOpacity = 0;
        const fadeIn = keyframes({
          from: {
            opacity: startOpacity,
          },
          to: {
            opacity: 1,
          }
        });
      `,
      errors: [{ messageId: 'use-compiled' }],
      options: [{ canAutoFix: true }],
    },
    {
      /**
       * We could auto-fix this safely but intentionally
       * keeping this rule very simple for now.
       */
      name: `[${importSource}] function call as style object value`,
      code: `
        import { keyframes } from '${importSource}';
        import { token } from '@atlaskit/tokens';

        const hideBackground = keyframes({
          from: {
            backgroundColor: token('color.background.neutral'),
          },
          to: {
            backgroundColor: 'transparent',
          }
        });
      `,
      errors: [{ messageId: 'use-compiled' }],
      options: [{ canAutoFix: true }],
    },
    {
      name: `[${importSource}] with unsupported named import`,
      code: `
        import { keyframes, type CSSObject } from '${importSource}';

        const fadeIn = keyframes({
          from: {
            opacity: 0,
          },
          to: {
            opacity: 1,
          }
        })
      `,
      errors: [{ messageId: 'use-compiled' }],
      options: [{ canAutoFix: true }],
    },
  ]),
});
