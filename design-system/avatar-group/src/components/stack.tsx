/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Children, type FC, type ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { BORDER_WIDTH } from '@atlaskit/avatar';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

const gutter = BORDER_WIDTH * 2 + gridSize() / 2;

const listStyles = css({
	display: 'flex',
	margin: token('space.0', '0px'),
	padding: token('space.0', '0px'),
	isolation: 'isolate',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 1,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
	listStyleType: 'none !important',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	marginInlineEnd: gutter,
});

const listItemStyles = css({
	margin: token('space.0', '0px'),
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	marginInlineEnd: -gutter,
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
