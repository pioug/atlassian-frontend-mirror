import { hasSameParent, isSamePath } from '../../path';

describe('@atlaskit/tree - utils/flat-tree', () => {
  describe('#isSamePath', () => {
    it('returns true if for the same instances', () => {
      const path = [1, 1];
      expect(isSamePath(path, path)).toBe(true);
    });

    it('returns true if it the same', () => {
      expect(isSamePath([1, 1], [1, 1])).toBe(true);
    });

    it('returns false if  not same', () => {
      expect(isSamePath([1, 1, 1], [1, 1])).toBe(false);
    });

    it('returns false if any of them is empty', () => {
      expect(isSamePath([], [1, 1])).toBe(false);
      expect(isSamePath([1], [])).toBe(false);
    });
  });

  describe('#hasSameParent', () => {
    it('returns true if both are on the first level', () => {
      expect(hasSameParent([1], [1])).toBe(true);
    });
    it('returns true if both have the same parent', () => {
      expect(hasSameParent([1, 1], [1, 2])).toBe(true);
    });
    it('returns false if they have different parent', () => {
      expect(hasSameParent([2, 1], [1, 1])).toBe(false);
    });
    it('returns false if they are different length', () => {
      expect(hasSameParent([2, 1], [2, 1, 3])).toBe(false);
    });
    it('returns true for the same instances', () => {
      const path = [1, 1];
      expect(hasSameParent(path, path)).toBe(true);
    });
    it('returns true if its same', () => {
      expect(hasSameParent([1, 1], [1, 1])).toBe(true);
    });
  });
});
