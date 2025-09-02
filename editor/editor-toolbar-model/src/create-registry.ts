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

	/**
	 * Similer to `register` but first checks the registry against `newComponents` using its
	 * key and type, if it already exists it replaces the item instead of simply appending it.
	 *
	 * Most likely you should avoid using this and just use the `register` method as it's preferred
	 * to register components statically.
	 */
	const safeRegister = (newComponents: RegisterComponent[]) => {
		newComponents.forEach((newComponent) => {
			const existingIndex = components.findIndex(
				(existingComponent) =>
					existingComponent.type === newComponent.type &&
					existingComponent.key === newComponent.key,
			);

			if (existingIndex !== -1) {
				// Replace existing component
				components[existingIndex] = newComponent;
			} else {
				// Add new component
				components.push(newComponent);
			}
		});
	};

	return {
		register,
		safeRegister,
		components,
	};
};
