import { getCSSUnitValue } from '../../getCSSUnitValue';

describe('index', () => {
  describe('getCSSUnitValue', () => {
    it('should pass through strings as unchanged', () => {
      const validUnit = '5em';
      expect(getCSSUnitValue(validUnit)).toEqual(validUnit);

      const invalidUnit = 'knight to e4';
      expect(getCSSUnitValue(invalidUnit)).toEqual(invalidUnit);
    });

    it('should append "px" to the end of numbers', () => {
      const positiveUnit = 999;
      expect(getCSSUnitValue(positiveUnit)).toEqual(`${positiveUnit}px`);

      const negativeUnit = -700;
      expect(getCSSUnitValue(negativeUnit)).toEqual(`${negativeUnit}px`);
    });
  });
});
