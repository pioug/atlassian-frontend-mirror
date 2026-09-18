import type React from 'react';

import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type {
	ComponentIdentifier,
	CommonComponentProps,
	RegisterComponent,
	SurfaceContext,
} from '../../types';
import type { ChildrenMap, ResolvedSurface, SurfaceIdentifier } from './types';

/** Renders children as-is. Used when no explicit component is registered. */
export const PassThrough = (props: CommonComponentProps): React.ReactNode => props.children ?? null;

export const getComponentIdentity = ({ type, key }: ComponentIdentifier): string =>
	isExperimentEnabled('platform_editor_slash_command') ||
	isExperimentEnabled('platform_editor_block_control_migration')
		? `${type}:${key}`
		: key;

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
				const parentIdentity = getComponentIdentity(parent);
				const existing = childrenMap.get(parentIdentity) || [];
				existing.push(component);
				childrenMap.set(parentIdentity, existing);
			}
		}
	}

	for (const [parentIdentity, children] of childrenMap.entries()) {
		children.sort((a, b) => {
			const rankA =
				a.parents?.find((parent) => getComponentIdentity(parent) === parentIdentity)?.rank ?? 0;
			const rankB =
				b.parents?.find((parent) => getComponentIdentity(parent) === parentIdentity)?.rank ?? 0;
			return rankA - rankB;
		});
	}

	return childrenMap;
};

export const resolveSurface = (
	components: RegisterComponent[],
	surface: SurfaceIdentifier,
): ResolvedSurface => {
	const root = findSurface(components, surface);
	const childrenMap = buildChildrenMap(components);
	const surfaceComponents: RegisterComponent[] = [];

	if (root) {
		const visited = new Set<string>();
		const visit = (component: RegisterComponent): void => {
			const identity = getComponentIdentity(component);
			if (visited.has(identity)) {
				return;
			}
			visited.add(identity);
			surfaceComponents.push(component);
			childrenMap.get(identity)?.forEach(visit);
		};
		visit(root);
	}

	return {
		root,
		childrenMap,
		components: surfaceComponents,
		topLevelChildren: root ? childrenMap.get(getComponentIdentity(root)) : undefined,
	};
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
	surfaceContext?: SurfaceContext,
): boolean => {
	return willComponentRenderWithAncestors(component, childrenMap, surfaceContext, new Set());
};

const willComponentRenderWithAncestors = (
	component: RegisterComponent,
	childrenMap: ChildrenMap,
	surfaceContext: SurfaceContext | undefined,
	ancestors: Set<string>,
): boolean => {
	const isHidden = surfaceContext
		? component.isHidden?.({ surfaceContext })
		: component.isHidden?.();

	if (isHidden) {
		return false;
	}

	const identity = getComponentIdentity(component);
	if (ancestors.has(identity)) {
		return false;
	}

	const children = childrenMap.get(identity);

	if (!children || children.length === 0) {
		return true;
	}
	const nextAncestors = new Set(ancestors).add(identity);
	return children.some((child) =>
		willComponentRenderWithAncestors(child, childrenMap, surfaceContext, nextAncestors),
	);
};

export const willSurfaceRender = (
	components: RegisterComponent[],
	surface: SurfaceIdentifier,
	surfaceContext?: SurfaceContext,
): boolean => {
	const { root, childrenMap } = resolveSurface(components, surface);
	return root ? willComponentRender(root, childrenMap, surfaceContext) : false;
};
