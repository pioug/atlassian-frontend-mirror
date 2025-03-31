/* eslint-disable @atlaskit/design-system/no-nested-styles */
/* eslint-disable @atlaskit/design-system/prefer-primitives */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import { fg } from '@atlaskit/platform-feature-flags';
import { Anchor, Box, Text, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import type { OpenButtonOverlayProps } from './types';

const containerStyles = css({
	position: 'relative',
});

const iconWrapperStyles = xcss({
	display: 'inline-flex',
	justifyContent: 'center',
	alignItems: 'center',
	height: '17px',
	width: '17px',
});

const linkStyles = xcss({
	position: 'absolute',
	left: 'space.025',
	top: '-1px',

	display: 'inline-flex',
	alignItems: 'center',
	verticalAlign: 'middle',

	paddingBlock: 'space.025',
	paddingInline: 'space.050',
	gap: 'space.025',
	overflow: 'hidden',

	zIndex: 'card',

	backgroundColor: 'color.background.accent.gray.subtlest',
	borderRadius: token('border.radius', '3px'),
	color: 'color.text.subtle',

	textDecoration: 'none',

	':hover': {
		backgroundColor: 'elevation.surface.hovered',
		color: 'color.text.subtle',
		textDecoration: 'none',
	},
});

const MIN_AVAILABLE_SPACE_WITH_LABEL_OVERLAY = 45;

const OpenButtonOverlay = ({
	children,
	isVisible = false,
	url,
	...props
}: React.PropsWithChildren<OpenButtonOverlayProps>) => {
	// TODO: ED-26961 - add translation
	const label = 'Open';

	const containerRef = useRef<HTMLSpanElement>(null);
	const openButtonRef = useRef<HTMLAnchorElement>(null);
	const [showLabel, setShowLabel] = useState(true);
	const [isHovered, setHovered] = useState(false);

	const handleDoubleClick = () => {
		// Double click opens the link in a new tab
		window.open(url, '_blank');
	};

	useLayoutEffect(() => {
		if (!isVisible || !isHovered) {
			return;
		}
		const cardWidth = containerRef.current?.offsetWidth;
		const openButtonWidth = openButtonRef.current?.offsetWidth;

		const canShowLabel =
			cardWidth && openButtonWidth
				? cardWidth - openButtonWidth > MIN_AVAILABLE_SPACE_WITH_LABEL_OVERLAY
				: true;
		setShowLabel(canShowLabel);
	}, [isVisible, isHovered]);

	const handleOverlayChange = useCallback((isHovered: boolean) => {
		setHovered(isHovered);
	}, []);

	if (fg('platform_editor_controls_patch_1')) {
		return (
			// eslint-disable-next-line jsx-a11y/no-static-element-interactions
			<span
				ref={containerRef}
				css={containerStyles}
				onDoubleClick={handleDoubleClick}
				onMouseEnter={() => handleOverlayChange(true)}
				onMouseLeave={() => handleOverlayChange(false)}
			>
				{children}
				{isHovered && (
					<Anchor ref={openButtonRef} xcss={linkStyles} href={url} target="_blank">
						<Box xcss={iconWrapperStyles}>
							<LinkExternalIcon label="" />
						</Box>
						{showLabel && (
							<Text size="small" color="color.text.subtle" maxLines={1}>
								{label}
							</Text>
						)}
					</Anchor>
				)}
			</span>
		);
	}
	return (
		// Ignored via go/ees005
		// eslint-disable-next-line react/jsx-props-no-spreading, jsx-a11y/no-static-element-interactions
		<span ref={containerRef} {...props} css={containerStyles} onDoubleClick={handleDoubleClick}>
			{children}
			{isVisible && (
				<Anchor ref={openButtonRef} xcss={linkStyles} href={url} target="_blank">
					<Box xcss={iconWrapperStyles} data-inlinecard-button-overlay="icon-wrapper-line-height">
						<LinkExternalIcon label="" />
					</Box>
					{showLabel && (
						<Text size="small" color="color.text.subtle" maxLines={1}>
							{label}
						</Text>
					)}
				</Anchor>
			)}
		</span>
	);
};

export default OpenButtonOverlay;
