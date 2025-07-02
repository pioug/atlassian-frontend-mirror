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
import { componentWithFG } from '@atlaskit/platform-feature-flags-react';

import { LayerNode } from '../classes/layer-node';

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
 * LevelNodeContext maintains the current layer node of nested layers.
 * Default ref value is null
 */
export const LevelNodeContext = createContext<MutableRefObject<LayerNode | null>>({
	current: null,
});

/**
 *
 *  @internal
 * RootNodeContext maintains the root node of the layer tree.
 * Default ref value is null
 */
export const RootNodeContext = createContext<MutableRefObject<LayerNode | null>>({
	current: null,
});

/**
 *
 *  @internal @deprecated
 * TopLevelContext which maintains the top level ref and setTopLevel method of layers
 * Default ref value is null
 *
 */
export const TopLevelContext = createContext<{
	topLevelRef: MutableRefObject<number | null>;
	layerList: MutableRefObject<string[] | null>;
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
	node: MutableRefObject<LayerNode>;
}> = ({ children, currentLevel, node: levelNode }) => {
	useEffect(() => {
		const levelNodeSafe = levelNode.current;
		const parentNode = levelNodeSafe.parent;

		parentNode?.addChild(levelNodeSafe);

		return () => {
			parentNode?.removeChild(levelNodeSafe);
		};
	}, [levelNode]);

	return (
		<LevelContext.Provider value={currentLevel}>
			<LevelNodeContext.Provider value={levelNode}>{children}</LevelNodeContext.Provider>
		</LevelContext.Provider>
	);
};

/**
 *
 *  @internal @deprecated
 * Context Provider Component which provider the current level of nested layers
 * It handles level management when it mounts and unmounts
 *
 */
const LevelProviderOld: FC<{
	children: ReactNode;
	currentLevel: number;
}> = ({ children, currentLevel }) => {
	const { layerList } = useContext(TopLevelContext);
	// This is not unstable, it will run once for ref creation.
	// eslint-disable-next-line  @repo/internal/react/disallow-unstable-values
	const id = useRef(Math.random().toString(36));

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

	return <LevelContext.Provider value={currentLevel}>{children}</LevelContext.Provider>;
};

/**
 *
 *  @internal @deprecated
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
			layerList,
		}),
		[topLevelRef, layerList],
	);
	return <TopLevelContext.Provider value={value}>{children}</TopLevelContext.Provider>;
};

/**
 *
 * @deprecated
 * @important the component is toggled by isDisabled props, the default isDisabled is true
 *
 * Layering component is a wrapper to let children to consume layer contexts and hooks.
 *
 */
const LayeringOld = ({
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

	const content = <LevelProviderOld currentLevel={currentLevel + 1}>{children}</LevelProviderOld>;

	return isNested ? content : <LayeringProvider>{content}</LayeringProvider>;
};

/**
 *
 * @important the component is toggled by isDisabled props, the default isDisabled is true
 *
 * Layering component is a wrapper to let children to consume layer contexts and hooks.
 *
 */
const LayeringNew = ({
	children,
	isDisabled = true,
}: {
	children: ReactNode;
	isDisabled?: boolean;
}) => {
	const currentLevel = useContext(LevelContext);
	const parentNode = useContext(LevelNodeContext);

	// eslint-disable-next-line  @repo/internal/react/disallow-unstable-values
	const newNode = useRef<LayerNode>(new LayerNode(Math.random().toString(36), parentNode.current));

	if (isDisabled) {
		return <>{children}</>;
	}
	const isNested = currentLevel > 0;

	const content = (
		<LevelProvider currentLevel={currentLevel + 1} node={newNode}>
			{children}
		</LevelProvider>
	);

	return isNested ? (
		content
	) : (
		<RootNodeContext.Provider value={newNode}>{content}</RootNodeContext.Provider>
	);
};

/**
 *
 * @important the component is toggled by isDisabled props, the default isDisabled is true
 *
 * Layering component is a wrapper to let children to consume layer contexts and hooks.
 * For more information on the implementation: https://hello.atlassian.net/wiki/x/FQCDQwE
 *
 */
export const Layering = componentWithFG('layering-tree-graph', LayeringNew, LayeringOld);
