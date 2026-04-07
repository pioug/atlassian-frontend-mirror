/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Children, type FC, type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { ExitingPersistence } from '@atlaskit/motion';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

const gutter = token('space.negative.050');

const listStyles = css({
	display: 'flex',
	justifyContent: 'flex-start',
	flexWrap: 'wrap',
	isolation: 'isolate',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 1,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
	listStyleType: 'none !important',
	marginBlockEnd: token('space.0'),
	marginBlockStart: token('space.0'),
	marginInlineEnd: gutter,
	marginInlineStart: gutter,
	paddingBlockEnd: token('space.0'),
	paddingBlockStart: token('space.0'),
	paddingInlineEnd: token('space.0'),
	paddingInlineStart: token('space.0'),
});

const listStylesFlagged = css({
	marginBlockEnd: token('space.050'),
	paddingInlineEnd: token('space.025'),
	paddingInlineStart: token('space.025'),
});

const listItemStyles = css({
	marginBlockEnd: token('space.100'),
	marginBlockStart: token('space.0'),
	marginInlineEnd: token('space.0'),
	marginInlineStart: token('space.0'),
	paddingInlineEnd: token('space.050'),
	paddingInlineStart: token('space.050'),
});

const Grid: FC<{
	children: ReactNode;
	testId?: string;
	'aria-label': string;
	id?: string;
}> = ({ id, children, testId, 'aria-label': label }) => (
	<ul
		id={id}
		data-testid={testId}
		aria-label={label}
		css={[listStyles, fg('platform-avatar-group-spacing-fix') && listStylesFlagged]}
	>
		{fg('platform-dst-motion-uplift') ? (
			<ExitingPersistence exitThenEnter>
				{Children.map(children, (child) => child && <li css={listItemStyles}>{child}</li>)}
			</ExitingPersistence>
		) : (
			Children.map(children, (child) => child && <li css={listItemStyles}>{child}</li>)
		)}
	</ul>
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Grid;
