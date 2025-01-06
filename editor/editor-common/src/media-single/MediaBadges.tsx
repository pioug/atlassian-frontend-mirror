import React, { type ReactNode, useEffect, useState } from 'react';

import debounce from 'lodash/debounce';

import { fg } from '@atlaskit/platform-feature-flags';
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const MEDIA_BADGE_VISIBILITY_BREAKPOINT = 200;

const containerStyles = xcss({
	display: 'flex',
	position: 'absolute',
	top: 'space.0',
	right: 'space.0',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: token('space.200'),
	gap: 'space.025',
	zIndex: 'card',
	height: 'fit-content',
	width: 'fit-content',
	margin: 'space.075',
});

// The above styles are used for both editor and renderer, and in renderer the
// document body is the main scroll area. This means it overscrolls the primary
// toolbar, where the z-index is "2". We have to hack in our own z-index less
// than that to ensure our badge appears under the toolbar when scrolled.
const hackedZIndexStyles = xcss({
	// @ts-ignore
	zIndex: '1',
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
	useMinimumZIndex?: boolean;
	children: ReactNode | ((props: { badgeSize: 'medium' | 'small'; visible: boolean }) => ReactNode);
};

const getBadgeSize = (width?: number, height?: number) => {
	// width is the original width of image, not resized or currently rendered to user. Defaulting to medium for now
	return (width && width < 70) || (height && height < 70) ? 'small' : 'medium';
};

const getBadgeVisible = (width?: number, height?: number) => {
	if (!fg('platform_editor_support_media_badge_visibility')) {
		return true;
	}
	return (width && width < MEDIA_BADGE_VISIBILITY_BREAKPOINT) ||
		(height && height < MEDIA_BADGE_VISIBILITY_BREAKPOINT)
		? false
		: true;
};

export const MediaBadges = ({
	children,
	mediaElement,
	mediaWidth,
	mediaHeight,
	extendedResizeOffset,
	useMinimumZIndex = false,
}: ExternalImageBadgeProps) => {
	const [badgeSize, setBadgeSize] = useState<'medium' | 'small'>(
		getBadgeSize(mediaWidth, mediaHeight),
	);
	const [visible, setVisible] = useState<boolean>(getBadgeVisible(mediaWidth, mediaHeight));

	useEffect(() => {
		const observer = new ResizeObserver(
			debounce((entries) => {
				const [entry] = entries;
				const { width, height } = entry.contentRect;
				setBadgeSize(getBadgeSize(width, height));
				if (fg('platform_editor_support_media_badge_visibility')) {
					setVisible(getBadgeVisible(width, height));
				}
			}),
		);

		if (mediaElement) {
			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			observer.observe(mediaElement as HTMLElement);
		}
		return () => {
			observer.disconnect();
		};
	}, [mediaElement]);

	if (typeof children === 'function') {
		children = children({ badgeSize, visible });
	}

	if (!mediaElement || React.Children.count(children) === 0) {
		return null;
	}

	return (
		<Box
			as="div"
			testId="media-badges"
			data-media-badges="true"
			contentEditable={false}
			xcss={[
				containerStyles,
				useMinimumZIndex && hackedZIndexStyles,
				extendedResizeOffset && resizeOffsetStyles,
				badgeSize === 'small' && smallBadgeStyles,
			]}
		>
			{children}
		</Box>
	);
};
