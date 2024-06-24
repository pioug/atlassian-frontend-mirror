import { memo, useMemo, useRef } from 'react';

import { isReducedMotion } from '../utils/accessibility';
import { useForceRender } from '../utils/use-force-render';

import {
	childrenToArray,
	childrenToObj,
	type ElementWithKey,
	type ExitingChildContext,
	type ExitingPersistenceProps,
	spliceNewElementsIntoPrevious,
	wrapChildWithContextProvider,
} from './exiting-persistence';

const isAnyPreviousKeysMissingFromCurrent = (
	currentMap: { [key: string]: ElementWithKey },
	previous: ElementWithKey[],
): boolean => {
	for (let i = 0; i < previous.length; i++) {
		const element = previous[i];
		const key = element.key;
		if (!currentMap[key]) {
			return true;
		}
	}

	return false;
};

/**
 * This handles the case when a render updates during an exit motion.
 * If any child is mounted again we removed them from the exiting children object and return true.
 */
const hasAnyExitingChildMountedAgain = (
	exitingChildren: React.MutableRefObject<{
		[key: string]: boolean;
	}>,
	children: ElementWithKey[],
): boolean => {
	let exitingChildMountedAgain = false;

	children.forEach((child) => {
		if (exitingChildren.current[child.key]) {
			exitingChildMountedAgain = true;
			delete exitingChildren.current[child.key];
		}
	});

	return exitingChildMountedAgain;
};

/**
 * __ExitingPersistence__
 *
 * Useful for enabling elements to persist and animate away when they are removed from the DOM.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/motion/docs/entering-motions)
 */
const WithoutStrictModeSupport = memo(
	({
		appear: appearFromProp = false,
		children: childs,
		exitThenEnter,
	}: ExitingPersistenceProps): any => {
		const children = childrenToArray(childs);
		const childrenObj = childrenToObj(children);
		const previousChildren = useRef<ElementWithKey[]>([]);
		const persistedChildren = useRef<ElementWithKey[]>([]);
		const forceRender = useForceRender();
		const exitingChildren = useRef<{ [key: string]: boolean }>({});
		const appear = useRef(appearFromProp);
		const defaultContextValue: ExitingChildContext = useMemo(
			() => ({
				appear: appear.current,
				isExiting: false,
			}),
			// React rules of hooks says this isn't needed because mutating appear won't cause a re-render.
			// While technically true - it will trigger this to make a new object on the _next_ render which is what we want.
			// Remove this or use appear instead of appear.current and you will notice a test breaks.
			// eslint-disable-next-line react-hooks/exhaustive-deps
			[appear.current],
		);

		if (isReducedMotion()) {
			return children;
		}

		if (!appear.current) {
			// We always want child motions to appear after the initial mount.
			appear.current = true;
		}

		// This entire block can't be an effect because we need it to run synchronously during a render
		// else when elements are being removed they will be remounted instead of being updated.
		if (
			previousChildren.current.length &&
			isAnyPreviousKeysMissingFromCurrent(childrenObj, previousChildren.current)
		) {
			if (
				persistedChildren.current.length === 0 ||
				hasAnyExitingChildMountedAgain(exitingChildren, children)
			) {
				persistedChildren.current = previousChildren.current;
			}

			// We have persisted children now set from previous children.
			// Let's update previous children so we have it available next render.
			previousChildren.current = children;

			return (
				exitThenEnter
					? persistedChildren.current
					: spliceNewElementsIntoPrevious(children, persistedChildren.current)
			).map((child) => {
				// eslint-disable-next-line @repo/internal/react/no-children-properties-access
				const currentChild = childrenObj[child.key];
				if (!currentChild) {
					// We've found an exiting child - mark it!
					exitingChildren.current[child.key] = true;

					return wrapChildWithContextProvider(child, {
						isExiting: true,
						appear: true,
						onFinish: () => {
							delete exitingChildren.current[child.key];

							// We will only remove the exiting elements when any subsequent exiting elements have also finished.
							// Think of removing many items from a todo list - when removing a few over a few clicks we don't
							// want the list jumping around when they exit.
							if (Object.keys(exitingChildren.current).length === 0) {
								// Set previous children to nothing.
								// This let's us skip the next render check as it's assumed children and previous will be the same.
								previousChildren.current = [];
								persistedChildren.current = [];

								// Re-render after the element(s) have animated away which will end up rendering the latest children.
								forceRender();
							}
						},
					});
				}

				// This element isn't exiting.
				// Wrap context and let's continue on our way.
				return wrapChildWithContextProvider(currentChild, defaultContextValue);
			});
		} else {
			previousChildren.current = children;
		}

		return children.map((child) => wrapChildWithContextProvider(child, defaultContextValue));
	},
);

export default WithoutStrictModeSupport;
