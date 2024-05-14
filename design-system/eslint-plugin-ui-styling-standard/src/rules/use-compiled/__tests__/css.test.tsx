import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

const importSources = ['@emotion/core', '@emotion/react', 'styled-components'];

tester.run('css API - fixable', rule, {
  valid: [],
  invalid: importSources.flatMap((importSource) => [
    {
      name: `[${importSource}] styles are a plain object with literal values`,
      code: `
        import { css } from '${importSource}';

        const Component = css({
          color: 'red',
        });
      `,
      output: `
        import { css } from '@compiled/react';

        const Component = css({
          color: 'red',
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
tester.run('css API - not fixable', rule, {
  valid: [],
  invalid: importSources.flatMap((importSource) => [
    {
      name: `[${importSource}] function as style argument`,
      code: `
        import { css } from '${importSource}';

        const Component = css(() => ({
          color: 'red',
        }));
      `,
      errors: [{ messageId: 'use-compiled' }],
      options: [{ canAutoFix: true }],
    },
    {
      name: `[${importSource}] function as style object value`,
      code: `
        import { css } from '${importSource}';

        const Component = css({
          color: () => 'red',
        });
      `,
      errors: [{ messageId: 'use-compiled' }],
      options: [{ canAutoFix: true }],
    },
    {
      name: `[${importSource}] identifier as style object value`,
      code: `
        import { css } from '${importSource}';

        const textColor = 'red';
        const Component = css({
          color: textColor,
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
        import { css } from '${importSource}';
        import { token } from '@atlaskit/tokens';

        const Component = css({
          color: token('color.text'),
        });
      `,
      errors: [{ messageId: 'use-compiled' }],
      options: [{ canAutoFix: true }],
    },
    {
      name: `[${importSource}] with unsupported named import`,
      code: `
        import { css, type CSSObject } from '${importSource}';

        const Component = css({
          color: 'red',
        });
      `,
      errors: [{ messageId: 'use-compiled' }],
      options: [{ canAutoFix: true }],
    },
    {
      name: `[${importSource}] with unsafe usage of other import`,
      code: `
        import { css, keyframes } from '${importSource}';

        const Component = css({
          color: 'red',
        });

        const animation = keyframes({
          from: {
            opacity: () => 0
          },
          to: {
            opacity: 1
          }
        })
      `,
      errors: [{ messageId: 'use-compiled' }],
      options: [{ canAutoFix: true }],
    },
  ]),
});
