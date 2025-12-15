import React from 'react';

import type { RegisterBlockMenuComponent } from '../../blockMenuPluginType';

import { BlockMenuComponents } from './BlockMenuComponents';
import type { BlockMenuRenderingContext } from './types';
import { getChildrenMapKey, willComponentRender } from './utils';

type BlockMenuComponentProps = BlockMenuRenderingContext & {
	registeredComponent: RegisterBlockMenuComponent;
};

/**
 * Renders the given registered component based on its type
 */
export const BlockMenuComponent = ({
	registeredComponent,
	childrenMap,
	fallbacks,
}: BlockMenuComponentProps) => {
	if (registeredComponent.type === 'block-menu-item') {
		const ItemComponent = registeredComponent.component || fallbacks['block-menu-item'];
		return <ItemComponent key={registeredComponent.key} />;
	}

	if (!willComponentRender(registeredComponent, childrenMap)) {
		return null;
	}

	const ParentComponent = registeredComponent.component || fallbacks[registeredComponent.type];
	const childrenMapKey = getChildrenMapKey(registeredComponent.key, registeredComponent.type);
	const registeredComponents = childrenMap.get(childrenMapKey);

	return (
		<ParentComponent key={registeredComponent.key}>
			<BlockMenuComponents
				registeredComponents={registeredComponents}
				childrenMap={childrenMap}
				fallbacks={fallbacks}
			/>
		</ParentComponent>
	);
};
