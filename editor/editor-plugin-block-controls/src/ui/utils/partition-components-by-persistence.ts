import { BLOCK_CONTROL_UI_CONTEXT } from '@atlaskit/editor-common/block-controls/block-control-ui-context';
import {
	getComponentIdentity,
	resolveSurface,
	willComponentRender,
} from '@atlaskit/editor-ui-control-model/surface-renderer';
import { createSurfaceContext } from '@atlaskit/editor-ui-control-model/create-surface-context';
import type { RegisterComponent, SurfaceContext } from '@atlaskit/editor-ui-control-model/types';

type SurfaceIdentifier = {
	key: string;
	type: 'toolbar' | 'menu';
};

type PartitionedComponents = {
	hoverOnlyComponents: RegisterComponent[];
	persistentComponents: RegisterComponent[];
};

/**
 * Split registered components into two groups:
 * those that should be rendered persistently and those that should only be rendered on hover.
 */
export const partitionComponentsByPersistence = (
	components: RegisterComponent[],
	surface: SurfaceIdentifier,
	surfaceContext: SurfaceContext | undefined,
): PartitionedComponents => {
	const { childrenMap, root, topLevelChildren } = resolveSurface(components, surface);
	if (!root || !topLevelChildren || topLevelChildren.length === 0) {
		return { hoverOnlyComponents: [], persistentComponents: components };
	}

	const context = surfaceContext?.get(BLOCK_CONTROL_UI_CONTEXT);
	const storedSurfaceContext = context
		? createSurfaceContext(BLOCK_CONTROL_UI_CONTEXT, {
				activeNode: undefined,
				rootNode: context.targetNode,
				targetNode: context.targetNode,
			})
		: undefined;

	const isLeaf = (component: RegisterComponent): boolean => {
		const children = childrenMap.get(getComponentIdentity(component));
		return !children || children.length === 0;
	};

	const persistentComponents: RegisterComponent[] = [];
	const hoverOnlyComponents: RegisterComponent[] = [];

	for (const component of components) {
		if (!isLeaf(component)) {
			persistentComponents.push(component);
			hoverOnlyComponents.push(component);
			continue;
		}
		if (willComponentRender(component, childrenMap, storedSurfaceContext)) {
			persistentComponents.push(component);
		} else {
			hoverOnlyComponents.push(component);
		}
	}

	return { hoverOnlyComponents, persistentComponents };
};
