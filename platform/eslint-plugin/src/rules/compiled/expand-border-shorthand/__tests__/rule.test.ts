import { outdent } from 'outdent';

import { tester } from '../../../../__tests__/utils/_tester';
import { expandBorderShorthand } from '../index';

const valid_packages_calls_and_imports = [
	['css', 'css', '@atlaskit/css'],
	['css', 'css', '@compiled/react'],
	['styled', 'styled.div', '@compiled/react'],
	['cssMap', 'cssMap', '@atlaskit/css'],
	['cssMap', 'cssMap', '@compiled/react'],
];

const invalid_packages_calls_and_imports = [
	['css', '@atlaskit/primitives'],
	['css', '@emotion'],
	['css', 'styled-components'],
];

tester.run('expand-border-shorthand', expandBorderShorthand, {
	valid: [
		...invalid_packages_calls_and_imports.map(([pkg, imp]) => ({
			name: `incorrect packages (${pkg}, ${imp})`,
			code: outdent`
			import {${pkg}} from '${imp}';

			const styles = ${pkg}({
				border: '1px solid red',
			});
		`,
		})),
		{
			name: 'references correct package',
			code: outdent`
			import {css} from '@compiled/react';

			const styles = xcss({
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
	],
	invalid: [
		...valid_packages_calls_and_imports.map(([pkg, call, imp]) => ({
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

			const styles2 = css({
				border: \`1px solid \${token('red')}\`,
			})

			const styles3 = css({
				border: \`1px \${solid} red\`,
			})

			const styles4 = css({
				border: \`1px red\`,
			})

			const styles5 = css({
				border: \`1px\`,
			})

			const styles6 = css({
				border: \` \${token('red')}\`,
			})
		`,
			errors: Array.from(Array(6), () => ({ messageId: 'expandBorderShorthand' })),
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
	],
});
