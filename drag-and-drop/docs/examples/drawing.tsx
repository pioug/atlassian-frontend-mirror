/** @jsx jsx */
import { useCallback, useEffect, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';

import { monitorForElements } from '@atlaskit/drag-and-drop/adapter/element';
import { cancelUnhandled } from '@atlaskit/drag-and-drop/addon/cancel-unhandled';
import { combine } from '@atlaskit/drag-and-drop/util/combine';

import LineOverlay, { LineOverlayHandle } from './pieces/drawing/line-overlay';
import Shape, { size as shapeSize, ShapeType } from './pieces/drawing/shape';

type Point = { x: number; y: number };

function getCenter(el: Element) {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  };
}

function reversed<T>(items: readonly T[]): T[] {
  return Array.from(items, (_, index) => items[items.length - (1 + index)]);
}

const gridStyles = css({
  display: 'grid',
  columnGap: `calc(100% - 2 * ${shapeSize}px)`,
  rowGap: 32,
  gridAutoFlow: 'column',
  gridTemplateRows: 'repeat(3, 1fr)',
});

export default function DrawingExample() {
  const linesRef = useRef<LineOverlayHandle>(null);

  const [shapes, setShapes] = useState<
    { shape: ShapeType; isConnected: boolean }[]
  >([
    { shape: 'square', isConnected: false },
    { shape: 'circle', isConnected: false },
    { shape: 'triangle', isConnected: false },
  ]);

  const connectShape = useCallback((shape: ShapeType) => {
    const [from, to] = document.body.querySelectorAll(
      `[data-shape="${shape}"]`,
    );

    setShapes(shapes =>
      Array.from(shapes, item => {
        if (item.shape === shape) {
          return { ...item, isConnected: true };
        }
        return item;
      }),
    );

    linesRef?.current?.drawFinished({
      from: getCenter(from),
      to: getCenter(to),
    });
  }, []);

  const onDrag = useCallback(({ from, to }: { from: Element; to: Point }) => {
    invariant(linesRef.current);
    linesRef.current.drawActive({
      from: getCenter(from),
      to,
    });
  }, []);

  const items = shapes.concat(reversed(shapes));

  useEffect(() => {
    return combine(
      monitorForElements({
        onDragStart({ source }) {
          if (source.data.type !== 'shape') {
            return;
          }

          // we want the drag to finish immediately on completion and not wait for any cancel animation
          cancelUnhandled.start();
        },
        onDrop({ source, location }) {
          if (source.data.type !== 'shape') {
            return;
          }

          cancelUnhandled.stop();
          linesRef.current?.hideActive();

          if (location.current.dropTargets.length === 0) {
            return;
          }

          const target = location.current.dropTargets[0];
          if (source.data.shape === target.data.shape) {
            connectShape(source.data.shape as ShapeType);
          }
        },
      }),
    );
  }, [connectShape]);

  return (
    <div css={gridStyles}>
      <LineOverlay ref={linesRef} />
      {items.map((shape, index) => (
        <Shape
          key={index}
          shape={shape.shape}
          canDrag={!shape.isConnected}
          onDrag={onDrag}
        />
      ))}
    </div>
  );
}
