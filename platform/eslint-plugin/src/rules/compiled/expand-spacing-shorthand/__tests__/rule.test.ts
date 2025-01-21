import { outdent } from 'outdent';
import { tester } from '../../../../__tests__/utils/_tester';
import { expandSpacingShorthand } from '../index';

const included_compiled_libraries = ['@compiled/react', '@atlaskit/css'];
const exempt_libraries = ['@emotion/react', 'styled-components'];

const validTestCases = (property: string) => {
	return [
		...exempt_libraries.map((imp) => ({
			name: `${property}: do not have to handle non-compiled packages (${imp})`,
			code: outdent`
			import {css} from '${imp}';
			import {xcss} from '@atlaskit/primitives';

			const styles = css({
				${property}: token('space.200'),
			});
			const styles2 = xcss({
				${property}: token('space.200'),
			});
		`,
		})),
		{
			name: `${property}: no spacing shorthand`,
			code: outdent`
			import {css} from '@compiled/react';
			const styles = css({
				${property}Top: token('space.200'),
				${property}Bottom: token('space.200'),
				${property}Left: token('space.200'),
				${property}Right: token('space.200'),
			});
			`,
		},
		{
			name: `${property}: do not have to handle plain string values`,
			code: outdent`
			import {css} from '@compiled/react';
			const styles = css({
				${property}: '0 auto',
			});
			`,
		},
		{
			name: `${property}: do not handle dynamic style`,
			code: outdent`
			import {css} from '@compiled/react';
			const styles = css({
				${property}: ({ isCompact }) => \`\${isCompact ? token('space.050', '4px') : token('space.075', '6px')}\`
			});
			`,
		},
		{
			name: `${property}: do not handle calc(...) as value`,
			code: outdent`
			import {css} from '@compiled/react';
			const styles = css({
				${property}: \`calc(var(--preview-block-width) + \${token('space.200', '16px')})\`,
			});
			`,
		},
		{
			name: `${property}: do not handle template literal if no token(...) in the expressions`,
			code: outdent`
			import {css} from '@compiled/react';
			const styles = css({
				${property}: \`0px 2\`,
			});
			`,
		},
		{
			name: `${property}: do not handle where value is a function call which is not a token`,
			code: outdent`
			import { css } from '@compiled/react';
			import { functionCall } from 'somewhere';
			const styles = css({
				${property}: functionCall(),
			});
			`,
		},
	];
};

