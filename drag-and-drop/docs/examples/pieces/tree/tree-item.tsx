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
import { TreeDropIndicator } from '@atlaskit/drag-and-drop-indicator/experimental/tree';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/drag-and-drop/adapter/element';
import { combine } from '@atlaskit/drag-and-drop/util/combine';

import { TreeContext } from './tree-context';
import { TreeItemContext } from './tree-item-context';
import TreeItemGroup, { TreeItemGroupProps } from './tree-item-group';
import TreeItemLeaf from './tree-item-leaf';

type TreeItemProps = Omit<TreeItemGroupProps, 'onClick'>;

type TreeItemState = 'idle' | 'dragging' | 'preview';

const TreeItem = ({
  children,
  id,
  inset: childInset,
  isOpen = false,
  label,
}: TreeItemProps) => {
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

  const edge = closestEdge === 'child' ? 'bottom' : closestEdge;
  const inset = nestingLevel * childInset;
  const dropIndicatorInset =
    closestEdge === 'child' ? inset + childInset : inset;

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
    <TreeDropIndicator hasTerminal edge={edge} inset={dropIndicatorInset}>
      {({ className }) => (
        <Component
          className={className}
          draggableState={state}
          id={id}
          inset={inset}
          isOpen={isOpen}
          label={label}
          onClick={onClick}
          ref={buttonRef}
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
      )}
    </TreeDropIndicator>
  );
};

export default TreeItem;
