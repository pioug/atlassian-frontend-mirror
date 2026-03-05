/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { akEditorFullPageNarrowBreakout } from '@atlaskit/editor-shared-styles';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { BlockControlsPlugin } from '../blockControlsPluginType';

const RIGHT_CONTROL_HIDE_DELAY_MS = 150;

interface VisibilityContainerProps {
	api?: ExtractInjectionAPI<BlockControlsPlugin>;
	children: React.ReactNode;
	controlSide?: 'left' | 'right';
}

const baseStyles = xcss({
	transition: 'opacity 0.1s ease-in-out, visibility 0.1s ease-in-out',
});

const visibleStyles = xcss({
	opacity: 1,
	visibility: 'visible',
});

const hiddenStyles = xcss({
	opacity: 0,
	visibility: 'hidden',
});

const baseStylesCSS = css({
	transition: 'opacity 0.1s ease-in-out, visibility 0.1s ease-in-out',

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	[`@container editor-area (max-width: ${akEditorFullPageNarrowBreakout}px)`]: {
		opacity: 0,
		visibility: 'hidden',
	},
});

const visibleStylesCSS = css({
	opacity: 1,
	visibility: 'visible',
});

const hiddenStylesCSS = css({
	opacity: 0,
	visibility: 'hidden',
});

export const VisibilityContainer = ({ api, children, controlSide }: VisibilityContainerProps) => {
	const {
		isTypeAheadOpen,
		isEditing,
		isMouseOut,
		hoverSide,
		editorViewMode,
		userIntent,
		rightSideControlsEnabled,
	} = useSharedPluginStateWithSelector(
		api,
		['typeAhead', 'blockControls', 'editorViewMode', 'userIntent'],
		(states) => ({
			isTypeAheadOpen: states.typeAheadState?.isOpen,
			isEditing: states.blockControlsState?.isEditing,
			isMouseOut: states.blockControlsState?.isMouseOut,
			hoverSide: states.blockControlsState?.hoverSide,
			editorViewMode: states.editorViewModeState?.mode,
			userIntent: states.userIntentState?.currentUserIntent,
			rightSideControlsEnabled: states.blockControlsState?.rightSideControlsEnabled,
		}),
	);

	const isViewMode = editorViewMode === 'view';
	// rightSideControlsEnabled is the single source of truth (confluence_remix_icon_right_side from preset)
	const shouldRestrictBySide = rightSideControlsEnabled && controlSide !== undefined && !isViewMode;
	// Only restrict by side when hoverSide is known (after mousemove). When undefined, show both
	// controls so drag handle is visible on load and for keyboard-only users.
	const sideHidden =
		shouldRestrictBySide && hoverSide !== undefined ? hoverSide !== controlSide : false;
	// In view mode with right-side controls, we delay hiding on isMouseOut (see below) so the right-edge
	// button stays visible when the user moves from the block toward the button (e.g. in edit/live
	// pages), avoiding flicker as the mouse crosses boundaries.
	const hideOnMouseOut = isMouseOut;
	const shouldHideImmediate =
		isTypeAheadOpen || isEditing || hideOnMouseOut || userIntent === 'aiStreaming' || sideHidden;

	// Delay hiding the right control in view mode to reduce flickering when moving from block
	// toward the right-edge button (avoids rapid show/hide as mouse crosses boundaries).
	const isRightControlViewMode = isViewMode && rightSideControlsEnabled && controlSide === 'right';
	// When in right-control view mode, we delay hiding so start visible; useEffect will update after delay
	const [delayedShouldHide, setDelayedShouldHide] = useState(false);
	const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (!isRightControlViewMode) {
			return;
		}
		if (!shouldHideImmediate) {
			if (hideTimeoutRef.current) {
				clearTimeout(hideTimeoutRef.current);
				hideTimeoutRef.current = null;
			}
			setDelayedShouldHide(false);
			return;
		}
		hideTimeoutRef.current = setTimeout(() => {
			hideTimeoutRef.current = null;
			setDelayedShouldHide(true);
		}, RIGHT_CONTROL_HIDE_DELAY_MS);
		return () => {
			if (hideTimeoutRef.current) {
				clearTimeout(hideTimeoutRef.current);
			}
		};
	}, [shouldHideImmediate, isRightControlViewMode]);

	const shouldHide = isRightControlViewMode ? delayedShouldHide : shouldHideImmediate;

	if (
		editorExperiment('platform_editor_preview_panel_responsiveness', true, {
			exposure: true,
		})
	) {
		return (
			<div css={[baseStylesCSS, shouldHide ? hiddenStylesCSS : visibleStylesCSS]}>{children}</div>
		);
	}

	return <Box xcss={[baseStyles, shouldHide ? hiddenStyles : visibleStyles]}>{children}</Box>;
};
