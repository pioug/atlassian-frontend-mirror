/** @jsx jsx */
import { ReactNode, useEffect, useRef, useState } from 'react';

import { css, jsx, SerializedStyles } from '@emotion/react';
import invariant from 'tiny-invariant';

import DragHandlerIcon from '@atlaskit/icon/glyph/drag-handler';
import {
  attachClosestEdge,
  Edge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/addon/closest-edge';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-indicator/box';
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/adapter/element';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/util/combine';
import { token } from '@atlaskit/tokens';

import { TableHeading } from './styled';

type DraggableStatus = 'idle' | 'preview' | 'dragging';

const tableHeadingStyles = css({
  cursor: 'grab',
});

const tableHeadingStatusStyles: Partial<
  Record<DraggableStatus, SerializedStyles>
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

const dragHandleStyles = css({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
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

export const DraggableTableHeading = ({
  children,
  id,
  index,
  tableId,
  dndPreviewHeight,
  onDragPreviewStart,
  onDragPreviewEnd,
}: {
  children: ReactNode;
  id: string;
  index: number;
  tableId: Symbol;
  dndPreviewHeight: number;
  onDragPreviewStart: () => void;
  onDragPreviewEnd: () => void;
}) => {
  const ref = useRef<HTMLTableCellElement>(null);
  const [status, setStatus] = useState<DraggableStatus>('idle');

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
        onGenerateDragPreview() {
          setStatus('preview');
          onDragPreviewStart();
        },
        onDragStart() {
          setStatus('dragging');
          onDragPreviewEnd();
        },
        onDrop() {
          setStatus('idle');
        },
      }),
    );
  }, [id, index, onDragPreviewEnd, onDragPreviewStart, tableId]);

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
      css={[tableHeadingStyles, tableHeadingStatusStyles[status]]}
      data-testid={`${id}-column-heading`}
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
      <div css={verticallyAlignedStyles}>
        <div css={dragHandleStyles}>
          <DragHandlerIcon label={`${id}-drag-icon`} size="medium" />
        </div>
        {children}
      </div>
    </TableHeading>
  );
};
