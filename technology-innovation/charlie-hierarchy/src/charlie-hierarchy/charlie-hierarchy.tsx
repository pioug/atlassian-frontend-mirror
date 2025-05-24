/**
 * CharlieHierarchy is meant to be a generic reusable component for building SVG rendered trees.
 * It is a wrapper around the visx Tree component that provides a more declarative API.
 * https://airbnb.io/visx/docs/hierarchy#Tree
 * Common use cases can be handled in the CharlieHierarchy component to allow for a quicker entry point to creating trees.
 */

/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag React.Fragment
 */
import React from 'react';

import { cssMap, jsx } from '@compiled/react';
import { Group } from '@visx/group';
import { Tree } from '@visx/hierarchy';
import { type TreeProps } from '@visx/hierarchy/lib/hierarchies/Tree';
import { type HierarchyPointNode } from '@visx/hierarchy/lib/types';
import { LinkVerticalStep } from '@visx/shape';
import { type ProvidedZoom, type TransformMatrix } from '@visx/zoom/lib/types';

import { token } from '@atlaskit/tokens';

const staticStyles = cssMap({
	hierarchyWrapper: {
		position: 'relative',
	},
	nodeGroupWrapper: {
		position: 'absolute',
	},
	nodeWrapper: {
		position: 'absolute',
		overflow: 'visible',
	},
	svg: {
		position: 'absolute',
		overflow: 'visible',
	},
	zoom: {
		touchAction: 'none',
	},
});
export interface CharlieHierarchyProps<Datum> extends Omit<TreeProps<Datum>, 'children'> {
	/**
	 * Children gets called for each node when the tree is being generated.
	 * This is where you can render your custom node components.
	 */
	children: (
		// The node object data that is being rendered
		node: HierarchyPointNode<Datum>,
		// A boolean that indicates if the tree is currently being suspended
		isSuspending: boolean,
		// A function that can be called to start a transition
		startSuspending: React.TransitionStartFunction,
	) => React.ReactNode;
	/**
	 * zoom controller that is passed to the space tree component to enable zooming and panning functionality.
	 * https://github.com/airbnb/visx/blob/master/packages/visx-zoom/src/types.ts#L49
	 *
	 * This can be passed to the space tree from the parent zoom component.
	 * https://airbnb.io/visx/zoom-i
	 *
	 * <Zoom<SVGSVGElement>
	 *  {(zoom) => (
	 *   <CharlieHierarchy zoom={zoom} ... />
	 *  )}
	 * <Zoom>
	 */
	zoom?: ProvidedZoom<SVGSVGElement> & {
		initialTransformMatrix: TransformMatrix;
		transformMatrix: TransformMatrix;
		isDragging: boolean;
	};

	// Custom styles for the tree
	styles?: {
		// Separates the nodes from each other by the specified amount.
		padding?: { above: number; adjacent: number };

		lineAttributes?: Omit<
			React.SVGAttributes<unknown>,
			| 'className'
			| 'innerRef'
			| 'data'
			| 'path'
			| 'percent'
			| 'x'
			| 'y'
			| 'source'
			| 'target'
			| 'children'
		>;
		/**
		 * A transform matrix that can be applied to the tree.
		 * If you are using zoom, this will be overridden by the zoom transform matrix.
		 */
		transformMatrix?: {
			scaleX: number;
			scaleY: number;
			skewX: number;
			skewY: number;
			translateX: number;
			translateY: number;
		};
	};
	/**
	 * Rendering the tree can be expensive, so we provide a way to pass in dependencies to the render function.
	 * Pass any dependencies that on change should trigger a re-render of the tree.
	 */
	renderDependencies?: React.DependencyList;
}

