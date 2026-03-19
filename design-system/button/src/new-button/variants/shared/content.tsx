/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@compiled/react';

const styles = cssMap({
	text: {
		// content can grow and shrink
		flexGrow: 1,
		flexShrink: 1,

		// ellipsis for overflow text
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
	icon: {
		display: 'flex',
		// icon size cannot grow and shrink
		flexGrow: 0,
		flexShrink: 0,
		alignSelf: 'center',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: 0,
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 0,
		userSelect: 'none',
	},
	common: {
		transition: 'opacity 0.3s',
	},
	fade: {
		opacity: 0,
	},
});

type ContentProps = {
	children: React.ReactNode;
	type?: 'text' | 'icon';
	isLoading: boolean;
	position?: 'before' | 'after';
};

/**
 * __Content__
 *
 * Used for slots within a Button, including icons and text content.
 */
const Content = ({ children, type = 'text', isLoading }: ContentProps): JSX.Element => {
	return (
		<span
			css={[
				styles.common,
				type === 'text' && styles.text,
				type === 'icon' && styles.icon,
				isLoading && styles.fade,
			]}
		>
			{children}
		</span>
	);
};

export default Content;
