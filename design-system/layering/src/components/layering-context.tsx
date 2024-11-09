import React, {
	createContext,
	type FC,
	type MutableRefObject,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useRef,
} from 'react';

import __noop from '@atlaskit/ds-lib/noop';

/**
 *
 *  @internal
 * LevelContext which maintains the current level of nested layers
 * Default is 0
 */
export const LevelContext = createContext(0);

/**
 *
 *  @internal
 * TopLevelContext which maintains the top level ref and setTopLevel method of layers
 * Default ref value is null
 *
 */
export const TopLevelContext = createContext<{
	topLevelRef: MutableRefObject<number | null>;
	setTopLevel: (level: number) => void;
}>({
	topLevelRef: { current: null },
	setTopLevel: __noop,
});

/**
 *
 *  @internal
 * Context Provider Component which provider the current level of nested layers
 * It handles level management when it mounts and unmounts
 *
 */
const LevelProvider: FC<{
	children: ReactNode;
	currentLevel: number;
}> = ({ children, currentLevel }) => {
	const { setTopLevel, topLevelRef } = useContext(TopLevelContext);

	if (topLevelRef.current === null || currentLevel > topLevelRef.current) {
		setTopLevel(currentLevel);
	}
	useEffect(() => {
		return () => {
			setTopLevel(currentLevel - 1);
		};
	}, [setTopLevel, currentLevel]);
	return <LevelContext.Provider value={currentLevel}>{children}</LevelContext.Provider>;
};

/**
 *
 *  @internal
 * Context Provider Component which provides the top level of all nested layers
 * It provides initial top level ref value as 0 and set top level method
 *
 */
const LayeringProvider: FC<{
	children: ReactNode;
}> = ({ children }) => {
	const topLevelRef = useRef(0);
	const value = useMemo(
		() => ({
			topLevelRef,
			setTopLevel: (level: number) => {
				topLevelRef.current = level;
			},
		}),
		[topLevelRef],
	);
	return <TopLevelContext.Provider value={value}>{children}</TopLevelContext.Provider>;
};

/**
 * __UNSAFE_LAYERING__
 *
 * @deprecated Please use Layering instead
 *
 * @important the component is toggled by isDisabled props, the default isDisabled is true
 *
 * Layering component is a wrapper to let children to consume layer contexts and hooks.
 *
 */
export const UNSAFE_LAYERING = ({
	children,
	isDisabled = true,
}: {
	children: ReactNode;
	isDisabled?: boolean;
}) => {
	const currentLevel = useContext(LevelContext);
	if (isDisabled) {
		return <>{children}</>;
	}
	const isNested = currentLevel > 0;

	const content = <LevelProvider currentLevel={currentLevel + 1}>{children}</LevelProvider>;

	return isNested ? content : <LayeringProvider>{content}</LayeringProvider>;
};

// TODO: Fill in the component {description} and ensure links point to the correct {packageName} location.
// Remove links that the component does not have (such as usage). If there are no links remove them all.
/**
 * __Layering__
 *
 * A layering {description}.
 *
 * - [Examples](https://atlassian.design/components/{packageName}/examples)
 * - [Code](https://atlassian.design/components/{packageName}/code)
 * - [Usage](https://atlassian.design/components/{packageName}/usage)
 */
export const Layering = UNSAFE_LAYERING;
