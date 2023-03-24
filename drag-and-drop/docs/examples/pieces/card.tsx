/** @jsx jsx */
import { memo, useEffect, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';

import Avatar from '@atlaskit/avatar';
import Button from '@atlaskit/button';
import {
  attachClosestEdge,
  Edge,
  extractClosestEdge,
} from '@atlaskit/drag-and-drop-hitbox/addon/closest-edge';
import { DropIndicator } from '@atlaskit/drag-and-drop-indicator/box';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/drag-and-drop/adapter/element';
import { dropTargetForFiles } from '@atlaskit/drag-and-drop/adapter/file';
import { combine } from '@atlaskit/drag-and-drop/util/combine';
import { scrollJustEnoughIntoView } from '@atlaskit/drag-and-drop/util/scroll-just-enough-into-view';
import Heading from '@atlaskit/heading';
import MoreIcon from '@atlaskit/icon/glyph/more';
// eslint-disable-next-line no-restricted-imports
import { Box, Inline, Stack } from '@atlaskit/primitives';

import { Item } from '../data/people';
import { cardGap } from '../util/constants';

type DraggableState = 'idle' | 'generate-preview' | 'dragging';

const noMarginStyles = css({ margin: 0 });
const noPointerEventsStyles = css({ pointerEvents: 'none' });

export const Card = memo(function Card({ item }: { item: Item }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { avatarUrl, itemId, name, role } = item;
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
  const [state, setState] = useState<DraggableState>('idle');

  useEffect(() => {
    invariant(ref.current);
    console.log('recreating draggable');
    return combine(
      draggable({
        element: ref.current,
        getInitialData: () => ({ type: 'card', itemId: itemId }),
        onGenerateDragPreview: ({ source }) => {
          scrollJustEnoughIntoView({ element: source.element });
          setState('generate-preview');
        },

        onDragStart: () => setState('dragging'),
        onDrop: () => setState('idle'),
      }),
      dropTargetForFiles({
        element: ref.current,
      }),
      dropTargetForElements({
        element: ref.current,
        canDrop: args => args.source.data.type === 'card',
        getIsSticky: () => true,
        getData: ({ input, element }) => {
          const data = { type: 'card', itemId: itemId };

          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ['top', 'bottom'],
          });
        },
        onDragEnter: args => {
          if (args.source.data.itemId !== itemId) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDrag: args => {
          if (args.source.data.itemId !== itemId) {
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
  }, [itemId]);

  return (
    <Box
      ref={ref}
      testId={`item-${itemId}`}
      width="100%"
      backgroundColor="elevation.surface"
      borderRadius="radius.200"
      padding="space.100"
      shadow="raised"
      position="relative"
      // @ts-expect-error
      UNSAFE_style={state === 'dragging' ? { opacity: 0.6 } : undefined}
    >
      <Inline space="100" alignBlock="center" grow="fill">
        <Avatar size="large" src={avatarUrl}>
          {props => (
            <div
              {...props}
              ref={props.ref as React.Ref<HTMLDivElement>}
              css={noPointerEventsStyles}
            />
          )}
        </Avatar>
        <Stack space="050" grow="fill">
          <Heading level="h400" as="span">
            {name}
          </Heading>
          <small css={noMarginStyles}>{role}</small>
        </Stack>
        <Button iconBefore={<MoreIcon label="..." />} appearance="subtle" />
      </Inline>
      {closestEdge && <DropIndicator edge={closestEdge} gap={`${cardGap}px`} />}
    </Box>
  );
});
