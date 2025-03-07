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
import { fg } from '@atlaskit/platform-feature-flags';

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
	// Set to required on FG cleanup plan_timeline_layering_wrapper
	layerList?: MutableRefObject<string[] | null>;
	setTopLevel: (level: number) => void;
}>({
	topLevelRef: { current: null },
	layerList: { current: null },
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
	const { setTopLevel, topLevelRef, layerList } = useContext(TopLevelContext);
	// This is not unstable, it will run once for ref creation.
	// eslint-disable-next-line  @repo/internal/react/disallow-unstable-values
	const id = useRef(fg('layering-top-level-use-array') ? Math.random().toString(36) : '');

	if (!fg('layering-top-level-use-array')) {
		if (topLevelRef.current === null || currentLevel > topLevelRef.current) {
			setTopLevel(currentLevel);
		}
	}

	if (!fg('layering-top-level-use-array')) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {
			return () => {
				// avoid immediate cleanup using setTimeout when component unmount
				// this will make sure non-top layer components can get the correct top level value
				// when multiple layers trigger onClose in sequence
				setTimeout(() => {
					setTopLevel(currentLevel - 1);
				}, 0);
			};
		}, [setTopLevel, currentLevel, topLevelRef]);
	}

	if (fg('layering-top-level-use-array')) {
		// Remove eslint error on FG cleanup
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {
			const safeLayerList = layerList?.current;
			const safeId = id.current;

			if (!safeLayerList) {
				return;
			}

			safeLayerList.push(safeId);
			return () => {
				const index = safeLayerList.indexOf(safeId);
				if (index > -1) {
					safeLayerList.splice(index, 1);
				}
			};
		}, [layerList, id]);
	}

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
	const layerList = useRef<string[]>([]);

	const value = useMemo(
		() => ({
			topLevelRef,
			setTopLevel: (level: number) => {
				topLevelRef.current = level;
			},
			...(fg('layering-top-level-use-array') ? { layerList } : {}),
		}),
		[topLevelRef],
	);
	return <TopLevelContext.Provider value={value}>{children}</TopLevelContext.Provider>;
};

/**
 *
 * @important the component is toggled by isDisabled props, the default isDisabled is true
 *
 * Layering component is a wrapper to let children to consume layer contexts and hooks.
 *
 */
export const Layering = ({
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
