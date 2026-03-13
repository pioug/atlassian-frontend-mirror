import type { RegisterComponent } from './types';

/**
 * Create a registry for UI control components (toolbar buttons, menu items, etc.).
 *
 * Follows the same pattern as `createBlockMenuRegistry` from `editor-plugin-block-menu`
 * but uses generic types to support any surface (toolbars, menus, etc.).
 *
 * Each component should have a unique `type` + `key` combination. The parent-child
 * model relies on key-based lookup, so duplicate keys lead to undefined behaviour.
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
	register: (newComponents: RegisterComponent[]) => void;
	components: RegisterComponent[];
} => {
	const components: RegisterComponent[] = [];

	const register = (newComponents: RegisterComponent[]): void => {
		components.push(...newComponents);
	};

	return {
		register,
		components,
	};
};
