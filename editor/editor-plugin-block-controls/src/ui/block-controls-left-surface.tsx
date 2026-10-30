/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag React.Fragment
 */
import React from 'react';

import { cssMap } from '@compiled/react';

import { css, jsx } from '@atlaskit/css';
import { BLOCK_CONTROL_UI_CONTEXT } from '@atlaskit/editor-common/block-controls/block-control-ui-context';
import { BLOCK_CONTROLS_LEFT_SURFACE } from '@atlaskit/editor-common/block-controls/surface-keys';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { SurfaceRenderer } from '@atlaskit/editor-ui-control-model/surface-renderer';
import type { SurfaceContext } from '@atlaskit/editor-ui-control-model/types';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { token } from '@atlaskit/tokens';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import {
	BlockControlsSurfaceWithClsFix,
	type BlockControlsSurfaceWrapperProps,
} from '../surface-lifecycle/block-controls-surface-with-cls-fix';
import { BlockControlsVisibilityProvider } from './block-controls-surface-components';
import { getBlockControlsSurfaceControlSide } from './block-controls-surface-context';
import type { BlockControlsSurfaceTarget } from './block-controls-surface-targets';
import type { SurfaceWrapperPlacement } from './utils/get-surface-placement';
import { useBlockControlsVisibility } from './visibility-container';

const leftSurfaceHiddenWrapperStyles = css({
	visibility: 'hidden',
});

const leftSurfaceOuterStyles = css({
	position: 'absolute',
	positionVisibility: 'anchors-valid',
	zIndex: 100,
});

const leftSurfaceGutterStyles = cssMap({
	container: {
		containerName: 'block-controls-left-gutter',
		containerType: 'inline-size',
		pointerEvents: 'none',
	},
	row: {
		justifyContent: 'flex-end',
		pointerEvents: 'none',
		// Restoring pointer events on each control keeps it interactive without making the
		// full-width gutter a hit target.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > *': {
			pointerEvents: 'auto',
		},
		// The left surface has room for two controls below 68px. Controls are ranked in DOM order,
		// so keep the final two and remove any lower-ranked controls from layout and keyboard order.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries
		'@container block-controls-left-gutter (max-width: 67px)': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'& > [data-editor-block-control-item]:nth-last-child(n+3)': {
				display: 'none',
			},
		},
	},
});

// Nested surfaces (e.g. a table inside an expand) can span the target node's full height and sit
// over controls rendered in the node's own gutter, such as the table row insert button. Let pointer
// events pass through the wrapper and row so those controls stay interactive, matching the top-level
// gutter behaviour without applying its container query sizing.
const nestedSurfacePointerEventsStyles = cssMap({
	container: {
		pointerEvents: 'none',
	},
	row: {
		pointerEvents: 'none',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > *': {
			pointerEvents: 'auto',
		},
	},
});

const leftSurfaceRowStyles = css({
	alignItems: 'center',
	display: 'flex',
	gap: token('space.025'),
});

// Applied in addition to leftSurfaceRowStyles when the target node is sticky-eligible (e.g. long
// tables): the outer wrapper spans the node's full height (see `placement.height`), so the content
// can stick near the top of the viewport instead of scrolling off with the node's top edge.
// Keep in sync with STICKY_CONTROLS_TOP_MARGIN in ./consts (must be a static literal here).
const leftSurfaceStickyStyles = css({
	position: 'sticky',
	top: token('space.100'),
});

// Keep in sync with STICKY_CONTROLS_TOP_MARGIN_FOR_STICKY_HEADER in ./consts (must be a static literal here)
const leftSurfaceStickyTableHeaderStyles = css({
	top: token('space.300'),
});

type BlockControlsLeftSurfaceProps = {
	api: ExtractInjectionAPI<BlockControlsPlugin>;
	components: React.ComponentProps<typeof SurfaceRenderer>['components'];
	forceVisibleOnMouseOut: boolean;
	placement: SurfaceWrapperPlacement | undefined;
	source: BlockControlsSurfaceTarget['source'];
	surfaceContext: SurfaceContext;
};

type BlockControlsLeftSurfaceContentProps = Omit<BlockControlsLeftSurfaceProps, 'placement'> & {
	placement: SurfaceWrapperPlacement;
};

