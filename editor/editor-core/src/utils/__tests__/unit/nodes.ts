import { isNodeSelectedOrInRange, SelectedState } from '../../nodes';

describe('node utils', () => {
  describe('isNodeSelected', () => {
    it('should return null if not selected', () => {
      const range = { anchor: 1, head: 2 };
      const node = { pos: 4, size: 3 };
      expect(
        isNodeSelectedOrInRange(range.anchor, range.head, node.pos, node.size),
      ).toBeNull();
    });
    it('should return selectedInRange if node is inside range', () => {
      const range = { anchor: 6, head: 10 };
      const node = { pos: 7, size: 2 };
      expect(
        isNodeSelectedOrInRange(range.anchor, range.head, node.pos, node.size),
      ).toBe(SelectedState.selectedInRange);
    });
    it('should return selectedInRange if node is inside reversed range', () => {
      const range = { anchor: 10, head: 6 };
      const node = { pos: 7, size: 2 };
      expect(
        isNodeSelectedOrInRange(range.anchor, range.head, node.pos, node.size),
      ).toBe(SelectedState.selectedInRange);
    });
    it('should return selectedInside if range is inside node', () => {
      const range = { anchor: 7, head: 8 };
      const node = { pos: 6, size: 10 };
      expect(
        isNodeSelectedOrInRange(range.anchor, range.head, node.pos, node.size),
      ).toBe(SelectedState.selectedInside);
    });
    it('should return selectedInside if range is the same as node', () => {
      const range = { anchor: 8, head: 11 };
      const node = { pos: 8, size: 3 };
      expect(
        isNodeSelectedOrInRange(range.anchor, range.head, node.pos, node.size),
      ).toBe(SelectedState.selectedInside);
    });
  });
});
