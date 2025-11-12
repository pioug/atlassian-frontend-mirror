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
import {
	akEditorFullPageDefaultFontSize,
	akEditorFullPageDenseFontSize,
} from '@atlaskit/editor-shared-styles';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import GrowDiagonalIcon from '@atlaskit/icon/core/grow-diagonal';
import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import PanelRightIcon from '@atlaskit/icon/core/panel-right';
import { fg } from '@atlaskit/platform-feature-flags';
import { componentWithCondition } from '@atlaskit/platform-feature-flags-react';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Anchor, Box, Text, xcss } from '@atlaskit/primitives';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
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

/**
 * Dynamic padding value that adjusts based on the editor's base font size.
 * When base font size is <= akEditorFullPageDenseFontSize (13px), uses 1px padding.
 * Otherwise, uses default value with token('space.025').
 */
const DYNAMIC_PADDING_BLOCK = `clamp(1px, calc((var(--ak-editor-base-font-size, ${akEditorFullPageDefaultFontSize}px) - ${akEditorFullPageDenseFontSize}px) * 999), ${token('space.025')})`;

const containerStylesOld = css({
	position: 'relative',
});

const containerStyles = css({
	position: 'relative',
	whiteSpace: 'nowrap',
});

const iconWrapperStylesOld = xcss({
	display: 'inline-flex',
	justifyContent: 'center',
	alignItems: 'center',
	height: '17px',
	width: '17px',
});

const iconWrapperStyles = xcss({
	display: 'inline-flex',
	justifyContent: 'center',
	alignItems: 'center',
});

const hiddenTextStyle = css({
	overflow: 'hidden',
	whiteSpace: 'nowrap',
	position: 'absolute',
	visibility: 'hidden',
});

const linkStylesCommon = xcss({
	position: 'absolute',
	left: 'space.025',

	display: 'inline-flex',
	alignItems: 'center',
	verticalAlign: 'middle',

	paddingBlock: 'space.025',
	paddingInline: 'space.050',
	gap: 'space.025',
	overflow: 'hidden',

	zIndex: 'card',

	backgroundColor: 'color.background.accent.gray.subtlest',
	borderRadius: token('radius.small', '3px'),
	color: 'color.text.subtle',

	textDecoration: 'none',
	whiteSpace: 'nowrap',

	':hover': {
		backgroundColor: 'elevation.surface.hovered',
		color: 'color.text.subtle',
		textDecoration: 'none',
	},
});

const linkStylesOld = xcss({
	top: '-1px',
});

const linkStylesHeightFix = xcss({
	top: '0px',
	height: '1.2em',
});

const linkStylesNewWithHeightFix = xcss({
	top: '0px',
	visibility: 'hidden',

	height: '1.2em',
});

const linkStylesVisible = xcss({
	visibility: 'visible',
});

const iconAndLabelStyles = xcss({
	display: 'flex',
	alignItems: 'center',
	height: '100%',

	gap: 'space.025',
});

const MIN_AVAILABLE_SPACE_WITH_LABEL_OVERLAY = 45;
const ICON_WIDTH = 16;
const DEFAULT_OPEN_TEXT_WIDTH = 28; // Default open text width in English
const MIN_CARD_WIDTH_NOT_COVERED_BY_OVERLAY = 30;

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

