/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Children, type FC, type ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const gutter = token('space.negative.050', '-4px');

const listStyles = css({
	display: 'flex',
	margin: token('space.0', '0px'),
	padding: token('space.0', '0px'),
	justifyContent: 'flex-start',
	flexWrap: 'wrap',
	isolation: 'isolate',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 1,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
	listStyleType: 'none !important',
	marginInlineEnd: gutter,
	marginInlineStart: gutter,
});

const listItemStyles = css({
	margin: token('space.0', '0px'),
	marginBlockEnd: token('space.100', '8px'),
	paddingInlineEnd: token('space.050', '4px'),
	paddingInlineStart: token('space.050', '4px'),
});

const Grid: FC<{
	children: ReactNode;
	testId?: string;
	'aria-label': string;
}> = ({ children, testId, 'aria-label': label }) => (
	<ul data-testid={testId} aria-label={label} css={listStyles}>
		{Children.map(children, (child) => child && <li css={listItemStyles}>{child}</li>)}
	</ul>
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Grid;
