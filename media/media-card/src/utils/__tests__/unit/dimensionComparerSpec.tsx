import { canCompareDimension, isBigger } from '../../dimensionComparer';

describe('dimensionComparer', () => {
  describe('canCompareDimension', () => {
    it('should return true when dimensions can be compared', () => {
      expect(canCompareDimension('10%', '30%')).toBe(true);
      expect(canCompareDimension(2, 100)).toBe(true);
      expect(canCompareDimension('2px', '100px')).toBe(true);
    });

    it('should return false when dimensions can not be compared', () => {
      expect(canCompareDimension('10%', 100)).toBe(false);
      expect(canCompareDimension('aa', '12%')).toBe(false);
      expect(canCompareDimension('10%', '12px')).toBe(false);
      expect(canCompareDimension('10%', undefined)).toBe(false);
      expect(canCompareDimension(undefined, 100)).toBe(false);
    });
  });

  describe('isBigger', () => {
    it('should return true if new dimensions are bigger', () => {
      expect(
        isBigger({ width: 200, height: 200 }, { width: 210, height: 200 }),
      ).toBe(true);
      expect(
        isBigger(
          { width: '10%', height: '10%' },
          { width: '20%', height: '10%' },
        ),
      ).toBe(true);
      expect(
        isBigger(
          { width: '10px', height: '10px' },
          { width: '10px', height: '101px' },
        ),
      ).toBe(true);
    });

    it('should return false if new dimensions are not bigger', () => {
      expect(
        isBigger({ width: 200, height: 200 }, { width: 200, height: 200 }),
      ).toBe(false);
      expect(
        isBigger({ width: 200, height: 200 }, { width: 200, height: 100 }),
      ).toBe(false);

      expect(
        isBigger(
          { width: '10%', height: '10%' },
          { width: '10%', height: '10%' },
        ),
      ).toBe(false);
      expect(
        isBigger(
          { width: '10%', height: '10%' },
          { width: '10%', height: '1%' },
        ),
      ).toBe(false);

      expect(
        isBigger(
          { width: '10px', height: '10px' },
          { width: '10px', height: '10px' },
        ),
      ).toBe(false);
      expect(
        isBigger(
          { width: '10px', height: '10px' },
          { width: '10px', height: '1px' },
        ),
      ).toBe(false);
    });

    it('should return false if we compare different dimensions types', () => {
      expect(
        isBigger(
          { width: '10%', height: '10%' },
          { width: '1000', height: '1000' },
        ),
      ).toBe(false);
    });
  });
});
