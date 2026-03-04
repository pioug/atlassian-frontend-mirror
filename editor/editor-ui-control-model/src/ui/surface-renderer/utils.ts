import type React from 'react';

import type { RegisterComponent } from '../../types';

import type { ChildrenMap, SurfaceIdentifier } from './types';

/** Renders children as-is. Used when no explicit component is registered. */
export const PassThrough = (props: Record<string, unknown>): React.ReactNode =>
	(props.children as React.ReactNode) ?? null;

/**
 * Locate the root surface component — one whose key and type match the
 * identifier and that has no parents (i.e. it is a root node).
 */
export const findSurface = (
	components: RegisterComponent[],
	surface: SurfaceIdentifier,
): RegisterComponent | undefined => {
	return components.find(
		(c) =>
			c.key === surface.key && c.type === surface.type && (!c.parents || c.parents.length === 0),
	);
};

/**
 * Build a map from parent key → sorted child components.
 *
 * Each component can declare multiple parents; it will appear in the children
 * list of every parent it references. Children are sorted by the rank they
 * declare for that particular parent.
 */
export const buildChildrenMap = (components: RegisterComponent[]): ChildrenMap => {
	const childrenMap: ChildrenMap = new Map();

	for (const component of components) {
		if (component.parents && component.parents.length > 0) {
			for (const parent of component.parents) {
				const existing = childrenMap.get(parent.key) || [];
				existing.push(component);
				childrenMap.set(parent.key, existing);
			}
		}
	}

	for (const [parentKey, children] of childrenMap.entries()) {
		children.sort((a, b) => {
			const rankA = a.parents?.find((p) => p.key === parentKey)?.rank ?? 0;
			const rankB = b.parents?.find((p) => p.key === parentKey)?.rank ?? 0;
			return rankA - rankB;
		});
	}

	return childrenMap;
};

/**
 * Determine whether a component will produce visible output.
 *
 * - A component with `isHidden` returning `true` will not render.
 * - A leaf component (no registered children) renders.
 * - A container component renders only if at least one child will render.
 */
export const willComponentRender = (
	component: RegisterComponent,
	childrenMap: ChildrenMap,
): boolean => {
	if (component.isHidden?.()) {
		return false;
	}

	const children = childrenMap.get(component.key);

	if (!children || children.length === 0) {
		return true;
	}

	return children.some((child) => willComponentRender(child, childrenMap));
};
