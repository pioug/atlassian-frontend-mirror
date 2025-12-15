import type {
	BlockMenuItemComponent,
	BlockMenuNestedComponent,
	BlockMenuSectionComponent,
	RegisterBlockMenuComponent,
} from '../../blockMenuPluginType';

/**
 * Fallback components used as defaults when specific components aren't provided
 */
export type BlockMenuFallbacks = {
	'block-menu-item': BlockMenuItemComponent;
	'block-menu-nested': BlockMenuNestedComponent;
	'block-menu-section': BlockMenuSectionComponent;
};

/**
 * Map of parent keys to their sorted children components
 * Used to efficiently organize and render hierarchical menu structures
 */
export type ChildrenMap = Map<string, RegisterBlockMenuComponent[]>;

/**
 * Props shared across multiple block menu rendering components
 */
export type BlockMenuRenderingContext = {
	/**
	 * Lookup map for child components organized by parent key
	 */
	childrenMap: ChildrenMap;
	/**
	 * Fallback components when specific components aren't registered
	 */
	fallbacks: BlockMenuFallbacks;
};