const BlockControlsLeftSurfaceContent = ({
	api,
	components,
	forceVisibleOnMouseOut,
	placement,
	source,
	surfaceContext,
}: BlockControlsLeftSurfaceContentProps): React.JSX.Element => {
	const blockControlsContext = surfaceContext.get(BLOCK_CONTROL_UI_CONTEXT);
	const controlSide = getBlockControlsSurfaceControlSide(
		blockControlsContext,
		isExperimentEnabled('platform_editor_controls_reliable_anchor'),
	);
	const { shouldHide: shouldHideHoverControls, useCssStyles } = useBlockControlsVisibility({
		api,
		controlSide,
		forceVisibleOnMouseOut,
	});
	const isSticky = placement.isSticky;
	const isTopLevel = blockControlsContext?.targetNode.parentType === 'doc';
	const shouldPassThroughNestedPointerEvents =
		!isTopLevel && isExperimentEnabled('platform_editor_nested_left_surface_pointer_fix');

	return (
		<div
			css={[
				leftSurfaceOuterStyles,
				isTopLevel && leftSurfaceGutterStyles.container,
				shouldPassThroughNestedPointerEvents && nestedSurfacePointerEventsStyles.container,
			]}
			data-editor-block-controls-surface
			data-editor-block-controls-side="left"
			data-testid={
				source === 'stored'
					? 'block-controls-left-surface-stored'
					: source === 'active'
						? 'block-controls-left-surface-active'
						: 'block-controls-left-surface'
			}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Placement is resolved per target node, from its runtime DOM geometry or from its CSS anchor.
			style={placement.style}
		>
			<div
				css={[
					leftSurfaceRowStyles,
					isTopLevel && leftSurfaceGutterStyles.row,
					shouldPassThroughNestedPointerEvents && nestedSurfacePointerEventsStyles.row,
					isSticky && leftSurfaceStickyStyles,
					isSticky &&
						blockControlsContext?.targetNode.type.name === 'table' &&
						isExperimentEnabled('platform_editor_block_controls_sticky_header_fix') &&
						leftSurfaceStickyTableHeaderStyles,
				]}
			>
				<BlockControlsVisibilityProvider
					shouldHideHoverControls={shouldHideHoverControls}
					useCssStyles={useCssStyles}
				>
					<SurfaceRenderer
						components={components}
						surface={BLOCK_CONTROLS_LEFT_SURFACE}
						surfaceContext={surfaceContext}
					/>
				</BlockControlsVisibilityProvider>
			</div>
		</div>
	);
};

const BlockControlsLeftSurfaceWrapper = ({
	children,
	placement,
	source,
	surfaceContext,
}: BlockControlsSurfaceWrapperProps): React.JSX.Element => {
	const blockControlsContext = surfaceContext.get(BLOCK_CONTROL_UI_CONTEXT);
	const isSticky = placement.isSticky;
	const isTopLevel = blockControlsContext?.targetNode.parentType === 'doc';

	return (
		<div
			css={[
				leftSurfaceOuterStyles,
				isTopLevel && leftSurfaceGutterStyles.container,
				leftSurfaceHiddenWrapperStyles,
			]}
			data-editor-block-controls-surface
			data-editor-block-controls-side="left"
			data-testid={
				source === 'stored'
					? 'block-controls-left-surface-stored'
					: source === 'active'
						? 'block-controls-left-surface-active'
						: 'block-controls-left-surface'
			}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Placement is resolved per target node, from its runtime DOM geometry or from its CSS anchor.
			style={placement.style}
		>
			<div
				css={[
					leftSurfaceRowStyles,
					isTopLevel && leftSurfaceGutterStyles.row,
					isSticky && leftSurfaceStickyStyles,
					isSticky &&
						blockControlsContext?.targetNode.type.name === 'table' &&
						isExperimentEnabled('platform_editor_block_controls_sticky_header_fix') &&
						leftSurfaceStickyTableHeaderStyles,
				]}
			>
				{children}
			</div>
		</div>
	);
};

/** Renders one left block-controls surface at a document position. */
export const BlockControlsLeftSurface = ({
	api,
	components,
	forceVisibleOnMouseOut,
	placement,
	source,
	surfaceContext,
}: BlockControlsLeftSurfaceProps): React.JSX.Element | null => {
	if (!placement) {
		return null;
	}

	if (isExperimentEnabled('platform_editor_block_controls_cls_fix')) {
		return (
			<BlockControlsSurfaceWithClsFix
				side="left"
				SurfaceWrapper={BlockControlsLeftSurfaceWrapper}
				api={api}
				components={components}
				forceVisibleOnMouseOut={forceVisibleOnMouseOut}
				placement={placement}
				source={source}
				surfaceContext={surfaceContext}
			/>
		);
	} else {
		return (
			<BlockControlsLeftSurfaceContent
				api={api}
				components={components}
				forceVisibleOnMouseOut={forceVisibleOnMouseOut}
				placement={placement}
				source={source}
				surfaceContext={surfaceContext}
			/>
		);
	}
};
