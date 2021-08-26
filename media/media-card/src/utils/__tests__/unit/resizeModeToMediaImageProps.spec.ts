import { resizeModeToMediaImageProps } from '../../resizeModeToMediaImageProps';

describe(resizeModeToMediaImageProps, () => {
  it('should convert resizeMode to crop and stretch MediaImage props', () => {
    expect(resizeModeToMediaImageProps('stretchy-fit')).toMatchObject({
      crop: false,
      stretch: true,
    });
    expect(resizeModeToMediaImageProps('crop')).toMatchObject({
      crop: true,
      stretch: false,
    });
  });
});
