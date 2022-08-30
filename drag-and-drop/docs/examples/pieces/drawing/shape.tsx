/** @jsx jsx */
import { ReactNode, useEffect, useRef } from 'react';

import { css, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';

import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/drag-and-drop/adapter/element';
import { combine } from '@atlaskit/drag-and-drop/util/combine';
import { token } from '@atlaskit/tokens';

const shapes = ['square', 'circle', 'triangle'] as const;

export type ShapeType = typeof shapes[number];

const shape = {
  size: 128,
  strokeWidth: 8,
};

const shapeStyles = css({
  display: 'flex',
  width: shape.size,
  height: shape.size,
  position: 'relative',
  strokeWidth: shape.strokeWidth,
  ':nth-of-type(1)': {
    fill: token('color.background.accent.red.bolder', 'red'),
    stroke: token('color.border.accent.red', 'black'),
  },
  ':nth-of-type(2)': {
    fill: token('color.background.accent.orange.bolder', 'orange'),
    stroke: token('color.border.accent.orange', 'black'),
  },
  ':nth-of-type(3)': {
    fill: token('color.background.accent.yellow.bolder', 'yellow'),
    stroke: token('color.border.accent.yellow', 'black'),
  },
  ':nth-of-type(4)': {
    fill: token('color.background.accent.green.bolder', 'green'),
    stroke: token('color.border.accent.green', 'black'),
  },
  ':nth-of-type(5)': {
    fill: token('color.background.accent.blue.bolder', 'blue'),
    stroke: token('color.border.accent.blue', 'black'),
  },
  ':nth-of-type(6)': {
    fill: token('color.background.accent.purple.bolder', 'purple'),
    stroke: token('color.border.accent.purple', 'black'),
  },
});

const shapeSVG: Record<ShapeType, ReactNode> = {
  square: (
    <rect
      x={shape.strokeWidth / 2}
      y={shape.strokeWidth / 2}
      width={shape.size - shape.strokeWidth}
      height={shape.size - shape.strokeWidth}
    />
  ),
  circle: (
    <circle
      cx={shape.size / 2}
      cy={shape.size / 2}
      r={(shape.size - shape.strokeWidth) / 2}
    />
  ),
  triangle: (
    <polygon
      points={[
        [shape.strokeWidth, shape.size - shape.strokeWidth],
        [shape.size / 2, shape.strokeWidth],
        [shape.size - shape.strokeWidth, shape.size - shape.strokeWidth],
      ].join(' ')}
    />
  ),
};

const Shape = ({
  type,
  canDrag,
  onDrag: onDragProp,
}: {
  type: ShapeType;
  canDrag: boolean;
  onDrag?: (args: { from: Element; to: { x: number; y: number } }) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    invariant(ref.current);
    return combine(
      draggable({
        element: ref.current,
        canDrag() {
          return canDrag;
        },
        getInitialData() {
          return { type };
        },
        onDrag({ location, source }) {
          const currentPosition = {
            x: location.current.input.clientX,
            y: location.current.input.clientY,
          };
          onDragProp?.({
            from: source.element,
            to: currentPosition,
          });
        },
        onGenerateDragPreview() {
          if (ref.current) {
            ref.current.style.opacity = '0';
          }
        },
        onDragStart() {
          if (ref.current) {
            ref.current.style.opacity = '1';
          }
        },
      }),
      dropTargetForElements({
        element: ref.current,
        getData() {
          return { type };
        },
        canDrop({ source }) {
          const isSameType = source.data.type === type;
          const isDifferentElement = source.element !== ref.current;
          return isSameType && isDifferentElement;
        },
      }),
    );
  }, [canDrag, onDragProp, type]);

  return (
    <div css={shapeStyles} ref={ref} data-shape={type}>
      <svg>{shapeSVG[type]}</svg>
    </div>
  );
};

export default Shape;
