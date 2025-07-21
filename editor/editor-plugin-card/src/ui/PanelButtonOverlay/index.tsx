/* eslint-disable @atlaskit/design-system/no-nested-styles */
/* eslint-disable @atlaskit/design-system/prefer-primitives */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { useLayoutEffect, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled
import { useIntl } from 'react-intl-next';

import { cardMessages } from '@atlaskit/editor-common/messages';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import PanelRightIcon from '@atlaskit/icon/core/panel-right';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Pressable, Text, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import type { PanelButtonOverlayProps } from '../PanelButtonOverlay/types';

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

const iconAndLabelWrapperStyles = xcss({
	position: 'absolute',
	left: 'space.025',
	top: '-1px',
	cursor: 'pointer',

	display: 'inline-flex',
	alignItems: 'center',
	verticalAlign: 'middle',

	paddingInline: 'space.050',
	gap: 'space.025',
	overflow: 'hidden',

	zIndex: 'card',

	backgroundColor: 'color.background.accent.gray.subtlest',
	borderRadius: token('border.radius', '3px'),
	color: 'color.text.subtle',

	textDecoration: 'none',
	whiteSpace: 'nowrap',

	':hover': {
		backgroundColor: 'elevation.surface.hovered',
		color: 'color.text.subtle',
		textDecoration: 'none',
	},
});

const MIN_AVAILABLE_SPACE_WITH_LABEL_OVERLAY = 45;
const ICON_WIDTH = 16;
const DEFAULT_PANEL_TEXT_WIDTH = 28; // Default panel text width in English

const PanelButtonOverlay = ({
	children,
	isVisible = false,
	editorAppearance,
	onClick,
}: React.PropsWithChildren<PanelButtonOverlayProps>) => {
	const { formatMessage } = useIntl();
	const label = formatMessage(cardMessages.panelButtonTitle);

	const containerRef = useRef<HTMLSpanElement>(null);
	const panelButtonRef = useRef<HTMLButtonElement>(null);
	const hiddenTextRef = useRef<HTMLDivElement>(null);
	const [showLabel, setShowLabel] = useState(true);
	const [isHovered, setHovered] = useState(false);
	const panelTextWidthRef = useRef<number | null>(null);

	useLayoutEffect(() => {
		if (!isVisible || !isHovered) {
			return;
		}
		const cardWidth = containerRef.current?.offsetWidth;
		const panelButtonWidth = panelButtonRef.current?.offsetWidth;

		// Get the hidden text width
		if (!panelTextWidthRef.current) {
			const hiddenText = hiddenTextRef.current;
			if (hiddenText) {
				// Measure the width of the hidden text
				// Temporarily make the element visible to measure its width
				hiddenText.style.visibility = 'hidden';
				hiddenText.style.display = 'inline';

				panelTextWidthRef.current = hiddenText.offsetWidth;

				// Reset the hiddenText's display property
				hiddenText.style.display = 'none';
				hiddenText.style.visibility = 'inherit';
			} else {
				panelTextWidthRef.current = DEFAULT_PANEL_TEXT_WIDTH;
			}
		}

		if (!cardWidth || !panelButtonWidth) {
			return;
		}

		const panelTextWidth = panelTextWidthRef.current || DEFAULT_PANEL_TEXT_WIDTH;

		const canShowLabel =
			cardWidth - panelTextWidth > MIN_AVAILABLE_SPACE_WITH_LABEL_OVERLAY + ICON_WIDTH;
		setShowLabel(canShowLabel);
	}, [isVisible, isHovered]);

	const handleOverlayChange = (isHovered: boolean) => {
		setHovered(isHovered);
	};

	const handleClick = () => {
		if (onClick) {
			onClick();
		}
	};

	return (
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<span
			ref={containerRef}
			css={containerStyles}
			onMouseEnter={() => handleOverlayChange(true)}
			onMouseLeave={() => handleOverlayChange(false)}
		>
			{children}
			<span css={hiddenTextStyle} aria-hidden="true">
				<Text ref={hiddenTextRef} size="small" maxLines={1}>
					{label}
				</Text>
			</span>
			{isHovered && (
				<Pressable
					ref={panelButtonRef}
					xcss={iconAndLabelWrapperStyles}
					style={{
						paddingBlock:
							editorAppearance === 'comment' || editorAppearance === 'chromeless'
								? '1px'
								: token('space.025'),
					}}
					onClick={handleClick}
				>
					<Box xcss={iconWrapperStyles} data-inlinecard-button-overlay="icon-wrapper-line-height">
						<PanelRightIcon label="" />
					</Box>
					{showLabel && (
						<Text size="small" color="color.text.subtle" maxLines={1}>
							{label}
						</Text>
					)}
				</Pressable>
			)}
		</span>
	);
};

export default PanelButtonOverlay;
