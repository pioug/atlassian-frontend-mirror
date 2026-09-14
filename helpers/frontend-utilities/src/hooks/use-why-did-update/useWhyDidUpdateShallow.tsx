/* eslint-disable no-console */

import { useEffect, useRef } from 'react';

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
export function useWhyDidUpdateShallow(name: string, deps: any[], depsNames?: string[]): void {
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
