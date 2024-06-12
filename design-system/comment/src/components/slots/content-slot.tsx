/** @jsx jsx */
import { type FC, type ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const contentSlotStyles = css({
	minWidth: 0,
	// this spacing is a specific affordance to the avatar border
	paddingTop: token('space.025', '2px'),
	gridArea: 'comment-area',
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
