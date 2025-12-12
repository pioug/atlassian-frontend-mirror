import React, {
	createContext,
	type FC,
	type MutableRefObject,
	type ReactNode,
	useContext,
	useEffect,
	useRef,
} from 'react';

import __noop from '@atlaskit/ds-lib/noop';

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
 * @important the component is toggled by isDisabled props, the default isDisabled is true
 *
 * Layering component is a wrapper to let children to consume layer contexts and hooks.
 * For more information on the implementation: https://hello.atlassian.net/wikix/x/FQCDQwE
 *
 */
export const Layering = ({
	children,
	isDisabled = true,
}: {
	children: ReactNode;
	isDisabled?: boolean;
}): React.JSX.Element => {
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
