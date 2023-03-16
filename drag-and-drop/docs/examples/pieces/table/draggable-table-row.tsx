/** @jsx jsx */
import { ReactNode, useEffect, useRef, useState } from 'react';

import { css, jsx, SerializedStyles } from '@emotion/react';
import invariant from 'tiny-invariant';

import {
  attachClosestEdge,
  Edge,
  extractClosestEdge,
} from '@atlaskit/drag-and-drop-hitbox/addon/closest-edge';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/drag-and-drop/adapter/element';
import { combine } from '@atlaskit/drag-and-drop/util/combine';
import { token } from '@atlaskit/tokens';

const tableRowStatusStyles: Partial<Record<DraggableStatus, SerializedStyles>> =
  {
    idle: css({
      ':hover': {
        background: token(
          'color.background.neutral.subtle.hovered',
          '#091E420F',
        ),
      },
    }),
    preview: css({
      background: token('elevation.surface', '#FFF'),
    }),
    dragging: css({
      background: token('color.background.disabled', '#091E420F'),
      color: token('color.text.disabled', '#091E424F'),
    }),
  };

/**
 * Because we cannot render arbitrary elements inside of a `<tr />` element,
 * we cannot use the `<DropIndicator />` component for row drags.
 *
 * Instead we use bespoke styles.
 */
const tableRowDropIndicatorStyles: Partial<Record<Edge, SerializedStyles>> = {
  top: css({
    position: 'relative',
    '::after': {
      content: "''",
      position: 'absolute',
      top: -1,
      left: 0,
      height: 2,
      width: '100%',
      background: token('color.border.brand', '#0052CC'),
    },
  }),
  bottom: css({
    position: 'relative',
    '::after': {
      content: "''",
      position: 'absolute',
      bottom: -1,
      left: 0,
      height: 2,
      width: '100%',
      background: token('color.border.brand', '#0052CC'),
    },
  }),
};

type DraggableStatus = 'idle' | 'preview' | 'dragging';

export const DraggableTableRow = ({
  children,
  id,
  index,
}: {
  children: ReactNode;
  id: unknown;
  index: number;
}) => {
  const ref = useRef<HTMLTableRowElement>(null);

  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  const [status, setStatus] = useState<DraggableStatus>('idle');

  useEffect(() => {
    const row = ref.current;
    invariant(row);
    return combine(
      draggable({
        element: row,
        getInitialData() {
          return { type: 'table-row', id, index };
        },
        onGenerateDragPreview() {
          setStatus('preview');
        },
        onDragStart() {
          setStatus('dragging');
        },
        onDrop() {
          setStatus('idle');
        },
      }),
      dropTargetForElements({
        element: row,
        getData({ input, element }) {
          const data = { id, index };
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ['top', 'bottom'],
          });
        },
        canDrop(args) {
          return args.source.data.type === 'table-row';
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
      }),
    );
  }, [id, index]);

  return (
    <tr
      ref={ref}
      css={[
        tableRowStatusStyles[status],
        closestEdge && tableRowDropIndicatorStyles[closestEdge],
      ]}
    >
      {children}
    </tr>
  );
};
