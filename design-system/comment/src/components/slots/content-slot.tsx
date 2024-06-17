/** @jsx jsx */
import { type FC, type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const contentSlotStyles = css({
	minWidth: 0,
	gridArea: 'comment-area',
	paddingBlockStart: token('space.025', '2px'),
	wordWrap: 'break-word',
});

interface ContentSlotProps {
	/**
	 * The slot for the header, body, and actions of a Comment
	 */
	children?: ReactNode;
}

/**
 * __ContentSlot__
 *
 * The content slot is used to nest content in a comment's layout. It should be used inside a CommentLayout.
 *
 */
const ContentSlot: FC<ContentSlotProps> = ({ children }) => (
	<div css={contentSlotStyles}>{children}</div>
);

export default ContentSlot;
