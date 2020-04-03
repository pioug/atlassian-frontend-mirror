import { containsPixelUnit } from '../..';

describe('containsPixelUnit', () => {
  it('should return false when passing not a pixel value', () => {
    expect(containsPixelUnit('0px')).toEqual(true);
    expect(containsPixelUnit('50px')).toEqual(true);
    expect(containsPixelUnit('1000px')).toEqual(true);
  });

  it('should return false when passing an invalid percentage value', () => {
    expect(containsPixelUnit('k5px')).toEqual(false);
    expect(containsPixelUnit('5kpx')).toEqual(false);
    expect(containsPixelUnit('15pxpx')).toEqual(false);
    expect(containsPixelUnit('15')).toEqual(false);
  });

  it('should return false when passing an random string', () => {
    expect(containsPixelUnit('5k0g')).toEqual(false);
  });
});
