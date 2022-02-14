import React from 'react';

type Rectangle = Omit<DOMRectReadOnly, 'toJSON'>;
type ResizeCallback = (rect: Rectangle) => void;
let resizeObserver: ResizeObserver;
const nodeToCallback = new WeakMap<Element, ResizeCallback>();

export const useObservedWidth = (
  node?: Element | null,
  useObservedWidthFlag?: boolean,
): Rectangle => {
  const [rect, setRect] = React.useState<Rectangle>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  });

  React.useEffect(() => {
    if (!node || !useObservedWidthFlag) {
      return;
    }
    if (!resizeObserver) {
      resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          if (nodeToCallback.has(entry.target)) {
            nodeToCallback.get(entry.target)!(entry.contentRect);
          }
        }
      });
    }

    nodeToCallback.set(node, (rect: Rectangle) => {
      const { x, y, width, height, top, left, bottom, right } = rect;
      return setRect({ x, y, width, height, top, left, bottom, right });
    });
    resizeObserver.observe(node);

    return () => {
      resizeObserver.unobserve(node);
      nodeToCallback.delete(node);
    };
  }, [node, useObservedWidthFlag]);

  return rect;
};
