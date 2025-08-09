import React from 'react';

import { hierarchy } from '@visx/hierarchy';
import type { HierarchyNode } from '@visx/hierarchy/lib/types';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { CharlieHierarchy } from '../src';
import { HierarchyContainer, useHierarchyData } from '../src/hooks/use-hierarchy';

import { rootNode as hierarchyRootNode, type Node } from './common/basic-hierarchy';

const styles = cssMap({
	container: {
		display: 'flex',
		justifyContent: 'center',
	},
	resetButton: {
		textAlign: 'center',
	},
	node: {
		width: '100%',
		minHeight: '40px',
		paddingTop: token('space.075'),
		paddingRight: token('space.075'),
		paddingBottom: token('space.075'),
		paddingLeft: token('space.075'),
		backgroundColor: token('color.background.neutral.bold'),
		color: token('color.text.inverse'),
		textAlign: 'center',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: token('border.radius.100'),
	},
});

// Helper functions for demo purposes
const findNodeById = (id: number, node: Node): Node | null => {
	if (node.id === id) {
		return node;
	}
	if (node.children) {
		for (const child of node.children) {
			const found = findNodeById(id, child);
			if (found) {
				return found;
			}
		}
	}
	return null;
};

const ResetButton = ({ resetRootNode }: { resetRootNode: (node: Node) => void }) => {
	return (
		<Button
			onClick={() => {
				resetRootNode(hierarchyRootNode);
			}}
		>
			Reset
		</Button>
	);
};

const MakeRootButton = ({
	resetRootNode,
	setCollapsedNodes,
	node,
}: {
	resetRootNode: (node: Node) => void;
	setCollapsedNodes: (nodes: Set<number>) => void;
	node: HierarchyNode<Node>;
}) => {
	return (
		<Button
			onClick={() => {
				const foundNode = findNodeById(node?.data?.id ?? 0, hierarchyRootNode);
				if (foundNode) {
					// Reset the root node to a new node.
					resetRootNode(foundNode);
					setCollapsedNodes(new Set([]));
				}
			}}
			appearance="subtle"
			spacing="compact"
		>
			Make Root
		</Button>
	);
};

const CollapseButton = ({
	setCollapsedNodes,
	node,
	collapsedNodes,
}: {
	setCollapsedNodes: React.Dispatch<React.SetStateAction<Set<number>>>;
	node: HierarchyNode<Node>;
	collapsedNodes: Set<number>;
}) => {
	const isCollapsed = collapsedNodes.has(node?.data?.id ?? 0);
	return (
		<Button
			onClick={() => {
				if (collapsedNodes.has(node?.data?.id ?? 0)) {
					setCollapsedNodes((prev) => {
						const newSet = new Set(prev);
						newSet.delete(node?.data?.id ?? 0);
						return newSet;
					});
				} else {
					setCollapsedNodes((prev) => new Set<number>(prev).add(node?.data?.id ?? 0));
				}
			}}
			appearance="primary"
			spacing="compact"
		>
			{isCollapsed ? 'Expand' : 'Collapse'}
		</Button>
	);
};

const HierarchyWithHook = () => {
	// useHierarchyData hook is used to manage the state of the hierarchy.
	const [{ rootNode, childrenAccessor }, { addNode, resetRootNode }] = useHierarchyData<Node>({
		// The children accessor is used to determine the children of a node.
		childrenAccessor: (node) => {
			if (node?.children == null) {
				return undefined;
			}
			return node.children;
		},
		// The update children function is used to update the children of a node.
		updateChildren: (node, children) => {
			return { ...node, children };
		},
		// The identifier accessor is used to determine the unique identifier of a node for comparison.
		identifierAccessor: (node) => node.id.toString(),
		// The parent identifier accessor is used to determine the parent identifier of a node for comparison.
		parentIdentifierAccessor: (node) => node.parentId?.toString() ?? '',
	});

	const [collapsedNodes, setCollapsedNodes] = React.useState<Set<number>>(new Set());

	// Set the root node to the hierarchy root node when the component mounts for demo purposes
	React.useEffect(() => {
		addNode(hierarchyRootNode);
	}, [addNode]);

	if (!rootNode) {
		return null;
	}

	// Create a visx hierarchy from the root node where we can collapse nodes
	const root = hierarchy(rootNode, (node) => {
		if ((node?.id && collapsedNodes.has(node.id)) || !node) {
			return null;
		}

		const children = childrenAccessor(node);
		return children;
	});

	return (
		<Box xcss={styles.container}>
			<Stack space="space.100">
				{/* Reset to Default Root button */}
				<Box xcss={styles.resetButton}>
					<ResetButton resetRootNode={resetRootNode} />
				</Box>
				{/* Hierarchy container */}
				<HierarchyContainer>
					{/* Hierarchy component */}
					<CharlieHierarchy
						root={root}
						nodeSize={[140, 50]}
						size={[600, 700]}
						renderDependencies={[collapsedNodes, root]}
					>
						{(node) => {
							const hasChildren =
								Array.isArray(node?.data?.children) && node.data.children.length > 0;
							const isCurrentRoot = rootNode?.id === node?.data?.id;

							return (
								<Stack space="space.050">
									<Box xcss={styles.node}>
										{node?.data?.name} {isCurrentRoot && '(Root)'}
									</Box>
									<Stack space="space.025">
										{hasChildren && (
											<CollapseButton
												setCollapsedNodes={setCollapsedNodes}
												node={node}
												collapsedNodes={collapsedNodes}
											/>
										)}
										{!isCurrentRoot && (
											<MakeRootButton
												resetRootNode={resetRootNode}
												setCollapsedNodes={setCollapsedNodes}
												node={node}
											/>
										)}
									</Stack>
								</Stack>
							);
						}}
					</CharlieHierarchy>
				</HierarchyContainer>
			</Stack>
		</Box>
	);
};

export default function Basic() {
	return (
		<div>
			<HierarchyWithHook />
		</div>
	);
}
