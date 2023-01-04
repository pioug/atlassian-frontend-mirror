import { resolveOrder } from '../list';

describe('list', () => {
  describe('resolveOrder', () => {
    it('should resolve 1 as 1', () => {
      expect(resolveOrder(1)).toBe(1);
    });

    it('should resolve 1.99 as 1', () => {
      expect(resolveOrder(1.99)).toBe(1);
    });

    it('should resolve -1 as undefined', () => {
      expect(resolveOrder(-1)).toBe(undefined);
    });

    it('should resolve -1.99 as undefined', () => {
      expect(resolveOrder(-1.99)).toBe(undefined);
    });

    it('should resolve 0 as 0', () => {
      expect(resolveOrder(0)).toBe(0);
    });

    it('should resolve 0.99 as 0', () => {
      expect(resolveOrder(0.99)).toBe(0);
    });

    it('should resolve "blah" as undefined', () => {
      expect(resolveOrder('blah')).toBe(undefined);
    });

    it('should resolve "1" as 1', () => {
      expect(resolveOrder('1')).toBe(1);
    });
  });
});
