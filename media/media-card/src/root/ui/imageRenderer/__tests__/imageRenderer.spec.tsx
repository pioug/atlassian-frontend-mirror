import React from 'react';
import { shallow, mount, ShallowWrapper } from 'enzyme';
import { ImageRenderer, ImageRendererBase } from '../imageRenderer';
import { resizeModeToMediaImageProps } from '../../../../utils/resizeModeToMediaImageProps';
import { MediaType, MediaItemType } from '@atlaskit/media-client';
import { FileAttributes } from '@atlaskit/media-common';
import { MediaImage } from '@atlaskit/media-ui';

const onDisplayImage = jest.fn();
const nonImageMediaTypes: MediaType[] = ['video', 'audio', 'doc', 'unknown'];

describe('ImageRenderer', () => {
  beforeAll(() => {
    jest.spyOn(performance, 'now').mockReturnValue(1000);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

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
        timeElapsedTillCommenced={100}
      />,
    );

    expect(component.find(ImageRendererBase)).toHaveLength(1);
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

  it('Should fire succeeded event on image load', () => {
    const fileAttributes: FileAttributes = {
      fileId: 'some-id',
      fileSize: 10,
      fileMediatype: 'image',
      fileMimetype: 'image/png',
      fileStatus: 'processed',
    };

    const fire = jest.fn();
    const createAnalyticsEvent = jest.fn().mockReturnValue({ fire });
    const component = shallow(
      <ImageRendererBase
        mediaType="image"
        mediaItemType="file"
        dataURI="some-data"
        resizeMode="stretchy-fit"
        previewOrientation={6}
        alt="this is a test"
        createAnalyticsEvent={createAnalyticsEvent}
        fileAttributes={fileAttributes} // This is needed to fire the event
        timeElapsedTillCommenced={100}
      />,
    );
    const mediaImage = component.find(MediaImage);
    expect(mediaImage).toHaveLength(1);
    const onImageLoad = mediaImage.prop('onImageLoad');
    expect(onImageLoad).toBeInstanceOf(Function);
    onImageLoad!(document.createElement('img'));
    expect(createAnalyticsEvent).toBeCalledTimes(1);
    expect(createAnalyticsEvent).toBeCalledWith(
      expect.objectContaining({
        action: 'succeeded',
        attributes: expect.objectContaining({
          performanceAttributes: {
            overall: {
              durationSincePageStart: 1000,
              durationSinceCommenced: 900,
            },
          },
        }),
      }),
    );
    expect(fire).toBeCalledTimes(1);
  });

  describe('onImageError', () => {
    const fileAttributes: FileAttributes = {
      fileId: 'some-id',
      fileSize: 10,
      fileMediatype: 'image',
      fileMimetype: 'image/png',
      fileStatus: 'processed',
    };

    const shallowImageRenderer = (
      mediaItemType: MediaItemType = 'file',
      overrideFileAttributes: Partial<FileAttributes> = {},
    ) => {
      const onImageErrorProp = jest.fn();
      const fire = jest.fn();
      const createAnalyticsEvent = jest.fn().mockReturnValue({ fire });
      const component = shallow(
        <ImageRendererBase
          mediaType="image"
          mediaItemType={mediaItemType}
          dataURI="some-data"
          resizeMode="stretchy-fit"
          previewOrientation={6}
          alt="this is a test"
          createAnalyticsEvent={createAnalyticsEvent}
          onImageError={onImageErrorProp}
          fileAttributes={{ ...fileAttributes, ...overrideFileAttributes }} // This is needed to fire analytics events
          timeElapsedTillCommenced={100}
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

    it('Should fire failed event when remote preview dataURI fails to load', () => {
      const { component, createAnalyticsEvent, fire } = shallowImageRenderer();
      triggerError(component);
      expect(createAnalyticsEvent).toBeCalledTimes(1);
      expect(createAnalyticsEvent).toBeCalledWith(
        expect.objectContaining({
          action: 'failed',
          attributes: expect.objectContaining({
            failReason: 'remote-uri',
            performanceAttributes: {
              overall: {
                durationSincePageStart: 1000,
                durationSinceCommenced: 900,
              },
            },
          }),
        }),
      );
      expect(fire).toBeCalledTimes(1);
    });

    it('Should fire failed event when local preview dataURI fails to load', () => {
      // We pass 'uploading' file status as the withFileAttributes HOC would pass it
      const {
        component,
        createAnalyticsEvent,
        fire,
      } = shallowImageRenderer(undefined, { fileStatus: 'uploading' });
      triggerError(component);
      expect(createAnalyticsEvent).toBeCalledTimes(1);
      expect(createAnalyticsEvent).toBeCalledWith(
        expect.objectContaining({
          action: 'failed',
          attributes: expect.objectContaining({
            failReason: 'local-uri',
            performanceAttributes: {
              overall: {
                durationSincePageStart: 1000,
                durationSinceCommenced: 900,
              },
            },
          }),
        }),
      );
      expect(fire).toBeCalledTimes(1);
    });

    it('Should fire failed event when external image dataURI fails to load', () => {
      const { component, createAnalyticsEvent, fire } = shallowImageRenderer(
        'external-image',
      );
      triggerError(component);
      expect(createAnalyticsEvent).toBeCalledTimes(1);
      expect(createAnalyticsEvent).toBeCalledWith(
        expect.objectContaining({
          action: 'failed',
          attributes: expect.objectContaining({
            failReason: 'external-uri',
            performanceAttributes: {
              overall: {
                durationSincePageStart: expect.any(Number),
                durationSinceCommenced: expect.any(Number),
              },
            },
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
        timeElapsedTillCommenced={100}
      />,
    );
    expect(onDisplayImage).toHaveBeenCalledTimes(1);
    card.update();
    expect(onDisplayImage).toHaveBeenCalledTimes(1);
  });

  nonImageMediaTypes.forEach((mediaType) => {
    it(`should not call onDisplayImage when mediaType is ${mediaType}`, () => {
      shallow(
        <ImageRendererBase
          mediaType={mediaType}
          mediaItemType="file"
          dataURI="some-data"
          onDisplayImage={onDisplayImage}
          timeElapsedTillCommenced={100}
        />,
      );
      expect(onDisplayImage).toHaveBeenCalledTimes(0);
    });
  });
});
