import type {
	RegisterBlockMenuComponent,
	RegisterBlockMenuComponentType,
	RegisterBlockMenuSection,
} from '../../blockMenuPluginType';

import type { ChildrenMap } from './types';

/**
 * Type guard to check if a component has a parent
 *
 * @param component The block menu component to check
 * @returns True if the component has a parent, false otherwise
 */
const hasParent = (
	component: RegisterBlockMenuComponent,
): component is RegisterBlockMenuComponent & {
	parent: { key: string; rank?: number; type: RegisterBlockMenuComponentType };
} => {
	return 'parent' in component && !!component.parent;
};

/**
 * Type guard to identify top-level sections (sections without a parent)
 *
 * @param component The block menu component to check
 * @returns True if the component is a top-level section, false otherwise
 */
const isTopLevelSection = (
	component: RegisterBlockMenuComponent,
): component is RegisterBlockMenuSection => {
	return component.type === 'block-menu-section' && !hasParent(component);
};

/**
 * Gets all top-level sections (those without a parent) sorted by rank
 *
 * @param components All registered block menu components
 * @returns Sorted array of top-level sections
 */
export const getSortedTopLevelSections = (
	components: RegisterBlockMenuComponent[],
): RegisterBlockMenuSection[] => {
	return components.filter(isTopLevelSection).sort((a, b) => (a.rank || 0) - (b.rank || 0));
};

/**
 * Generates a unique key from a key and type
 * Used to lookup children in the childrenMap
 *
 * @param key The component's key
 * @param type The component's type
 * @returns A unique string key combining type and key
 */
export const getChildrenMapKey = (
	key: string,
	type: Omit<RegisterBlockMenuComponentType, 'block-menu-item'>,
): string => {
	return `${type}:${key}`;
};

/**
 * Builds a map of parent keys to their sorted children
 * This enables efficient hierarchical rendering of the menu structure
 *
 * @param components All registered block menu components
 * @returns Map where keys are parent identifiers and values are sorted child components
 */
export const buildChildrenMap = (components: RegisterBlockMenuComponent[]): ChildrenMap => {
	const childrenMap = new Map<string, RegisterBlockMenuComponent[]>();

	for (const component of components) {
		// Only components with parents can be children
		if ('parent' in component && !!component.parent) {
			const childrenMapKey = getChildrenMapKey(component.parent.key, component.parent.type);
			const existing = childrenMap.get(childrenMapKey) || [];
			existing.push(component);
			childrenMap.set(childrenMapKey, existing);
		}
	}

	// Sort children by their rank within their parent
	for (const [, children] of childrenMap.entries()) {
		children.sort((a, b) => {
			const rankA = hasParent(a) ? a.parent.rank || 0 : 0;
			const rankB = hasParent(b) ? b.parent.rank || 0 : 0;
			return rankA - rankB;
		});
	}

	return childrenMap;
};

/**
 * Determines whether a component will render based on its type and children
 *
 * Rules:
 * - An item will not render if it has isHidden that returns true OR if its component returns null (fallback)
 * - A nested menu will render if at least one section, that has at least one registered child
 * - A section will render if it has at least one registered child component that will render
 *
 */
export const willComponentRender = (
	registeredComponent: RegisterBlockMenuComponent,
	childrenMap: ChildrenMap,
): boolean => {
	if (registeredComponent.type === 'block-menu-item') {
		return !registeredComponent?.isHidden?.();
	}
	const childrenMapKey = getChildrenMapKey(registeredComponent.key, registeredComponent.type);
	const registeredComponents = childrenMap.get(childrenMapKey) || [];

	return registeredComponents.some((childComponent) =>
		willComponentRender(childComponent, childrenMap),
	);
};
