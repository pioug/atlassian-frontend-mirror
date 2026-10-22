/* eslint-disable @repo/internal/react/require-jsdoc */

import React, {
	type FC,
	type MutableRefObject,
	type ReactNode,
	useContext,
	useEffect,
	useRef,
} from 'react';

import { LayerNode } from '../classes/layer-node';
import { LevelContext } from './level-context';
import { LevelNodeContext } from './level-node-context';
import { RootNodeContext } from './root-node-context';

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
 * @deprecated The browser top layer handles stacking and Escape natively. Use `@atlaskit/top-layer`
 * (DS components use it on their `platform-dst-top-layer` path). To check whether an overlay is
 * open, use `hasOpenDialogOrPopover` from `@atlaskit/top-layer/page-surface/has-open-dialog-or-popover`. During the rollout, do not render
 * `Layering` when `fg('platform-dst-top-layer')` is on.
 */
export const Layering: ({
	children,
	isDisabled,
}: {
	children: ReactNode;
	isDisabled?: boolean;
}) => React.JSX.Element = ({
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
