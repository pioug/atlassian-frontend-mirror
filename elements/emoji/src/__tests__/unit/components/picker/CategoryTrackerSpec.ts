import { List as VirtualList } from 'react-virtualized/dist/commonjs/List';
import CategoryTracker from '../../../../components/picker/CategoryTracker';
import { defaultCategories } from '../../../../util/constants';

describe('CategoryTracker', () => {
  describe('getRow', () => {
    it('returns undefined if the category was not added', () => {
      const tracker = new CategoryTracker();
      expect(tracker.getRow('CUSTOM')).toEqual(undefined);
    });

    it('maps a category to the first row added', () => {
      const tracker = new CategoryTracker();
      tracker.add('CUSTOM', 200);
      tracker.add('CUSTOM', 100);
      expect(tracker.getRow('CUSTOM')).toEqual(200);
    });
  });

  describe('findNearestCategoryAbove', () => {
    const getTracker = () => {
      const tracker = new CategoryTracker();
      defaultCategories.forEach((category, index) =>
        tracker.add(category, 2 * index),
      );
      return tracker;
    };

    it('returns first category if list is undefined', () => {
      expect(getTracker().findNearestCategoryAbove(10, undefined)).toEqual(
        defaultCategories[0],
      );
    });

    it('returns first category if scrolled past startIndex', () => {
      expect(getTracker().findNearestCategoryAbove(10, undefined)).toEqual(
        defaultCategories[0],
      );
    });

    it('returns category if first row matches startIndex', () => {
      expect(
        getTracker().findNearestCategoryAbove(10, {} as VirtualList),
      ).toEqual(defaultCategories[5]);
    });

    it('returns first above category whose row matches startIndex', () => {
      expect(
        getTracker().findNearestCategoryAbove(11, {} as VirtualList),
      ).toEqual(defaultCategories[5]);
    });
  });
});
