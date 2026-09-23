/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag React.Fragment
 */
import React from 'react';

import { css, jsx } from '@atlaskit/css';
import { BLOCK_CONTROLS_RIGHT_SURFACE } from '@atlaskit/editor-common/block-controls/surface-keys';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { SurfaceRenderer } from '@atlaskit/editor-ui-control-model/surface-renderer';
import type { SurfaceContext } from '@atlaskit/editor-ui-control-model/types';
import { token } from '@atlaskit/tokens';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import { BlockControlsVisibilityProvider } from './block-controls-surface-components';
import type { BlockControlsSurfaceTarget } from './block-controls-surface-targets';
import type { SurfaceWrapperPlacement } from './utils/get-surface-placement';
import { useBlockControlsVisibility } from './visibility-container';

const rightSurfaceOuterStyles = css({
	position: 'absolute',
	positionVisibility: 'anchors-valid',
	zIndex: 100,
});

const rightSurfaceRowStyles = css({
	alignItems: 'center',
	display: 'flex',
	gap: token('space.025'),
});

// Applied in addition to rightSurfaceRowStyles when the target node is sticky-eligible (e.g. long
// tables): the outer wrapper spans the node's full height (see `placement.height`), so the content
// can stick near the top of the viewport instead of scrolling off with the node's top edge.
// Keep in sync with STICKY_CONTROLS_TOP_MARGIN in ./consts (must be a static literal here).
const rightSurfaceStickyStyles = css({
	position: 'sticky',
	top: token('space.100'),
});

type BlockControlsRightSurfaceProps = {
	api: ExtractInjectionAPI<BlockControlsPlugin>;
	components: React.ComponentProps<typeof SurfaceRenderer>['components'];
	forceVisibleOnMouseOut: boolean;
	placement: SurfaceWrapperPlacement | undefined;
	source: BlockControlsSurfaceTarget['source'];
	surfaceContext: SurfaceContext;
};

type BlockControlsRightSurfaceContentProps = Omit<BlockControlsRightSurfaceProps, 'placement'> & {
	placement: SurfaceWrapperPlacement;
};

const BlockControlsRightSurfaceContent = ({
	api,
	components,
	forceVisibleOnMouseOut,
	placement,
	source,
	surfaceContext,
}: BlockControlsRightSurfaceContentProps): React.JSX.Element => {
	const { shouldHide: shouldHideHoverControls, useCssStyles } = useBlockControlsVisibility({
		api,
		controlSide: 'right',
		forceVisibleOnMouseOut,
	});
	const isSticky = placement.isSticky;

	return (
		<div
			css={rightSurfaceOuterStyles}
			data-editor-block-controls-surface
			data-editor-block-controls-side="right"
			data-testid={
				source === 'stored'
					? 'block-controls-right-surface-stored'
					: source === 'active'
						? 'block-controls-right-surface-active'
						: 'block-controls-right-surface'
			}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Placement is resolved per target node, from its runtime DOM geometry or from its CSS anchor.
			style={placement.style}
		>
			<div css={[rightSurfaceRowStyles, isSticky && rightSurfaceStickyStyles]}>
				<BlockControlsVisibilityProvider
					shouldHideHoverControls={shouldHideHoverControls}
					useCssStyles={useCssStyles}
				>
					<SurfaceRenderer
						components={components}
						surface={BLOCK_CONTROLS_RIGHT_SURFACE}
						surfaceContext={surfaceContext}
					/>
				</BlockControlsVisibilityProvider>
			</div>
		</div>
	);
};

/** Renders one right block-controls surface at a document position. */
export const BlockControlsRightSurface = ({
	api,
	components,
	forceVisibleOnMouseOut,
	placement,
	source,
	surfaceContext,
}: BlockControlsRightSurfaceProps): React.JSX.Element | null => {
	if (!placement) {
		return null;
	}

	return (
		<BlockControlsRightSurfaceContent
			api={api}
			components={components}
			forceVisibleOnMouseOut={forceVisibleOnMouseOut}
			placement={placement}
			source={source}
			surfaceContext={surfaceContext}
		/>
	);
};
