import React from 'react';

import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const textStyles = xcss({
	// content can grow and shrink
	flexGrow: 1,
	flexShrink: 1,

	// ellipsis for overflow text
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

const iconStyles = xcss({
	display: 'flex',
	// icon size cannot grow and shrink
	flexGrow: 0,
	flexShrink: 0,
	alignSelf: 'center',
	fontSize: 0,
	lineHeight: 0,
	userSelect: 'none',
});

const commonStyles = xcss({
	transition: 'opacity 0.3s',
});

const fadeStyles = xcss({
	opacity: 0,
});

/**
 * These CSS variables consumed by the new icons, to allow them to have appropriate
 * padding inside Button while also maintaining spacing for the existing icons.
 *
 * These styles can be removed once the new icons are fully rolled out, feature flag
 * platform.design-system-team.enable-new-icons is cleaned up,
 * and we bump Button to set padding based on the new icons.
 */
const beforeIconStyles = xcss({
	// @ts-ignore
	'--ds--button--new-icon-padding-start': token('space.050', '4px'),
	// @ts-ignore
	'--ds--button--new-icon-padding-end': token('space.025', '2px'),
});
const afterIconStyles = xcss({
	// @ts-ignore
	'--ds--button--new-icon-padding-start': token('space.025', '2px'),
	// @ts-ignore
	'--ds--button--new-icon-padding-end': token('space.050', '4px'),
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
const Content = ({ children, type = 'text', isLoading, position }: ContentProps) => {
	return (
		<Box
			as="span"
			xcss={[
				commonStyles,
				...(type === 'text' ? [textStyles] : [iconStyles]),
				...(isLoading ? [fadeStyles] : []),
				...(position === 'before' ? [beforeIconStyles] : []),
				...(position === 'after' ? [afterIconStyles] : []),
			]}
		>
			{children}
		</Box>
	);
};

export default Content;
