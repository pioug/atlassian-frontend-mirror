/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag React.Fragment
 */
import React from 'react';

import { css, jsx } from '@atlaskit/css';
import { BLOCK_CONTROL_UI_CONTEXT } from '@atlaskit/editor-common/block-controls/block-control-ui-context';
import { BLOCK_CONTROLS_LEFT_SURFACE } from '@atlaskit/editor-common/block-controls/surface-keys';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	SurfaceRenderer,
	willSurfaceRender,
} from '@atlaskit/editor-ui-control-model/surface-renderer';
import type { SurfaceContext } from '@atlaskit/editor-ui-control-model/types';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { token } from '@atlaskit/tokens';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import { getBlockControlsSurfaceControlSide } from './block-controls-surface-context';
import type { BlockControlsSurfaceTarget } from './block-controls-surface-targets';
import type { SurfaceWrapperPlacement } from './utils/get-surface-placement';
import { partitionComponentsByPersistence } from './utils/partition-components-by-persistence';
import { VisibilityContainer } from './visibility-container';

const leftSurfaceOuterStyles = css({
	position: 'absolute',
	positionVisibility: 'anchors-valid',
	zIndex: 100,
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

type BlockControlsLeftSurfaceProps = {
	api: ExtractInjectionAPI<BlockControlsPlugin>;
	components: React.ComponentProps<typeof SurfaceRenderer>['components'];
	forceVisibleOnMouseOut: boolean;
	placement: SurfaceWrapperPlacement | undefined;
	source: BlockControlsSurfaceTarget['source'];
	surfaceContext: SurfaceContext;
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
	if (!placement || !willSurfaceRender(components, BLOCK_CONTROLS_LEFT_SURFACE, surfaceContext)) {
		return null;
	}

	const { hoverOnlyComponents, persistentComponents } = partitionComponentsByPersistence(
		components,
		BLOCK_CONTROLS_LEFT_SURFACE,
		surfaceContext,
	);
	const willRenderPersistent = willSurfaceRender(
		persistentComponents,
		BLOCK_CONTROLS_LEFT_SURFACE,
		surfaceContext,
	);
	const willRenderHoverOnly = willSurfaceRender(
		hoverOnlyComponents,
		BLOCK_CONTROLS_LEFT_SURFACE,
		surfaceContext,
	);

	const isSticky = placement.isSticky;

	return (
		<div
			css={leftSurfaceOuterStyles}
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
			<div css={[leftSurfaceRowStyles, isSticky && leftSurfaceStickyStyles]}>
				{/* The partitions are separate surface trees, so their relative ranks cannot be
				    resolved together. Left-side hover controls rank before the persistent collapse
				    control and must therefore render first to keep the button order stable. */}
				{willRenderHoverOnly && (
					<VisibilityContainer
						api={api}
						controlSide={getBlockControlsSurfaceControlSide(
							surfaceContext.get(BLOCK_CONTROL_UI_CONTEXT),
							isExperimentEnabled('platform_editor_controls_reliable_anchor'),
						)}
						forceVisibleOnMouseOut={forceVisibleOnMouseOut}
						shouldUseDisplayContents
					>
						<SurfaceRenderer
							components={hoverOnlyComponents}
							surface={BLOCK_CONTROLS_LEFT_SURFACE}
							surfaceContext={surfaceContext}
						/>
					</VisibilityContainer>
				)}
				{willRenderPersistent && (
					<VisibilityContainer
						api={api}
						controlSide={getBlockControlsSurfaceControlSide(
							surfaceContext.get(BLOCK_CONTROL_UI_CONTEXT),
							isExperimentEnabled('platform_editor_controls_reliable_anchor'),
						)}
						forceVisibleOnMouseOut={forceVisibleOnMouseOut}
						isPersistent
						shouldUseDisplayContents
					>
						<SurfaceRenderer
							components={persistentComponents}
							surface={BLOCK_CONTROLS_LEFT_SURFACE}
							surfaceContext={surfaceContext}
						/>
					</VisibilityContainer>
				)}
			</div>
		</div>
	);
};
