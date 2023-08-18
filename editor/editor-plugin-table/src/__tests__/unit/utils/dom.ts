import {
  getMousePositionHorizontalRelativeByElement,
  getMousePositionVerticalRelativeByElement,
} from '../../../plugins/table/utils/dom';

describe('table plugin: utils/dom.js', () => {
  let element: HTMLElement;
  let elementContentRects: any;
  const elementRect: DOMRect = {
    width: 100,
    left: 50,
    height: 100,
    top: 50,
    bottom: 0,
    right: 0,
    x: 0,
    y: 0,
    toJSON() {
      return JSON.stringify(this);
    },
  };
  beforeAll(() => {
    jest.spyOn(HTMLElement.prototype, 'closest').mockImplementation(() => {
      return {
        id: 'table-cell-id',
      } as Element;
    });
  });

  beforeEach(() => {
    element = document.createElement('div');
    element.getBoundingClientRect = () => elementRect;
  });

  describe('#getMousePositionHorizontalRelativeByElement', () => {
    describe('when there is a gap of 30px', () => {
      const GAP = 30;

      describe('and when the mouse is outside of the gap', () => {
        describe('for 1px on the left', () => {
          it('should return null', () => {
            const event = {
              target: element,
              offsetX: GAP + 1,
            };

            elementContentRects = { 'table-cell-id': { width: 100 } };

            expect(
              getMousePositionHorizontalRelativeByElement(
                // @ts-ignore
                event,
                elementContentRects,
                GAP,
              ),
            ).toBeNull();
          });
        });

        describe('for 1px on the right', () => {
          it('should return null', () => {
            const event = {
              target: element,
              offsetX: elementRect.width - GAP - 1,
            };

            elementContentRects = { 'table-cell-id': { width: 100 } };

            expect(
              getMousePositionHorizontalRelativeByElement(
                // @ts-ignore
                event,
                elementContentRects,
                GAP,
              ),
            ).toBeNull();
          });
        });
      });

      describe('and when the mouse is inside of the gap', () => {
        it('should return left', () => {
          const event = {
            target: element,
            offsetX: GAP,
          };

          elementContentRects = { 'table-cell-id': { width: 100 } };

          expect(
            getMousePositionHorizontalRelativeByElement(
              // @ts-ignore
              event,
              elementContentRects,
              GAP,
            ),
          ).toBe('left');
        });

        it('should return right', () => {
          const event = {
            target: element,
            offsetX: elementRect.width - GAP,
          };

          elementContentRects = { 'table-cell-id': { width: 100 } };

          expect(
            getMousePositionHorizontalRelativeByElement(
              // @ts-ignore
              event,
              elementContentRects,
              GAP,
            ),
          ).toBe('right');
        });
      });
    });

    it('should return left when the mouse is positioned before half of the element', () => {
      const event = {
        target: element,
        offsetX: 50,
      };

      elementContentRects = { 'table-cell-id': { width: 100 } };

      expect(
        getMousePositionHorizontalRelativeByElement(
          // @ts-ignore
          event,
          elementContentRects,
        ),
      ).toBe('left');
    });

    it('should return right when the mouse is positioned after half of the element', () => {
      const event = {
        target: element,
        offsetX: 101,
      };

      elementContentRects = { 'table-cell-id': { width: 100 } };

      expect(
        getMousePositionHorizontalRelativeByElement(
          // @ts-ignore
          event,
          elementContentRects,
        ),
      ).toBe('right');
    });
  });

  describe('#getMousePositionVerticalRelativeByElement', () => {
    it('should return top when the mouse is positioned before half of the element', () => {
      const event = {
        target: element,
        clientY: 50,
      };

      expect(
        // @ts-ignore
        getMousePositionVerticalRelativeByElement(event),
      ).toBe('top');
    });

    it('should return bottom when the mouse is positioned before half of the element', () => {
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
