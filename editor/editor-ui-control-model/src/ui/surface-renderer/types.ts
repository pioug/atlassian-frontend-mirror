import type React from 'react';

import type { ComponentType, RegisterComponent } from '../../types';

export type SurfaceIdentifier = {
	key: string;
	type: 'toolbar' | 'menu';
};

export type ComponentIdentifier = {
	key: string;
	type: ComponentType['type'];
};

export type SurfaceFallbacks = Partial<
	Record<ComponentType['type'], (props: Record<string, unknown>) => React.ReactNode>
>;

export type ChildrenMap = Map<string, RegisterComponent[]>;

export type SurfaceRendererProps = {
	components: RegisterComponent[];
	fallbacks?: SurfaceFallbacks;
	surface: SurfaceIdentifier;
};

export type SurfaceRenderingContext = {
	childrenMap: ChildrenMap;
	fallbacks?: SurfaceFallbacks;
	parents: ComponentIdentifier[];
};
