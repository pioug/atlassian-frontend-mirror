import {
  getMousePositionHorizontalRelativeByElement,
  getMousePositionVerticalRelativeByElement,
} from '../../../../../plugins/table/utils/dom';

describe('table plugin: utils/dom.js', () => {
  let element: HTMLElement;
  let tableCellOptimization = false;
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
    tableCellOptimization = false;
    element.getBoundingClientRect = () => elementRect;
  });

  describe('#getMousePositionHorizontalRelativeByElement', () => {
    describe('when there is a gap of 30px', () => {
      const GAP = 30;

      describe('and when the mouse is outside of the gap', () => {
        describe('for 1px on the left', () => {
          it('should returns null when tableCellOptimization is disabled', () => {
            const event = {
              target: element,
              clientX: GAP + elementRect.left + 1,
            };

            expect(
              getMousePositionHorizontalRelativeByElement(
                // @ts-ignore
                event,
                tableCellOptimization,
                elementContentRects,
                GAP,
              ),
            ).toBeNull();
          });

          it('should returns null when tableCellOptimization is enabled', () => {
            const event = {
              target: element,
              offsetX: GAP + 1,
            };

            tableCellOptimization = true;
            elementContentRects = { 'table-cell-id': { width: 100 } };

            expect(
              getMousePositionHorizontalRelativeByElement(
                // @ts-ignore
                event,
                tableCellOptimization,
                elementContentRects,
                GAP,
              ),
            ).toBeNull();
          });
        });

        describe('for 1px on the right', () => {
          it('should returns null when tableCellOptimization is disabled', () => {
            const event = {
              target: element,
              clientX: elementRect.width + elementRect.left - GAP - 1,
            };

            expect(
              getMousePositionHorizontalRelativeByElement(
                // @ts-ignore
                event,
                tableCellOptimization,
                elementContentRects,
                GAP,
              ),
            ).toBeNull();
          });

          it('should returns null when tableCellOptimization is enabled', () => {
            const event = {
              target: element,
              offsetX: elementRect.width - GAP - 1,
            };

            tableCellOptimization = true;
            elementContentRects = { 'table-cell-id': { width: 100 } };

            expect(
              getMousePositionHorizontalRelativeByElement(
                // @ts-ignore
                event,
                tableCellOptimization,
                elementContentRects,
                GAP,
              ),
            ).toBeNull();
          });
        });
      });

      describe('and when the mouse is inside of the gap', () => {
        it('should returns left when tableCellOptimization is disabled', () => {
          const event = {
            target: element,
            clientX: GAP + elementRect.left,
          };

          expect(
            getMousePositionHorizontalRelativeByElement(
              // @ts-ignore
              event,
              tableCellOptimization,
              elementContentRects,
              GAP,
            ),
          ).toBe('left');
        });

        it('should returns left when tableCellOptimization is enabled', () => {
          const event = {
            target: element,
            offsetX: GAP,
          };

          tableCellOptimization = true;
          elementContentRects = { 'table-cell-id': { width: 100 } };

          expect(
            getMousePositionHorizontalRelativeByElement(
              // @ts-ignore
              event,
              tableCellOptimization,
              elementContentRects,
              GAP,
            ),
          ).toBe('left');
        });

        it('should returns right when tableCellOptimization is disabled', () => {
          const event = {
            target: element,
            clientX: elementRect.width + elementRect.left - GAP,
          };

          expect(
            getMousePositionHorizontalRelativeByElement(
              // @ts-ignore
              event,
              tableCellOptimization,
              elementContentRects,
              GAP,
            ),
          ).toBe('right');
        });

        it('should returns right when tableCellOptimization is enabled', () => {
          const event = {
            target: element,
            offsetX: elementRect.width - GAP,
          };

          tableCellOptimization = true;
          elementContentRects = { 'table-cell-id': { width: 100 } };

          expect(
            getMousePositionHorizontalRelativeByElement(
              // @ts-ignore
              event,
              tableCellOptimization,
              elementContentRects,
              GAP,
            ),
          ).toBe('right');
        });
      });
    });

    it('should returns left when the mouse is positioned before half of the element and tableCellOptimization is disabled', () => {
      const event = {
        target: element,
        clientX: 50,
      };

      expect(
        // @ts-ignore
        getMousePositionHorizontalRelativeByElement(event),
      ).toBe('left');
    });

    it('should returns left when the mouse is positioned before half of the element and tableCellOptimization is enabled', () => {
      const event = {
        target: element,
        offsetX: 50,
      };

      tableCellOptimization = true;
      elementContentRects = { 'table-cell-id': { width: 100 } };

      expect(
        getMousePositionHorizontalRelativeByElement(
          // @ts-ignore
          event,
          tableCellOptimization,
          elementContentRects,
        ),
      ).toBe('left');
    });

    it('should returns right when the mouse is positioned after half of the element and tableCellOptimization is disabled', () => {
      const event = {
        target: element,
        clientX: 101,
      };

      expect(
        // @ts-ignore
        getMousePositionHorizontalRelativeByElement(event),
      ).toBe('right');
    });

    it('should returns right when the mouse is positioned after half of the element and tableCellOptimization is enabled', () => {
      const event = {
        target: element,
        offsetX: 101,
      };

      tableCellOptimization = true;
      elementContentRects = { 'table-cell-id': { width: 100 } };

      expect(
        getMousePositionHorizontalRelativeByElement(
          // @ts-ignore
          event,
          tableCellOptimization,
          elementContentRects,
        ),
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
