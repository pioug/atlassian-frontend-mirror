import type { RegisterComponent } from './types';

/**
 * Create a simple registry for toolbar components.
 *
 * @returns A registry object with a `register` method and a `components` array.
 *
 * @example
 * ```ts
 * const registry = createToolbarRegistry();
 *
 * registry.register([
 * 	{
 * 		type: 'toolbar',
 * 		key: 'primary-toolbar',
 * 		component: ({ children }) => <div>{children}</div>,
 * 	},
 *  {
 *      type: 'section',
 *      key: 'section-1',
 *      rank: 1,
 *      parents: [{ type: 'toolbar', key: 'primary-toolbar' }],
 *      component: ({ children }) => <div>{children}</div>,
 *  },
 *  {
 *      type: 'group',
 *      key: 'group-1',
 *      rank: 1,
 *      parents: [{ type: 'section', key: 'section-1' }],
 *      component: ({ children }) => <div>{children}</div>,
 *  },
 * ]);
 */
export const createComponentRegistry = () => {
	const components: RegisterComponent[] = [];

	const register = (newComponents: RegisterComponent[]) => {
		components.push(...newComponents);
	};

	return {
		register,
		components,
	};
};
