import React, { Children, createContext, memo, type ReactNode, useContext } from 'react';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import WithStrictModeSupport from './exit-motion-new';
import WithoutStrictModeSupport from './exit-motion-old';

/**
 * Internally we will be playing with an element that will always have a key defined.
 */
export type ElementWithKey = JSX.Element & { key: string };

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
export interface ExitingChildContext {
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
export const emptyContext: ExitingChildContext = {
	// Motions will always appear if not inside a exiting persistence component.
	appear: true,
	isExiting: false,
};

/**
 * __Exiting context__
 *
 * An exiting context.
 */
export const ExitingContext = createContext<ExitingChildContext>(emptyContext);

/**
 * This method will wrap any React element with a context provider. We're using context (instead of
 * cloneElement) so we can communicate between multiple elements without the need of prop drilling
 * (results in a better API for consumers).
 */
export const wrapChildWithContextProvider = (
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
export const childrenToArray = (children?: ReactNode): ElementWithKey[] => {
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

export const spliceNewElementsIntoPrevious = (
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

export const childrenToObj = (children: ElementWithKey[]) => {
	return children.reduce<{ [key: string]: ElementWithKey }>((acc, child) => {
		acc[child.key] = child;
		return acc;
	}, {});
};

/**
 * __ExitingPersistence__
 *
 * Useful for enabling elements to persist and animate away when they are removed from the DOM.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/motion/docs/entering-motions)
 */
const ExitingPersistence = memo(
	({ appear = false, children, exitThenEnter }: ExitingPersistenceProps): any => {
		return getBooleanFF('platform.design-system-team.update-motion-for-strict-mode_p6qs0') ? (
			<WithStrictModeSupport appear={appear} children={children} exitThenEnter={exitThenEnter} />
		) : (
			<WithoutStrictModeSupport appear={appear} children={children} exitThenEnter={exitThenEnter} />
		);
	},
);

export const useExitingPersistence = () => {
	return useContext(ExitingContext);
};

ExitingPersistence.displayName = 'ExitingPersistence';

export default ExitingPersistence;