export const CharlieHierarchy = <Datum,>(props: CharlieHierarchyProps<Datum>) => {
	const [isSuspending, startSuspending] = React.useTransition();

	const styles = {
		...{ padding: { above: 100, adjacent: 30 } },
		...props.styles,
	};

	const containerHeight = props.size?.[1] ?? 0;
	const containerWidth = props.size?.[0] ?? 0;
	const nodeWidth = props.nodeSize?.[0] ?? 0;
	const nodeHeight = props.nodeSize?.[1] ?? 0;
	const nodeWidthWithPadding = nodeWidth + styles.padding.adjacent;
	const nodeHeightWithPadding = nodeHeight + styles.padding.above;
	const nodeSize: [number, number] = [nodeWidthWithPadding, nodeHeightWithPadding];
	const root = props.root;
	const top = props.top ?? 0;
	const left = props.left ?? 0;
	const zoom = props?.zoom;
	const cursor = zoom?.isDragging ? 'grabbing' : 'grab';
	const children = props.children;
	const renderDependencies = props.renderDependencies ?? [];

	/**
	 * If zoom is enabled, we need to apply the transform matrix to the SVG.
	 * If not, then use the static transform matrix provided in the styles prop.
	 * If no transform matrix is provided, then don't apply any transform.
	 */
	const transformMatrix = styles.transformMatrix ?? {
		scaleX: 1,
		scaleY: 1,
		skewX: 0,
		skewY: 0,
		translateX: document.body.clientWidth / 2,
		translateY: 120,
	};
	const transform = zoom
		? zoom?.toString()
		: transformMatrix
			? `matrix(${transformMatrix.scaleX}, ${transformMatrix.skewX}, ${transformMatrix.skewY}, ${transformMatrix.scaleY}, ${transformMatrix.translateX}, ${transformMatrix.translateY})`
			: undefined;

	const edges = React.useMemo(() => {
		return (
			<Tree<Datum> root={root} top={top} left={left} nodeSize={nodeSize}>
				{/* The tree is passed to the children function so that the links can be rendered */}
				{(tree) => {
					return (
						<>
							{tree.links().map((link, linkIndex) => (
								<LinkVerticalStep
									key={`link-${linkIndex}`}
									data={link}
									stroke={token('color.border.accent.gray')}
									strokeWidth="1"
									fill="none"
									opacity={1}
									percent={0.5}
									{...(props.styles?.lineAttributes ?? {})}
								/>
							))}
						</>
					);
				}}
			</Tree>
		);
		// There are cases where the parent component will want to render the tree
		// depending on certain props. so we need to pass the renderDependencies so the
		// tree will re-render when the dependencies change.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...renderDependencies, props.styles?.lineAttributes]);

	const nodes = React.useMemo(() => {
		return (
			<Tree<Datum> root={root} top={top} left={left} nodeSize={nodeSize}>
				{(tree) => {
					const descendants = tree.descendants();

					return (
						<>
							{descendants.map((node, index) => {
								const top: number = node.y - nodeHeight / 2;
								const left: number = node.x - nodeWidth / 2;

								return (
									<div
										key={`tree-node-${index}`}
										css={staticStyles.nodeWrapper}
										style={{
											top: top,
											left: left,
											width: `${nodeWidth}px`,
											height: `${nodeHeight}px`,
										}}
									>
										{children(node, isSuspending, startSuspending)}
									</div>
								);
							})}
						</>
					);
				}}
			</Tree>
		);
		// There are cases where the parent component will want to render the tree
		// depending on certain props. so we need to pass the renderDependencies so the
		// tree will re-render when the dependencies change.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...renderDependencies, nodeHeight, isSuspending, nodeWidth, children]);

	return (
		<div
			style={{
				height: `${containerHeight}px`,
				width: `${containerWidth}px`,
			}}
			css={staticStyles.hierarchyWrapper}
		>
			<svg
				width={containerWidth}
				height={containerHeight}
				css={[staticStyles.svg, zoom ? staticStyles.zoom : undefined]}
				style={{
					cursor: `${cursor}`,
				}}
				ref={zoom ? zoom.containerRef : undefined}
			>
				{zoom && (
					<rect
						width={containerWidth}
						height={containerHeight}
						fill="transparent"
						onTouchStart={zoom.dragStart}
						onTouchMove={zoom.dragMove}
						onTouchEnd={zoom.dragEnd}
						onMouseDown={zoom.dragStart}
						onMouseMove={zoom.dragMove}
						onMouseUp={zoom.dragEnd}
						onMouseLeave={() => {
							if (zoom.isDragging) {
								zoom.dragEnd();
							}
						}}
					/>
				)}
				<Group transform={transform}>{edges}</Group>
			</svg>
			<div
				style={{
					transform: `${transform}`,
				}}
				css={staticStyles.nodeGroupWrapper}
			>
				{nodes}
			</div>
		</div>
	);
};
