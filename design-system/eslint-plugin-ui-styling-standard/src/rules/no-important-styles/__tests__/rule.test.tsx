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
			name: 'ignores a shadowed style function',
			code: `
        import { css } from '@compiled/react';

        function makeStyles(css) {
          return css({ color: 'red !important' });
        }
			`,
		},
		{
			name: 'ignores important strings passed to runtime functions',
			code: `
        import { css } from '@compiled/react';

        css({ color: getColor('red !important') });
      `,
		},
		{
			name: 'custom import sources (subtractive)',
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
			name: 'arrow function style object',
			code: `
        import { css } from '@compiled/react';

        css(() => ({ color: 'red !important' }));
      `,
			errors: [{ messageId: 'no-important-styles' }],
		},
		{
			name: 'aliased import',
			code: `
        import { css as compiledCss } from '@compiled/react';

        compiledCss({ color: 'red !important' });
      `,
			errors: [{ messageId: 'no-important-styles' }],
		},
		{
			name: 'basic test case',
			code: `
        import { css } from '@compiled/react';

        const styles = css({
          color: 'red !important'
        });
      `,
			errors: [{ messageId: 'no-important-styles' }],
		},
		{
			name: 'whitespace handling',
			code: `
        import { css } from '@compiled/react';

        const styles = css({
          color: 'red  !important  '
        });
      `,
			errors: [{ messageId: 'no-important-styles' }],
		},
		{
			name: 'nesting',
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
			name: 'styled API',
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
			name: 'keyframes API',
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
			name: 'cssMap API',
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
			name: 'xcss API',
			code: `
        import { xcss } from '@atlaskit/primitives';

        const styles = xcss({
          display: 'block !important'
        });
      `,
			errors: [{ messageId: 'no-important-styles' }],
		},
		{
			name: 'custom import sources (additive)',
			code: `
        import { css } from 'custom-library';

        const styles = css({
          color: 'red !important'
        });
      `,
			errors: [{ messageId: 'no-important-styles' }],
			options: [{ importSources: ['custom-library'] }],
		},
		{
			name: 'template string',
			code: `
        import { css } from '@compiled/react';

        const color = 'red';

        const styles = css({
          color: \`\${color}!important\`
        });
      `,
			errors: [{ messageId: 'no-important-styles' }],
		},
		{
			name: 'uses default when options object is provided without importSources',
			code: `
        import { css } from '@compiled/react';

        const styles = css({
          color: 'red !important'
        });
      `,
			errors: [{ messageId: 'no-important-styles' }],
			options: [{}],
		},
	],
});
