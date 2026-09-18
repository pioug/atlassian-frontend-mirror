import React from 'react';

import type { RegisterComponent } from '../../types';
import { SurfaceComponent } from './SurfaceComponent';
import type { SurfaceRenderingContext } from './types';
import { getComponentIdentity } from './utils';

type SurfaceComponentsProps = SurfaceRenderingContext & {
	components?: RegisterComponent[];
};

/**
 * Renders a list of registered components.
 * Returns null when there are no components to render.
 */
export const SurfaceComponents = ({
	components,
	childrenMap,
	fallbacks,
	parents,
	surfaceContext,
}: SurfaceComponentsProps): React.JSX.Element | null => {
	if (!components?.length) {
		return null;
	}

	return (
		<>
			{components.map((component) => (
				<SurfaceComponent
					key={getComponentIdentity(component)}
					component={component}
					childrenMap={childrenMap}
					fallbacks={fallbacks}
					parents={parents}
					surfaceContext={surfaceContext}
				/>
			))}
		</>
	);
};