const invalidTestCases = (property: string) => {
	return [
		// Value of spacing property is plain token() call
		...included_compiled_libraries.map((imp) => ({
			name: `expand ${property} with value as token: (${imp})`,
			code: outdent`
			import {css} from '${imp}';
			const styles = css({
				${property}: token('space.200'),
			});
			`,
			output: outdent`
			import {css} from '${imp}';
			const styles = css({
				${property}Top: token('space.200'),
				${property}Right: token('space.200'),
				${property}Bottom: token('space.200'),
				${property}Left: token('space.200'),
			});
			`,
			errors: [{ messageId: 'expandSpacingShorthand' }],
		})),
		// Value of spacing property is a template string
		...included_compiled_libraries.map((imp) => ({
			name: `${property}: template string case (one value) (${imp})`,
			code: outdent`
			import {css} from '${imp}';
			const styles = css({
				${property}: \`\${token('space.200')}\`,
			});
			`,
			output: outdent`
			import {css} from '${imp}';
			const styles = css({
				${property}Top: token('space.200'),
				${property}Right: token('space.200'),
				${property}Bottom: token('space.200'),
				${property}Left: token('space.200'),
			});
			`,
			errors: [{ messageId: 'expandSpacingShorthand' }],
		})),
		...included_compiled_libraries.map((imp) => ({
			name: `${property}: template string case (two values) (${imp})`,
			code: outdent`
			import {css} from '${imp}';
			const styles = css({
				${property}: \`\${token('space.100')} 0\`,
			});
			`,
			output: outdent`
			import {css} from '${imp}';
			const styles = css({
				${property}Top: token('space.100'),
				${property}Right: 0,
				${property}Bottom: token('space.100'),
				${property}Left: 0,
			});
			`,
			errors: [{ messageId: 'expandSpacingShorthand' }],
		})),
		...included_compiled_libraries.map((imp) => ({
			name: `${property}: template string case (three values) (${imp})`,
			code: outdent`
			import {css} from '${imp}';
			const styles = css({
				${property}: \`\${token('space.100')} 0 2px\`,
			});
			`,
			output: outdent`
			import {css} from '${imp}';
			const styles = css({
				${property}Top: token('space.100'),
				${property}Right: 0,
				${property}Bottom: '2px',
				${property}Left: 0,
			});
			`,
			errors: [{ messageId: 'expandSpacingShorthand' }],
		})),
		...included_compiled_libraries.map((imp) => ({
			name: `${property}: template string case (four values) (${imp})`,
			code: outdent`
			import {css} from '${imp}';
			const styles = css({
				${property}: \`\${token('space.100')} 0 0px 12px\`,
			});
			const styles2 = css({
				${property}: \`\${token('space.100')} \${token('space.200')} \${token('space.300')} \${token('space.400')}\`,
			});
			`,
			output: outdent`
			import {css} from '${imp}';
			const styles = css({
				${property}Top: token('space.100'),
				${property}Right: 0,
				${property}Bottom: '0px',
				${property}Left: '12px',
			});
			const styles2 = css({
				${property}Top: token('space.100'),
				${property}Right: token('space.200'),
				${property}Bottom: token('space.300'),
				${property}Left: token('space.400'),
			});
			`,
			errors: Array.from(Array(2), () => ({ messageId: 'expandSpacingShorthand' })),
		})),
		{
			name: `${property}: compiled import (styled.div, @compiled/react)`,
			code: outdent`
			import { styled } from '@compiled/react';
			const styledDiv = styled.div({
				${property}: \`0 \${token('space.100', '8px')} 0 0\`,
			});
			`,
			output: outdent`
			import { styled } from '@compiled/react';
			const styledDiv = styled.div({
				${property}Top: 0,
				${property}Right: token('space.100', '8px'),
				${property}Bottom: 0,
				${property}Left: 0,
			});
			`,
			errors: [{ messageId: 'expandSpacingShorthand' }],
		},
		{
			name: `${property}: compiled import (cssMap, @compiled/react)`,
			code: outdent`
			import { cssMap } from '@compiled/react';
			const backgroundMap = cssMap({
				firstDiv: { ${property}: token('space.100') },
				secondDiv: { ${property}: token('space.100') },
			});
			`,
			output: outdent`
			import { cssMap } from '@compiled/react';
			const backgroundMap = cssMap({
				firstDiv: { ${property}Top: token('space.100'),
				${property}Right: token('space.100'),
				${property}Bottom: token('space.100'),
				${property}Left: token('space.100') },
				secondDiv: { ${property}Top: token('space.100'),
				${property}Right: token('space.100'),
				${property}Bottom: token('space.100'),
				${property}Left: token('space.100') },
			});
			`,
			errors: Array.from(Array(2), () => ({ messageId: 'expandSpacingShorthand' })),
		},
		{
			name: `${property}: compiled import with alias`,
			code: outdent`
			import { styled as styled2 } from '@compiled/react';
			const style = styled2.span({
				${property}: \`0 \${token('space.100', '8px')} 0 0\`,
			});
			`,
			output: outdent`
			import { styled as styled2 } from '@compiled/react';
			const style = styled2.span({
				${property}Top: 0,
				${property}Right: token('space.100', '8px'),
				${property}Bottom: 0,
				${property}Left: 0,
			});
			`,
			errors: [{ messageId: 'expandSpacingShorthand' }],
		},
		// Template literal containing expressions that is not token should only throw error with no autofix
		{
			name: `${property}: property value template string where it contains an expression that is not a token`,
			code: outdent`
			import {css} from '@compiled/react';
			const styles = css({
				${property}: \`\${token('space.100', '8px')} \${gridSize * 2}px\`,
			});
			const styles2 = css({
				padding: \`\${DROPDOWN_HEADER_VERTICAL_PADDING} \${token('space.075','6px')} 
					\${DROPDOWN_HEADER_VERTICAL_PADDING} \${token('space.200', '16px')}\`,
			});
			const styles3 = css({
				${property}: \`\${token('space.050', '4px')} \${token('space.150', '12px')} \${token('space.150', '12px')} 
					\${({ isSummaryView }: EditFormContentWrapperProps) =>
					isSummaryView ? token('space.0', '0') : token('space.150', '12px')}\`,
			});
			`,
			errors: Array.from(Array(3), () => ({ messageId: 'expandSpacingShorthand' })),
		},
		// Strings that are not valid property values should not be autofixed (e.g. !important)
		{
			name: `${property}: Don't autofix if not able to handle all the string values, e.g !important`,
			code: outdent`
			import {css} from '@compiled/react';
			const styles = css({
				${property}: \`0 \${token('space.200', '16px')} !important\`,
			});
			`,
			errors: [{ messageId: 'expandSpacingShorthand' }],
		},
		{
			name: `${property}: Autofix if able to handle all string values`,
			code: outdent`
			import {css} from '@compiled/react';
			const styles = css({
				${property}: \`0 auto \${token('space.300', '24px')}\`,
			});
			`,
			output: outdent`
			import {css} from '@compiled/react';
			const styles = css({
				${property}Top: 0,
				${property}Right: 'auto',
				${property}Bottom: token('space.300', '24px'),
				${property}Left: 'auto',
			});
			`,
			errors: [{ messageId: 'expandSpacingShorthand' }],
		},
		// Miscellaneous
		{
			name: `${property}: new property should not be created if existing property already exists`,
			code: outdent`
			import {css} from '@compiled/react';
			const styles = css({
				${property}: token('space.100'),
				${property}Top: token('space.200'),
			});
			`,
			output: outdent`
			import {css} from '@compiled/react';
			const styles = css({
				${property}Top: token('space.200'),
				${property}Right: token('space.100'),
				${property}Bottom: token('space.100'),
				${property}Left: token('space.100'),
			});
			`,
			errors: [{ messageId: 'expandSpacingShorthand' }],
		},
		{
			name: `${property}: property with nested selectors`,
			code: outdent`
			import {css} from '@compiled/react';
			const styles = css({
				${property}: token('space.100'),
				'.some-selector': {
					${property}Top: token('space.200'),
				}
			});
			const styles2 = css({
				${property}Top: token('space.100'),
				'.some-selector': {
					${property}: token('space.200'),
				}
			});
			const styles3 = css({
				'.some-selector': {
					${property}: token('space.200'),
					${property}Top: token('space.100'),
				}
			});
			`,
			output: outdent`
			import {css} from '@compiled/react';
			const styles = css({
				${property}Top: token('space.100'),
				${property}Right: token('space.100'),
				${property}Bottom: token('space.100'),
				${property}Left: token('space.100'),
				'.some-selector': {
					${property}Top: token('space.200'),
				}
			});
			const styles2 = css({
				${property}Top: token('space.100'),
				'.some-selector': {
					${property}Top: token('space.200'),
				${property}Right: token('space.200'),
				${property}Bottom: token('space.200'),
				${property}Left: token('space.200'),
				}
			});
			const styles3 = css({
				'.some-selector': {
					${property}Top: token('space.100'),
				${property}Right: token('space.200'),
				${property}Bottom: token('space.200'),
				${property}Left: token('space.200'),
				}
			});
			`,
			errors: Array.from(Array(3), () => ({ messageId: 'expandSpacingShorthand' })),
		},
		{
			name: `${property}: property value includes newline and tab`,
			code: outdent`
			import {css} from '@compiled/react';
			const styles = css({
				${property}: \`\${token('space.100')} \${token('space.200')}
					\${token('space.300')} \${token('space.400')}\`,
			});
			const styles2 = css({
				paddingBottom: token('space.050', '4px'),
				'&& > span': {
					padding: \`\${token('space.100', '8px')} \${token('space.150', '12px')} 7px
					\${token('space.150', '12px')}\`,
				},
			});
			`,
			output: outdent`
			import {css} from '@compiled/react';
			const styles = css({
				${property}Top: token('space.100'),
				${property}Right: token('space.200'),
				${property}Bottom: token('space.300'),
				${property}Left: token('space.400'),
			});
			const styles2 = css({
				paddingBottom: token('space.050', '4px'),
				'&& > span': {
					paddingTop: token('space.100', '8px'),
				paddingRight: token('space.150', '12px'),
				paddingBottom: '7px',
				paddingLeft: token('space.150', '12px'),
				},
			});
			`,
			errors: Array.from(Array(2), () => ({ messageId: 'expandSpacingShorthand' })),
		},
		// // TODO (AFB-1022): Resolve this failing test
		// {
		//  name: `${property}: styled components with prop input`,
		//  code: outdent`
		//  import { styled } from '@compiled/react';
		//  const MenuOptionWrapper = styled.div<{ isDisabled: boolean }>({
		//      '& button': ({ isDisabled }) => ({
		//          ${property}: \`\${token('space.075', '6px')} \${token('space.200', '16px')}\`,
		//      }),
		//  });
		//  `,
		//  output: outdent`
		//  import { styled } from '@compiled/react';
		//  const MenuOptionWrapper = styled.div<{ isDisabled: boolean }>({
		//      '& button': ({ isDisabled }) => ({
		//          ${property}Top: token('space.075', '6px'),
		//      ${property}Right: token('space.200', '16px'),
		//      ${property}Bottom: token('space.075', '6px'),
		//      ${property}Left: token('space.200', '16px'),
		//      }),
		//  });
		//  `,
		//  errors: [{ messageId: 'expandSpacingShorthand' }],
		// },
	];
};

tester.run('expand-spacing-shorthand', expandSpacingShorthand, {
	valid: [...validTestCases('padding'), ...validTestCases('margin')],
	invalid: [...invalidTestCases('padding'), ...invalidTestCases('margin')],
});
