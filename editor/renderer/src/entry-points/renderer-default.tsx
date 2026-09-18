/* eslint-disable @atlaskit/editor/no-re-export */

import React from 'react';
import type { ComponentType, JSX } from 'react';

import { nodes } from '../react/nodes/nodes';
import RenderLegacy, {
	RendererFunctionalComponent as RendererFunctionalComponentLegacy,
	RendererWithAnalytics as RendererWithAnalyticsLegacy,
} from '../ui/Renderer/index';
import type { NodeComponentsProps } from '../ui/Renderer/types';

export { DEGRADED_SEVERITY_THRESHOLD, NORMAL_SEVERITY_THRESHOLD } from '../ui/Renderer/index';
export type { RendererWrapperProps } from '../ui/Renderer/index';

type PropsWithNodeComponents = {
	nodeComponents?: NodeComponentsProps;
};

function withSyncNodes<T extends PropsWithNodeComponents>(
	BaseComponent: ComponentType<T>,
): (props: T) => JSX.Element {
	const ComponentWithSyncNodes = (props: T): JSX.Element => {
		const nodeComponentsWithSyncNodes = React.useMemo(
			() => ({
				...nodes,
				...props.nodeComponents,
			}),
			[props.nodeComponents],
		);

		// eslint-disable-next-line react/jsx-props-no-spreading
		return <BaseComponent {...props} nodeComponents={nodeComponentsWithSyncNodes} />;
	};

	return ComponentWithSyncNodes;
}

export const Renderer: typeof RenderLegacy = withSyncNodes(RenderLegacy);
export const RendererFunctionalComponent: typeof RendererFunctionalComponentLegacy = withSyncNodes(
	RendererFunctionalComponentLegacy,
);
export const RendererWithAnalytics: typeof RenderLegacy = withSyncNodes(
	RendererWithAnalyticsLegacy,
);
