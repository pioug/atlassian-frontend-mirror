import React from 'react';

import { act, fireEvent, render } from '@testing-library/react';
import { replaceRaf } from 'raf-stub';

import { ElementBox } from '../../use-element-box';

replaceRaf();

const commonBoundingClientRectValues = {
  left: 2,
  right: 0,
  bottom: 0,
  x: 0,
  y: 0,
  toJSON() {
    return JSON.stringify(this);
  },
};

const getBoundingClientRectValues: DOMRect[] = [
  {
    width: 100,
    height: 250,
    top: 5,
    ...commonBoundingClientRectValues,
  },
  {
    width: 50,
    height: 300,
    top: 10,
    ...commonBoundingClientRectValues,
  },
];

describe('use-element-box', () => {
  it('correctly provides element dimensions on initial render', () => {
    const element = document.createElement('div');

    jest
      .spyOn(element, 'getBoundingClientRect')
      .mockImplementationOnce(() => getBoundingClientRectValues[0]);

    let box = {};

    render(
      <ElementBox element={element}>
        {(nextBox) => {
          if (nextBox) {
            box = nextBox;
          }

          return null;
        }}
      </ElementBox>,
    );

    expect(box).toEqual({
      width: 100,
      height: 250,
      left: 2,
      top: 5,
    });
  });

  it('listens to resizes and updates element position to match', () => {
    const element = document.createElement('div');

    jest
      .spyOn(element, 'getBoundingClientRect')
      .mockImplementationOnce(() => getBoundingClientRectValues[0])
      .mockImplementationOnce(() => getBoundingClientRectValues[1]);

    let box = {};

    render(
      <ElementBox element={element}>
        {(nextBox) => {
          if (nextBox) {
            box = nextBox;
          }

          return null;
        }}
      </ElementBox>,
    );

    act(() => {
      fireEvent(window, new Event('resize'));
      (window.requestAnimationFrame as any).step();
    });

    expect(element.getBoundingClientRect).toHaveBeenCalledTimes(2);
    expect(box).toEqual({
      width: 50,
      height: 300,
      top: 10,
      left: 2,
    });
  });

  it('updates dimensions correctly when the target element is swapped out', () => {
    let element: HTMLElement = document.createElement('div');
    const elementNext = document.createElement('span');
    let box = {};

    jest
      .spyOn(element, 'getBoundingClientRect')
      .mockImplementation(() => getBoundingClientRectValues[0]);

    const { rerender } = render(
      <ElementBox element={element}>
        {(nextBox) => {
          if (nextBox) {
            box = nextBox;
          }

          return null;
        }}
      </ElementBox>,
    );

    expect(box).toEqual({
      width: 100,
      height: 250,
      left: 2,
      top: 5,
    });
    expect(element.getBoundingClientRect).toHaveBeenCalledTimes(1);

    jest
      .spyOn(elementNext, 'getBoundingClientRect')
      .mockImplementation(() => getBoundingClientRectValues[1]);

    rerender(
      <ElementBox element={elementNext}>
        {(nextBox) => {
          if (nextBox) {
            box = nextBox;
          }

          return null;
        }}
      </ElementBox>,
    );

    expect(box).toEqual({
      width: 50,
      height: 300,
      top: 10,
      left: 2,
    });
    expect(elementNext.getBoundingClientRect).toHaveBeenCalledTimes(1);
  });
});
