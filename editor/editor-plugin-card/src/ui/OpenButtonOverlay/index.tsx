/* eslint-disable @atlaskit/design-system/no-nested-styles */
/* eslint-disable @atlaskit/design-system/prefer-primitives */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useLayoutEffect, useRef, useState } from 'react';

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

const hiddenTextStyle = css({
	overflow: 'hidden',
	whiteSpace: 'nowrap',
	position: 'absolute',
	visibility: 'hidden',
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

const linkStylesFix = xcss({ whiteSpace: 'nowrap' });

const MIN_AVAILABLE_SPACE_WITH_LABEL_OVERLAY = 45;
const ICON_WIDTH = 16;
const DEFAULT_OPEN_TEXT_WIDTH = 28; // Default open text width in English

const OpenButtonOverlay = ({
	children,
	isVisible = false,
	url,
	editorAppearance,
	...props
}: React.PropsWithChildren<OpenButtonOverlayProps>) => {
	// TODO: ED-26961 - add translation
	const label = 'Open';

	const containerRef = useRef<HTMLSpanElement>(null);
	const openButtonRef = useRef<HTMLAnchorElement>(null);
	const hiddenTextRef = useRef<HTMLDivElement>(null);
	const [showLabel, setShowLabel] = useState(true);
	const [isHovered, setHovered] = useState(false);
	const openTextWidthRef = useRef(DEFAULT_OPEN_TEXT_WIDTH);

	const handleDoubleClick = () => {
		// Double click opens the link in a new tab
		window.open(url, '_blank');
	};

	useLayoutEffect(() => {
		const hiddenText = hiddenTextRef.current;
		if (!hiddenText) {
			return;
		}
		// Measure the width of the hidden text
		// Temporarily make the element visible to measure its width
		hiddenText.style.visibility = 'hidden';
		hiddenText.style.display = 'inline';

		openTextWidthRef.current = hiddenText.offsetWidth;

		// Reset the hiddenText's display property
		hiddenText.style.display = 'none';
		hiddenText.style.visibility = 'inherit';
	}, []);

	useLayoutEffect(() => {
		if (!isVisible || !isHovered) {
			return;
		}
		const cardWidth = containerRef.current?.offsetWidth;
		const openButtonWidth = openButtonRef.current?.offsetWidth;

		if (!cardWidth || !openButtonWidth) {
			return;
		}

		let canShowLabel = true;
		if (fg('platform_editor_controls_patch_2')) {
			canShowLabel =
				cardWidth - openTextWidthRef.current > MIN_AVAILABLE_SPACE_WITH_LABEL_OVERLAY + ICON_WIDTH;
		} else {
			canShowLabel = cardWidth - openButtonWidth > MIN_AVAILABLE_SPACE_WITH_LABEL_OVERLAY;
		}

		setShowLabel(canShowLabel);
	}, [isVisible, isHovered]);

	const handleOverlayChange = (isHovered: boolean) => {
		setHovered(isHovered);
	};

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

			{fg('platform_editor_controls_patch_2') && (
				<span css={hiddenTextStyle} aria-hidden="true">
					<Text ref={hiddenTextRef} size="small" maxLines={1}>
						{label}
					</Text>
				</span>
			)}

			{isHovered && (
				<Anchor
					ref={openButtonRef}
					xcss={[linkStyles, fg('platform_editor_controls_patch_5') && linkStylesFix]}
					href={url}
					target="_blank"
					style={{
						paddingBlock:
							editorAppearance === 'comment' && fg('platform_editor_controls_patch_6')
								? '1px'
								: token('space.025'),
					}}
				>
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
