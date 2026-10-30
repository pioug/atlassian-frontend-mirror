import React, { memo, useLayoutEffect, useMemo, useSyncExternalStore } from 'react';

import { isCSSAnchorSupported } from '@atlaskit/editor-common/styles/native-anchor';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import { getNodeTypeWithLevel } from '../pm-plugins/decorations-common';
import { BlockControlsLeftSurface } from '../ui/block-controls-left-surface';
import { BlockControlsRightSurface } from '../ui/block-controls-right-surface';
import {
	getAnchoredLeftGutterSurfacePlacement,
	getAnchoredSurfacePlacement,
	type SurfaceSide,
	type SurfaceWrapperPlacement,
} from '../ui/utils/get-surface-placement';
import type { SurfaceDescriptor } from './block-controls-surface-descriptors';
import { getSurfaceLifecycle } from './surface-lifecycle';
import { getSurfaceKey, useMeasuredSurfacePlacements } from './use-measured-surface-placements';

type Props = {
	api: ExtractInjectionAPI<BlockControlsPlugin>;
	editorView: EditorView;
};

type CommittedSurfaceProps = Pick<Props, 'api'> & {
	descriptor: SurfaceDescriptor;
	forceVisibleOnMouseOut: boolean;
	/** Placement measured from DOM geometry, used only when CSS anchors are unsupported. */
	measuredPlacement: SurfaceWrapperPlacement | undefined;
	side: SurfaceSide;
};

const CommittedSurface = memo(
	({ api, descriptor, side, forceVisibleOnMouseOut, measuredPlacement }: CommittedSurfaceProps) => {
		const { anchorName, blockControlsContext, isTopLevel } = descriptor;
		const nodeType = blockControlsContext.targetNode.type.name;
		const nodeTypeWithLevel = getNodeTypeWithLevel(blockControlsContext.targetNode.node);
		const layout = blockControlsContext.targetNode.node.attrs.layout;
		const parentNodeType =
			blockControlsContext.targetNode.parentType === 'doc'
				? undefined
				: blockControlsContext.targetNode.parentType;
		const anchoredPlacement = useMemo(() => {
			if (!isCSSAnchorSupported()) {
				return undefined;
			}
			const options = { anchorName, nodeType, nodeTypeWithLevel, layout, parentNodeType, side };
			return side === 'left' && isTopLevel
				? getAnchoredLeftGutterSurfacePlacement(options)
				: getAnchoredSurfacePlacement(options);
		}, [anchorName, nodeType, nodeTypeWithLevel, layout, parentNodeType, side, isTopLevel]);
		const Surface = side === 'left' ? BlockControlsLeftSurface : BlockControlsRightSurface;
		return (
			<Surface
				api={api}
				components={descriptor.surfaceComponents}
				forceVisibleOnMouseOut={forceVisibleOnMouseOut}
				placement={anchoredPlacement ?? measuredPlacement}
				source={descriptor.source}
				surfaceContext={descriptor.surfaceContext}
			/>
		);
	},
);

export const CommittedBlockControlsSurfaces = (props: Props): React.JSX.Element | null => {
	const lifecycle = getSurfaceLifecycle(props.editorView);
	const snapshot = useSyncExternalStore(
		lifecycle.subscribe,
		lifecycle.getSnapshot,
		() => undefined,
	);
	const measuredPlacements = useMeasuredSurfacePlacements(
		props.editorView,
		snapshot?.left,
		snapshot?.right,
	);
	useLayoutEffect(() => {
		if (snapshot) {
			lifecycle.acknowledge(snapshot.revision);
		}
	}, [lifecycle, snapshot]);

	if (!snapshot) {
		return null;
	}

	return (
		<>
			{(['left', 'right'] as const).flatMap((side) =>
				snapshot[side].map((descriptor) => (
					<CommittedSurface
						key={getSurfaceKey(side, descriptor)}
						api={props.api}
						descriptor={descriptor}
						side={side}
						forceVisibleOnMouseOut={snapshot.forceVisibleOnMouseOut}
						measuredPlacement={measuredPlacements.get(getSurfaceKey(side, descriptor))}
					/>
				)),
			)}
		</>
	);
};
