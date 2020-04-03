import {
  getMousePositionHorizontalRelativeByElement,
  getMousePositionVerticalRelativeByElement,
} from '../../../../../plugins/table/utils/dom';

describe('table plugin: utils/dom.js', () => {
  let element: HTMLElement;
  const elementRect = {
    width: 100,
    left: 50,
    height: 100,
    top: 50,
    bottom: 0,
    right: 0,
    x: 0,
    y: 0,
  };

  beforeEach(() => {
    element = document.createElement('div');

    element.getBoundingClientRect = () => elementRect;
  });

  describe('#getMousePositionHorizontalRelativeByElement', () => {
    describe('when there is a gap of 30px', () => {
      const GAP = 30;

      describe('and when the mouse is outside of the gap', () => {
        describe('for 1px on the left', () => {
          it('should returns null', () => {
            const event = {
              target: element,
              clientX: GAP + elementRect.left + 1,
            };

            expect(
              // @ts-ignore
              getMousePositionHorizontalRelativeByElement(event, GAP),
            ).toBeNull();
          });
        });

        describe('for 1px on the right', () => {
          it('should returns null', () => {
            const event = {
              target: element,
              clientX: elementRect.width + elementRect.left - GAP - 1,
            };

            expect(
              // @ts-ignore
              getMousePositionHorizontalRelativeByElement(event, GAP),
            ).toBeNull();
          });
        });
      });

      describe('and when the mouse is inside of the gap', () => {
        it('should returns left', () => {
          const event = {
            target: element,
            clientX: GAP + elementRect.left,
          };

          expect(
            // @ts-ignore
            getMousePositionHorizontalRelativeByElement(event, GAP),
          ).toBe('left');
        });

        it('should returns right', () => {
          const event = {
            target: element,
            clientX: elementRect.width + elementRect.left - GAP,
          };

          expect(
            // @ts-ignore
            getMousePositionHorizontalRelativeByElement(event, GAP),
          ).toBe('right');
        });
      });
    });

    it('should returns left when the mouse is positioned before half of the element', () => {
      const event = {
        target: element,
        clientX: 50,
      };

      expect(
        // @ts-ignore
        getMousePositionHorizontalRelativeByElement(event),
      ).toBe('left');
    });

    it('should returns right when the mouse is positioned after half of the element', () => {
      const event = {
        target: element,
        clientX: 101,
      };

      expect(
        // @ts-ignore
        getMousePositionHorizontalRelativeByElement(event),
      ).toBe('right');
    });
  });

  describe('#getMousePositionVerticalRelativeByElement', () => {
    it('should returns top when the mouse is positioned before half of the element', () => {
      const event = {
        target: element,
        clientY: 50,
      };

      expect(
        // @ts-ignore
        getMousePositionVerticalRelativeByElement(event),
      ).toBe('top');
    });

    it('should returns bottom when the mouse is positioned before half of the element', () => {
      const event = {
        target: element,
        clientY: 101,
      };

      expect(
        // @ts-ignore
        getMousePositionVerticalRelativeByElement(event),
      ).toBe('bottom');
    });
  });
});
