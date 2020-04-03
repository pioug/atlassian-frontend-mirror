import { appendTimestamp } from '../../appendTimestamp';

describe('appendTimestamp', () => {
  const defaultDate = Date.UTC(2018, 11, 12, 15, 30, 45);

  it('should work with normal file name', () => {
    expect(appendTimestamp('image.png', defaultDate)).toBe(
      'image-20181212-153045.png',
    );
  });

  it('should work with file names with dot', () => {
    expect(appendTimestamp('image.xyz.png', defaultDate)).toBe(
      'image.xyz-20181212-153045.png',
    );
  });

  it('should work with file names with dash', () => {
    expect(appendTimestamp('image-xyz.png', defaultDate)).toBe(
      'image-xyz-20181212-153045.png',
    );
  });

  it('should pad digits with zero', () => {
    expect(appendTimestamp('image.png', Date.UTC(0, 0, 1, 0, 0, 0))).toBe(
      'image-19000101-000000.png',
    );
  });

  it('should work when file has no extension', () => {
    expect(appendTimestamp('my-image', defaultDate)).toEqual(
      'my-image-20181212-153045',
    );
  });

  it('should work when there is a dot in the begining', () => {
    expect(appendTimestamp('.my-image.png', defaultDate)).toEqual(
      '.my-image-20181212-153045.png',
    );
  });
});
