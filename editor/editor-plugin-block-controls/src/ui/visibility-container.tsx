/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { css, jsx } from '@emotion/react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { akEditorFullPageNarrowBreakout } from '@atlaskit/editor-shared-styles';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/editor-experiment';

import type { BlockControlsPlugin } from '../blockControlsPluginType';

const RIGHT_CONTROL_HIDE_DELAY_MS = 150;

interface VisibilityContainerProps {
	api?: ExtractInjectionAPI<BlockControlsPlugin>;
	children: React.ReactNode;
	controlSide?: 'left' | 'right';
	forceVisibleOnMouseOut?: boolean;
	isPersistent?: boolean;
	/**
	 * Set when the container should not create its own layout box while its descendants retain theirs.
	 */
	shouldUseDisplayContents?: boolean;
}

type VisibilityWrapperProps = Pick<
	VisibilityContainerProps,
	'children' | 'shouldUseDisplayContents'
> & {
	shouldHide: boolean;
	useCssStyles: boolean;
};

type BlockControlsVisibilityOptions = Omit<
	VisibilityContainerProps,
	'children' | 'shouldUseDisplayContents'
>;

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

const displayContentsStyles = xcss({
	display: 'contents',
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

const displayContentsStylesCSS = css({
	display: 'contents',
});

/**
 * Resolves visibility once so a surface can apply the same state to each rendered control without
 * creating a plugin-state subscription and hide-delay timer for every control wrapper.
 */
export const useBlockControlsVisibility = ({
	api,
	controlSide,
	forceVisibleOnMouseOut,
	isPersistent,
}: BlockControlsVisibilityOptions): {
	shouldHide: boolean;
	useCssStyles: boolean;
} => {
	const {
		isTypeAheadOpen,
		isEditing,
		isMouseOut,
		hoverSide,
		editorViewMode,
		userIntent,
		isDisplayingDiff,
		rightSideControlsEnabled,
	} = useSharedPluginStateWithSelector(
		api,
		['typeAhead', 'blockControls', 'editorViewMode', 'userIntent', 'showDiff'],
		(states) => ({
			isTypeAheadOpen: states.typeAheadState?.isOpen,
			isEditing: states.blockControlsState?.isEditing,
			isMouseOut: states.blockControlsState?.isMouseOut,
			hoverSide: states.blockControlsState?.hoverSide,
			editorViewMode: states.editorViewModeState?.mode,
			userIntent: states.userIntentState?.currentUserIntent,
			isDisplayingDiff: states.showDiffState?.isDisplayingChanges,
			rightSideControlsEnabled: states.blockControlsState?.rightSideControlsEnabled,
		}),
	);

	const isViewMode = editorViewMode === 'view';
	// rightSideControlsEnabled is the single source of truth (confluence_remix_button_right_side_block_fg from preset)
	// Both controls are restricted by side: the drag handle shows on the left half, the Remix button on
	// the right half (and the right margin), matching the midpoint split in handle-mouse-move.
	const shouldRestrictBySide = rightSideControlsEnabled && controlSide !== undefined && !isViewMode;
	// Only restrict by side when hoverSide is known (after mousemove). When undefined, show both
	// controls so drag handle is visible on load and for keyboard-only users.
	const sideHidden =
		shouldRestrictBySide && hoverSide !== undefined ? hoverSide !== controlSide : false;
	// In view mode with right-side controls, we delay hiding on isMouseOut (see below) so the right-edge
	// button stays visible when the user moves from the block toward the button (e.g. in edit/live
	// pages), avoiding flicker as the mouse crosses boundaries.
	const hideOnMouseOut = isMouseOut;
	// When forceVisibleOnMouseOut is true (e.g. drag handle focused via keyboard Shift+Ctrl+H),
	// override the mouse-out condition so the control stays visible regardless of mouse position.
	const shouldHideWhenMouseOut = forceVisibleOnMouseOut ? false : hideOnMouseOut;
	// Persistent controls (e.g. an AI suggestion icon on every qualifying node) aren't hover-driven,
	// so none of the hover/typing/mouse-out/diff-review reasons below apply to them — they're never
	// hidden by this container.
	const shouldHideImmediate =
		!isPersistent &&
		(isTypeAheadOpen ||
			isEditing ||
			shouldHideWhenMouseOut ||
			userIntent === 'aiStreaming' ||
			// EDITOR-7926: hide the drag handle while a diff is on screen or a suggestion card is open.
			isDisplayingDiff ||
			userIntent === 'reviewing' ||
			sideHidden);

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
	const useCssStyles = editorExperiment('platform_editor_preview_panel_responsiveness', true, {
		exposure: true,
	});

	return { shouldHide, useCssStyles };
};

export const VisibilityWrapper = ({
	children,
	shouldHide,
	shouldUseDisplayContents,
	useCssStyles,
}: VisibilityWrapperProps): jsx.JSX.Element => {
	if (useCssStyles) {
		return (
			<div
				css={[
					baseStylesCSS,
					shouldHide ? hiddenStylesCSS : visibleStylesCSS,
					shouldUseDisplayContents && displayContentsStylesCSS,
				]}
			>
				{children}
			</div>
		);
	}

	return (
		<Box
			// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
			xcss={[
				baseStyles,
				shouldHide ? hiddenStyles : visibleStyles,
				shouldUseDisplayContents && displayContentsStyles,
			]}
		>
			{children}
		</Box>
	);
};

export const VisibilityContainer = ({
	api,
	children,
	controlSide,
	forceVisibleOnMouseOut,
	isPersistent,
	shouldUseDisplayContents,
}: VisibilityContainerProps): jsx.JSX.Element => {
	const { shouldHide, useCssStyles } = useBlockControlsVisibility({
		api,
		controlSide,
		forceVisibleOnMouseOut,
		isPersistent,
	});

	return (
		<VisibilityWrapper
			shouldHide={shouldHide}
			shouldUseDisplayContents={shouldUseDisplayContents}
			useCssStyles={useCssStyles}
		>
			{children}
		</VisibilityWrapper>
	);
};
