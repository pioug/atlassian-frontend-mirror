import type { RegisterComponent } from '@atlaskit/editor-ui-control-model';

const isComponentOrAncestorHidden = (
	component: RegisterComponent,
	componentsByKey: Map<string, RegisterComponent>,
): boolean => {
	if (component.isHidden?.()) {
		return true;
	}
	return (component.parents ?? []).some((parent) => {
		const parentComponent = componentsByKey.get(parent.key);
		return parentComponent ? isComponentOrAncestorHidden(parentComponent, componentsByKey) : false;
	});
};

/**
 * Returns the keys of visible button/menu-item components in the list.
 * A component is visible when neither it nor any of its ancestors are hidden.
 */
export const getVisibleKeys = (
	components: RegisterComponent[],
	types: RegisterComponent['type'][] = ['menu-item'],
): string[] => {
	const componentsByKey = new Map(components.map((c) => [c.key, c]));
	return components
		.filter((c) => types.includes(c.type))
		.filter((c) => !isComponentOrAncestorHidden(c, componentsByKey))
		.map((c) => c.key);
};

/**
 * Returns true when at least one menu-item button in the list is visible.
 * A button is visible when neither it nor any of its ancestors are hidden.
 */
export const hasVisibleButton = (components: RegisterComponent[]): boolean => {
	return getVisibleKeys(components).length > 0;
};
