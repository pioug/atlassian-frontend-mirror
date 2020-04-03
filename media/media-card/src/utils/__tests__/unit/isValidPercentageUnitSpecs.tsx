import { isValidPercentageUnit } from '../..';

describe('isValidPercentageUnit', () => {
  it('should return true when passing a valid percentage value', () => {
    expect(isValidPercentageUnit('50%')).toEqual(true);
  });

  it('should return false when passing an invalid percentage value', () => {
    expect(isValidPercentageUnit('k5%')).toEqual(false);
    expect(isValidPercentageUnit('5k%')).toEqual(false);
    expect(isValidPercentageUnit('15%%')).toEqual(false);
    expect(isValidPercentageUnit('15')).toEqual(false);
  });

  it('should return false when passing an random string', () => {
    expect(isValidPercentageUnit('5k0g')).toEqual(false);
  });

  it('should return false when passing number', () => {
    expect(isValidPercentageUnit(10)).toEqual(false);
  });
});
