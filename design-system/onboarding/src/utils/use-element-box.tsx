import { useEffect, useLayoutEffect, useState } from 'react';

export interface ElementBoundingBox {
  height: number;
  left: number;
  top: number;
  width: number;
}

const getElementRect = (element: HTMLElement): ElementBoundingBox => {
  const { height, left, top, width } = element.getBoundingClientRect();
  return {
    height,
    left,
    top,
    width,
  };
};

/**
 * Will listen to the document resizing to see if an element has moved positions.
 * Not using ResizeObserver because of IE11 support.
 * @param element HTMLElement to watch when resizing.
 */
export const useElementBox = (element: HTMLElement) => {
  const [box, setBox] = useState<ElementBoundingBox>({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  });

  useLayoutEffect(() => {
    setBox(getElementRect(element));
  }, [element]);

  useEffect(() => {
    const onResize = () => {
      requestAnimationFrame(() => {
        setBox(getElementRect(element));
      });
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [element]);

  return box;
};

/**
 * __Element box__
 *
 * Allows consumption of `userElementBox` hook through render props.
 *
 * @internal
 */
export const ElementBox = (props: {
  element: HTMLElement;
  children: (box: ElementBoundingBox) => any;
}) => {
  const box = useElementBox(props.element);
  return props.children(box);
};
