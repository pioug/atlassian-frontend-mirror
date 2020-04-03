import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { ImageWrapper } from '../../image-placer/styled';

jest.mock('../../image-cropper/isImageRemote');

// ...before importing Image
import {
  ImagePlacerImage,
  ImagePlacerImageProps,
  IMAGE_ERRORS,
} from '../../image-placer/image';

import { isImageRemote } from '../../image-cropper/isImageRemote';
import { asMock } from '@atlaskit/media-test-helpers';

interface SetupInfo {
  wrapper: ShallowWrapper;
  instance: ImagePlacerImage;
  onLoad: () => void;
  onError: () => void;
}

const setup = (props: Partial<ImagePlacerImageProps> = {}): SetupInfo => {
  const onLoad = jest.fn();
  const onError = jest.fn();

  let wrapper = shallow(
    <ImagePlacerImage
      x={1}
      y={2}
      width={3}
      height={4}
      onLoad={onLoad}
      onError={onError}
      {...props}
    />,
  );

  const instance = wrapper.instance() as ImagePlacerImage;
  return { wrapper, instance, onLoad, onError };
};

describe('Image Placer Image', () => {
  describe('Loading', () => {
    it('should call onError prop if bad url', async () => {
      asMock(isImageRemote).mockImplementation(() => {
        throw new Error();
      });
      const { onError } = setup({ src: 'some-very-bad-url' });

      expect(onError).toHaveBeenCalledWith(IMAGE_ERRORS.BAD_URL);
    });

    describe('Image Events', () => {
      const currentTarget = {
        naturalWidth: 1,
        naturalHeight: 2,
      };

      beforeAll(() => {
        asMock(isImageRemote).mockReturnValue(true);
      });

      it('should pass image load event to props', () => {
        const { wrapper, onLoad } = setup({ src: 'some-src' });

        wrapper.find(ImageWrapper).simulate('load', {
          currentTarget,
        });
        expect(onLoad).toHaveBeenCalledWith(currentTarget, 1, 2);
      });

      it('should pass image error event to props', () => {
        const { wrapper, onError } = setup({ src: 'some-src' });

        wrapper.find(ImageWrapper).simulate('error');
        expect(onError).toHaveBeenCalled();
      });
    });
  });

  describe('Rendering', () => {
    it('should not render image if no src', () => {
      const { wrapper } = setup();
      expect(wrapper.find(ImageWrapper)).toHaveLength(0);
    });

    it('should render image with given coordinates', () => {
      const { wrapper } = setup({ src: 'some-src' });

      expect(wrapper.find(ImageWrapper).props()).toEqual(
        expect.objectContaining({
          x: 1,
          y: 2,
          width: 3,
          height: 4,
        }),
      );
    });
  });
});
