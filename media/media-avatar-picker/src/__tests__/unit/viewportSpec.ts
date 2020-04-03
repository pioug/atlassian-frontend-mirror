import {
  Viewport,
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT,
  DEFAULT_MARGIN,
  DEFAULT_INNER_WIDTH,
  DEFAULT_INNER_HEIGHT,
  MAX_SCALE,
} from '../../viewport';

export const DEFAULT_ITEM_WIDTH = DEFAULT_WIDTH * 2;
export const DEFAULT_ITEM_HEIGHT = DEFAULT_HEIGHT * 2;
export const DEFAULT_MAX_ITEM_VIEW_WIDTH = DEFAULT_INNER_WIDTH * MAX_SCALE;
export const DEFAULT_MAX_ITEM_VIEW_HEIGHT = DEFAULT_INNER_HEIGHT * MAX_SCALE;
export const ZOOMED_OUT = 0;
export const ZOOMED_HALF = 50;
export const ZOOMED_IN = 100;
export const ZOOMED_EXCESSIVE = 200;
export const DRAG_DELTA_X = -10;
export const DRAG_DELTA_Y = -20;
export const DRAG_DELTA_X_HUGE = 10000000;
export const DRAG_DELTA_Y_HUGE = 20000000;

export const setup = (
  scale: number = 0, // 0 - 100
  dragX: number = 0,
  dragY: number = 0,
  itemWidth: number = DEFAULT_ITEM_WIDTH,
  itemHeight: number = DEFAULT_ITEM_HEIGHT,
) => {
  const viewport = new Viewport();
  viewport
    .setItemSize(itemWidth, itemHeight)
    .setScale(scale)
    .dragBy(dragX, dragY);
  return viewport;
};