const HoverLinkOverlayOriginal = ({
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

	const isPreviewButton =
		showPanelButton && editorExperiment('platform_editor_preview_panel_linking_exp', true);
	const label = isPreviewButton
		? formatMessage(cardMessages.previewButtonTitle)
		: formatMessage(cardMessages.openButtonTitle);

	let icon = null;
	if (isPreviewButton && showPanelButtonIcon === 'panel') {
		icon = <PanelRightIcon label="" />;
	} else if (isPreviewButton && showPanelButtonIcon === 'modal') {
		icon = <GrowDiagonalIcon label="" />;
	} else {
		icon = <LinkExternalIcon label="" />;
	}

	return (
		<span
			ref={containerRef}
			css={containerStylesOld}
			onDoubleClick={handleDoubleClick}
			// eslint-disable-next-line @atlassian/a11y/mouse-events-have-key-events
			onMouseEnter={() => handleOverlayChange(true)}
			// eslint-disable-next-line @atlassian/a11y/mouse-events-have-key-events
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
					xcss={[
						linkStylesCommon,
						expValEquals('platform_editor_hoverlink_ui_fixes_exp', 'cohort', 'css_changes_only')
							? linkStylesHeightFix
							: linkStylesOld,
					]}
					href={url}
					target="_blank"
					style={{
						paddingBlock: compactPadding
							? '1px'
							: expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
								  fg('platform_editor_content_mode_button_mvp')
								? DYNAMIC_PADDING_BLOCK
								: token('space.025'),
					}}
					onClick={handleClick}
					testId="inline-card-hoverlink-overlay"
				>
					<Box
						xcss={iconWrapperStylesOld}
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

const HoverLinkOverlayNew = ({
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
	const iconRef = useRef<HTMLElement>(null);
	const iconLeftRef = useRef<number>(0);
	const iconAndLabelRef = useRef<HTMLSpanElement>(null);
	const minMaxWidthRef = useRef<{ max: number; min: number } | undefined>();

	const [showLabel, setShowLabel] = useState(false);
	const [isHovered, setHovered] = useState(false);
	const [showOverlay, setShowOverlay] = useState(false);

	useLayoutEffect(() => {
		if (!isVisible && !isHovered) {
			return;
		}

		if (!containerRef.current) {
			return;
		}

		if (iconRef.current && iconAndLabelRef.current) {
			const iconRect = iconRef.current.getBoundingClientRect();
			iconLeftRef.current = iconRect.left;
			minMaxWidthRef.current = {
				min: iconRect.width,
				max: iconAndLabelRef.current.getBoundingClientRect().width,
			};
		}

		if (!iconLeftRef.current || !minMaxWidthRef.current) {
			return;
		}

		const containerDomRect = containerRef.current.getBoundingClientRect();
		const containerStyles = getComputedStyle(containerRef.current);
		const containerHeight =
			containerDomRect.height -
			parseFloat(containerStyles.paddingTop) -
			parseFloat(containerStyles.paddingBottom) -
			parseFloat(containerStyles.borderTopWidth) -
			parseFloat(containerStyles.borderBottomWidth);

		const oneLine = parseFloat(containerStyles.lineHeight) >= containerHeight;
		const firstLineWidth = containerDomRect.right - iconLeftRef.current;

		// We don't want HoverLinkOverlay to cover the entire card if it is oneline. It allows the user to click on the card itself.
		const reservedWidth = oneLine ? MIN_CARD_WIDTH_NOT_COVERED_BY_OVERLAY : 0;
		const availableWidth = firstLineWidth - reservedWidth;

		// True when icon and label can be shown
		setShowLabel(availableWidth >= minMaxWidthRef.current.max);
		// True when at least an icon can be shown
		setShowOverlay(availableWidth >= minMaxWidthRef.current.min);
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

	const isPreviewButton =
		showPanelButton && editorExperiment('platform_editor_preview_panel_linking_exp', true);
	const label = isPreviewButton
		? formatMessage(cardMessages.previewButtonTitle)
		: formatMessage(cardMessages.openButtonTitle);

	let icon = null;
	if (isPreviewButton && showPanelButtonIcon === 'panel') {
		icon = <PanelRightIcon label="" />;
	} else if (isPreviewButton && showPanelButtonIcon === 'modal') {
		icon = <GrowDiagonalIcon label="" />;
	} else {
		icon = <LinkExternalIcon label="" />;
	}

	return (
		<span
			ref={containerRef}
			css={containerStyles}
			onDoubleClick={handleDoubleClick}
			onMouseEnter={() => handleOverlayChange(true)}
			onMouseLeave={() => handleOverlayChange(false)}
			role="presentation" // remove as part of platform_editor_hoverlink_ui_fixes_exp cleanup
			onFocus={() => {}} // remove as part of platform_editor_hoverlink_ui_fixes_exp cleanup
			onBlur={() => {}} // remove as part of platform_editor_hoverlink_ui_fixes_exp cleanup
		>
			{isHovered && (
				<Anchor
					xcss={[linkStylesCommon, linkStylesNewWithHeightFix, showOverlay && linkStylesVisible]}
					href={url}
					target="_blank"
					style={{
						paddingBlock: compactPadding
							? '1px'
							: expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
								  fg('platform_editor_content_mode_button_mvp')
								? DYNAMIC_PADDING_BLOCK
								: token('space.025'),
					}}
					onClick={handleClick}
					testId="inline-card-hoverlink-overlay"
				>
					<Box as="span" xcss={iconAndLabelStyles} ref={iconAndLabelRef}>
						<Box
							ref={iconRef}
							as="span"
							xcss={iconWrapperStyles}
							data-inlinecard-button-overlay="icon-wrapper-line-height"
							testId="inline-card-hoverlink-overlay-icon"
						>
							{icon}
						</Box>
						{(showLabel || !minMaxWidthRef.current) && (
							<Text
								size="small"
								color="color.text.subtle"
								maxLines={1}
								testId="inline-card-hoverlink-overlay-label"
							>
								{label}
							</Text>
						)}
					</Box>
				</Anchor>
			)}
			{children}
		</span>
	);
};

const HoverLinkOverlay: React.ComponentType<HoverLinkOverlayProps> = componentWithCondition(
	() => expValEquals('platform_editor_hoverlink_ui_fixes_exp', 'cohort', 'css_js_changes'),
	HoverLinkOverlayNew,
	HoverLinkOverlayOriginal,
);

export default HoverLinkOverlay;
