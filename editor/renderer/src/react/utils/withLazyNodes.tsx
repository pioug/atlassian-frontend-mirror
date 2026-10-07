import React, {
	type ComponentType,
	type ExoticComponent,
	type JSX,
	type ReactNode,
	useMemo,
} from 'react';

import type { NodeComponentsProps } from '../../ui/Renderer/types';
import { nodeToReact } from '../nodes';

type PropsWithNodeComponents = {
	nodeComponents?: NodeComponentsProps;
};

/**
 * Helper HOC to inject the legacy lazy-loaded set of nodes into the renderer.
 *
 * @param BaseComponent Renderer without default nodes
 * @returns Renderer, with lazy-loaded default nodes
 */
export function withLazyNodes<T extends PropsWithNodeComponents>(
	BaseComponent: ComponentType<T> | ExoticComponent<T> | ((props: T) => ReactNode),
): (props: T) => JSX.Element {
	const ComponentWithLazyNodes = (props: T): JSX.Element => {
		const nodeComponentsWithLazyNodes = useMemo(
			() => ({
				...nodeToReact,
				...props.nodeComponents,
			}),
			[props.nodeComponents],
		);

		// eslint-disable-next-line react/jsx-props-no-spreading
		return <BaseComponent {...props} nodeComponents={nodeComponentsWithLazyNodes} />;
	};

	return ComponentWithLazyNodes;
}