describe('Viewport', () => {
  describe('Layout', () => {
    let viewport: Viewport;

    beforeAll(() => (viewport = setup()));

    it('should calculate correct inner bounds', () => {
      const { innerBounds } = viewport;
      expect(innerBounds.left).toEqual(DEFAULT_MARGIN);
      expect(innerBounds.top).toEqual(DEFAULT_MARGIN);
      expect(innerBounds.width).toEqual(DEFAULT_INNER_WIDTH);
      expect(innerBounds.height).toEqual(DEFAULT_INNER_HEIGHT);
    });

    it('should calculate correct outer bounds', () => {
      const { outerBounds } = viewport;
      expect(outerBounds.left).toEqual(0);
      expect(outerBounds.top).toEqual(0);
      expect(outerBounds.width).toEqual(DEFAULT_WIDTH);
      expect(outerBounds.height).toEqual(DEFAULT_HEIGHT);
    });

    it('should calculate correct fitted item bounds', () => {
      const viewport = setup();
      const { fittedItemBounds: rect } = viewport;
      expect(rect.width).toEqual(DEFAULT_INNER_WIDTH);
      expect(rect.height).toEqual(DEFAULT_INNER_HEIGHT);
    });

    it('should know when no item size set', () => {
      const viewport = new Viewport(0, 0, 0);
      expect(viewport.isEmpty).toBeTruthy();
    });

    describe('visible source bounds', () => {
      it('should give whole image when first positioned', () => {
        const viewport = setup();
        const { visibleSourceBounds } = viewport;
        expect(visibleSourceBounds.left).toEqual(0);
        expect(visibleSourceBounds.top).toEqual(0);
        expect(visibleSourceBounds.width).toEqual(DEFAULT_ITEM_WIDTH);
        expect(visibleSourceBounds.height).toEqual(DEFAULT_ITEM_HEIGHT);
      });

      it('should give correct portion of total image width when half zoomed in', () => {
        const viewport = setup(ZOOMED_HALF);
        const visibleSourceBounds = viewport.visibleSourceBounds.map(
          Math.round,
        );
        expect(visibleSourceBounds.left).toEqual(58);
        expect(visibleSourceBounds.top).toEqual(58);
        expect(visibleSourceBounds.width).toEqual(84);
        expect(visibleSourceBounds.height).toEqual(84);
      });

      it('should give quarter of total image size when fully zoomed in', () => {
        const viewport = setup(
          ZOOMED_IN,
          DEFAULT_MAX_ITEM_VIEW_WIDTH / 4,
          DEFAULT_MAX_ITEM_VIEW_HEIGHT / 4,
        );
        const visibleSourceBounds = viewport.visibleSourceBounds.map(
          Math.round,
        );
        expect(visibleSourceBounds.left).toEqual(53);
        expect(visibleSourceBounds.top).toEqual(53);
        expect(visibleSourceBounds.width).toEqual(53);
        expect(visibleSourceBounds.height).toEqual(53);
      });

      it('should calculate correct max scale for itemBounds when image smaller than view', () => {
        const viewport = setup();
        viewport.setItemSize(
          DEFAULT_MAX_ITEM_VIEW_WIDTH / 2,
          DEFAULT_MAX_ITEM_VIEW_HEIGHT / 2,
        );
        const { maxScale } = viewport;
        expect(maxScale).toEqual(MAX_SCALE);
      });

      it('should calculate correct max scale for itemBounds when image larger than view', () => {
        const viewport = setup();
        const itemSize = DEFAULT_MAX_ITEM_VIEW_WIDTH * 2;
        viewport.setItemSize(itemSize, itemSize);
        const { maxScale } = viewport;
        expect(maxScale).toEqual((itemSize * MAX_SCALE) / DEFAULT_INNER_WIDTH);
      });
    });
  });

  describe('Zooming', () => {
    it('should fit whole image within inner view aread when fully zoomed out', () => {
      const viewport = setup(ZOOMED_OUT);
      const { itemBounds } = viewport;
      expect(itemBounds.width).toEqual(DEFAULT_INNER_WIDTH);
      expect(itemBounds.height).toEqual(DEFAULT_INNER_HEIGHT);
    });

    it('should zoom image to max scale when fully zoomed in', () => {
      const viewport = setup(ZOOMED_IN);
      const { itemBounds, maxItemViewRect } = viewport;
      expect(itemBounds.width).toEqual(maxItemViewRect.width);
      expect(itemBounds.height).toEqual(maxItemViewRect.height);
    });
  });

  describe('Dragging (panning)', () => {
    it('should update itemBounds when dragged', () => {
      const viewport = setup(ZOOMED_IN);
      const { itemBounds: beforeDragItemBounds } = viewport;
      viewport.dragBy(DRAG_DELTA_X, DRAG_DELTA_Y);
      const { itemBounds: afterDragItemBounds } = viewport;
      expect(afterDragItemBounds.left - beforeDragItemBounds.left).toEqual(
        DRAG_DELTA_X,
      );
      expect(afterDragItemBounds.top - beforeDragItemBounds.top).toEqual(
        DRAG_DELTA_Y,
      );
    });
  });

  describe('Constraints', () => {
    it('should constrain itemBounds size when over scaled', () => {
      const viewport = setup(ZOOMED_EXCESSIVE);
      const { itemBounds, maxItemViewRect } = viewport;
      expect(itemBounds.width).toEqual(maxItemViewRect.width);
      expect(itemBounds.height).toEqual(maxItemViewRect.height);
    });

    it('should constrain edges when dragged and zoomed in', () => {
      const viewport = setup(ZOOMED_IN);
      viewport.dragBy(DRAG_DELTA_X_HUGE, DRAG_DELTA_Y_HUGE);
      const { itemBounds } = viewport;
      expect(itemBounds.left).toEqual(DEFAULT_MARGIN);
      expect(itemBounds.top).toEqual(DEFAULT_MARGIN);
    });

    it('should constrain edges when dragged and zoomed out', () => {
      const viewport = setup(ZOOMED_OUT);
      const { itemBounds: beforeDragItemBounds } = viewport;
      viewport.dragBy(DRAG_DELTA_X_HUGE, DRAG_DELTA_Y_HUGE);
      const { itemBounds: afterDragItemBounds } = viewport;
      expect(afterDragItemBounds.left).toEqual(beforeDragItemBounds.left);
      expect(afterDragItemBounds.top).toEqual(beforeDragItemBounds.top);
    });
  });

  describe('Coordinate transformations', () => {
    it('should map between view coords and image local coords with no dragging', () => {
      const viewport = setup(ZOOMED_IN);
      const p = viewport.viewToLocalPoint(0, 0).rounded();
      expect(p.x).toEqual(73);
      expect(p.y).toEqual(73);
    });

    it('should map between view coords and image local coords with dragging', () => {
      const viewport = setup(ZOOMED_IN);
      viewport.dragBy(DRAG_DELTA_X_HUGE, DRAG_DELTA_Y_HUGE);
      const p = viewport.viewToLocalPoint(0, 0);
      expect(p.x).toEqual(0);
      expect(p.y).toEqual(0);
    });
  });
});
