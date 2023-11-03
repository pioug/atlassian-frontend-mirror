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
import { cancelUnhandled } from '@atlaskit/pragmatic-drag-and-drop/addon/cancel-unhandled';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/util/combine';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/util/disable-native-drag-preview';
import { offsetFromPointer } from '@atlaskit/pragmatic-drag-and-drop/util/offset-from-pointer';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/util/set-custom-native-drag-preview';
import { token } from '@atlaskit/tokens';

import { TableHeading } from './styled';

import { COLUMN_MIN_WIDTH } from './index';

type DraggableState =
  | { type: 'idle' }
  | { type: 'preview'; container: HTMLElement }
  | { type: 'dragging' }
  | {
      type: 'resizing';
      initialWidth: number;
    };

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

const resizerStyles = css({
  '--local-hitbox-width': token('space.300', '24px'),
  width: 'var(--local-hitbox-width)',
  cursor: 'col-resize',
  flexGrow: '0',
  position: 'absolute',
  zIndex: 1, // we want this to sit on top of adjacent column headers
  right: 'calc(-1 * calc(var(--local-hitbox-width) / 2))',
  top: 0,

  '::before': {
    opacity: 0,
    '--local-line-width': token('border.width', '2px'),
    content: '""',
    position: 'absolute',
    background: token('color.border.brand', '#0052CC'),
    width: 'var(--local-line-width)',
    inset: 0,
    left: `calc(50% - calc(var(--local-line-width) / 2))`,
    transition: 'opacity 0.2s ease',
  },

  ':hover::before': {
    opacity: 1,
  },
});

const resizingStyles = css({
  // turning off the resizing cursor as sometimes it can cause the cursor to flicker
  // while resizing. The browser controls the cursor while dragging, but the browser
  // can sometimes bug out.
  cursor: 'unset',
  '::before': {
    opacity: 1,
  },
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
  width,
  onWidthChange,
}: {
  children: ReactNode;
  id: string;
  index: number;
  tableId: Symbol;
  dndPreviewHeight: number;
  dragPreview: React.ReactNode;
  width: number;
  onWidthChange?: (width: number) => void;
}) => {
  const mainHeaderCellRef = useRef<HTMLTableCellElement>(null);
  const columnResizeHandleRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<DraggableState>(idleState);

  const [isDraggingAnyColumn, setIsDraggingAnyColumn] = useState(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  const dropTargetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cell = mainHeaderCellRef.current;

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

  // Handling column resizing
  useEffect(() => {
    const resizeHandle = columnResizeHandleRef.current;
    invariant(resizeHandle);
    const mainHeaderCell = mainHeaderCellRef.current;
    invariant(mainHeaderCell);

    return draggable({
      element: resizeHandle,
      getInitialData() {
        // metadata related to currently dragging item (can be read by drop events etc)
        return { type: 'column-resize', id, index, tableId };
      },

      // Is called when dragging started
      onGenerateDragPreview({ nativeSetDragImage }) {
        // We don't show any preview, since column separator (handle) is moving with the cursor
        disableNativeDragPreview({ nativeSetDragImage });
        // Block drag operations outside `@atlaskit/pragmatic-drag-and-drop`
        cancelUnhandled.start();

        setState({
          type: 'resizing',
          initialWidth: width,
        });
      },
      onDrag({ location }) {
        const relativeDistanceX =
          location.current.input.clientX - location.initial.input.clientX;

        invariant(state.type === 'resizing');
        const { initialWidth } = state;

        // Set the width of our header being resized
        let proposedWidth = initialWidth + relativeDistanceX;
        if (
          initialWidth >= COLUMN_MIN_WIDTH &&
          proposedWidth < COLUMN_MIN_WIDTH
        ) {
          proposedWidth = COLUMN_MIN_WIDTH;
        }

        // We update width css directly live
        mainHeaderCell.style.setProperty('width', `${proposedWidth}px`);
      },
      onDrop() {
        cancelUnhandled.stop();
        setState(idleState);
        if (onWidthChange) {
          // We use element's css value as a source of truth (compare to another Ref)
          const currentWidthPx = mainHeaderCell.style.getPropertyValue('width');
          onWidthChange(+currentWidthPx.slice(0, -2));
        }
      },
    });
  }, [id, index, onWidthChange, state, tableId, width]);

  return (
    <TableHeading
      ref={mainHeaderCellRef}
      css={[tableHeadingStatusStyles[state.type]]}
      data-testid={`${id}-column-heading`}
      style={{
        width,
        cursor: 'grab',
      }}
    >
      <div
        ref={columnResizeHandleRef}
        css={[resizerStyles, state.type === 'resizing' && resizingStyles]}
        style={{
          height: `${dndPreviewHeight}px`,
        }}
        data-testid="column-resize-handle"
      ></div>
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
