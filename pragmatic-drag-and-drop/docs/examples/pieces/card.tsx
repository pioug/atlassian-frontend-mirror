/** @jsx jsx */
import { forwardRef, Fragment, memo, useEffect, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';
import ReactDOM from 'react-dom';
import invariant from 'tiny-invariant';

import Avatar from '@atlaskit/avatar';
import Button from '@atlaskit/button';
import Heading from '@atlaskit/heading';
import MoreIcon from '@atlaskit/icon/glyph/more';
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
import { dropTargetForFiles } from '@atlaskit/pragmatic-drag-and-drop/adapter/file';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/util/combine';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/util/set-custom-native-drag-preview';
import { Box, Stack, xcss } from '@atlaskit/primitives';

import { Person } from '../data/people';
import { cardGap } from '../util/constants';

type DraggableState =
  | { type: 'idle' }
  | { type: 'preview'; container: HTMLElement; rect: DOMRect }
  | { type: 'dragging' };

const idleState: DraggableState = { type: 'idle' };
const draggingState: DraggableState = { type: 'dragging' };

const noMarginStyles = css({ margin: 0 });
const noPointerEventsStyles = css({ pointerEvents: 'none' });
const containerStyles = xcss({
  width: '100%',
  borderRadius: 'border.radius.200',
  boxShadow: 'elevation.shadow.raised',
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  gap: 'space.100',
  alignItems: 'center',
});
const draggingStyles = xcss({
  opacity: 0.6,
});

type CardPrimitiveProps = {
  closestEdge: Edge | null;
  item: Person;
  state: DraggableState;
};

const CardPrimitive = forwardRef<HTMLDivElement, CardPrimitiveProps>(
  function CardPrimitive({ closestEdge, item, state }, ref) {
    const { avatarUrl, name, role, userId } = item;

    return (
      <Box
        ref={ref}
        testId={`item-${userId}`}
        backgroundColor="elevation.surface"
        padding="space.100"
        xcss={[containerStyles, state === draggingState && draggingStyles]}
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
        <Button iconBefore={<MoreIcon label="..." />} appearance="subtle" />
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
  const [state, setState] = useState<DraggableState>(idleState);

  useEffect(() => {
    invariant(ref.current);
    console.log('recreating draggable');
    return combine(
      draggable({
        element: ref.current,
        getInitialData: () => ({ type: 'card', itemId: userId }),
        onGenerateDragPreview: ({ location, source, nativeSetDragImage }) => {
          const rect = source.element.getBoundingClientRect();

          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset() {
              /**
               * This offset ensures that the preview is positioned relative to
               * the cursor based on where you drag from.
               *
               * This creates the effect of it being picked up.
               */
              return {
                x: location.current.input.clientX - rect.x,
                y: location.current.input.clientY - rect.y,
              };
            },
            render({ container }) {
              setState({ type: 'preview', container, rect });
              return () => setState(draggingState);
            },
          });
        },

        onDragStart: () => setState(draggingState),
        onDrop: () => setState(idleState),
      }),
      dropTargetForFiles({
        element: ref.current,
      }),
      dropTargetForElements({
        element: ref.current,
        canDrop: args => args.source.data.type === 'card',
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
  }, [item, userId]);

  return (
    <Fragment>
      <CardPrimitive
        ref={ref}
        item={item}
        state={state}
        closestEdge={closestEdge}
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
