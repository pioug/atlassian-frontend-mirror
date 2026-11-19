/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag React.Fragment
 */
import React from 'react';

import { cssMap } from '@compiled/react';

import { css, jsx } from '@atlaskit/css';
import { BLOCK_CONTROL_UI_CONTEXT } from '@atlaskit/editor-common/block-controls/block-control-ui-context';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { SurfaceRenderer } from '@atlaskit/editor-ui-control-model/surface-renderer';
import type { SurfaceContext } from '@atlaskit/editor-ui-control-model/types';
import { token } from '@atlaskit/tokens';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import {
	BlockControlsSurfaceWithClsFix,
	type BlockControlsSurfaceWrapperProps,
} from '../surface-lifecycle/block-controls-surface-with-cls-fix';
import type { BlockControlsSurfaceTarget } from './block-controls-surface-targets';
import type { SurfaceWrapperPlacement } from './utils/get-surface-placement';

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
};
