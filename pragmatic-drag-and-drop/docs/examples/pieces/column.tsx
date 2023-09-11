/** @jsx jsx */
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { css, jsx, SerializedStyles } from '@emotion/react';
import { createPortal } from 'react-dom';
import invariant from 'tiny-invariant';

import Button from '@atlaskit/button';
import DropdownMenu, {
  CustomTriggerProps,
  DropdownItem,
  DropdownItemGroup,
} from '@atlaskit/dropdown-menu';
import Heading from '@atlaskit/heading';
import MoreIcon from '@atlaskit/icon/glyph/more';
import { easeInOut } from '@atlaskit/motion/curves';
import { mediumDurationMs } from '@atlaskit/motion/durations';
import {
  attachClosestEdge,
  Edge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/addon/closest-edge';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-indicator/box';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/adapter/element';
import { centerUnderPointer } from '@atlaskit/pragmatic-drag-and-drop/util/center-under-pointer';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/util/combine';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/util/set-custom-native-drag-preview';
import { token } from '@atlaskit/tokens';

import { ColumnType } from '../data/people';
import { cardGap, columnGap } from '../util/constants';

import { useBoardContext } from './board-context';
import { Card } from './card';
import {
  ColumnContext,
  ColumnContextProps,
  useColumnContext,
} from './column-context';

const columnStyles = css({
  display: 'flex',
  width: 250,
  flexDirection: 'column',
  background: token('elevation.surface.sunken', '#F7F8F9'),
  borderRadius: 'calc(var(--grid) * 2)',
  transition: `background ${mediumDurationMs}ms ${easeInOut}`,
  position: 'relative',
  cursor: 'grab',
  /**
   * TODO: figure out hover color.
   * There is no `elevation.surface.sunken.hovered` token,
   * so leaving this for now.
   */
});

const scrollContainerStyles = css({
  height: '100%',
  overflowY: 'auto',
});

const cardListStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  minHeight: '100%',
  padding: 'var(--grid)',
  gap: cardGap,
  flexDirection: 'column',
});

const columnHeaderStyles = css({
  display: 'flex',
  padding: 'var(--grid) calc(var(--grid) * 2) 0',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'row',
  color: token('color.text.subtlest', '#626F86'),
  userSelect: 'none',
});

type IdleState = { type: 'idle' };

type DropTargetState =
  | IdleState
  | { type: 'is-card-over' }
  | { type: 'is-column-over'; closestEdge: Edge | null };

type DraggableState =
  | IdleState
  | { type: 'generate-safari-column-preview'; container: HTMLElement }
  | { type: 'generate-column-preview' }
  | { type: 'is-dragging' };

// preventing re-renders
const idle: IdleState = { type: 'idle' };
const isCardOver: DropTargetState = { type: 'is-card-over' };
const isDraggingState: DraggableState = { type: 'is-dragging' };

const stateStyles: Partial<Record<DropTargetState['type'], SerializedStyles>> =
  {
    'is-card-over': css({
      background: token('color.background.selected.hovered', '#CCE0FF'),
    }),
  };

const draggableStateStyles: Partial<
  Record<DraggableState['type'], SerializedStyles>
> = {
  /**
   * **Browser bug workaround**
   *
   * _Problem_
   * When generating a drag preview for an element
   * that has an inner scroll container, the preview can include content
   * vertically before or after the element
   *
   * _Fix_
   * We make the column a new stacking context when the preview is being generated.
   * We are not making a new stacking context at all times, as this _can_ mess up
   * other layering components inside of your card
   *
   * _Fix: Safari_
   * We have not found a great workaround yet. So for now we are just rendering
   * a custom drag preview
   */
  'generate-column-preview': css({
    isolation: 'isolate',
  }),
  'generate-safari-column-preview': undefined,
  'is-dragging': css({
    opacity: 0.4,
  }),
};

