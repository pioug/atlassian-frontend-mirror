import React from 'react';

import { mount, ReactWrapper } from 'enzyme';

import {
  calculatePosition,
  getHorizontalPlacement,
  getVerticalPlacement,
  validatePosition,
} from '../../../../ui/Popup/utils';

type ElementLayout = {
  width?: number;
  height?: number;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
};

describe('@atlaskit/editor-common popup utils', () => {
  // This test should sit above the mounted, as it relies on untampered offsetParent
  it('should not be valid if the element is not mounted', () => {
    // @ts-ignore
    const element = global.document.createElement('div');
    expect(validatePosition(element)).toBe(false);
  });

  describe('mounted', () => {
    let offset: number[];
    let stick: boolean;
    let wrapper: ReactWrapper;
    let rootEl: Element;
    let popupEl: HTMLElement;
    let targetEl: HTMLElement;

    /**
     * Mock the dimensions & position of the different elements
     * Provide values to override, default layout looks like:
     *
     * -----------------------------------------
     * |<root>            ^                    |
     * |100px x 100px     | 10px               |
     * |          |---------------|            |
     * |<--30px---| <target>      |---40px---->|
     * |          | 30px x 20px   |            |
     * |          |---------------|            |
     * |                  | 70px               |
     * |                  |                    |
     * |                  v                    |
     * -----------------------------------------
     *
     * */
    const layoutElements = (
      elements: {
        root?: ElementLayout;
        popup?: ElementLayout;
        target?: ElementLayout;
      } = {},
    ) => {
      const { root, popup, target } = elements;

      rootEl.getBoundingClientRect = () =>
        ({
          top: 0,
          left: 0,
          right: 0,
          height: 100,
          width: 100,
          x: 0,
          y: 0,
          toJSON() {
            return JSON.stringify(this);
          },
          ...(root ? root : {}),
        } as DOMRect);

      popupEl.getBoundingClientRect = () =>
        ({
          height: 10,
          width: 50,
          x: 0,
          y: 0,
          toJSON() {
            return JSON.stringify(this);
          },
          ...(popup ? popup : {}),
        } as DOMRect);

      targetEl.getBoundingClientRect = () =>
        ({
          top: 10,
          left: 30,
          right: 40,
          height: 20,
          width: 30,
          x: 0,
          y: 0,
          toJSON() {
            return JSON.stringify(this);
          },
          ...(target ? target : {}),
        } as DOMRect);
    };

    beforeAll(() => {
      Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
        get() {
          return rootEl;
        },
      });
      Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
        get() {
          return this.getBoundingClientRect().width - 5;
        },
      });
    });

    beforeEach(() => {
      offset = [0, 0];
      stick = false;
      wrapper = mount(
        <div id="root">
          <div id="popup">OPA</div>
          <figure id="target" />
        </div>,
      );

      rootEl = wrapper.find('#root').getDOMNode();
      popupEl = wrapper.find('#popup').getDOMNode() as HTMLElement;
      targetEl = wrapper.find('#target').getDOMNode() as HTMLElement;

      layoutElements();
    });

    it('should calculatePosition for start and left placement', () => {
      const placement = ['start', 'left'] as [string, string];
      const calc = calculatePosition({
        placement,
        target: targetEl,
        popup: popupEl,
        offset,
        stick,
      });

      expect(calc).toEqual({
        top: 10,
        left: 30,
      });
    });

    it('should calculatePosition for start and end placement', () => {
      const placement = ['start', 'end'] as [string, string];
      const calc = calculatePosition({
        placement,
        target: targetEl,
        popup: popupEl,
        offset,
        stick,
      });

      expect(calc).toEqual({
        top: 10,
        left: 40,
      });
    });

    it('should calculatePosition for top and left placement', () => {
      const placement = ['top', 'left'] as [string, string];
      const calc = calculatePosition({
        placement,
        target: targetEl,
        popup: popupEl,
        offset,
        stick,
      });

      expect(calc).toEqual({
        bottom: 90,
        left: 30,
      });
    });

    it('should force position when forcePlacement Y is sent', () => {
      const calc = getVerticalPlacement(
        targetEl,
        popupEl,
        32,
        'bottom-left',
        true,
      );

      expect(calc).toEqual('bottom-left');
    });

    it('should force position when forcePlacement X is sent', () => {
      const calc = getHorizontalPlacement(
        targetEl,
        popupEl,
        32,
        'top-right',
        true,
      );

      expect(calc).toEqual('top-right');
    });

    it('should calculatePosition for bottom and left placement', () => {
      const placement = ['bottom', 'left'] as [string, string];
      const calc = calculatePosition({
        placement,
        target: targetEl,
        popup: popupEl,
        offset,
        stick,
      });

      expect(calc).toEqual({
        top: 30,
        left: 30,
      });
    });

    it('should calculatePosition for bottom and center placement', () => {
      const placement = ['bottom', 'center'] as [string, string];
      const calc = calculatePosition({
        placement,
        target: targetEl,
        popup: popupEl,
        offset,
        stick,
      });

      expect(calc).toEqual({
        top: 30,
        left: 23,
      });
    });

    it('should calculatePosition for bottom and right placement', () => {
      const placement = ['bottom', 'right'] as [string, string];
      const calc = calculatePosition({
        placement,
        target: targetEl,
        popup: popupEl,
        offset,
        stick,
      });

      expect(calc).toEqual({
        top: 30,
        right: 1,
      });
    });

    it('should not allow x position < 1', () => {
      layoutElements({
        target: { left: 0 },
      });
      const placement = ['bottom', 'center'] as [string, string];
      const calc = calculatePosition({
        placement,
        target: targetEl,
        popup: popupEl,
        offset,
        stick,
      });

      expect(calc).toEqual({
        left: 1,
        top: 30,
      });
    });

    it('should not allow x position > parent width - popup width', () => {
      layoutElements({
        target: { left: 70 },
      });
      const placement = ['bottom', 'center'] as [string, string];
      const calc = calculatePosition({
        placement,
        target: targetEl,
        popup: popupEl,
        offset,
        stick,
      });

      expect(calc).toEqual({
        left: 49,
        top: 30,
      });
    });

    describe('allow out of bound', () => {
      it('should allow x position < 1', () => {
        layoutElements({
          target: { left: 0 },
        });
        const placement = ['bottom', 'center'] as [string, string];
        const calc = calculatePosition({
          placement,
          target: targetEl,
          popup: popupEl,
          offset,
          stick,
          allowOutOfBounds: true,
        });

        expect(calc).toEqual({
          left: -7,
          top: 30,
        });
      });

      it('should allow x position > parent width - popup width', () => {
        layoutElements({
          target: { left: 70 },
        });
        const placement = ['bottom', 'center'] as [string, string];
        const calc = calculatePosition({
          placement,
          target: targetEl,
          popup: popupEl,
          offset,
          stick,
          allowOutOfBounds: true,
        });

        expect(calc).toEqual({
          left: 63,
          top: 30,
        });
      });
    });
  });
});
