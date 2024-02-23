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
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import {
  attachClosestEdge,
  Edge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { centerUnderPointer } from '@atlaskit/pragmatic-drag-and-drop/element/center-under-pointer';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { token } from '@atlaskit/tokens';

import { ColumnType } from '../../data/people';
import { cardGap, columnGap } from '../../util/constants';

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

type State =
  | { type: 'idle' }
  | { type: 'is-card-over' }
  | { type: 'is-column-over'; closestEdge: Edge | null }
  | { type: 'is-dragging' }
  | { type: 'generate-safari-column-preview'; container: HTMLElement }
  | { type: 'generate-column-preview' };

// preventing re-renders with stable state objects
const idle: State = { type: 'idle' };
const isCardOver: State = { type: 'is-card-over' };
const isDraggingState: State = { type: 'is-dragging' };

const stateStyles: { [key in State['type']]: SerializedStyles | undefined } = {
  idle: undefined,
  'is-dragging': css({
    opacity: 0.4,
  }),
  'is-card-over': css({
    background: token('color.background.selected.hovered', '#CCE0FF'),
  }),
  'is-column-over': undefined,
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
};

export const Column = memo(function Column({ column }: { column: ColumnType }) {
  const columnId = column.columnId;
  const columnRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardListRef = useRef<HTMLDivElement | null>(null);
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<State>(idle);

  const { instanceId } = useBoardContext();

  useEffect(() => {
    invariant(columnRef.current);
    invariant(headerRef.current);
    invariant(cardListRef.current);
    invariant(scrollableRef.current);
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
            setState({ type: 'generate-column-preview' });
            return;
          }
          setCustomNativeDragPreview({
            getOffset: centerUnderPointer,
            render: ({ container }) => {
              setState({
                type: 'generate-safari-column-preview',
                container,
              });
              return () => setState(idle);
            },
            nativeSetDragImage,
          });
        },
        onDragStart: () => {
          setState(isDraggingState);
        },
        onDrop() {
          setState(idle);
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
        onDragEnter: () => setState(isCardOver),
        onDragLeave: () => setState(idle),
        onDragStart: () => setState(isCardOver),
        onDrop: () => setState(idle),
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
          setState({
            type: 'is-column-over',
            closestEdge: extractClosestEdge(args.self.data),
          });
        },
        onDrag: args => {
          // skip react re-render if edge is not changing
          setState(current => {
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
          setState(idle);
        },
        onDrop: () => {
          setState(idle);
        },
      }),
      autoScrollForElements({
        element: scrollableRef.current,
        canScroll: ({ source }) =>
          source.data.instanceId === instanceId && source.data.type === 'card',
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
        css={[columnStyles, stateStyles[state.type]]}
        ref={columnRef}
        data-testid={`column-${columnId}`}
      >
        <div
          css={columnHeaderStyles}
          ref={headerRef}
          data-testid={`column-header-${columnId}`}
        >
          <Heading level="h300" as="span">
            {column.title}
          </Heading>
          <ActionMenu />
        </div>
        <div css={scrollContainerStyles} ref={scrollableRef}>
          <div css={cardListStyles} ref={cardListRef}>
            {column.items.map(item => (
              <Card item={item} key={item.userId} />
            ))}
          </div>
        </div>
        {state.type === 'is-column-over' && state.closestEdge && (
          <DropIndicator edge={state.closestEdge} gap={`${columnGap}px`} />
        )}
      </div>
      {state.type === 'generate-safari-column-preview'
        ? createPortal(<SafariColumnPreview column={column} />, state.container)
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