export const Column = memo(function Column({ column }: { column: ColumnType }) {
  const columnId = column.columnId;
  const columnRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardListRef = useRef<HTMLDivElement | null>(null);
  const [dropTargetState, setDropTargetState] = useState<DropTargetState>(idle);
  const [draggableState, setDraggableState] = useState<DraggableState>(idle);

  const { instanceId } = useBoardContext();

  useEffect(() => {
    invariant(columnRef.current);
    invariant(headerRef.current);
    invariant(cardListRef.current);
    return combine(
      draggable({
        element: columnRef.current,
        dragHandle: headerRef.current,
        getInitialData: () => ({ columnId, type: 'column', instanceId }),
        onGenerateDragPreview: ({ nativeSetDragImage }) => {
          const isSafari: boolean =
            navigator.userAgent.includes('AppleWebKit') &&
            !navigator.userAgent.includes('Chrome');

          if (!isSafari) {
            setDraggableState({ type: 'generate-column-preview' });
            return;
          }
          setCustomNativeDragPreview({
            getOffset: centerUnderPointer,
            render: ({ container }) => {
              setDraggableState({
                type: 'generate-safari-column-preview',
                container,
              });
              return () => setDraggableState(idle);
            },
            nativeSetDragImage,
          });
        },
        onDragStart: () => {
          setDraggableState(isDraggingState);
        },
        onDrop() {
          setDraggableState(idle);
        },
      }),
      dropTargetForElements({
        element: cardListRef.current,
        getData: () => ({ columnId }),
        canDrop: ({ source }) => {
          return (
            source.data.instanceId === instanceId && source.data.type === 'card'
          );
        },
        getIsSticky: () => true,
        onDragEnter: () => setDropTargetState(isCardOver),
        onDragLeave: () => setDropTargetState(idle),
        onDragStart: () => setDropTargetState(isCardOver),
        onDrop: () => setDropTargetState(idle),
      }),
      dropTargetForElements({
        element: columnRef.current,
        canDrop: ({ source }) => {
          return (
            source.data.instanceId === instanceId &&
            source.data.type === 'column'
          );
        },
        getIsSticky: () => true,
        getData: ({ input, element }) => {
          const data = {
            columnId,
          };
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ['left', 'right'],
          });
        },
        onDragEnter: args => {
          setDropTargetState({
            type: 'is-column-over',
            closestEdge: extractClosestEdge(args.self.data),
          });
        },
        onDrag: args => {
          // skip react re-render if edge is not changing
          setDropTargetState(current => {
            const closestEdge: Edge | null = extractClosestEdge(args.self.data);
            if (
              current.type === 'is-column-over' &&
              current.closestEdge === closestEdge
            ) {
              return current;
            }
            return {
              type: 'is-column-over',
              closestEdge,
            };
          });
        },
        onDragLeave: () => {
          setDropTargetState(idle);
        },
        onDrop: () => {
          setDropTargetState(idle);
        },
      }),
    );
  }, [columnId, instanceId]);

  const stableItems = useRef(column.items);
  useEffect(() => {
    stableItems.current = column.items;
  }, [column.items]);

  const getCardIndex = useCallback((userId: string) => {
    return stableItems.current.findIndex(item => item.userId === userId);
  }, []);

  const getNumCards = useCallback(() => {
    return stableItems.current.length;
  }, []);

  const contextValue: ColumnContextProps = useMemo(() => {
    return { columnId, getCardIndex, getNumCards };
  }, [columnId, getCardIndex, getNumCards]);

  return (
    <ColumnContext.Provider value={contextValue}>
      <div
        css={[
          columnStyles,
          stateStyles[dropTargetState.type],
          draggableStateStyles[draggableState.type],
        ]}
        ref={columnRef}
      >
        <div
          css={columnHeaderStyles}
          ref={headerRef}
          data-testid={`column-${columnId}--header`}
        >
          <Heading level="h300" as="span">
            {column.title}
          </Heading>
          <ActionMenu />
        </div>
        <div css={scrollContainerStyles}>
          <div css={cardListStyles} ref={cardListRef}>
            {column.items.map(item => (
              <Card item={item} key={item.userId} />
            ))}
          </div>
        </div>
        {dropTargetState.type === 'is-column-over' &&
          dropTargetState.closestEdge && (
            <DropIndicator
              edge={dropTargetState.closestEdge}
              gap={`${columnGap}px`}
            />
          )}
      </div>
      {draggableState.type === 'generate-safari-column-preview'
        ? createPortal(
            <SafariColumnPreview column={column} />,
            draggableState.container,
          )
        : null}
    </ColumnContext.Provider>
  );
});

const previewStyles = css({
  '--grid': '8px',
  width: 250,
  background: token('elevation.surface.sunken', '#F7F8F9'),
  borderRadius: 'calc(var(--grid) * 2)',
  padding: 'calc(var(--grid) * 2)',
});

function SafariColumnPreview({ column }: { column: ColumnType }) {
  return (
    <div css={[columnHeaderStyles, previewStyles]}>
      <Heading level="h300" as="span">
        {column.title}
      </Heading>
    </div>
  );
}

function ActionMenu() {
  return (
    <DropdownMenu trigger={DropdownMenuTrigger}>
      <ActionMenuItems />
    </DropdownMenu>
  );
}

function ActionMenuItems() {
  const { columnId } = useColumnContext();
  const { getColumns, reorderColumn } = useBoardContext();

  const columns = getColumns();
  const startIndex = columns.findIndex(column => column.columnId === columnId);

  const moveLeft = useCallback(() => {
    reorderColumn({
      startIndex,
      finishIndex: startIndex - 1,
    });
  }, [reorderColumn, startIndex]);

  const moveRight = useCallback(() => {
    reorderColumn({
      startIndex,
      finishIndex: startIndex + 1,
    });
  }, [reorderColumn, startIndex]);

  const isMoveLeftDisabled = startIndex === 0;
  const isMoveRightDisabled = startIndex === columns.length - 1;

  return (
    <DropdownItemGroup>
      <DropdownItem onClick={moveLeft} isDisabled={isMoveLeftDisabled}>
        Move left
      </DropdownItem>
      <DropdownItem onClick={moveRight} isDisabled={isMoveRightDisabled}>
        Move right
      </DropdownItem>
    </DropdownItemGroup>
  );
}

function DropdownMenuTrigger({
  triggerRef,
  ...triggerProps
}: CustomTriggerProps) {
  return (
    <Button
      ref={triggerRef}
      {...triggerProps}
      appearance="subtle"
      iconBefore={<MoreIcon label="Actions" />}
    />
  );
}
