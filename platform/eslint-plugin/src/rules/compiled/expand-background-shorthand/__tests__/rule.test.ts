import { outdent } from 'outdent';
import { tester } from '../../../../__tests__/utils/_tester';
import { expandBackgroundShorthand } from '../index';

const included_packages_calls_and_imports = [
	['css', 'css', '@atlaskit/css'],
	['css', 'css', '@compiled/react'],
	['styled', 'styled.div', '@compiled/react'],
];
const exempt_packages_calls_and_imports = [
	['css', '@atlaskit/primitives'],
	['css', '@emotion'],
	['css', 'styled-components'],
	['xcss', '@atlaskit/primitives'],
];
tester.run('expand-background-shorthand', expandBackgroundShorthand, {
	valid: [
		...exempt_packages_calls_and_imports.map(([pkg, imp]) => ({
			name: `do not have to handle non-Compiled packages (${pkg}, ${imp})`,
			code: outdent`
			import {${pkg}} from '${imp}';
			const styles = ${pkg}({
				background: token('color.background.accent.gray.subtlest')
			});
		`,
		})),
		{
			name: 'no background shorthand',
			code: outdent`
			import {css} from '@compiled/react';
			const styles = css({
				backgroundColor: token('color.background.neutral.hovered'),
			});
			const styles2 = css({
				backgroundColor: token('color.border', colors.N40),
			});
			const styles3 = css({
				backgroundColor: token('color.background.inverse.subtle', '#00000029'),
			});
			const styles4 = css({
				backgroundColor: token('color.background.brand.bold', 'lightblue'),
			});
			`,
		},
		// Other background shorthands that do not have token is out of scope for now
		{
			name: 'background shorthand without token',
			code: outdent`
			import {css} from '@compiled/react';
			const styles = css({
				background: 'transparent'
			});
			const styles2 = css({
				background: url('image.png')
			});
			const styles3 = css({
				background: 0
			});
			`,
		},
		// Usages of token within a template string are not used, so ESLint rule does not handle this case
		{
			name: 'background shorthand in a template literal as string text',
			code: outdent`
			import {css} from '@compiled/react';
			const styles = css({
				background: \`token('color.background.brand.bold', 'lightblue')\`,
			});
			`,
		},
		{
			name: 'background as key in cssMap call (cssMap, @compiled/react)',
			code: outdent`
			import { cssMap } from '@compiled/react';
			const colorMap = cssMap({
				background: {
					color: token('some.token')
				},
				foreground: {
					color: token('some.other.token')
				},
			});
			`,
		},
	],
	invalid: [
		...included_packages_calls_and_imports.map(([pkg, call, imp]) => ({
			name: `simple case (${call}, ${imp})`,
			code: outdent`
			import {${pkg}} from '${imp}';
			const styles = ${call}({
				background: token('color.background.accent.gray.subtlest'),
			});
			`,
			output: outdent`
			import {${pkg}} from '${imp}';
			const styles = ${call}({
				backgroundColor: token('color.background.accent.gray.subtlest'),
			});
            `,
			errors: [{ messageId: 'expandBackgroundShorthand' }],
		})),
		{
			name: `simple case (styled, @compiled/react)`,
			code: outdent`
			import { styled } from '@compiled/react';
			const Button = styled.div({
				paddingTop: '10px',
			});
			const StyledButton = styled(Button)({
				background: token('elevation.surface', colors.N0),
			});
			`,
			output: outdent`
			import { styled } from '@compiled/react';
			const Button = styled.div({
				paddingTop: '10px',
			});
			const StyledButton = styled(Button)({
				backgroundColor: token('elevation.surface', colors.N0),
			});
            `,
			errors: [{ messageId: 'expandBackgroundShorthand' }],
		},
		{
			name: `simple case (cssMap, @compiled/react)`,
			code: outdent`
			import { cssMap } from '@compiled/react';
			const backgroundMap = cssMap({
				firstBackground: { background: token('some.token') },
				secondBackground: { background: token('some.other.token') },
			});
			`,
			output: outdent`
			import { cssMap } from '@compiled/react';
			const backgroundMap = cssMap({
				firstBackground: { backgroundColor: token('some.token') },
				secondBackground: { backgroundColor: token('some.other.token') },
			});
            `,
			errors: Array.from(Array(2), () => ({ messageId: 'expandBackgroundShorthand' })),
		},
		{
			name: `compiled import with alias`,
			code: outdent`
			import { styled as styled2 } from '@compiled/react';
			const style = styled2.span({
				background: token('color.background.neutral.subtle', '#fff'),
			});
			`,
			output: outdent`
			import { styled as styled2 } from '@compiled/react';
			const style = styled2.span({
				backgroundColor: token('color.background.neutral.subtle', '#fff'),
			});
            `,
			errors: [{ messageId: 'expandBackgroundShorthand' }],
		},
	],
});
