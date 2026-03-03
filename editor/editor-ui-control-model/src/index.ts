/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

export { createRegistry } from './createRegistry';
export type {
	ButtonType,
	CommonComponentProps,
	ComponentType,
	ComponentTypes,
	GroupType,
	MenuItemType,
	MenuSectionType,
	MenuType,
	NestedMenuType,
	RegisterButton,
	RegisterComponent,
	RegisterComponentParent,
	RegisterGroup,
	RegisterMenu,
	RegisterMenuItem,
	RegisterMenuSection,
	RegisterMenuSurface,
	RegisterNestedMenu,
	RegisterSection,
	RegisterToolbar,
	SectionType,
	ToolbarType,
} from './types';

export { SurfaceRenderer } from './ui/surface-renderer';
export { buildChildrenMap, willComponentRender } from './ui/surface-renderer/utils';
export type {
	ChildrenMap,
	ComponentIdentifier,
	SurfaceFallbacks,
	SurfaceIdentifier,
	SurfaceRendererProps,
} from './ui/surface-renderer/types';
