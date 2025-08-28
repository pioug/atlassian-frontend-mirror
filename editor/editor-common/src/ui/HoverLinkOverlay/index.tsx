/* eslint-disable @atlaskit/design-system/no-nested-styles */
/* eslint-disable @atlaskit/design-system/prefer-primitives */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useLayoutEffect, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled
import { useIntl } from 'react-intl-next';

import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import GrowDiagonalIcon from '@atlaskit/icon/core/grow-diagonal';
import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import PanelRightIcon from '@atlaskit/icon/core/panel-right';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Anchor, Box, Text, xcss } from '@atlaskit/primitives';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

import {
	type ACTION_SUBJECT_ID,
	buildVisitedNonHyperLinkPayload,
	type EditorAnalyticsAPI,
	INPUT_METHOD,
} from '../../analytics';
import { cardMessages } from '../../messages';
import { type Command } from '../../types';

import type { HoverLinkOverlayProps } from './types';

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
	whiteSpace: 'nowrap',

	':hover': {
		backgroundColor: 'elevation.surface.hovered',
		color: 'color.text.subtle',
		textDecoration: 'none',
	},
});

const MIN_AVAILABLE_SPACE_WITH_LABEL_OVERLAY = 45;
const ICON_WIDTH = 16;
const DEFAULT_OPEN_TEXT_WIDTH = 28; // Default open text width in English

const visitCardLinkAnalytics =
	(
		editorAnalyticsApi: EditorAnalyticsAPI | undefined,
		inputMethod:
			| INPUT_METHOD.FLOATING_TB
			| INPUT_METHOD.TOOLBAR
			| INPUT_METHOD.BUTTON
			| INPUT_METHOD.DOUBLE_CLICK
			| INPUT_METHOD.META_CLICK,
	): Command =>
	(state, dispatch) => {
		if (!(state.selection instanceof NodeSelection)) {
			return false;
		}

		const { type } = state.selection.node;

		if (dispatch) {
			const { tr } = state;
			editorAnalyticsApi?.attachAnalyticsEvent(
				buildVisitedNonHyperLinkPayload(
					type.name as
						| ACTION_SUBJECT_ID.CARD_INLINE
						| ACTION_SUBJECT_ID.CARD_BLOCK
						| ACTION_SUBJECT_ID.EMBEDS,
					inputMethod,
				),
			)(tr);

			dispatch(tr);
		}
		return true;
	};

const HoverLinkOverlay = ({
	children,
	isVisible = false,
	url,
	compactPadding = false,
	editorAnalyticsApi,
	view,
	onClick,
	showPanelButton = false,
	showPanelButtonIcon,
}: React.PropsWithChildren<HoverLinkOverlayProps>) => {
	const { formatMessage } = useIntl();
	const containerRef = useRef<HTMLSpanElement>(null);
	const hoverLinkButtonRef = useRef<HTMLAnchorElement>(null);
	const hiddenTextRef = useRef<HTMLDivElement>(null);
	const [showLabel, setShowLabel] = useState(true);
	const [isHovered, setHovered] = useState(false);
	const openTextWidthRef = useRef<number | null>(null);

	useLayoutEffect(() => {
		if (!isVisible || !isHovered) {
			return;
		}
		const cardWidth = containerRef.current?.offsetWidth;
		const openButtonWidth = hoverLinkButtonRef.current?.offsetWidth;

		// Get the hidden text width
		if (!openTextWidthRef.current) {
			const hiddenText = hiddenTextRef.current;
			if (hiddenText) {
				// Measure the width of the hidden text
				// Temporarily make the element visible to measure its width
				hiddenText.style.visibility = 'hidden';
				hiddenText.style.display = 'inline';

				openTextWidthRef.current = hiddenText.offsetWidth;

				// Reset the hiddenText's display property
				hiddenText.style.display = 'none';
				hiddenText.style.visibility = 'inherit';
			} else {
				openTextWidthRef.current = DEFAULT_OPEN_TEXT_WIDTH;
			}
		}

		if (!cardWidth || !openButtonWidth) {
			return;
		}

		const openTextWidth = openTextWidthRef.current || DEFAULT_OPEN_TEXT_WIDTH;

		const canShowLabel =
			cardWidth - openTextWidth > MIN_AVAILABLE_SPACE_WITH_LABEL_OVERLAY + ICON_WIDTH;
		setShowLabel(canShowLabel);
	}, [isVisible, isHovered]);

	const handleOverlayChange = (isHovered: boolean) => {
		setHovered(isHovered);
	};

	const sendVisitLinkAnalytics = (inputMethod: INPUT_METHOD.DOUBLE_CLICK | INPUT_METHOD.BUTTON) => {
		if (editorAnalyticsApi && view) {
			visitCardLinkAnalytics(editorAnalyticsApi, inputMethod)(view.state, view.dispatch);
		}
	};

	const handleDoubleClick = () => {
		if (!showPanelButton) {
			sendVisitLinkAnalytics(INPUT_METHOD.DOUBLE_CLICK);

			// Double click opens the link in a new tab
			window.open(url, '_blank');
		}
	};

	const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
		if (showPanelButton && onClick) {
			onClick(event);
		} else {
			sendVisitLinkAnalytics(INPUT_METHOD.BUTTON);
		}
	};

	const isPreivewButton =
		showPanelButton && editorExperiment('platform_editor_preview_panel_linking_exp', true);
	const label = isPreivewButton
		? formatMessage(cardMessages.previewButtonTitle)
		: formatMessage(cardMessages.openButtonTitle);

	let icon = null;
	if (isPreivewButton && showPanelButtonIcon === 'panel') {
		icon = <PanelRightIcon label="" />;
	} else if (isPreivewButton && showPanelButtonIcon === 'modal') {
		icon = <GrowDiagonalIcon label="" />;
	} else {
		icon = <LinkExternalIcon label="" />;
	}

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
			<span css={hiddenTextStyle} aria-hidden="true">
				<Text ref={hiddenTextRef} size="small" maxLines={1}>
					{label}
				</Text>
			</span>
			{isHovered && (
				<Anchor
					ref={hoverLinkButtonRef}
					xcss={linkStyles}
					href={url}
					target="_blank"
					style={{
						paddingBlock: compactPadding ? '1px' : token('space.025'),
					}}
					onClick={handleClick}
					testId="inline-card-hoverlink-overlay"
				>
					<Box
						xcss={iconWrapperStyles}
						data-inlinecard-button-overlay="icon-wrapper-line-height"
						testId="inline-card-hoverlink-overlay-icon"
					>
						{icon}
					</Box>
					{showLabel && (
						<Text
							size="small"
							color="color.text.subtle"
							maxLines={1}
							testId="inline-card-hoverlink-overlay-label"
						>
							{label}
						</Text>
					)}
				</Anchor>
			)}
		</span>
	);
};

export default HoverLinkOverlay;
