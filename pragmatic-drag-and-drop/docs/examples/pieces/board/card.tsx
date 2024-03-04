/** @jsx jsx */
import {
  forwardRef,
  Fragment,
  memo,
  Ref,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { css, jsx } from '@emotion/react';
import ReactDOM from 'react-dom';
import invariant from 'tiny-invariant';

import Avatar from '@atlaskit/avatar';
import { IconButton } from '@atlaskit/button/new';
import DropdownMenu, {
  DropdownItem,
  DropdownItemGroup,
} from '@atlaskit/dropdown-menu';
// eslint-disable-next-line @atlaskit/design-system/no-banned-imports
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import Heading from '@atlaskit/heading';
// This is the smaller MoreIcon soon to be more easily accessible with the
// ongoing icon project
import MoreIcon from '@atlaskit/icon/glyph/editor/more';
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
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { dropTargetForExternal } from '@atlaskit/pragmatic-drag-and-drop/external/adapter';
import { Box, Stack, xcss } from '@atlaskit/primitives';

import { ColumnType, Person } from '../../data/people';
import { cardGap } from '../../util/constants';

import { useBoardContext } from './board-context';
import { useColumnContext } from './column-context';

type State =
  | { type: 'idle' }
  | { type: 'preview'; container: HTMLElement; rect: DOMRect }
  | { type: 'dragging' };

const idleState: State = { type: 'idle' };
const draggingState: State = { type: 'dragging' };

const noMarginStyles = css({ margin: 0 });
const noPointerEventsStyles = css({ pointerEvents: 'none' });
const baseStyles = xcss({
  width: '100%',
  borderRadius: 'border.radius.200',
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  gap: 'space.100',
  alignItems: 'center',
  ':hover': {
    backgroundColor: 'elevation.surface.hovered',
  },
});

const stateStyles: {
  [Key in State['type']]: ReturnType<typeof xcss> | undefined;
} = {
  idle: xcss({
    cursor: 'grab',
    boxShadow: 'elevation.shadow.raised',
  }),
  dragging: xcss({
    opacity: 0.4,
    boxShadow: 'elevation.shadow.raised',
  }),
  // no shadow for preview - the platform will add it's own drop shadow
  preview: undefined,
};

const buttonColumnStyles = xcss({
  alignSelf: 'start',
});

type CardPrimitiveProps = {
  closestEdge: Edge | null;
  item: Person;
  state: State;
  actionMenuTriggerRef?: Ref<HTMLButtonElement>;
};

function MoveToOtherColumnItem({
  targetColumn,
  startIndex,
}: {
  targetColumn: ColumnType;
  startIndex: number;
}) {
  const { moveCard } = useBoardContext();
  const { columnId } = useColumnContext();

  const onClick = useCallback(() => {
    moveCard({
      startColumnId: columnId,
      finishColumnId: targetColumn.columnId,
      itemIndexInStartColumn: startIndex,
    });
  }, [columnId, moveCard, startIndex, targetColumn.columnId]);

  return <DropdownItem onClick={onClick}>{targetColumn.title}</DropdownItem>;
}

function LazyDropdownItems({ userId }: { userId: string }) {
  const { getColumns, reorderCard } = useBoardContext();
  const { columnId, getCardIndex, getNumCards } = useColumnContext();

  const numCards = getNumCards();
  const startIndex = getCardIndex(userId);

  const moveUp = useCallback(() => {
    reorderCard({ columnId, startIndex, finishIndex: startIndex - 1 });
  }, [columnId, reorderCard, startIndex]);

  const moveDown = useCallback(() => {
    reorderCard({ columnId, startIndex, finishIndex: startIndex + 1 });
  }, [columnId, reorderCard, startIndex]);

  const isMoveUpDisabled = startIndex === 0;
  const isMoveDownDisabled = startIndex === numCards - 1;

  const moveColumnOptions = getColumns().filter(
    column => column.columnId !== columnId,
  );

  return (
    <Fragment>
      <DropdownItemGroup title="Reorder">
        <DropdownItem onClick={moveUp} isDisabled={isMoveUpDisabled}>
          Move up
        </DropdownItem>
        <DropdownItem onClick={moveDown} isDisabled={isMoveDownDisabled}>
          Move down
        </DropdownItem>
      </DropdownItemGroup>
      <DropdownItemGroup title="Move to">
        {moveColumnOptions.map(column => (
          <MoveToOtherColumnItem
            key={column.columnId}
            targetColumn={column}
            startIndex={startIndex}
          />
        ))}
      </DropdownItemGroup>
    </Fragment>
  );
}

const CardPrimitive = forwardRef<HTMLDivElement, CardPrimitiveProps>(
  function CardPrimitive(
    { closestEdge, item, state, actionMenuTriggerRef },
    ref,
  ) {
    const { avatarUrl, name, role, userId } = item;

    return (
      <Box
        ref={ref}
        testId={`item-${userId}`}
        backgroundColor="elevation.surface"
        padding="space.100"
        xcss={[baseStyles, stateStyles[state.type]]}
      >
        <Avatar size="large" src={avatarUrl}>
          {props => (
            <div
              {...props}
              ref={props.ref as React.Ref<HTMLDivElement>}
              css={noPointerEventsStyles}
            />
          )}
        </Avatar>
        <Stack space="space.050" grow="fill">
          <Heading level="h400" as="span">
            {name}
          </Heading>
          <small css={noMarginStyles}>{role}</small>
        </Stack>
        <Box xcss={buttonColumnStyles}>
          <DropdownMenu
            trigger={({ triggerRef, ...triggerProps }) => (
              <IconButton
                ref={
                  actionMenuTriggerRef
                    ? mergeRefs([triggerRef, actionMenuTriggerRef])
                    : // Workaround for IconButton typing issue
                      mergeRefs([triggerRef])
                }
                icon={MoreIcon}
                label={`Move ${name}`}
                appearance="default"
                spacing="compact"
                {...triggerProps}
              />
            )}
          >
            <LazyDropdownItems userId={userId} />
          </DropdownMenu>
        </Box>

        {closestEdge && (
          <DropIndicator edge={closestEdge} gap={`${cardGap}px`} />
        )}
      </Box>
    );
  },
);

export const Card = memo(function Card({ item }: { item: Person }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { userId } = item;
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
  const [state, setState] = useState<State>(idleState);

  const actionMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const { instanceId, registerCard } = useBoardContext();
  useEffect(() => {
    invariant(actionMenuTriggerRef.current);
    invariant(ref.current);
    return registerCard({
      cardId: userId,
      entry: {
        element: ref.current,
        actionMenuTrigger: actionMenuTriggerRef.current,
      },
    });
  }, [registerCard, userId]);

  useEffect(() => {
    const element = ref.current;
    invariant(element);
    console.log('recreating draggable');
    return combine(
      draggable({
        element: element,
        getInitialData: () => ({ type: 'card', itemId: userId, instanceId }),
        onGenerateDragPreview: ({ location, source, nativeSetDragImage }) => {
          const rect = source.element.getBoundingClientRect();

          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: preserveOffsetOnSource({
              element,
              input: location.current.input,
            }),
            render({ container }) {
              setState({ type: 'preview', container, rect });
              return () => setState(draggingState);
            },
          });
        },

        onDragStart: () => setState(draggingState),
        onDrop: () => setState(idleState),
      }),
      dropTargetForExternal({
        element: element,
      }),
      dropTargetForElements({
        element: element,
        canDrop: ({ source }) => {
          return (
            source.data.instanceId === instanceId && source.data.type === 'card'
          );
        },
        getIsSticky: () => true,
        getData: ({ input, element }) => {
          const data = { type: 'card', itemId: userId };

          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ['top', 'bottom'],
          });
        },
        onDragEnter: args => {
          if (args.source.data.itemId !== userId) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDrag: args => {
          if (args.source.data.itemId !== userId) {
            setClosestEdge(extractClosestEdge(args.self.data));
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
  }, [instanceId, item, userId]);

  return (
    <Fragment>
      <CardPrimitive
        ref={ref}
        item={item}
        state={state}
        closestEdge={closestEdge}
        actionMenuTriggerRef={actionMenuTriggerRef}
      />
      {state.type === 'preview' &&
        ReactDOM.createPortal(
          <div
            style={{
              /**
               * Ensuring the preview has the same dimensions as the original.
               *
               * Using `border-box` sizing here is not necessary in this
               * specific example, but it is safer to include generally.
               */
              boxSizing: 'border-box',
              width: state.rect.width,
              height: state.rect.height,
            }}
          >
            <CardPrimitive item={item} state={state} closestEdge={null} />
          </div>,
          state.container,
        )}
    </Fragment>
  );
});
