import React from 'react';

interface BoundingBox {
  offsetHeight: number;
  offsetLeft: number;
  offsetTop: number;
  offsetWidth: number;
}

export const ComponentStub = React.forwardRef(
  (
    {
      testId,
      box,
    }: {
      testId: string;
      box: Partial<BoundingBox>;
    },
    ref: React.Ref<HTMLElement>,
  ) => {
    return (
      <div
        data-testid={testId}
        style={{}}
        ref={(element) => {
          if (element) {
            Object.defineProperty(element, 'offsetHeight', {
              configurable: true,
              value: box.offsetHeight || 0,
            });
            Object.defineProperty(element, 'offsetLeft', {
              configurable: true,
              value: box.offsetLeft || 0,
            });
            Object.defineProperty(element, 'offsetTop', {
              configurable: true,
              value: box.offsetTop || 0,
            });
            Object.defineProperty(element, 'offsetWidth', {
              configurable: true,
              value: box.offsetWidth || 0,
            });
          }

          if (typeof ref === 'function') {
            ref(element);
          } else {
            (ref as React.MutableRefObject<HTMLElement | null>).current = element;
          }
        }}
      />
    );
  },
);
