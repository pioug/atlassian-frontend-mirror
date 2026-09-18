import React from 'react';

import type { ComponentIdentifier, RegisterComponent } from '../../types';
import { SurfaceComponents } from './SurfaceComponents';
import type { SurfaceRenderingContext } from './types';
import { getComponentIdentity, PassThrough, willComponentRender } from './utils';

type SurfaceComponentProps = SurfaceRenderingContext & {
	component: RegisterComponent;
};

/**
 * Renders a single registered component and recurses into its children.
 *
 * Skips rendering when `willComponentRender` returns false (hidden items
 * or empty containers with no visible descendants).
 */
export const SurfaceComponent = ({
	component,
	childrenMap,
	fallbacks,
	parents,
	surfaceContext,
}: SurfaceComponentProps): React.JSX.Element | null => {
	if (!willComponentRender(component, childrenMap, surfaceContext)) {
		return null;
	}

	const children = childrenMap.get(getComponentIdentity(component));
	const Component = component.component ?? fallbacks?.[component.type] ?? PassThrough;
	const newParents: ComponentIdentifier[] = [
		...parents,
		{ key: component.key, type: component.type },
	];

	if (!children || children.length === 0) {
		return (
			<Component parents={parents} surfaceContext={surfaceContext}>
				{null}
			</Component>
		);
	}

	return (
		<Component parents={parents} surfaceContext={surfaceContext}>
			<SurfaceComponents
				components={children}
				childrenMap={childrenMap}
				fallbacks={fallbacks}
				parents={newParents}
				surfaceContext={surfaceContext}
			/>
		</Component>
	);
};
