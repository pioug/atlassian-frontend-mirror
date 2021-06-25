import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { MediaImage, MediaImageProps, MediaImageState } from '../../mediaImage';
import { ImageComponent } from '../../mediaImage/styled';
import { expectToEqual, nextTick } from '@atlaskit/media-test-helpers';
import { isRotated } from '../../imageMetaData';

interface SetupParams {
  isCoverStrategy: boolean;
  isImageMoreLandscapyThanContainer: boolean;
  isStretchingProhibited: boolean;
  loadImageImmediately?: boolean;
  previewOrientation?: number;
  altText?: string;
}

let mockIsRotated: jest.Mock | typeof isRotated = jest.fn();

jest.mock('../../imageMetaData/imageOrientationUtil', () => ({
  ...jest.requireActual<Object>('../../imageMetaData/imageOrientationUtil'),
  isRotated: jest.fn<
    ReturnType<typeof isRotated>,
    Parameters<typeof isRotated>
  >((orientation) => mockIsRotated(orientation)),
}));

describe('MediaImage', () => {
  const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
  const dimensionsMap = {
    isImageMoreLandscapyThanContainer: [
      [2000, 1000],
      [500, 500],
    ],
    isImageMorePortraityThanContainer: [
      [100, 200],
      [500, 500],
    ],
  };
  const defaultTransform = {
    transform: 'translate(-50%, -50%)',
  };
  let onImageLoad: jest.Mock<any>;
  let onImageError: jest.Mock<any>;

  const mockImageTag = (
    component: ReactWrapper<MediaImageProps, MediaImageState>,
    imageDimentions: number[],
    containerDimentions: number[],
    loadImageImmediately: boolean,
  ) => {
    Element.prototype.getBoundingClientRect = () =>
      ({
        width: containerDimentions[0],
        height: containerDimentions[1],
      } as any);
    const img = component.find('img');
    const imgInstance = img.instance();
    Object.defineProperty(imgInstance, 'naturalHeight', {
      value: imageDimentions[1],
    });
    Object.defineProperty(imgInstance, 'naturalWidth', {
      value: imageDimentions[0],
    });
    if (loadImageImmediately) {
      img.simulate('load');
    }
  };

  const setup = (params: SetupParams) => {
    const {
      isCoverStrategy,
      isImageMoreLandscapyThanContainer,
      isStretchingProhibited,
      loadImageImmediately = true,
      previewOrientation,
      altText,
    } = params;
    const [imageDimentions, containerDimentions] = dimensionsMap[
      isImageMoreLandscapyThanContainer
        ? 'isImageMoreLandscapyThanContainer'
        : 'isImageMorePortraityThanContainer'
    ];

    const component = mount<MediaImageProps, MediaImageState>(
      <MediaImage
        dataURI="data:image/png;base64,"
        stretch={!isStretchingProhibited}
        crop={isCoverStrategy}
        previewOrientation={previewOrientation}
        onImageLoad={onImageLoad}
        onImageError={onImageError}
        crossOrigin={'anonymous'}
        alt={altText}
      />,
    );
    mockImageTag(
      component,
      imageDimentions,
      containerDimentions,
      loadImageImmediately,
    );

    return component.find(ImageComponent);
  };

  beforeEach(() => {
    onImageLoad = jest.fn();
    onImageError = jest.fn();
    mockIsRotated = jest.requireActual(
      '../../imageMetaData/imageOrientationUtil',
    ).isRotated;
  });

  afterAll(() => {
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    jest.resetAllMocks();
  });

  describe("when image hasn't been loaded yet", () => {
    it('should not show image yet with cover strategy', () => {
      const component = setup({
        isCoverStrategy: true,
        isImageMoreLandscapyThanContainer: true,
        isStretchingProhibited: true,
        loadImageImmediately: false,
      });
      expect(component.props().style).toEqual(
        expect.objectContaining({
          display: 'none',
        }),
      );
    });
    it('should show image right away with fit strategy', () => {
      const component = setup({
        isCoverStrategy: false,
        isImageMoreLandscapyThanContainer: true,
        isStretchingProhibited: true,
        loadImageImmediately: false,
      });
      expect(component.props().style).not.toEqual(
        expect.objectContaining({
          display: 'none',
        }),
      );
    });
  });

  describe('when image loaded correctly', () => {
    it('should call onImageLoad', () => {
      setup({
        isCoverStrategy: true,
        isImageMoreLandscapyThanContainer: true,
        isStretchingProhibited: true,
      });
      expect(onImageLoad).toHaveBeenCalled();
    });

    it('should set crossOrigin', () => {
      const component = setup({
        isCoverStrategy: true,
        isImageMoreLandscapyThanContainer: true,
        isStretchingProhibited: true,
      });

      const { crossOrigin } = component.find('img').props();
      expect(crossOrigin).toBe('anonymous');
    });

    describe('alt prop is not provided', () => {
      it('should render img tag without alt-text attribute', () => {
        const component = setup({
          isCoverStrategy: true,
          isImageMoreLandscapyThanContainer: true,
          isStretchingProhibited: true,
        });

        const { alt } = component.find('img').props();
        expect(alt).toBe('');
      });
    });

    describe('alt prop is provided', () => {
      it('should render img tag with alt-text attribute', () => {
        const component = setup({
          isCoverStrategy: true,
          isImageMoreLandscapyThanContainer: true,
          isStretchingProhibited: true,
          altText: 'this is an alt text',
        });

        const { alt } = component.find('img').props();
        expect(alt).toBe('this is an alt text');
      });
    });
  });

  describe('when image loaded with an error', () => {
    it('should call onImageLoad', () => {
      const component = setup({
        isCoverStrategy: true,
        isImageMoreLandscapyThanContainer: true,
        isStretchingProhibited: true,
      });
      component.find('img').props().onError!('some-error' as any);
      expect(onImageError).toHaveBeenCalled();
    });
  });

  describe('when image is more landscapy than container', () => {
    describe('when image is smaller than container', () => {
      it('should have right style for cover strategy', () => {
        const component = setup({
          isCoverStrategy: true,
          isImageMoreLandscapyThanContainer: true,
          isStretchingProhibited: true,
        });
        expect(component.props().style).toEqual({
          maxHeight: '100%',
          ...defaultTransform,
        });
      });
      it('should have right style for fit strategy', () => {
        const component = setup({
          isCoverStrategy: false,
          isImageMoreLandscapyThanContainer: true,
          isStretchingProhibited: true,
        });
        expect(component.props().style).toEqual({
          maxWidth: '100%',
          maxHeight: '100%',
          ...defaultTransform,
        });
      });
    });

    describe('when image is bigger than container', () => {
      it('should have right style for cover strategy', () => {
        const component = setup({
          isCoverStrategy: true,
          isImageMoreLandscapyThanContainer: true,
          isStretchingProhibited: false,
        });
        expect(component.props().style).toEqual({
          height: '100%',
          ...defaultTransform,
        });
      });
      it('should have right style for fit strategy', () => {
        const component = setup({
          isCoverStrategy: false,
          isImageMoreLandscapyThanContainer: true,
          isStretchingProhibited: false,
        });
        expect(component.props().style).toEqual({
          width: '100%',
          ...defaultTransform,
        });
      });
    });

    describe('when image is rotated', () => {
      it('should choose appropriate width when cover strategy chosen', () => {
        mockIsRotated = jest.fn().mockReturnValue(true);

        const component = mount<MediaImageProps, MediaImageState>(
          <MediaImage
            dataURI="data:image/png;base64,"
            stretch={true}
            crop={true}
            previewOrientation={6}
          />,
        );

        mockImageTag(component, [1000, 750], [100, 75], true);
        expectToEqual(
          component.find(ImageComponent).prop('style')!.width,
          '134%',
        );
      });

      it('should choose appropriate height when fit strategy chosen', () => {
        mockIsRotated = jest.fn().mockReturnValue(true);

        const component = mount<MediaImageProps, MediaImageState>(
          <MediaImage
            dataURI="data:image/png;base64,"
            stretch={true}
            crop={false}
            previewOrientation={6}
          />,
        );

        mockImageTag(component, [1000, 750], [100, 75], true);
        expectToEqual(
          component.find(ImageComponent).prop('style')!.height,
          '134%',
        );
      });
    });
  });

  describe('when image is more portraity than container', () => {
    describe('when image is smaller than container', () => {
      it('should have right style for cover strategy', () => {
        const component = setup({
          isCoverStrategy: true,
          isImageMoreLandscapyThanContainer: false,
          isStretchingProhibited: true,
        });
        expect(component.props().style).toEqual({
          maxWidth: '100%',
          ...defaultTransform,
        });
      });
      it('should have right style for fit strategy', () => {
        const component = setup({
          isCoverStrategy: false,
          isImageMoreLandscapyThanContainer: false,
          isStretchingProhibited: true,
        });
        expect(component.props().style).toEqual({
          maxWidth: '100%',
          maxHeight: '100%',
          ...defaultTransform,
        });
      });
    });
    describe('when image is bigger than container', () => {
      it('should have right style for cover strategy', () => {
        const component = setup({
          isCoverStrategy: true,
          isImageMoreLandscapyThanContainer: false,
          isStretchingProhibited: false,
        });
        expect(component.props().style).toEqual({
          width: '100%',
          ...defaultTransform,
        });
      });
      it('should have right style for fit strategy', () => {
        const component = setup({
          isCoverStrategy: false,
          isImageMoreLandscapyThanContainer: false,
          isStretchingProhibited: false,
        });
        expect(component.props().style).toEqual({
          height: '100%',
          ...defaultTransform,
        });
      });
    });

    describe('when image is rotated', () => {
      it('should do nothing if orientation is 1', () => {
        const component = setup({
          isCoverStrategy: false,
          isImageMoreLandscapyThanContainer: false,
          isStretchingProhibited: false,
          loadImageImmediately: true,
          previewOrientation: 1,
        });

        expect(component.prop('style')!.transform).toEqual(
          defaultTransform.transform,
        );
      });

      it('should rotate the image and revert width and height when image is rotated 90deg', async () => {
        mockIsRotated = jest.fn().mockReturnValue(true);

        const component = mount<MediaImageProps, MediaImageState>(
          <MediaImage
            dataURI="data:image/png;base64,"
            stretch={true}
            crop={false}
            previewOrientation={6}
          />,
        );

        await nextTick();
        await nextTick();
        await nextTick();

        mockImageTag(component, [1000, 750], [75, 100], true);
        expectToEqual(component.find(ImageComponent).prop('style'), {
          ...defaultTransform,
          height: '134%',
          transform: 'translate(-50%, -50%) rotate(90deg)',
        });
      });

      it('should choose appropriate width when cover strategy chosen', () => {
        mockIsRotated = jest.fn().mockReturnValue(true);

        const component = mount<MediaImageProps, MediaImageState>(
          <MediaImage
            dataURI="data:image/png;base64,"
            stretch={true}
            crop={true}
            previewOrientation={6}
          />,
        );

        mockImageTag(component, [1000, 750], [75, 100], true);
        expectToEqual(
          component.find(ImageComponent).prop('style')!.width,
          '134%',
        );
      });
    });
  });
});
