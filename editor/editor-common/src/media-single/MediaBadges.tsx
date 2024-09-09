import React, { type ReactNode, useEffect, useState } from 'react';

import debounce from 'lodash/debounce';

import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const containerStyles = xcss({
	display: 'flex',
	position: 'absolute',
	top: 'space.0',
	right: 'space.0',
	lineHeight: token('space.200'),
	gap: 'space.025',
	zIndex: 'card',
	height: 'fit-content',
	width: 'fit-content',
	margin: 'space.075',
});

const resizeOffsetStyles = xcss({
	right: 'space.150',
});

const smallBadgeStyles = xcss({
	margin: 'space.025',
});

type ExternalImageBadgeProps = {
	mediaElement?: HTMLElement | null;
	mediaHeight?: number;
	mediaWidth?: number;
	extendedResizeOffset?: boolean;
	children: ReactNode | ((props: { badgeSize: 'medium' | 'small' }) => ReactNode);
};

const getBadgeSize = (width?: number, height?: number) => {
	// width is the original width of image, not resized or currently rendered to user. Defaulting to medium for now
	return (width && width < 70) || (height && height < 70) ? 'small' : 'medium';
};

export const MediaBadges = ({
	children,
	mediaElement,
	mediaWidth,
	mediaHeight,
	extendedResizeOffset,
}: ExternalImageBadgeProps) => {
	const [badgeSize, setBadgeSize] = useState<'medium' | 'small'>(
		getBadgeSize(mediaWidth, mediaHeight),
	);

	useEffect(() => {
		const observer = new ResizeObserver(
			debounce((entries) => {
				const [entry] = entries;
				const { width, height } = entry.contentRect;
				setBadgeSize(getBadgeSize(width, height));
			}),
		);

		if (mediaElement) {
			observer.observe(mediaElement as HTMLElement);
		}
		return () => {
			observer.disconnect();
		};
	}, [mediaElement]);

	if (typeof children === 'function') {
		children = children({ badgeSize });
	}

	if (!mediaElement || React.Children.count(children) === 0) {
		return null;
	}

	return (
		<Box
			testId="media-badges"
			data-media-badges="true"
			xcss={[
				containerStyles,
				extendedResizeOffset && resizeOffsetStyles,
				badgeSize === 'small' && smallBadgeStyles,
			]}
		>
			{children}
		</Box>
	);
};
