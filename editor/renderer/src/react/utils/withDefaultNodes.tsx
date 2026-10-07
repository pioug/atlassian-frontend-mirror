import React, {
	type ComponentType,
	type ExoticComponent,
	type JSX,
	type ReactNode,
	useMemo,
} from 'react';

import type { NodeComponentsProps } from '../../ui/Renderer/types';
import { nodes } from '../nodes/nodes';

type PropsWithNodeComponents = {
	nodeComponents?: NodeComponentsProps;
};

/**
 * Helper HOC to inject a synchronous set of default nodes into the renderer.
 *
 * @param BaseComponent Renderer without default nodes
 * @returns Renderer, with synchronous set of default nodes
 */
export function withDefaultNodes<T extends PropsWithNodeComponents>(
	BaseComponent: ComponentType<T> | ExoticComponent<T> | ((props: T) => ReactNode),
): (props: T) => JSX.Element {
	const ComponentWithDefaultNodes = (props: T): JSX.Element => {
		const nodeComponentsWithDefaultNodes = useMemo(
			() => ({
				...nodes,
				...props.nodeComponents,
			}),
			[props.nodeComponents],
		);

		// eslint-disable-next-line react/jsx-props-no-spreading
		return <BaseComponent {...props} nodeComponents={nodeComponentsWithDefaultNodes} />;
	};

	return ComponentWithDefaultNodes;
}
