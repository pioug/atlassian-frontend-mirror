import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

const _default_1: any = md`
	CharlieHierarchy is a component for building SVG-rendered trees. It is a wrapper around the
	\`visx/hierarchy\` Tree component that provides a more declarative API and handles common use
	cases, allowing for a quicker entry point to creating trees.
	
  ## Usage

  ${(
		<Example
			packageName="@atlaskit/charlie-hierarchy"
			Component={require('../examples/01-basic').default}
			title="Basic example"
			source={require('!!raw-loader!../examples/01-basic')}
		/>
	)}

  ## Using the useHierarchyData Hook

  The \`useHierarchyData\` hook provides a state management solution for hierarchical data structures.
  It leverages the \`@visx/hierarchy\` library and offers actions to manage your tree data dynamically.

  ### Basic Setup

  ${code`import { useHierarchyData, HierarchyContainer } from '@atlaskit/charlie-hierarchy';

const MyHierarchyComponent = () => {
  const [
    { rootNode, childrenAccessor },
    { addNode, resetRootNode }
  ] = useHierarchyData<NodeType>({
    childrenAccessor: (node) => node.children,
    updateChildren: (node, children) => ({ ...node, children }),
    identifierAccessor: (node) => node.id.toString(),
    parentIdentifierAccessor: (node) => node.parentId?.toString() ?? ''
  });

  // Add nodes as needed based on your use case
  // addNode(yourRootData);

  return (
    <HierarchyContainer>
      <CharlieHierarchy root={hierarchy(rootNode, childrenAccessor)}>
        {/* Your node rendering logic */}
      </CharlieHierarchy>
    </HierarchyContainer>
  );
};`}

  ### Required Configuration

  - **childrenAccessor**: Function that returns the children of a node
  - **updateChildren**: Function that creates a new node with updated children
  - **identifierAccessor**: Function that returns a unique identifier for a node
  - **parentIdentifierAccessor**: Function that returns the parent identifier of a node

  ### HierarchyContainer

  The \`HierarchyContainer\` component provides the necessary context for the hook's state management.
  Always wrap your hierarchy components within this container when using \`useHierarchyData\`.

  ### State and Actions

  The hook returns a tuple with:
  - **state**: Contains \`rootNode\`, \`addedNodeIdentifiers\`, and the accessor functions
  - **actions**: Contains \`addNode\` and \`resetRootNode\` methods

  ### Adding Data to Your Hierarchy

  You can add nodes to your hierarchy in various ways depending on your use case:

  ${code`// Direct call (e.g., in event handlers)
addNode(newNode);

// On component mount (for demo/initial data)
React.useEffect(() => {
  addNode(initialRootNode);
}, [addNode]);

// From async data loading
const loadData = async () => {
  const data = await fetchHierarchyData();
  addNode(data);
};

// In response to user actions
const handleAddNode = (nodeData) => {
  addNode(nodeData);
};`}

  The \`addNode\` function intelligently handles:
  - Setting the first node as root
  - Making a node the new root if it's the parent of the current root
  - Adding nodes as descendants of existing nodes

  ### Changing the Root Node

  ${code`// Reset the hierarchy with a new root node
actions.resetRootNode(newRootNode);`}

  The \`resetRootNode\` function allows you to:
  - Completely change the root of your hierarchy
  - Restructure your tree view from any node's perspective
  - Reset the \`addedNodeIdentifiers\` to only include the new root

  ${(
		<Example
			packageName="@atlaskit/charlie-hierarchy"
			Component={require('../examples/04-basic-with-hook').default}
			title="Interactive hierarchy with useHierarchyData hook"
			source={require('!!raw-loader!../examples/04-basic-with-hook')}
		/>
	)}

  This example demonstrates:
  - Component composition with separated concerns
  - Interactive root switching with \`resetRootNode\`
  - Proper use of \`HierarchyContainer\`
  - State management for collapsible nodes
  - Reset functionality to return to default state

  ${(
		<Props
			heading="CharlieHierarchy Props"
			props={require('!!extract-react-types-loader!../src')}
		/>
	)}
`;
export default _default_1;
