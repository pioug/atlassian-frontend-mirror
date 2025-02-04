/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Children, type FC, type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const listStyles = css({
	display: 'flex',
	isolation: 'isolate',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 1,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
	listStyleType: 'none !important',
	marginBlockEnd: token('space.0', '0px'),
	marginBlockStart: token('space.0', '0px'),
	marginInlineEnd: token('space.100', '8px'),
	marginInlineStart: token('space.0', '0px'),
	paddingBlockEnd: token('space.0', '0px'),
	paddingBlockStart: token('space.0', '0px'),
	paddingInlineEnd: token('space.0', '0px'),
	paddingInlineStart: token('space.0', '0px'),
});

const listItemStyles = css({
	marginBlockEnd: token('space.0', '0px'),
	marginBlockStart: token('space.0', '0px'),
	marginInlineEnd: token('space.negative.100', '-8px'),
	marginInlineStart: token('space.0', '0px'),
});

const Stack: FC<{
	children: ReactNode;
	testId?: string;
	'aria-label': string;
}> = ({ children, testId, 'aria-label': label }) => (
	<ul data-testid={testId} aria-label={label} css={listStyles}>
		{Children.map(children, (child) => child && <li css={listItemStyles}>{child}</li>)}
	</ul>
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Stack;
