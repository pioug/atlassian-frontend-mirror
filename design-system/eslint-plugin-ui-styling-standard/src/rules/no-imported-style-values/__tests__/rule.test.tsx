import { typescriptEslintTester } from '../../__tests__/utils/_tester';
import rule from '../index';

typescriptEslintTester.run(
	'no-imported-style-values',
	// @ts-expect-error
	rule,
	{
		valid: [
			{
				name: 'Basic valid test for css',
				code: `
          import { css } from '@compiled/react';
          const sharedObject = { padding: 0 };
          const styles = css({
            ...sharedObject,
            color: 'red',
          });
        `,
			},
			{
				name: 'Valid emotion css call',
				code: `
          import { css } from '@emotion/react';
          import { CURRENT_SURFACE_CSS_VAR, token } from '@atlaskit/tokens';
          const styles = css({
            backgroundColor: token('elevation.surface.overlay', N0),
            borderRadius: token('border.radius', '3px'),
            [CURRENT_SURFACE_CSS_VAR]: token('elevation.surface.overlay', N0),
          });
        `,
			},
			{
				name: 'Valid styled component',
				code: `
          import { styled } from '@compiled/react';
          import { token } from '@atlaskit/tokens';
          const Component = styled.div({
            borderRadius: token('border.radius', '3px')
          })
        `,
			},
			{
				name: 'Variables defined in same file',
				code: `
          import { css } from '@compiled/react';
          const color = 'red',
          const containerWidth = 0;
          const styles = css({
            color,
            width: containerWidth
          });
        `,
			},
			{
				name: 'Importing token function',
				code: `
          import { css } from '@compiled/react';
          import { token } from '@atlaskit/tokens';
          const styles = css({
            padding: token('space.150'),
          });
        `,
			},
			{
				name: 'Valid cssMap call',
				code: `
          import { cssMap } from '@compiled/react';
          import { token } from '@atlaskit/tokens';
          const styles = cssMap({
            root: {
              width: '16rem',
            },
            blackBorder: {
              border: '1px solid black',
              borderRadius: token('border.radius.100', '3px'),
            },
          });
        `,
			},
			{
				name: 'Custom import sources (subtractive)',
				code: `
          import { css } from '@compiled/react';
          import { color } from '../shared'
          const styles = css({
            color
          });
        `,
				options: [
					{
						importSources: [],
					},
				],
			},
			{
				name: 'Custom allowed function',
				code: `
          import { css } from '@compiled/react';
          import { getColor } from 'my-package'
          const styles = css({
            color: getColor()
          });
        `,
				options: [
					{
						allowedFunctionCalls: [['my-package', 'getColor']],
					},
				],
			},
			{
				name: 'Custom allowed dynamic key',
				code: `
          import { css } from '@compiled/react';
          import { colorKey } from 'my-package';
          const styles = css({
            [colorKey]: 'red',
          });
        `,
				options: [
					{
						allowedDynamicKeys: [['my-package', 'colorKey']],
					},
				],
			},
			{
				name: 'Ignores type casts',
				code: `
					import type { CSSProperties } from 'react';
          import { css } from '@compiled/react';

					const Component = () => (
						<div
							style={
								{
									'--my-var': 'red',
								} as CSSProperties
							}
						/>
					);
        `,
				options: [],
			},
			{
				name: 'Imported value in LHS of conditional expression in css prop',
				code: `
					import { css } from '@compiled/react';
					import { ff } from '@atlassian/jira-feature-flagging';
					import { IS_FF_ENABLED } from '../shared';

					const baseStyles = css({ margin: 0 });
					const styles = css({ color: token('color.text') });
					const stylesFF = css({ color: token('color.text.danger') });

					const Component = () => (
						<>
							<div css={IS_FF_ENABLED ? stylesFF : styles} />
							<div css={[baseStyles, IS_FF_ENABLED ? stylesFF : styles]} />
							<div css={ff('my-feature-flag') ? stylesFF : styles} />
							<div css={[baseStyles, ff('my-feature-flag') ? stylesFF : styles]} />
						</>
					);
				`,
			},
			{
				name: 'Imported value as entire LHS of logical expression in css prop',
				code: `
					import { css } from '@compiled/react';
					import { ff } from '@atlassian/jira-feature-flagging';
					import { IS_FF_ENABLED } from '../shared';

					const baseStyles = css({ margin: 0 });
					const stylesFF = css({ color: token('color.text.danger') });

					const Component = () => (
						<>
							<div css={IS_FF_ENABLED && stylesFF} />
							<div css={[baseStyles, IS_FF_ENABLED && stylesFF]} />
							<div css={ff('my-feature-flag') && stylesFF} />
							<div css={[baseStyles, ff('my-feature-flag') && stylesFF]} />
						</>
					);
				`,
			},
			{
				name: 'Imported value in LHS of conditional expression in style prop',
				code: `
					import { css } from '@compiled/react';
					import { ff } from '@atlassian/jira-feature-flagging';
					import { IS_FF_ENABLED } from '../shared';

					const Component = (props: { width: number }) => (
						<>
							<div style={{ width: IS_FF_ENABLED ? Math.abs(width) : width }} />
							<div style={{ width: ff('my-feature-flag') ? Math.abs(width) : width }} />
						</>
					);
				`,
			},
			{
				name: 'Non-computed member access that collides with imported name',
				code: `
					import { abs } from '../shared';

					const Component = (props: { width: number }) => (
						<div style={{ width: Math.abs(width) }} />
					);
				`,
			},
			{
				name: 'Non-computed property key that collides with imported name',
				code: `
					import { css } from '@compiled/react';
					import { color } from '../shared';

					const styles = css({
						color: token('color.text'),
					});

					const Component = (props: { color: string }) => (
						<div
							css={styles}
							style={{ color: props.color }}
						/>
					);
				`,
			},
		],
		invalid: [
			{
				name: 'Importing spreadElement',
				code: `
          import { css } from '@compiled/react';
          import { importedStyles } from '../shared';
          const styles = css({
            ...importedStyles,
            color: 'red',
          });
        `,
				errors: [{ messageId: 'no-imported-style-values' }],
			},
			{
				name: 'Importing functions to use within css',
				code: `
          import { css } from '@compiled/react';
          import { getColor } from '@mui/theme';
          import { colorKey } from '../shared';
          const styles = css({
            [colorKey]: getColor('red'),
          });
        `,
				errors: [
					{ messageId: 'no-imported-style-values' },
					{ messageId: 'no-imported-style-values' },
				],
			},
			{
				name: 'Importing objects to use within css',
				code: `
          import { css } from '@compiled/react';
          import { colors } from '@mui/theme';
          const styles = css({
            background: colors['red'],
          });
        `,
				errors: [{ messageId: 'no-imported-style-values' }],
			},
			{
				name: 'Importing variables to use within template literal',
				code: `
          import { css } from '@compiled/react';
          import { HEIGHT } from '../shared';
          const styles = css({
            height: \`\${HEIGHT}px\`,
          });
        `,
				errors: [{ messageId: 'no-imported-style-values' }],
			},
			{
				name: 'Importing variables to within conditional expression',
				code: `
          import { css } from '@compiled/react';
          import { ff } from '@atlaskit/ff';
          import { HEIGHT } from '../shared';
          const styles = css({
            width: ff('…') ? \`\${HEIGHT}px\` : undefined,
          });
        `,
				errors: [
					{ messageId: 'no-imported-style-values' },
					{ messageId: 'no-imported-style-values' },
				],
			},
			{
				name: 'Invalid styled component',
				code: `
          import { styled } from '@compiled/react';
          import { HEIGHT, importedStyles, getWidth } from '../shared';

          const randomVar = 10;

          const Component = styled.div({
            ...importedStyles,
            height: \`\${HEIGHT}px\`,
            width: getWidth(10),
          });
        `,
				errors: [
					{ messageId: 'no-imported-style-values' },
					{ messageId: 'no-imported-style-values' },
					{ messageId: 'no-imported-style-values' },
				],
			},
			{
				name: 'Invalid cssMap call',
				code: `
          import { cssMap } from '@compiled/react';
          import { textColor, bgColor } from '../shared';

          const styles = cssMap({
            text: { color: textColor },
            bg: { background: bgColor },
          });
        `,
				errors: [
					{ messageId: 'no-imported-style-values' },
					{ messageId: 'no-imported-style-values' },
				],
			},
			{
				name: 'Invalid style composition in css prop',
				code: `
          import { css } from '@compiled/react';
          import { buttonStyles } from '../shared';

          const styles = css({
            color: 'red',
          });

          export default () => <div css={[styles, buttonStyles]} />;
        `,
				errors: [{ messageId: 'no-imported-style-values' }],
			},
			{
				name: 'Importing value within style prop',
				code: `
          import { importedWidth } from '../shared';

          export default () => <div style={{ width: importedWidth }} />;
        `,
				errors: [{ messageId: 'no-imported-style-values' }],
			},
			{
				name: 'Importing member expression',
				code: `
          import { hello } from 'package';
          import { css } from '@compiled/react';

          const styles = css({
            color: hello.world,
          });
        `,
				errors: [{ messageId: 'no-imported-style-values' }],
			},
			{
				name: 'Imported value in LHS of conditional expression in style declaration',
				code: `
					import { css } from '@compiled/react';
					import { ff } from '@atlassian/jira-feature-flagging';
					import { IS_FF_ENABLED } from '../shared';

					const stylesA = css({
						color: IS_FF_ENABLED ? token('color.text.danger'): token('color.text'),
					});

					const stylesB = css({
						color: ff('my-feature-flag') ? token('color.text.danger') : token('color.text'),
					});
				`,
				errors: [
					{ messageId: 'no-imported-style-values', line: 7 },
					{ messageId: 'no-imported-style-values', line: 11 },
				],
			},
			{
				name: 'Imported value in RHS of conditional expression in css prop',
				code: `
					import { css } from '@compiled/react';
					import { ff } from '@atlassian/jira-feature-flagging';
					import { IS_FF_ENABLED, stylesFF } from '../shared';

					const baseStyles = css({ margin: 0 });
					const styles = css({ color: token('color.text' )});

					const Component = () => (
						<>
							<div css={IS_FF_ENABLED ? stylesFF : styles} />
							<div css={[baseStyles, IS_FF_ENABLED ? stylesFF : styles]} />
							<div css={ff('my-feature-flag') ? stylesFF : styles} />
							<div css={[baseStyles, ff('my-feature-flag') ? stylesFF : styles]} />
						</>
					);
				`,
				errors: [
					{ messageId: 'no-imported-style-values', line: 11 },
					{ messageId: 'no-imported-style-values', line: 12 },
					{ messageId: 'no-imported-style-values', line: 13 },
					{ messageId: 'no-imported-style-values', line: 14 },
				],
			},
			{
				name: 'Imported value in RHS of logical expression in css prop',
				code: `
					import { css } from '@compiled/react';
					import { ff } from '@atlassian/jira-feature-flagging';
					import { IS_FF_ENABLED, stylesFF } from '../shared';

					const baseStyles = css({ margin: 0 });
					const styles = css({ color: token('color.text' )});

					const Component = () => (
						<>
							<div css={IS_FF_ENABLED && stylesFF} />
							<div css={[baseStyles, IS_FF_ENABLED && stylesFF]} />
							<div css={ff('my-feature-flag') && stylesFF} />
							<div css={[baseStyles, ff('my-feature-flag') && stylesFF]} />
						</>
					);
				`,
				errors: [
					{ messageId: 'no-imported-style-values', line: 11 },
					{ messageId: 'no-imported-style-values', line: 12 },
					{ messageId: 'no-imported-style-values', line: 13 },
					{ messageId: 'no-imported-style-values', line: 14 },
				],
			},
			{
				name: 'Imported value in RHS of conditional expression in style prop',
				code: `
					import { css } from '@compiled/react';
					import { ff } from '@atlassian/jira-feature-flagging';
					import { IS_FF_ENABLED, abs } from '../shared';

					const Component = (props: { width: number }) => (
						<>
							<div style={{ width: IS_FF_ENABLED ? abs(width) : width }} />
							<div style={{ width: ff('my-feature-flag') ? abs(width) : width }} />
						</>
					);
				`,
				errors: [
					{ messageId: 'no-imported-style-values', line: 8 },
					{ messageId: 'no-imported-style-values', line: 9 },
				],
			},
			{
				name: 'Computed member access with imported name',
				code: `
					import { abs } from '../shared';

					const Component = (props: { width: number }) => (
						<div style={{ width: Math[abs](width) }} />
					);
				`,
				errors: [{ messageId: 'no-imported-style-values' }],
			},
			{
				name: 'Computed property key with imported name',
				code: `
					import { css } from '@compiled/react';
					import { color } from '../shared';

					const styles = css({
						[color]: token('color.text'),
					});

					const Component = (props: { color: string }) => (
						<div
							css={styles}
							style={{ [color]: props.color }}
						/>
					);
				`,
				errors: [
					{ messageId: 'no-imported-style-values' },
					{ messageId: 'no-imported-style-values' },
				],
			},
		],
	},
);
