import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';
import { Box, xcss } from '@atlaskit/primitives';

import { type Size } from './types';

type IconContainerProps = {
	children: React.ReactNode;
	size: Size;
	isHidden: boolean;
	position: 'left' | 'right';
};

const iconContainerStyles = xcss({
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	transition: 'opacity 0.2s ease',

	position: 'absolute',
	insetBlockStart: 'space.025',
});
const iconContainerRegularStyles = xcss({
	width: '16px',
	height: '16px',
});
const iconContainerLargeStyles = xcss({
	width: '20px',
	height: '20px',
});
const hiddenStyles = xcss({
	opacity: 0,
});
const leftStyles = xcss({
	insetInlineStart: '3px',
});
const rightStyles = xcss({
	insetInlineEnd: '3px',
});

/**
 * __Icon container__
 *
 * Positions a toggle's check and close icons.
 */
const IconContainer = ({ children, size, isHidden, position }: IconContainerProps) => {
	return (
		<Box
			as="span"
			xcss={[
				iconContainerStyles,
				isHidden && fg('platform.design-system-team.enable-new-icons') && hiddenStyles,
				size === 'regular' && iconContainerRegularStyles,
				size === 'large' && iconContainerLargeStyles,
				position === 'left' && leftStyles,
				position === 'right' && rightStyles,
			]}
		>
			{children}
		</Box>
	);
};

export default IconContainer;
