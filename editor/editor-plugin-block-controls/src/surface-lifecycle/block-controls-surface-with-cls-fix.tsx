import React from 'react';

import { BLOCK_CONTROL_UI_CONTEXT } from '@atlaskit/editor-common/block-controls/block-control-ui-context';
import {
	BLOCK_CONTROLS_LEFT_SURFACE,
	BLOCK_CONTROLS_RIGHT_SURFACE,
} from '@atlaskit/editor-common/block-controls/surface-keys';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { SurfaceRenderer } from '@atlaskit/editor-ui-control-model/surface-renderer';
import type { SurfaceContext } from '@atlaskit/editor-ui-control-model/types';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import { BlockControlsVisibilityProvider } from '../ui/block-controls-surface-components';
import { getBlockControlsSurfaceControlSide } from '../ui/block-controls-surface-context';
import type { BlockControlsSurfaceTarget } from '../ui/block-controls-surface-targets';
import type { SurfaceSide, SurfaceWrapperPlacement } from '../ui/utils/get-surface-placement';
import { useBlockControlsVisibility } from '../ui/visibility-container';

export type BlockControlsSurfaceWrapperProps = {
	children: React.ReactNode;
	placement: SurfaceWrapperPlacement;
	source: BlockControlsSurfaceTarget['source'];
	surfaceContext: SurfaceContext;
};

type Props = {
	api: ExtractInjectionAPI<BlockControlsPlugin>;
	components: React.ComponentProps<typeof SurfaceRenderer>['components'];
	forceVisibleOnMouseOut: boolean;
	placement: SurfaceWrapperPlacement;
	side: SurfaceSide;
	source: BlockControlsSurfaceTarget['source'];
	surfaceContext: SurfaceContext;
	SurfaceWrapper: React.ComponentType<BlockControlsSurfaceWrapperProps>;
};

/** Renders one block-controls surface for either side on the CLS fix path. */
export const BlockControlsSurfaceWithClsFix = ({
	api,
	components,
	forceVisibleOnMouseOut,
	placement,
	side,
	source,
	surfaceContext,
	SurfaceWrapper,
}: Props): React.JSX.Element => {
	const controlSide =
		side === 'left'
			? getBlockControlsSurfaceControlSide(
					surfaceContext.get(BLOCK_CONTROL_UI_CONTEXT),
					isExperimentEnabled('platform_editor_controls_reliable_anchor'),
				)
			: 'right';
	const { shouldHide: shouldHideHoverControls, useCssStyles } = useBlockControlsVisibility({
		api,
		controlSide,
		forceVisibleOnMouseOut,
	});
	return (
		<SurfaceWrapper placement={placement} source={source} surfaceContext={surfaceContext}>
			<BlockControlsVisibilityProvider
				shouldHideHoverControls={shouldHideHoverControls}
				useCssStyles={useCssStyles}
			>
				<SurfaceRenderer
					components={components}
					surface={side === 'left' ? BLOCK_CONTROLS_LEFT_SURFACE : BLOCK_CONTROLS_RIGHT_SURFACE}
					surfaceContext={surfaceContext}
				/>
			</BlockControlsVisibilityProvider>
		</SurfaceWrapper>
	);
};
