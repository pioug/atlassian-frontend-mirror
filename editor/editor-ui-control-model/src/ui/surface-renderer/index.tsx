import React, { useMemo } from 'react';

import { SurfaceComponents } from './SurfaceComponents';
import type { SurfaceRendererProps } from './types';
import { PassThrough, resolveSurface, willComponentRender } from './utils';

const ROOT_PARENTS: [] = [];

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
	surfaceContext,
}: SurfaceRendererProps): React.JSX.Element | null => {
	const { root, childrenMap, topLevelChildren } = useMemo(() => {
		return resolveSurface(components, surface);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [components, surface.key, surface.type]);

	if (!root) {
		return null;
	}

	if (!willComponentRender(root, childrenMap, surfaceContext)) {
		return null;
	}

	const RootComponent = root.component ?? PassThrough;

	return (
		<RootComponent parents={ROOT_PARENTS} surfaceContext={surfaceContext}>
			<SurfaceComponents
				components={topLevelChildren}
				childrenMap={childrenMap}
				fallbacks={fallbacks}
				/* eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed) */
				parents={[{ key: root.key, type: root.type }]}
				surfaceContext={surfaceContext}
			/>
		</RootComponent>
	);
};
