/** @jsx jsx */
import { ReactNode, useEffect, useRef, useState } from 'react';

import { css, jsx, SerializedStyles } from '@emotion/react';
import ReactDOM from 'react-dom';
import invariant from 'tiny-invariant';

import {
  attachClosestEdge,
  Edge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/addon/closest-edge';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-indicator/box-without-terminal';
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/adapter/element';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/util/combine';
import { offsetFromPointer } from '@atlaskit/pragmatic-drag-and-drop/util/offset-from-pointer';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/util/set-custom-native-drag-preview';
import { token } from '@atlaskit/tokens';

import { TableHeading } from './styled';

type DraggableState =
  | { type: 'idle' }
  | { type: 'preview'; container: HTMLElement }
  | { type: 'dragging' };

const tableHeadingStatusStyles: Partial<
  Record<DraggableState['type'], SerializedStyles>
> = {
  idle: css({
    ':hover': {
      background: token('elevation.surface.hovered', '#091E4224'),
    },
  }),
  dragging: css({
    background: token('color.background.disabled', '#091E4224'),
    color: token('color.text.disabled', '#091E424F'),
  }),
};

const verticallyAlignedStyles = css({
  display: 'flex',
  alignItems: 'center',
  whiteSpace: 'nowrap',
});

const dropTargetStyles = css({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
});

const noPointerEventsStyles = css({
  pointerEvents: 'none',
});

const idleState: DraggableState = { type: 'idle' };
const draggingState: DraggableState = { type: 'dragging' };

export const DraggableTableHeading = ({
  children,
  id,
  index,
  tableId,
  dndPreviewHeight,
  dragPreview,
  maxWidth,
}: {
  children: ReactNode;
  id: string;
  index: number;
  tableId: Symbol;
  dndPreviewHeight: number;
  dragPreview: React.ReactNode;
  maxWidth?: number;
}) => {
  const ref = useRef<HTMLTableCellElement>(null);
  const [state, setState] = useState<DraggableState>(idleState);

  const [isDraggingAnyColumn, setIsDraggingAnyColumn] = useState(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  const dropTargetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cell = ref.current;

    invariant(cell);

    return combine(
      draggable({
        element: cell,
        getInitialData() {
          return { type: 'table-header', id, index, tableId };
        },
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            getOffset: offsetFromPointer({
              x: '18px',
              y: '18px',
            }),
            render: ({ container }) => {
              // Cause a `react` re-render to create your portal synchronously
              setState({ type: 'preview', container });
              // In our cleanup function: cause a `react` re-render to create remove your portal
              // Note: you can also remove the portal in `onDragStart`,
              // which is when the cleanup function is called
              return () => setState(draggingState);
            },
            nativeSetDragImage,
          });
        },
        onDragStart() {
          setState(draggingState);
        },
        onDrop() {
          setState(idleState);
        },
      }),
    );
  }, [id, index, tableId]);

  // Here we handle drop target, that in our case is absolutely positioned div that covers full width and height
  // of this column (has height of whole table). It sits on top of everything, but has `pointerEvents: 'none'` by default
  useEffect(() => {
    const dropTarget = dropTargetRef.current;
    invariant(dropTarget);

    return dropTargetForElements({
      element: dropTarget,
      getIsSticky() {
        return true;
      },
      getData({ input, element }) {
        const data = { id, index };
        return attachClosestEdge(data, {
          input,
          element,
          allowedEdges: ['left', 'right'],
        });
      },
      canDrop(args) {
        return (
          args.source.data.type === 'table-header' &&
          args.source.data.tableId === tableId
        );
      },
      onDrag(args) {
        if (args.source.data.id !== id) {
          setClosestEdge(extractClosestEdge(args.self.data));
        }
      },
      onDragLeave() {
        setClosestEdge(null);
      },
      onDrop() {
        setClosestEdge(null);
      },
    });
  }, [id, index, tableId]);

  // During dragging anywhere we want to remove `pointerEvents: 'none'` from all the drop targets
  useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return (
          source.data.type === 'table-header' && source.data.tableId === tableId
        );
      },
      onDragStart() {
        /**
         * Should cause a synchronous re-render.
         */
        setIsDraggingAnyColumn(true);
      },
      onDrop() {
        setIsDraggingAnyColumn(false);
      },
    });
  }, [tableId]);

  return (
    <TableHeading
      ref={ref}
      css={[tableHeadingStatusStyles[state.type]]}
      data-testid={`${id}-column-heading`}
      style={{
        maxWidth,
      }}
    >
      <div
        ref={dropTargetRef}
        css={[
          dropTargetStyles,
          isDraggingAnyColumn ? null : noPointerEventsStyles,
        ]}
        style={{
          height: `${dndPreviewHeight}px`,
        }}
        data-testid={'column-drop-target'}
      >
        {closestEdge && <DropIndicator edge={closestEdge} />}
      </div>
      <div css={verticallyAlignedStyles}>{children}</div>
      {state.type === 'preview'
        ? ReactDOM.createPortal(dragPreview, state.container)
        : null}
    </TableHeading>
  );
};
