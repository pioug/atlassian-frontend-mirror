import React, { useMemo } from 'react';

import { SurfaceComponents } from './SurfaceComponents';
import type { SurfaceRendererProps } from './types';
import { buildChildrenMap, findSurface, PassThrough } from './utils';

/**
 * Unified renderer for all editor surfaces (toolbars, menus, etc.).
 *
 * Given a flat list of registered components and a surface identifier, it
 * builds the parent→child tree, resolves fallback components, filters hidden
 * items, and renders the hierarchy recursively.
 *
 * @example
 * ```tsx
 * <SurfaceRenderer
 *   surface={{ type: 'menu', key: 'block-menu' }}
 *   components={api?.uiControlRegistry?.actions.getComponents('block-menu') ?? []}
 *   fallbacks={{ 'menu-section': SectionFallback }}
 * />
 * ```
 */
export const SurfaceRenderer = ({
	surface,
	components,
	fallbacks,
}: SurfaceRendererProps): React.JSX.Element | null => {
	const { root, childrenMap, topLevelChildren } = useMemo(() => {
		const root = findSurface(components, surface);
		const childrenMap = buildChildrenMap(components);
		const topLevelChildren = root ? childrenMap.get(root.key) : undefined;

		return { root, childrenMap, topLevelChildren };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [components, surface.key, surface.type]);

	if (!root) {
		return null;
	}

	const RootComponent = root.component ?? PassThrough;

	return (
		<RootComponent>
			<SurfaceComponents
				components={topLevelChildren}
				childrenMap={childrenMap}
				fallbacks={fallbacks}
				parents={[{ key: root.key, type: root.type }]}
			/>
		</RootComponent>
	);
};
