import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { SurfaceIdentifier } from './ui/surface-renderer/types';
import { resolveSurface } from './ui/surface-renderer/utils';
import type { ComponentIdentifier, RegisterComponent } from './types';

export type RegisterOptions = {
	replaceExisting?: boolean;
};

const getComponentKey = ({ type, key }: ComponentIdentifier): string => `${type}:${key}`;

/** Preserves the existing string lookup while the indexed hierarchy rolls out behind experiments. */
const getComponentsForSurface = (
	allComponents: RegisterComponent[],
	surfaceKey: string,
): RegisterComponent[] => {
	const root = allComponents.find(
		(component) =>
			component.key === surfaceKey && (!component.parents || component.parents.length === 0),
	);
	if (!root) {
		return [];
	}

	const includedKeys = new Set<string>([surfaceKey]);
	let changed = true;

	while (changed) {
		changed = false;
		for (const component of allComponents) {
			if (includedKeys.has(component.key)) {
				continue;
			}
			if (component.parents?.some((parent) => includedKeys.has(parent.key))) {
				includedKeys.add(component.key);
				changed = true;
			}
		}
	}

	return allComponents.filter((component) => includedKeys.has(component.key));
};

/**
 * Create a registry for UI control components (toolbar buttons, menu items, etc.).
 *
 * Follows the same pattern as `createBlockMenuRegistry` from `editor-plugin-block-menu`
 * but uses generic types to support any surface (toolbars, menus, etc.).
 *
 * Each component should have a unique `type` + `key` combination. The parent-child
 * model relies on key-based lookup.
 *
 * @returns A registry object with a `register` method and a `components` array.
 *
 * @example
 * ```ts
 * const registry = createRegistry();
 *
 * registry.register([
 *   {
 *     type: 'toolbar',
 *     key: 'primary-toolbar',
 *     component: ({ children }) => <div>{children}</div>,
 *   },
 *   {
 *     type: 'section',
 *     key: 'section-1',
 *     parents: [{ type: 'toolbar', key: 'primary-toolbar', rank: 1 }],
 *     component: ({ children }) => <div>{children}</div>,
 *   },
 * ]);
 * ```
 */
export const createRegistry = (): {
	components: RegisterComponent[];
	getComponent: (component: ComponentIdentifier) => RegisterComponent | undefined;
	getComponents: (surface: string | SurfaceIdentifier) => RegisterComponent[];
	register: (newComponents: RegisterComponent[], options?: RegisterOptions) => void;
	unregister: (components: ComponentIdentifier[]) => void;
} => {
	const components: RegisterComponent[] = [];
	const registeredComponents = new Map<string, RegisterComponent>();
	const surfaceCache = new Map<string, RegisterComponent[]>();
	// Replacement and deduplication are part of the existing slash-command registration contract.
	const supportsMutableRegistration = isExperimentEnabled('platform_editor_slash_command');
	// Either registry-backed experience can opt the shared model into indexed, cached surface lookup.
	const supportsOptimizedSurfaceLookup =
		isExperimentEnabled('platform_editor_slash_command') ||
		isExperimentEnabled('platform_editor_block_control_migration');

	const updateIndexes = (): void => {
		registeredComponents.clear();
		components.forEach((component) => {
			registeredComponents.set(getComponentKey(component), component);
		});
	};

	const invalidateSurfaceCache = (): void => {
		surfaceCache.clear();
	};

	const register = (
		newComponents: RegisterComponent[],
		{ replaceExisting = false }: RegisterOptions = {},
	): void => {
		if (!supportsMutableRegistration) {
			components.push(...newComponents);
			invalidateSurfaceCache();
			return;
		}

		let hasChanged = false;
		const componentKeys = new Set(registeredComponents.keys());
		const componentsToRegister = newComponents.filter((component) => {
			const componentKey = getComponentKey(component);
			if (componentKeys.has(componentKey)) {
				if (replaceExisting) {
					const index = components.findIndex(
						(existing) => getComponentKey(existing) === componentKey,
					);
					if (index !== -1) {
						components[index] = component;
						hasChanged = true;
					}
				}
				return false;
			}

			hasChanged = true;
			componentKeys.add(componentKey);
			return true;
		});

		components.push(...componentsToRegister);
		if (hasChanged) {
			updateIndexes();
			invalidateSurfaceCache();
		}
	};

	const resolveSurfaceIdentifier = (
		surface: string | SurfaceIdentifier,
	): SurfaceIdentifier | undefined => {
		if (typeof surface !== 'string') {
			return surface;
		}
		const root = components.find(
			(component) =>
				component.key === surface &&
				(component.type === 'toolbar' || component.type === 'menu') &&
				(!component.parents || component.parents.length === 0),
		);
		return root ? { key: root.key, type: root.type as SurfaceIdentifier['type'] } : undefined;
	};

	const getComponents = (surface: string | SurfaceIdentifier): RegisterComponent[] => {
		if (typeof surface === 'string' && !supportsOptimizedSurfaceLookup) {
			return getComponentsForSurface(components, surface);
		}

		const identifier = resolveSurfaceIdentifier(surface);
		if (!identifier) {
			return [];
		}
		const surfaceIdentity = getComponentKey(identifier);
		const cached = surfaceCache.get(surfaceIdentity);
		if (cached) {
			return cached;
		}
		const surfaceComponents = resolveSurface(components, identifier).components;
		surfaceCache.set(surfaceIdentity, surfaceComponents);
		return surfaceComponents;
	};

	return {
		getComponent: (component) => registeredComponents.get(getComponentKey(component)),
		getComponents,
		register,
		unregister: (componentsToRemove) => {
			let hasChanged = false;
			componentsToRemove.forEach((component) => {
				const componentKey = getComponentKey(component);
				const index = components.findIndex(
					(existing) => getComponentKey(existing) === componentKey,
				);
				if (index !== -1) {
					components.splice(index, 1);
					hasChanged = true;
				}
			});
			if (hasChanged) {
				if (supportsMutableRegistration) {
					updateIndexes();
				}
				invalidateSurfaceCache();
			}
		},
		components,
	};
};
