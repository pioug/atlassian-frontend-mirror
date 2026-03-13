import React from 'react';

import type { RegisterComponent } from '../../types';

import { SurfaceComponents } from './SurfaceComponents';
import type { ComponentIdentifier, SurfaceRenderingContext } from './types';
import { PassThrough, willComponentRender } from './utils';

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
}: SurfaceComponentProps): React.JSX.Element | null => {
	if (!willComponentRender(component, childrenMap)) {
		return null;
	}

	const children = childrenMap.get(component.key);
	const Component = component.component ?? fallbacks?.[component.type] ?? PassThrough;
	const newParents: ComponentIdentifier[] = [
		...parents,
		{ key: component.key, type: component.type },
	];

	if (!children || children.length === 0) {
		return <Component parents={parents}>{null}</Component>;
	}

	return (
		<Component parents={parents}>
			<SurfaceComponents
				components={children}
				childrenMap={childrenMap}
				fallbacks={fallbacks}
				parents={newParents}
			/>
		</Component>
	);
};
