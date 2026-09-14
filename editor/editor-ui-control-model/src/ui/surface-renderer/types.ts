import type {
	ComponentIdentifier,
	ComponentType,
	RegisteredComponent,
	RegisterComponent,
	SurfaceContext,
} from '../../types';

export type SurfaceIdentifier = {
	key: string;
	type: 'toolbar' | 'menu';
};

export type SurfaceFallbacks = Partial<Record<ComponentType['type'], RegisteredComponent>>;

export type ChildrenMap = Map<string, RegisterComponent[]>;

export type ResolvedSurface = {
	childrenMap: ChildrenMap;
	components: RegisterComponent[];
	root: RegisterComponent | undefined;
	topLevelChildren: RegisterComponent[] | undefined;
};

export type SurfaceRendererProps = {
	components: RegisterComponent[];
	fallbacks?: SurfaceFallbacks;
	surface: SurfaceIdentifier;
	surfaceContext?: SurfaceContext;
};

export type SurfaceRenderingContext = {
	childrenMap: ChildrenMap;
	fallbacks?: SurfaceFallbacks;
	parents: ComponentIdentifier[];
	surfaceContext?: SurfaceContext;
};
