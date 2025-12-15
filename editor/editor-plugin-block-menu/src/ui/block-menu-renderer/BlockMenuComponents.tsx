import React from 'react';

import type { RegisterBlockMenuComponent } from '../../blockMenuPluginType';

import { BlockMenuComponent } from './BlockMenuComponent';
import type { BlockMenuRenderingContext } from './types';

type BlockMenuComponentsProps = BlockMenuRenderingContext & {
	registeredComponents?: RegisterBlockMenuComponent[];
};

/**
 * Renders the given registered components
 * Returns null if no components are rendered
 */
export const BlockMenuComponents = ({
	registeredComponents,
	childrenMap,
	fallbacks,
}: BlockMenuComponentsProps) => {
	if (!registeredComponents?.length) {
		return null;
	}

	return (
		<>
			{registeredComponents.map((registeredComponent) => (
				<BlockMenuComponent
					key={registeredComponent.key}
					registeredComponent={registeredComponent}
					childrenMap={childrenMap}
					fallbacks={fallbacks}
				/>
			))}
		</>
	);
};
