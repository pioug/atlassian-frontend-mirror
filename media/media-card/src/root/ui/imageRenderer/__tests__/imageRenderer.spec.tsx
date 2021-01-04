import React from 'react';
import { shallow, mount, ShallowWrapper } from 'enzyme';
import {
  ImageRenderer,
  ImageRendererWithoutAnalytics,
  resizeModeToMediaImageProps,
} from '../imageRenderer';
import { MediaType, MediaItemType } from '@atlaskit/media-client';
import { MediaImage } from '@atlaskit/media-ui';
import { AnalyticsLoadingFailReason } from '../../../../utils/analytics';

const onDisplayImage = jest.fn();
const nonImageMediaTypes: MediaType[] = ['video', 'audio', 'doc', 'unknown'];

describe('ImageRenderer', () => {
  beforeEach(() => {
    onDisplayImage.mockClear();
  });

  it('should render ImageRendererBase and MediaImage with props', () => {
    const mediaType = 'image';
    const mediaItemType = 'file';
    const dataURI = 'some-data';
    const resizeMode = 'stretchy-fit';
    const previewOrientation = 6;
    const alt = 'this is a test';
    const component = mount(
      <ImageRenderer
        mediaType={mediaType}
        mediaItemType={mediaItemType}
        dataURI={dataURI}
        resizeMode={resizeMode}
        previewOrientation={previewOrientation}
        alt={alt}
      />,
    );

    expect(component.find(ImageRendererWithoutAnalytics)).toHaveLength(1);
    const mediaImage = component.find(MediaImage);
    expect(mediaImage).toHaveLength(1);
    expect(mediaImage.props()).toMatchObject({
      dataURI,
      previewOrientation,
      alt,
      onImageLoad: expect.any(Function),
      onImageError: expect.any(Function),
      ...resizeModeToMediaImageProps(resizeMode),
    });
  });

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

  it('Should fire succeeded event on image load', () => {
    const fire = jest.fn();
    const createAnalyticsEvent = jest.fn().mockReturnValue({ fire });
    const component = shallow(
      <ImageRendererWithoutAnalytics
        mediaType="image"
        mediaItemType="file"
        dataURI="some-data"
        resizeMode="stretchy-fit"
        previewOrientation={6}
        alt="this is a test"
        createAnalyticsEvent={createAnalyticsEvent}
      />,
    );
    const mediaImage = component.find(MediaImage);
    expect(mediaImage).toHaveLength(1);
    const onImageLoad = mediaImage.prop('onImageLoad');
    expect(onImageLoad).toBeInstanceOf(Function);
    onImageLoad!(document.createElement('img'));
    expect(createAnalyticsEvent).toBeCalledTimes(1);
    expect(createAnalyticsEvent).toBeCalledWith(
      expect.objectContaining({ action: 'succeeded' }),
    );
    expect(fire).toBeCalledTimes(1);
  });

  describe('onImageError', () => {
    const shallowImageRenderer = (mediaItemType: MediaItemType = 'file') => {
      const onImageErrorProp = jest.fn();
      const fire = jest.fn();
      const createAnalyticsEvent = jest.fn().mockReturnValue({ fire });
      const component = shallow(
        <ImageRendererWithoutAnalytics
          mediaType="image"
          mediaItemType={mediaItemType}
          dataURI="some-data"
          resizeMode="stretchy-fit"
          previewOrientation={6}
          alt="this is a test"
          createAnalyticsEvent={createAnalyticsEvent}
          onImageError={onImageErrorProp}
        />,
      );
      return { component, onImageErrorProp, createAnalyticsEvent, fire };
    };

    const triggerError = (
      shallowedComponent: ShallowWrapper<
        any,
        Readonly<{}>,
        React.Component<{}, {}, any>
      >,
    ) => {
      const mediaImage = shallowedComponent.find(MediaImage);
      const onImageErrorMediaImage = mediaImage.prop('onImageError');
      if (!onImageErrorMediaImage) {
        throw new Error('onImageError MediaImage prop is not defined');
      }
      onImageErrorMediaImage();
    };

    it('Should run callback when dataURI fails to load', () => {
      const { component, onImageErrorProp } = shallowImageRenderer();
      triggerError(component);
      expect(onImageErrorProp).toBeCalledTimes(1);
    });

    it('Should fire failed event when file dataURI fails to load', () => {
      const { component, createAnalyticsEvent, fire } = shallowImageRenderer();
      triggerError(component);
      expect(createAnalyticsEvent).toBeCalledTimes(1);
      expect(createAnalyticsEvent).toBeCalledWith(
        expect.objectContaining({
          action: 'failed',
          attributes: expect.objectContaining({
            failReason: AnalyticsLoadingFailReason.FILE_URI,
          }),
        }),
      );
      expect(fire).toBeCalledTimes(1);
    });

    it('Should fire failed event when dataURI fails to load', () => {
      const { component, createAnalyticsEvent, fire } = shallowImageRenderer(
        'external-image',
      );
      triggerError(component);
      expect(createAnalyticsEvent).toBeCalledTimes(1);
      expect(createAnalyticsEvent).toBeCalledWith(
        expect.objectContaining({
          action: 'failed',
          attributes: expect.objectContaining({
            failReason: AnalyticsLoadingFailReason.EXTERNAL_FILE_URI,
          }),
        }),
      );
      expect(fire).toBeCalledTimes(1);
    });
  });

  it('should call onDisplayImage once', () => {
    const card = mount(
      <ImageRenderer
        mediaType="image"
        mediaItemType="file"
        dataURI="some-data"
        onDisplayImage={onDisplayImage}
      />,
    );
    expect(onDisplayImage).toHaveBeenCalledTimes(1);
    card.update();
    expect(onDisplayImage).toHaveBeenCalledTimes(1);
  });

  nonImageMediaTypes.forEach(mediaType => {
    it(`should not call onDisplayImage when mediaType is ${mediaType}`, () => {
      shallow(
        <ImageRendererWithoutAnalytics
          mediaType={mediaType}
          mediaItemType="file"
          dataURI="some-data"
          onDisplayImage={onDisplayImage}
        />,
      );
      expect(onDisplayImage).toHaveBeenCalledTimes(0);
    });
  });
});
