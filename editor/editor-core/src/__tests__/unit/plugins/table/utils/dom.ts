import {
  getMousePositionHorizontalRelativeByElement,
  getMousePositionVerticalRelativeByElement,
} from '../../../../../plugins/table/utils/dom';

describe('table plugin: utils/dom.js', () => {
  let element: HTMLElement;
  let mouseMoveOptimization = false;
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
    mouseMoveOptimization = false;
    element.getBoundingClientRect = () => elementRect;
  });

  describe('#getMousePositionHorizontalRelativeByElement', () => {
    describe('when there is a gap of 30px', () => {
      const GAP = 30;

      describe('and when the mouse is outside of the gap', () => {
        describe('for 1px on the left', () => {
          it('should return null when mouseMoveOptimization is disabled', () => {
            const event = {
              target: element,
              clientX: GAP + elementRect.left + 1,
            };

            expect(
              getMousePositionHorizontalRelativeByElement(
                // @ts-ignore
                event,
                mouseMoveOptimization,
                elementContentRects,
                GAP,
              ),
            ).toBeNull();
          });

          it('should return null when mouseMoveOptimization is enabled', () => {
            const event = {
              target: element,
              offsetX: GAP + 1,
            };

            mouseMoveOptimization = true;
            elementContentRects = { 'table-cell-id': { width: 100 } };

            expect(
              getMousePositionHorizontalRelativeByElement(
                // @ts-ignore
                event,
                mouseMoveOptimization,
                elementContentRects,
                GAP,
              ),
            ).toBeNull();
          });
        });

        describe('for 1px on the right', () => {
          it('should return null when mouseMoveOptimization is disabled', () => {
            const event = {
              target: element,
              clientX: elementRect.width + elementRect.left - GAP - 1,
            };

            expect(
              getMousePositionHorizontalRelativeByElement(
                // @ts-ignore
                event,
                mouseMoveOptimization,
                elementContentRects,
                GAP,
              ),
            ).toBeNull();
          });

          it('should return null when mouseMoveOptimization is enabled', () => {
            const event = {
              target: element,
              offsetX: elementRect.width - GAP - 1,
            };

            mouseMoveOptimization = true;
            elementContentRects = { 'table-cell-id': { width: 100 } };

            expect(
              getMousePositionHorizontalRelativeByElement(
                // @ts-ignore
                event,
                mouseMoveOptimization,
                elementContentRects,
                GAP,
              ),
            ).toBeNull();
          });
        });
      });

      describe('and when the mouse is inside of the gap', () => {
        it('should return left when mouseMoveOptimization is disabled', () => {
          const event = {
            target: element,
            clientX: GAP + elementRect.left,
          };

          expect(
            getMousePositionHorizontalRelativeByElement(
              // @ts-ignore
              event,
              mouseMoveOptimization,
              elementContentRects,
              GAP,
            ),
          ).toBe('left');
        });

        it('should return left when mouseMoveOptimization is enabled', () => {
          const event = {
            target: element,
            offsetX: GAP,
          };

          mouseMoveOptimization = true;
          elementContentRects = { 'table-cell-id': { width: 100 } };

          expect(
            getMousePositionHorizontalRelativeByElement(
              // @ts-ignore
              event,
              mouseMoveOptimization,
              elementContentRects,
              GAP,
            ),
          ).toBe('left');
        });

        it('should return right when mouseMoveOptimization is disabled', () => {
          const event = {
            target: element,
            clientX: elementRect.width + elementRect.left - GAP,
          };

          expect(
            getMousePositionHorizontalRelativeByElement(
              // @ts-ignore
              event,
              mouseMoveOptimization,
              elementContentRects,
              GAP,
            ),
          ).toBe('right');
        });

        it('should return right when mouseMoveOptimization is enabled', () => {
          const event = {
            target: element,
            offsetX: elementRect.width - GAP,
          };

          mouseMoveOptimization = true;
          elementContentRects = { 'table-cell-id': { width: 100 } };

          expect(
            getMousePositionHorizontalRelativeByElement(
              // @ts-ignore
              event,
              mouseMoveOptimization,
              elementContentRects,
              GAP,
            ),
          ).toBe('right');
        });
      });
    });

    it('should return left when the mouse is positioned before half of the element and mouseMoveOptimization is disabled', () => {
      const event = {
        target: element,
        clientX: 50,
      };

      expect(
        // @ts-ignore
        getMousePositionHorizontalRelativeByElement(event),
      ).toBe('left');
    });

    it('should return left when the mouse is positioned before half of the element and mouseMoveOptimization is enabled', () => {
      const event = {
        target: element,
        offsetX: 50,
      };

      mouseMoveOptimization = true;
      elementContentRects = { 'table-cell-id': { width: 100 } };

      expect(
        getMousePositionHorizontalRelativeByElement(
          // @ts-ignore
          event,
          mouseMoveOptimization,
          elementContentRects,
        ),
      ).toBe('left');
    });

    it('should return right when the mouse is positioned after half of the element and mouseMoveOptimization is disabled', () => {
      const event = {
        target: element,
        clientX: 101,
      };

      expect(
        // @ts-ignore
        getMousePositionHorizontalRelativeByElement(event),
      ).toBe('right');
    });

    it('should return right when the mouse is positioned after half of the element and mouseMoveOptimization is enabled', () => {
      const event = {
        target: element,
        offsetX: 101,
      };

      mouseMoveOptimization = true;
      elementContentRects = { 'table-cell-id': { width: 100 } };

      expect(
        getMousePositionHorizontalRelativeByElement(
          // @ts-ignore
          event,
          mouseMoveOptimization,
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
