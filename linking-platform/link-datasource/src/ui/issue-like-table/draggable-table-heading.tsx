/** @jsx jsx */
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl-next';
import invariant from 'tiny-invariant';

import Button from '@atlaskit/button/new';
import DropdownMenu, {
  CustomTriggerProps,
  DropdownItem,
  DropdownMenuProps,
} from '@atlaskit/dropdown-menu';
import ChevronDown from '@atlaskit/icon/glyph/chevron-down';
import ChevronUp from '@atlaskit/icon/glyph/chevron-up';
import {
  attachClosestEdge,
  Edge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box-without-terminal';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { preventUnhandled } from '@atlaskit/pragmatic-drag-and-drop/prevent-unhandled';
import { token } from '@atlaskit/tokens';

import { GlyphPlaceholder, UnwrapTextIcon, WrapTextIcon } from './custom-icons';
import { issueLikeTableMessages } from './messages';
import { TableHeading } from './styled';
import { COLUMN_MIN_WIDTH, getWidthCss } from './utils';

type DraggableState =
  | { type: 'idle' }
  | { type: 'preview'; container: HTMLElement }
  | { type: 'dragging' }
  | {
      type: 'resizing';
      initialWidth: number;
    };

const DropdownParent = styled.div({
  display: 'flex',
  alignItems: 'center',
  whiteSpace: 'nowrap',
  '& button': {
    textAlign:
      'left' /* By default button center in the middle without props to control it */,
    height:
      'auto' /* By default button is not happy with tall (up to lines in our case) content */,
    paddingLeft: token(
      'space.0',
      '0px',
    ) /* By default button's padding left and right is 8 + 4. We control that 8, so left with 4 that we need.  */,
    paddingRight: token('space.0', '0px'),
  },
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

interface DraggableTableHeadingProps {
  children: ReactNode;
  id: string;
  index: number;
  tableId: Symbol;
  dndPreviewHeight: number;
  dragPreview: React.ReactNode;
  width: number;
  onWidthChange?: (width: number) => void;
  isWrapped?: boolean;
  onIsWrappedChange?: (shouldWrap: boolean) => void;
}

export const DraggableTableHeading = ({
  children,
  id,
  index,
  tableId,
  dndPreviewHeight,
  dragPreview,
  width,
  onWidthChange,
  isWrapped,
  onIsWrappedChange,
}: DraggableTableHeadingProps) => {
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
            getOffset: pointerOutsideOfPreview({
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
    if (!onWidthChange) {
      return;
    }
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
        preventUnhandled.start();

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

        // We update width css directly live
        mainHeaderCell.style.setProperty('width', `${proposedWidth}px`);
      },
      onDrop() {
        preventUnhandled.stop();
        setState(idleState);
        if (onWidthChange) {
          let cssWidth = +mainHeaderCell.style
            .getPropertyValue('width')
            .slice(0, -2);

          if (cssWidth < COLUMN_MIN_WIDTH) {
            cssWidth = COLUMN_MIN_WIDTH;
          }
          onWidthChange(cssWidth);
        }
      },
    });
  }, [id, index, onWidthChange, state, tableId, width]);

  const [buttonHovered, setButtonHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isWideEnoughToHaveChevron = width > 76;

  const shouldShowTriggerIcon =
    (buttonHovered || isDropdownOpen) && isWideEnoughToHaveChevron;
  const triggerIcon = useMemo(
    () =>
      shouldShowTriggerIcon
        ? isDropdownOpen
          ? ChevronUp
          : ChevronDown
        : isWideEnoughToHaveChevron
        ? GlyphPlaceholder
        : undefined,
    [shouldShowTriggerIcon, isDropdownOpen, isWideEnoughToHaveChevron],
  );

  const getTriggerButton = useCallback(
    ({ triggerRef, ...props }: CustomTriggerProps<HTMLButtonElement>) => {
      return (
        <Button
          {...props}
          testId={`${id}-column-dropdown`}
          shouldFitContainer
          iconAfter={triggerIcon}
          ref={triggerRef}
          appearance="subtle"
          spacing="compact"
          onMouseEnter={() => setButtonHovered(true)}
          onMouseLeave={() => setButtonHovered(false)}
        >
          {children}
        </Button>
      );
    },
    [children, id, triggerIcon],
  );

  const onDropdownOpenChange: DropdownMenuProps['onOpenChange'] = useCallback(
    ({ isOpen }) => setIsDropdownOpen(isOpen),
    [],
  );

  const toggleWrap = useCallback(
    () => onIsWrappedChange && onIsWrappedChange(!(isWrapped || false)),
    [isWrapped, onIsWrappedChange],
  );

  return (
    <TableHeading
      ref={mainHeaderCellRef}
      data-testid={`${id}-column-heading`}
      style={{
        cursor: 'grab',
        ...getWidthCss({ shouldUseWidth: !!onWidthChange, width }),
      }}
    >
      {onWidthChange ? (
        <div
          ref={columnResizeHandleRef}
          css={[resizerStyles, state.type === 'resizing' && resizingStyles]}
          style={{
            height: `${dndPreviewHeight}px`,
          }}
          data-testid="column-resize-handle"
        ></div>
      ) : null}
      {onIsWrappedChange ? (
        <DropdownParent>
          <DropdownMenu<HTMLButtonElement>
            trigger={getTriggerButton}
            onOpenChange={onDropdownOpenChange}
            placement={'bottom'}
          >
            <DropdownItem
              elemBefore={isWrapped ? <UnwrapTextIcon /> : <WrapTextIcon />}
              testId={`${id}-column-dropdown-item-toggle-wrapping`}
              onClick={toggleWrap}
            >
              {isWrapped ? (
                <FormattedMessage {...issueLikeTableMessages.unwrapText} />
              ) : (
                <FormattedMessage {...issueLikeTableMessages.wrapText} />
              )}
            </DropdownItem>
          </DropdownMenu>
        </DropdownParent>
      ) : (
        children
      )}
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
      {state.type === 'preview'
        ? ReactDOM.createPortal(dragPreview, state.container)
        : null}
    </TableHeading>
  );
};
