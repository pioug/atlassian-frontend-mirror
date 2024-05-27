import { type ReactNode } from 'react';
// Allowing existing usage of non Pragmatic drag and drop solution
// eslint-disable-next-line @atlaskit/design-system/no-unsupported-drag-and-drop-libraries
import {
  type DraggableProvided,
  type DraggableStateSnapshot,
  type DraggableProvidedDragHandleProps,
  type DraggableProvidedDraggableProps,
  type DraggingStyle,
} from 'react-beautiful-dnd-next';
import { type ItemId, type Path, type TreeItem } from '../../types';

export type TreeDraggingStyle = DraggingStyle & {
  paddingLeft: number;
  transition: 'none' | string;
};

export type DragActionType = null | 'mouse' | 'key' | 'touch';

export type RenderItemParams = {
  item: TreeItem;
  depth: number;
  onExpand: (itemId: ItemId) => void;
  onCollapse: (itemId: ItemId) => void;
  provided: TreeDraggableProvided;
  snapshot: DraggableStateSnapshot;
};

export type TreeDraggableProvided = {
  draggableProps: DraggableProvidedDraggableProps;
  // will be null if the draggable is disabled
  dragHandleProps: DraggableProvidedDragHandleProps | null;
  // The following props will be removed once we move to react 16
  innerRef: (el: HTMLElement | null) => void;
};

export type Props = {
  item: TreeItem;
  path: Path;
  onExpand: (itemId: ItemId, path: Path) => void;
  onCollapse: (itemId: ItemId, path: Path) => void;
  renderItem: (item: RenderItemParams) => ReactNode;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  itemRef: (itemId: ItemId, element: HTMLElement | null) => void;
  offsetPerLevel: number;
};
