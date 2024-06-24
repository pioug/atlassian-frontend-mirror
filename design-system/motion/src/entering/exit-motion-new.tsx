import { memo, useEffect, useState } from 'react';

import { isReducedMotion } from '../utils/accessibility';

import {
	childrenToArray,
	type ElementWithKey,
	type ExitingPersistenceProps,
	spliceNewElementsIntoPrevious,
	wrapChildWithContextProvider,
} from './exiting-persistence';

const getMissingKeys = (current: ElementWithKey[], previous: ElementWithKey[]) => {
	const currentMapKeys = new Set(current.map((child) => child.key));
	const missing = new Set<string>();
	for (let i = 0; i < previous.length; i++) {
		const element = previous[i];
		const key = element.key;
		if (!currentMapKeys.has(key)) {
			missing.add(key);
		}
	}

	return missing;
};

/**
 * __WithStrictModeSupport__
 *
 * Useful for enabling elements to persist and animate away when they are removed from the DOM.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/motion/docs/entering-motions)
 */
const WithStrictModeSupport = memo(
	({ appear = false, children, exitThenEnter }: ExitingPersistenceProps): any => {
		const [stateChildren, setChildren] = useState<[React.ReactNode | null, React.ReactNode]>([
			null,
			children,
		]);

		const [exitingChildren, setExitingChildren] = useState<ElementWithKey[]>([]);

		const [defaultContext, setDefaultContext] = useState(() => ({ appear, isExiting: false }));

		useEffect(() => {
			if (!defaultContext.appear) {
				setDefaultContext({ appear: true, isExiting: false });
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		if (isReducedMotion()) {
			return children;
		}

		/**
		 * NOTE: This is a workaround for the test case written in Jira where the stateChildren is a boolean value because
		 * useState is mocked to return a boolean value.
		 */
		if (typeof stateChildren === 'boolean') {
			return children;
		}

		const [previousChildren, currentChildren] = stateChildren;

		const previous = childrenToArray(previousChildren);
		const current = childrenToArray(currentChildren);

		if (currentChildren !== children) {
			setChildren([currentChildren as any, children]);
		}

		const missingKeys = getMissingKeys(current, previous);
		const isSomeChildRemoved = !!missingKeys.size;

		let visibleChildren = current;

		if (isSomeChildRemoved) {
			visibleChildren = spliceNewElementsIntoPrevious(current, previous);
		}

		if (exitThenEnter) {
			if (exitingChildren.length) {
				visibleChildren = exitingChildren;
			} else {
				const nextExitingChildren = visibleChildren.filter((child) => missingKeys.has(child.key));
				if (nextExitingChildren.length) {
					setExitingChildren(nextExitingChildren);
				}
			}
		}

		if (missingKeys.size) {
			visibleChildren = visibleChildren.map((child) => {
				const isExiting = missingKeys.has(child.key);
				return wrapChildWithContextProvider(child, {
					appear: true,
					isExiting,
					onFinish: isExiting
						? () => {
								missingKeys.delete(child.key);
								if (missingKeys.size === 0) {
									setChildren([null, children]);
									setExitingChildren([]);
								}
							}
						: undefined,
				});
			}) as ElementWithKey[];
		} else {
			visibleChildren = visibleChildren.map((child) =>
				wrapChildWithContextProvider(child, defaultContext),
			) as ElementWithKey[];
		}

		return visibleChildren;
	},
);
export default WithStrictModeSupport;
