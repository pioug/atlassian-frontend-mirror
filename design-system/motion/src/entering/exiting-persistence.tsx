import React, {
	Children,
	createContext,
	memo,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';

/**
 * Internally we will be playing with an element that will always have a key defined.
 */
type ElementWithKey = JSX.Element & { key: string };

export interface ExitingPersistenceProps {
	/**
	 * Children can be any valid react node.
	 * Either a single element,
	 * multiple elements,
	 * or multiple elements in an array.
	 */
	children?: ReactNode;

	/**
	 * When elements are exiting will exit all elements first and then mount the new ones.
	 * Defaults to `false`.
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	exitThenEnter?: boolean;

	/**
	 * When initially mounting if set to `true` all child motions will animate in.
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	appear?: boolean;
}

/**
 * Internal data passed to child motions.
 */
interface ExitingChildContext {
	/**
	 * Will perform an exit animation instead of an enter animation.
	 */
	isExiting: boolean;

	/**
	 * Will be called when the animation has completed.
	 */
	onFinish?: () => void;

	/**
	 * Used to tell the child motions to animate in when initially mounting.
	 */
	appear: boolean;
}

// We define empty context here so the object doesn't change.
const emptyContext: ExitingChildContext = {
	// Motions will always appear if not inside a exiting persistence component.
	appear: true,
	isExiting: false,
};

/**
 * __Exiting context__
 *
 * An exiting context.
 */
const ExitingContext = createContext<ExitingChildContext>(emptyContext);

/**
 * This method will wrap any React element with a context provider. We're using context (instead of
 * cloneElement) so we can communicate between multiple elements without the need of prop drilling
 * (results in a better API for consumers).
 */
const wrapChildWithContextProvider = (
	child: JSX.Element,
	value: ExitingChildContext = emptyContext,
) => {
	return (
		<ExitingContext.Provider key={`${child.key}-provider`} value={value}>
			{child}
		</ExitingContext.Provider>
	);
};

/**
 * This function will convert all children types to an array while also filtering out non-valid React elements.
 */
const childrenToArray = (children?: ReactNode): ElementWithKey[] => {
	const childrenAsArray: ElementWithKey[] = [];

	// We convert children to an array using this helper method as it will add keys to children that do not
	// have them, such as when we have hardcoded children that are conditionally rendered.
	Children.toArray(children).forEach((child) => {
		// We ignore any boolean children to make our code a little more simple later on,
		// and also filter out any falsies (empty strings, nulls, and undefined).
		if (typeof child !== 'boolean' && Boolean(child)) {
			// Children WILL have a key after being forced into an array using the React.Children helper.
			childrenAsArray.push(child as ElementWithKey);
		}
	});

	return childrenAsArray;
};

const spliceNewElementsIntoPrevious = (
	current: ElementWithKey[],
	previous: ElementWithKey[],
): ElementWithKey[] => {
	const splicedChildren: ElementWithKey[] = previous.concat([]);
	const previousMap = childrenToObj(previous);

	for (let i = 0; i < current.length; i++) {
		const child = current[i];
		const childIsNew = !previousMap[child.key];

		if (childIsNew) {
			// This will insert the new element after the previous element.
			splicedChildren.splice(i + 1, 0, child);
		}
	}

	return splicedChildren;
};

const childrenToObj = (children: ElementWithKey[]) => {
	return children.reduce<{ [key: string]: ElementWithKey }>((acc, child) => {
		acc[child.key] = child;
		return acc;
	}, {});
};

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
 * How does this component work?
 *
 * It looks at changes in its children to see what is removed.
 *
 * If a child is removed it clones it and wraps it with context providing an `onFinish` callback.
 *
 * The cloned child will call the `onFinish` when it finishes its exit animation,
 * which lets `ExitingPersistence` know to stop rendering it.
 */
/**
 * __ExitingPersistence__
 *
 * Useful for enabling elements to persist and animate away when they are removed from the DOM.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/motion/docs/entering-motions)
 */
const ExitingPersistence: React.MemoExoticComponent<({ appear, children, exitThenEnter }: ExitingPersistenceProps) => any> = memo(
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

export const useExitingPersistence = (): ExitingChildContext => {
	return useContext(ExitingContext);
};

ExitingPersistence.displayName = 'ExitingPersistence';

export default ExitingPersistence;
