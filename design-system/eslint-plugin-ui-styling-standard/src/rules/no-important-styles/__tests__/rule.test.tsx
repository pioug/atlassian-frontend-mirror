import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-important-styles', rule, {
  valid: [
    `
      import { css } from '@compiled/react';

      const styles = css({
        color: 'red'
      });
    `,
    {
      // Custom import sources (subtractive)
      code: `
        import { css } from '@compiled/react';

        const styles = css({
          color: 'red !important'
        });
      `,
      options: [
        {
          importSources: [],
        },
      ],
    },
  ],
  invalid: [
    {
      // Basic test case
      code: `
        import { css } from '@compiled/react';

        const styles = css({
          color: 'red !important'
        });
      `,
      errors: [{ messageId: 'no-important-styles' }],
    },
    {
      // Whitespace handling
      code: `
        import { css } from '@compiled/react';

        const styles = css({
          color: 'red  !important  '
        });
      `,
      errors: [{ messageId: 'no-important-styles' }],
    },
    {
      // Nesting
      code: `
        import { css } from '@compiled/react';

        const styles = css({
          div: {
            padding: '8px',
            span: {
              padding: '8px',
              color: 'blue!important',
              margin: '8px'
            }
          }
        });
      `,
      errors: [{ messageId: 'no-important-styles' }],
    },
    {
      // styled API
      code: `
        import { styled } from '@compiled/react';

        const Component = styled.div({
          div: {
            padding: '8px',
            span: {
              padding: '8px',
              color: 'blue!important',
              margin: '8px'
            }
          }
        });
      `,
      errors: [{ messageId: 'no-important-styles' }],
    },
    {
      // keyframes API
      code: `
        import { keyframes } from '@compiled/react';

        const fadeOut = keyframes({
          from: {
            opacity: '1 !important',
          },
          to: {
            opacity: 0,
          },
        });
      `,
      errors: [{ messageId: 'no-important-styles' }],
    },
    {
      // cssMap API
      code: `
        import { cssMap } from '@compiled/react';

        const borderStyleMap = cssMap({
          none: { borderStyle: 'none !important' },
          solid: { borderStyle: 'solid' },
        });
      `,
      errors: [{ messageId: 'no-important-styles' }],
    },
    {
      // xcss API
      code: `
        import { xcss } from '@atlaskit/primitives';

        const styles = xcss({
          display: 'block !important'
        });
      `,
      errors: [{ messageId: 'no-important-styles' }],
    },
    {
      // Custom import sources (additive)
      code: `
        import { css } from 'custom-library';

        const styles = css({
          color: 'red !important'
        });
      `,
      errors: [{ messageId: 'no-important-styles' }],
      options: [{ importSources: ['custom-library'] }],
    },
  ],
});
