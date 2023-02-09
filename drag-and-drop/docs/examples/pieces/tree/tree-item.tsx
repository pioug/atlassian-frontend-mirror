/** @jsx jsx */

import {
  Children,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { jsx } from '@emotion/react';
import invariant from 'tiny-invariant';

import {
  attachClosestEdge,
  Edge,
  extractClosestEdge,
} from '@atlaskit/drag-and-drop-hitbox/experimental/tree';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/drag-and-drop/adapter/element';
import { combine } from '@atlaskit/drag-and-drop/util/combine';

import { indentPerLevel } from './constants';
import { TreeContext } from './tree-context';
import { TreeItemContext } from './tree-item-context';
import TreeItemGroup, { TreeItemGroupProps } from './tree-item-group';
import TreeItemLeaf from './tree-item-leaf';

type TreeItemProps = Omit<
  TreeItemGroupProps,
  'onClick' | 'closestEdge' | 'level'
>;

type TreeItemState = 'idle' | 'dragging' | 'preview';

const TreeItem = ({ children, id, isOpen = false, label }: TreeItemProps) => {
  const childCount = Children.count(children);
  const hasChildren = Boolean(childCount);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const [state, setState] = useState<TreeItemState>('idle');
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  const { dispatch } = useContext(TreeContext);
  const onClick = useCallback(() => {
    dispatch({ type: 'toggle', itemId: id });
  }, [dispatch, id]);

  const { nestingLevel } = useContext(TreeItemContext);
  const contextValue = useMemo(() => {
    return { nestingLevel: nestingLevel + 1 };
  }, [nestingLevel]);

  // Note: we could be using CSS variables here rather than numbers
  const inset = nestingLevel * indentPerLevel;

  useEffect(() => {
    invariant(buttonRef.current);
    return combine(
      draggable({
        element: buttonRef.current,
        getInitialData: () => ({ id, type: 'tree-item' }),
        onGenerateDragPreview: () => setState('preview'),
        onDragStart: () => setState('dragging'),
        onDrop: () => setState('idle'),
      }),
      dropTargetForElements({
        element: buttonRef.current,
        getData: ({ input, element }) => {
          const data = { id };
          return attachClosestEdge(data, {
            input,
            element,
            inset,
          });
        },
        canDrop: ({ source }) => source.data.type === 'tree-item',
        getIsSticky: () => true,
        onDrag: ({ self, source }) => {
          if (source.data.id !== id) {
            const closestEdge = extractClosestEdge(self.data);
            if (hasChildren) {
              if (closestEdge === 'child' && !isOpen) {
                dispatch({ type: 'expand', itemId: id });
              } else if (closestEdge === 'bottom' && isOpen) {
                /**
                 * TODO: confirm this collapse behavior with design
                 */
                dispatch({ type: 'collapse', itemId: id });
              }
            }

            setClosestEdge(closestEdge);
          }
        },
        onDragLeave: () => {
          setClosestEdge(null);
        },
        onDrop: () => {
          setClosestEdge(null);
        },
      }),
    );
  }, [dispatch, hasChildren, id, inset, isOpen]);

  const Component = hasChildren ? TreeItemGroup : TreeItemLeaf;

  return (
    <Component
      draggableState={state}
      id={id}
      level={nestingLevel}
      isOpen={isOpen}
      label={label}
      onClick={onClick}
      ref={buttonRef}
      closestEdge={closestEdge}
    >
      {Children.map(children, child => (
        /**
         * Using a map here instead of just wrapping all of the children,
         * so that the child count doesn't change (needed for badge on drag).
         */
        <TreeItemContext.Provider value={contextValue}>
          {child}
        </TreeItemContext.Provider>
      ))}
    </Component>
  );
};

export default TreeItem;
