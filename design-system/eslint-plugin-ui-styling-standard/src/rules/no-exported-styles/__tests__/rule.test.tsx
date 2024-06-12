import { typescriptEslintTester } from '../../__tests__/utils/_tester';
import rule from '../index';

typescriptEslintTester.run(
	'no-exported-styles',
	// @ts-expect-error
	rule,
	{
		valid: [
			{
				name: 'Basic valid test for css',
				code: `
          import { css } from '@compiled/react';
          const styles = css({});
        `,
			},
			{
				name: 'Basic valid test for cssMap',
				code: `
          import { cssMap } from '@compiled/react';
          const styles = xcss({});
        `,
			},
			{
				name: 'Basic valid test for keyframes',
				code: `
          import { css } from '@compiled/react';
          const styles = css({});
        `,
			},
			{
				name: 'Basic valid test for styled',
				code: `
          import { styled } from '@compiled/react';
          const Component = styled.div({});
        `,
			},
			{
				name: 'Basic valid test for xcss',
				code: `
        import { css } from '@compiled/react';
        const styles = css({});
        `,
			},
			{
				name: 'Custom import sources (subtractive)',
				code: `
          import { css } from '@compiled/react';
          export const styles = css({});
        `,
				options: [
					{
						importSources: [],
					},
				],
			},
			{
				name: 'Exporting a div with css styles is ok',
				code: `
          import { css } from '@compiled/react';
          const styles = css({});
          export default () => (
            <div css={styles} />
          );
        `,
			},
		],
		invalid: [
			{
				name: 'Export of css',
				code: `
          import { css } from '@compiled/react';

          export const styles = css({});

          export default css({});
        `,
				errors: [{ messageId: 'no-exported-styles' }, { messageId: 'no-exported-styles' }],
			},
			{
				name: 'Export of css from emotion',
				code: `
          import { css } from '@emotion/react';

          export const styles = css(
            {
              display: 'flex',
              position: 'relative',
            },
            borderRadius,
          );
        `,
				errors: [{ messageId: 'no-exported-styles' }],
			},
			{
				name: 'Export of cssMap',
				code: `
          import { cssMap } from '@compiled/react';

          export const borderStyleMap = cssMap({
            none: { borderStyle: 'none' },
            solid: { borderStyle: 'solid' },
          });

          export default cssMap({});
        `,
				errors: [{ messageId: 'no-exported-styles' }, { messageId: 'no-exported-styles' }],
			},
			{
				name: 'Export of keyframes',
				code: `
          import { keyframes } from '@compiled/react';

          export const animation = keyframes({});

          export default keyframes({});
        `,
				errors: [{ messageId: 'no-exported-styles' }, { messageId: 'no-exported-styles' }],
			},
			{
				name: 'Exporting styled component',
				code: `
          import { styled } from '@compiled/react';

          export const Component = styled.div({});
        `,
				errors: [{ messageId: 'no-exported-styles' }],
			},
			{
				name: 'Exporting css styles',
				code: `
          import { css } from '@compiled/react';
          import { colors, getColor } from '@mui/theme';
          import { ff } from '@atlaskit/ff';

          import { buttonStyles, cssShared, colorKey } from '../shared';

          const sharedObject = { padding: 0 };

          export const styles = css({
            ...cssShared,
            ...sharedObject,
            [colorKey]: getColor('red'),
            background: colors['red'],
          });
        `,
				errors: [{ messageId: 'no-exported-styles' }],
			},
			{
				name: 'Export let css',
				code: `
          import { css } from '@compiled/react';

          export let styles = css({});
        `,
				errors: [{ messageId: 'no-exported-styles' }],
			},
			{
				name: 'Export style in object',
				code: `
          import { css } from '@compiled/react';

          const styles = css({});

          export { styles };
        `,
				errors: [{ messageId: 'no-exported-styles' }],
			},
			{
				name: 'Exporting nested style',
				code: `
          import { css } from '@compiled/react';

          const styles = {
            primary: css({}),
          };

          export { styles };
        `,
				errors: [{ messageId: 'no-exported-styles' }],
			},
			{
				name: 'Exporting styled components',
				code: `
          import styled from 'styled-components'

          export const PasswordInput = styled.input.attrs(props => ({
            type: "password"
          }))
        `,
				errors: [{ messageId: 'no-exported-styles' }],
			},
			{
				name: 'Exporting styled component with base component',
				code: `
          import styled from 'styled-components'

          const BaseComponent = styled.div({});
          export const Component = styled(BaseComponent)({});
        `,
				errors: [{ messageId: 'no-exported-styles' }],
			},
			{
				name: 'Exporting styled component from compiled',
				code: `
          import { styled as styled2 } from '@compiled/react'

          export const Component = styled2.div({
            margin: \`\${token('space.200', '16px')} 0\`,
          })
        `,
				errors: [{ messageId: 'no-exported-styles' }],
			},
		],
	},
);
