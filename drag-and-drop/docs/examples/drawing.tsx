/** @jsx jsx */
import { useCallback, useEffect, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';

import { monitorForElements } from '@atlaskit/drag-and-drop/adapter/element';
import { cancelUnhandled } from '@atlaskit/drag-and-drop/util/cancel-unhandled';
import { combine } from '@atlaskit/drag-and-drop/util/combine';
import { token } from '@atlaskit/tokens';

import LineOverlay, { LineOverlayHandle } from './pieces/drawing/line-overlay';
import Shape, { ShapeType } from './pieces/drawing/shape';

type Point = { x: number; y: number };

const layoutStyles = css({
  display: 'grid',
  padding: 32,
  position: 'relative',
  zIndex: 1,
  justifyContent: 'center',
  gap: 24,
});

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
  width: 'fit-content',
  padding: 32,
  columnGap: 256,
  rowGap: 32,
  gridAutoFlow: 'column',
  gridTemplateRows: 'repeat(3, 1fr)',
  background: token('elevation.surface.sunken', '#F7F8F9'),
  borderRadius: 10,
});

export default function DrawingExample() {
  const linesRef = useRef<LineOverlayHandle>(null);

  const [shapes, setShapes] = useState<
    { type: ShapeType; isConnected: boolean }[]
  >([
    { type: 'square', isConnected: false },
    { type: 'circle', isConnected: false },
    { type: 'triangle', isConnected: false },
  ]);

  const connectShape = useCallback((type: ShapeType) => {
    const [from, to] = document.body.querySelectorAll(`[data-shape="${type}"]`);

    setShapes(shapes =>
      Array.from(shapes, item => {
        if (item.type === type) {
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
        onDragStart() {
          // we want the drag to finish immediately on completion and not wait for any cancel animation
          cancelUnhandled.start();
        },
        onDrop({ source, location }) {
          cancelUnhandled.stop();
          linesRef.current?.hideActive();

          if (location.current.dropTargets.length === 0) {
            return;
          }

          const target = location.current.dropTargets[0];
          if (source.data.type === target.data.type) {
            connectShape(source.data.type as ShapeType);
          }
        },
      }),
    );
  }, [connectShape]);

  return (
    <div css={layoutStyles}>
      <p>Draw lines to connect the matching shapes.</p>
      <div css={gridStyles}>
        <LineOverlay ref={linesRef} />
        {items.map((shape, index) => (
          <Shape
            key={index}
            type={shape.type}
            canDrag={!shape.isConnected}
            onDrag={onDrag}
          />
        ))}
      </div>
    </div>
  );
}
