/* eslint-disable no-console */
import { useEffect, useRef } from 'react';

import isEqual from 'lodash/isEqual';

/**
 * Example usage:
 * ```tsx
 * function MyComponent({ user, settings }) {
 *   useWhyDidUpdate(
 *     'MyComponent',
 *     [user, settings],
 *     ['user', 'settings'] // Optional names for better logging
 *   );
 *
 *   return <div>...</div>;
 * }
 * ```
 *
 * When one of these dependencies change, it will log something like:
 * ```
 * ---------------------------------------
 * MyComponent dependencies have changed:
 * [user] { from: { name: 'John' }, to: { name: 'Jane' } }
 * ```
 */

/**
 * A hook that helps debug when the content of your dependencies actually changes and may have caused a re-computation.
 * @param name - The name of the component or values being debugged
 * @param deps - The dependencies array to watch
 * @param depsNames - Optional array of dependency names for better logging
 *
 * @note This hook uses deep equality comparison (lodash's isEqual) to detect changes in your data's content,
 * rather than just reference changes. React's re-rendering is based on shallow equality. So this hook will not
 * act the same as the react re-rendering detection, but can help you understand when your data actually changes.
 * Useful for:
 * - Finding actual data updates in complex objects
 * - Identifying when your data changes structurally vs just getting new references
 */
export function useWhyDidUpdate(name: string, deps: any[], depsNames?: string[]) {
	const prevDeps = useRef(deps);

	useEffect(() => {
		if (process.env.NODE_ENV === 'production') {
			return;
		}

		const changes: Array<{ name: string; next: any; prev: any }> = [];

		deps.forEach((dep, index) => {
			if (!isEqual(prevDeps.current[index], dep)) {
				changes.push({
					name: depsNames?.[index] ?? `dep_${index}`,
					prev: prevDeps.current[index],
					next: dep,
				});
			}
		});

		if (changes.length > 0) {
			console.log(`---------------------------------------`);
			console.log(`useWhyDidUpdate - ${name} dependencies have changed:`);
			changes.forEach(({ name, prev, next }) => {
				console.log(`useWhyDidUpdate - [${name}]`, {
					from: prev,
					to: next,
				});
			});
		}

		prevDeps.current = deps;
	}, deps); // eslint-disable-line react-hooks/exhaustive-deps
}

/**
 * A variant of useWhyDidUpdate that uses Object.is (shallow comparison) like React does.
 * This will show changes whenever React would trigger a re-render due to prop/state changes.
 *
 * Example usage:
 * ```tsx
 * function MyComponent({ user }) {
 *   useWhyDidUpdateShallow('MyComponent', [user], ['user']);
 *   // Will show changes when user reference changes, even if content is the same
 *   return <div>{user.name}</div>;
 * }
 * ```
 */
export function useWhyDidUpdateShallow(name: string, deps: any[], depsNames?: string[]) {
	const prevDeps = useRef(deps);

	useEffect(() => {
		if (process.env.NODE_ENV === 'production') {
			return;
		}

		const changes: Array<{ name: string; next: any; prev: any }> = [];

		deps.forEach((dep, index) => {
			if (!Object.is(prevDeps.current[index], dep)) {
				changes.push({
					name: depsNames?.[index] ?? `dep_${index}`,
					prev: prevDeps.current[index],
					next: dep,
				});
			}
		});

		if (changes.length > 0) {
			console.log(`---------------------------------------`);
			console.log(`useWhyDidUpdateShallow - ${name} dependencies have changed:`);
			changes.forEach(({ name, prev, next }) => {
				console.log(`useWhyDidUpdateShallow - [${name}]`, {
					from: prev,
					to: next,
				});
			});
		}

		prevDeps.current = deps;
	}, deps); // eslint-disable-line react-hooks/exhaustive-deps
}
