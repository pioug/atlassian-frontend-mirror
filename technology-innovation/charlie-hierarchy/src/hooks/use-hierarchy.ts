import { type Action, createContainer, createHook, createStore } from 'react-sweet-state';

type State<NodeType extends object> = {
	addedNodeIdentifiers: Set<string>;
	rootNode: NodeType | null;
	/**
	 * used to determine the children of a node
	 */
	childrenAccessor: (node: NodeType) => NodeType[] | undefined | null;
	updateChildren: (node: NodeType, children: NodeType[]) => NodeType;
	/**
	 * used to determine the unique identifier of a node for comparison
	 */
	identifierAccessor: (node: NodeType) => string;

	/**
	 * used to determine the unique identifier of a nodes parent for comparison
	 */
	parentIdentifierAccessor: (node: NodeType) => string;
};

export const HierarchyContainer = createContainer();

/**
 * useHierarchyData manages your hierarchal data leveraging
 * the `@visx/hierarchy` library (wrapper for d3).
 */
export const useHierarchyData = <NodeType extends object>({
	childrenAccessor,
	updateChildren,
	identifierAccessor,
	parentIdentifierAccessor,
}: {
	childrenAccessor: State<NodeType>['childrenAccessor'];
	updateChildren: State<NodeType>['updateChildren'];
	identifierAccessor: State<NodeType>['identifierAccessor'];
	parentIdentifierAccessor: State<NodeType>['parentIdentifierAccessor'];
}) => {
	const initialState: State<NodeType> = {
		rootNode: null,
		addedNodeIdentifiers: new Set(),
		childrenAccessor,
		identifierAccessor,
		parentIdentifierAccessor,
		updateChildren,
	};

	const actions = {
		resetRootNode:
			(root: NodeType): Action<State<NodeType>> =>
			({ setState, getState }) => {
				setState({
					rootNode: root,
					addedNodeIdentifiers: new Set([getState().identifierAccessor(root)]),
				});
			},
		/** for useHierarchyData, when you add a node it must either be:
		 * - the new root
		 * - parent of the existing root
		 * - descendent of the existing root
		 */
		addNode:
			(node: NodeType): Action<State<NodeType>> =>
			({ setState, getState }) => {
				const childrenAccessor = getState().childrenAccessor;
				const identifierAccessor = getState().identifierAccessor;
				const parentIdentifierAccessor = getState().parentIdentifierAccessor;

				const currentIdentifiers = getState().addedNodeIdentifiers;
				// it's already been added, skip!
				if (currentIdentifiers.has(identifierAccessor(node))) {
					return;
				}

				const rootNode = getState().rootNode;

				// if there is no root, the node becomes the root!
				if (rootNode == null) {
					setState({
						rootNode: node,
						addedNodeIdentifiers: new Set([identifierAccessor(node)]),
					});
					return;
				}

				const nodeId = identifierAccessor(node);
				const rootId = identifierAccessor(rootNode);

				// if the node is the parent of the root, then it becomes the new root
				const nodeChildren = childrenAccessor(node);

				let foundChild = false;
				const updatedChildren = (nodeChildren ?? []).map((child) => {
					if (identifierAccessor(child) === rootId) {
						foundChild = true;
						return rootNode;
					} else {
						return child;
					}
				});

				if (foundChild) {
					setState({
						rootNode: updateChildren(node, updatedChildren),
						addedNodeIdentifiers: new Set(currentIdentifiers).add(nodeId),
					});
					return;
				}

				let tempRoot: NodeType | undefined = rootNode;
				let searchingThroughChildren = true;
				let accessedNodes: NodeType[] = [];
				const visitedNodes: NodeType[] = [];
				while (searchingThroughChildren && tempRoot != null) {
					visitedNodes.push(tempRoot);
					const children = childrenAccessor(tempRoot);
					if (children) {
						accessedNodes = [...accessedNodes, ...children];
					}
					let foundInTree = false;
					const updatedRootDesc = (children ?? [])
						.map((child) => {
							if (nodeId === identifierAccessor(child)) {
								foundInTree = true;
								return node;
							} else {
								return child;
							}
						})
						.filter(Boolean);

					if (foundInTree) {
						// Work our way up the tree to update the parent nodes
						let currentRootNode = updateChildren(tempRoot, updatedRootDesc);
						while (identifierAccessor(currentRootNode) !== rootId) {
							// Find the parent node from our visited nodes
							const parentNode = visitedNodes.find((visitedNode) => {
								return (
									identifierAccessor(visitedNode) === parentIdentifierAccessor(currentRootNode)
								);
							});

							// No parent found, we must be the root
							if (!parentNode) {
								break;
							}

							// Get a new version of the children where you replace the old node with the new one
							const currentRootChildrenNodes = childrenAccessor(parentNode);
							const currentDescendingChildren = (currentRootChildrenNodes ?? [])
								.map((child) => {
									if (identifierAccessor(currentRootNode) === identifierAccessor(child)) {
										foundInTree = true;
										return currentRootNode;
									} else {
										return child;
									}
								})
								.filter(Boolean);

							// Set the new parent node
							currentRootNode = updateChildren(parentNode, currentDescendingChildren);
						}

						setState({
							rootNode: currentRootNode,
							addedNodeIdentifiers: new Set(currentIdentifiers).add(nodeId),
						});
						return;
					}

					if (accessedNodes.length === 0) {
						searchingThroughChildren = false;
					} else {
						tempRoot = accessedNodes.shift();
					}
				}
			},
	};

	const Store = createStore({
		containedBy: HierarchyContainer,
		initialState,
		actions: actions,
		name: 'HierarchyDataStore',
	});

	return createHook(Store)();
};
