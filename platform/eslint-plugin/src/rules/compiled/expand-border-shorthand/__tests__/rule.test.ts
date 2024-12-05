import { outdent } from 'outdent';

import { tester } from '../../../../__tests__/utils/_tester';
import { expandBorderShorthand } from '../index';

const included_packages_calls_and_imports = [
	['css', 'css', '@atlaskit/css'],
	['css', 'css', '@compiled/react'],
	['styled', 'styled.div', '@compiled/react'],
];

const exempt_packages_calls_and_imports = [
	['css', '@atlaskit/primitives'],
	['css', '@emotion'],
	['css', 'styled-components'],
];

tester.run('expand-border-shorthand', expandBorderShorthand, {
	valid: [
		...exempt_packages_calls_and_imports.map(([pkg, imp]) => ({
			name: `handle only Compiled APIs (${pkg}, ${imp})`,
			code: outdent`
			import {${pkg}} from '${imp}';

			const styles = ${pkg}({
				border: '1px solid red',
			});
		`,
		})),
		{
			name: 'CallExpression matches with imported API',
			code: outdent`
			import { styled } from 'styled-components';
			import { styled as styled2, css as compiledCSS, jsx } from '@compiled/react';

			const styles = xcss({
				border: '1px solid red',
			});

			const styles2 = styled.div({
				border: '1px solid red',
			});
		`,
		},
		{
			name: 'excluded values',
			code: outdent`
			import {css} from '@compiled/react';

			const styles = css({
				border: 'none',
			});
			const styles2 = css({
				border: '0',
			});
			const styles3 = css({
				border: 'unset',
			});
			const styles4 = css({
				border: 'none !important',
			});
			const styles5 = css({
				border: \`none\`,
			});
			const styles6 = css({
				border: \`0\`,
			});
			const styles7 = css({
				border: \`unset\`,
			});
			const styles8 = css({
				border: \`none !important\`,
			});
			const styles9 = css({
				border: 0,
			});
			const styles10 = css({
				border: 'var(--icon-border)',
			});
			const styles11 = css({
				border: \`\${(props: { border?: boolean }) =>
					props.border ? \`1px solid \${token('color.border.disabled', colors.N30)}\` : 'none'}\`,
			});
			const styles12 = css({
				border: (props: { border?: boolean }) =>
					props.border ? token('color.border.disabled', colors.N30) : 'none',
			});
		`,
		},
		{
			name: 'not using border shorthand',
			code: outdent`
			import {css} from '@compiled/react';

			const styles = css({
				borderTop: '2px solid green',
				borderRight: '3px dashed orange',
				borderBottom: '4px double purple',
				borderLeft: '5px groove teal',
			});
			const styles2 = css({
				borderWidth: '1px',
				borderStyle: 'solid',
				borderColor: 'black',
			});
		`,
		},
		{
			name: 'cssMap case where border is assigned an ObjectExpression',
			code: outdent`
			import { cssMap } from '@compiled/react';

			const borderStyleMap = cssMap({
				none: { borderStyle: 'none' },
				border: { borderStyle: 'solid' },
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
				border: '1px solid red',
			});
			const styles2 = ${call}({
				border: '1px solid',
			});
			const styles3 = ${call}({
				border: '1px',
			});
			`,
			errors: Array.from(Array(3), () => ({ messageId: 'expandBorderShorthand' })),
		})),
		{
			name: 'nested ObjectExpression',
			code: outdent`
			import {css} from '@compiled/react';
			const styles = {
				inverse: css({
					border: '1px solid red',
				}),
			};
		`,
			errors: [{ messageId: 'expandBorderShorthand' }],
		},
		{
			name: 'pseudo selector',
			code: outdent`
			import {css} from '@compiled/react';
			const styles = css({
				'&:hover': {
					border: '1px solid red',
					'&:hover': {
						border: '1px solid red',
					},
				},
				border: '1px solid red',
			})
		`,
			errors: Array.from(Array(3), () => ({ messageId: 'expandBorderShorthand' })),
		},
		{
			name: 'template string',
			code: outdent`
			import {css} from '@compiled/react';

			const styles = css({
				border: \`1px solid red\`,
			})

			const styles4 = css({
				border: \`1px red\`,
			})

			const styles5 = css({
				border: \`1px\`,
			})
		`,
			errors: Array.from(Array(3), () => ({ messageId: 'expandBorderShorthand' })),
		},
		{
			name: 'tokens',
			code: outdent`
			import {css} from '@compiled/react';
			const styles = css({
				border: token('color.border'),
			})
			const styles2 = css({
				border: token('space.025', '2px'),
			})
		`,
			errors: Array.from(Array(2), () => ({ messageId: 'expandBorderShorthand' })),
		},
		{
			name: 'cssMap case where border is assigned an a Literal',
			code: outdent`
			import { cssMap } from '@compiled/react';

			const borderStyleMap = cssMap({
				none: { border: 'none' },
				solid: { border: '1px solid blue' },
			});
			`,
			errors: [{ messageId: 'expandBorderShorthand' }],
		},
	],
});
