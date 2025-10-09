/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { type FC, type ReactNode } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const editedContentStyles = cssMap({
	root: {
		color: token('color.text.subtlest', N200),
	},
});

export interface EditedProps {
	/**
	 * Content to render indicating that the comment has been edited.
	 */
	children?: ReactNode;
	/**
	 * Handler called when the element is focused.
	 */
	onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
	/**
	 * Handler called when the element is moused over.
	 */
	onMouseOver?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const Edited: FC<EditedProps> = ({ children, onFocus, onMouseOver }) => (
	// eslint-disable-next-line @atlassian/a11y/no-static-element-interactions
	<span css={editedContentStyles.root} onFocus={onFocus} onMouseOver={onMouseOver}>
		{children}
	</span>
);

Edited.displayName = 'Edited';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Edited;
