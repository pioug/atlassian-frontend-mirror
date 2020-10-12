import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`
  Tree component provides a generic way to visualize tree structures. It was built on top of the popular [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)
  library in order to provide a natural way of reorganizing the nodes.

  ## Feature set

   - Fully customizable node rendering
   - Capability to collapse and expand subtree
   - Lazy loading of subtree
   - Reorganization of the tree by drag&drop
   - Mouse, touch and keyboard support

  ## Usage

  ${code`import Tree, { mutateTree, moveItemOnTree } from '@atlaskit/tree';`}

  ${(
    <Example
      packageName="@atlaskit/tree"
      Component={require('../examples/5-pure-tree').default}
      title="Drag-n-Drop Tree"
      source={require('!!raw-loader!../examples/5-pure-tree')}
    />
  )}

  ## Get started

  ### Tree data structure

  Tree is defined by a normalized data structure, where _rootId_ defines the _id_ of the root node and _items_ map contains all the nodes indexed by their _id_.
  Child relationship is defined in the _children_ field of parent in form of list of _id_'s.

  **Data attribute:** Any consumer data should be defined in the _data_ attribute of item, e.g. title, color, selection etc.

  **State handling:** This data structure is the single source of truth. After any interaction the consumer's responsibility to execute the mutation
   on the tree, which will be passed down in props to refresh the rendered tree. A few utils functions (_mutateTree_, _moveItemOnTree_) are provided
   in order to help you make those changes easily and in a efficient way.

  **Performance / Side-effects:** We put some effort into optimizing rendering based on reference equality. We only re-render an Item if it's reference changed or
  moved on the tree.

  ${code`
type ItemId = any;

interface TreeData {
  rootId: ItemId,
  items: { [ItemId]: TreeItem },
};

type TreeItem = {|
  id: ItemId,
  children: Array<ItemId>,
  hasChildren?: boolean,
  isExpanded?: boolean,
  isChildrenLoading?: boolean,
  data?: TreeItemData,
|};
  `}

  ### Rendering

  In order to render the tree, _renderItem_ render prop must be defined on _Tree_. It will receive one object with multiple params, defined as _RenderItemParams_ .

  **Root item** is not rendered by design. If you want to render a tree with a single root, you will need to create a virtual root above your effective root.

  **Provided** is a concept inherited from react-beautiful-dnd library in order to provide flexible drag&drop functionality.

   - _innerRef_ must be bound to the highest possible DOM node in the ReactElement. We do this in order to avoid needing to use ReactDOM to look up your DOM node.
   - _draggableProps_ is an Object that contains a data attribute and an inline style. This Object needs to be applied to the same node that you apply provided.innerRef to. This controls the movement of the draggable when it is dragging and not dragging.
   - _dragHandleProps_ is used to drag the whole tree item. Often this will be the highest level node, but sometimes it can be a child node. dragHandleProps need to be applied to the node that you want to be the drag handle.

  ${code`
type RenderItemParams = {|
  /** Item to be rendered */
  item: TreeItem,
  /** The depth of the item on the tree. 0 means root level. */
  depth: number,
  /** Function to call when a parent item needs to be expanded */
  onExpand: (itemId: ItemId) => void,
  /** Function to call when a parent item needs to be collapsed */
  onCollapse: (itemId: ItemId) => void,
  /** Couple of Props to be spread into the rendered React.Components and DOM elements */
  /** More info: https://github.com/atlassian/react-beautiful-dnd#children-function-render-props */
  provided: TreeDraggableProvided,
  /** Couple of state variables */
  /** More info: https://github.com/atlassian/react-beautiful-dnd#2-snapshot-draggablestatesnapshot */
  snapshot: DraggableStateSnapshot,
|};
  `}

  **Example**

  ${code`
renderItem = ({
  item,
  depth,
  onExpand,
  onCollapse,
  provided,
}: RenderItemParams) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <span>{getIcon(item, onExpand, onCollapse)}</span>
      <span>{item.data ? item.data.title : ''}</span>
    </div>
  );
};
  `}

  ### Expand & Collapse

  _onExpand_ and _onCollapse_ functions are triggered when there is a need to change the state of a parent. This is the right time to trigger requests to load the subtree or
  flip the _isExpanded_ attribute to show the already loaded children nodes.

  **Example**

  ${code`
onExpand = (itemId: ItemId) => {
  const { tree }: State = this.state;
  this.setState({
    tree: mutateTree(tree, itemId, { isExpanded: true }),
  });
};
  `}

  ### Drag & Drop

  Drag&Drop is powered by [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd), so a couple of design principles are inherited from there. To make it work
  _provided_ from _renderItem_ must be used as defined earlier in the Rendering section. For custom behavior you can also act on a few additional information conveyed in
  _snapshot_ attribute.

  **Events:** _onDragStart_ and _onDragEnd_ functions will be triggered at the beginning and the end of re-ordering. They provide the necessary information as _TreePosition_
   to change the tree.

  **Current limitations = Plans:** Currently it's not possible to drag a parent, which is already expanded. Addition to this, it's not possible to hover over another item to
  expand it or drop on top to nest. We are actively working on these features and we will update the documentation once they are ready.

  **Example**

  ${code`
type TreePosition = {|
  parentId: ItemId,
  index: number,
|};

onDragEnd = (source: TreePosition, destination: ?TreePosition) => {
  const { tree } = this.state;

  if (!destination) {
    return;
  }
  const newTree = moveItemOnTree(tree, source, destination);
  this.setState({
    tree: newTree,
  });
};
  `}

  ${(
    <Props
      title="API Reference"
      heading="Tree Props"
      props={require('!!extract-react-types-loader!../src/components/Tree/Tree')}
    />
  )}
`;
