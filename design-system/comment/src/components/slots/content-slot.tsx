/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type FC, type ReactNode } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const contentSlotStyles = cssMap({
	root: {
		minWidth: '0px',
		gridArea: 'comment-area',
		paddingBlockStart: token('space.025', '2px'),
		wordWrap: 'break-word',
	},
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
	<div css={contentSlotStyles.root}>{children}</div>
);

export default ContentSlot;
