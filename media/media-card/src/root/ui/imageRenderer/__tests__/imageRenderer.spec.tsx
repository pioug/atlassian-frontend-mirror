import React from 'react';
import { shallow, mount } from 'enzyme';
import {
  ImageRenderer,
  ImageRendererBase,
  resizeModeToMediaImageProps,
} from '../imageRenderer';
import { MediaType } from '@atlaskit/media-client';
import { MediaImage } from '@atlaskit/media-ui';

const onDisplayImage = jest.fn();
const nonImageMediaTypes: MediaType[] = ['video', 'audio', 'doc', 'unknown'];

describe('ImageRenderer', () => {
  beforeEach(() => {
    onDisplayImage.mockClear();
  });

  it('should render ImageRendererBase and MediaImage with props', () => {
    const mediaType = 'image';
    const dataURI = 'some-data';
    const resizeMode = 'stretchy-fit';
    const previewOrientation = 6;
    const alt = 'this is a test';
    const component = mount(
      <ImageRenderer
        mediaType={mediaType}
        dataURI={dataURI}
        resizeMode={resizeMode}
        previewOrientation={previewOrientation}
        alt={alt}
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
      <ImageRendererBase
        mediaType="image"
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

  it('Should fire failed event and run the callback onImageError when dataURI fails to load', () => {
    const onImageErrorProp = jest.fn();
    const fire = jest.fn();
    const createAnalyticsEvent = jest.fn().mockReturnValue({ fire });
    const component = shallow(
      <ImageRendererBase
        mediaType="image"
        dataURI="some-data"
        resizeMode="stretchy-fit"
        previewOrientation={6}
        alt="this is a test"
        createAnalyticsEvent={createAnalyticsEvent}
        onImageError={onImageErrorProp}
      />,
    );
    const mediaImage = component.find(MediaImage);
    expect(mediaImage).toHaveLength(1);
    const onImageErrorMediaImage = mediaImage.prop('onImageError');
    expect(onImageErrorMediaImage).toBeInstanceOf(Function);
    onImageErrorMediaImage!();
    expect(createAnalyticsEvent).toBeCalledTimes(1);
    expect(createAnalyticsEvent).toBeCalledWith(
      expect.objectContaining({ action: 'failed' }),
    );
    expect(fire).toBeCalledTimes(1);
    expect(onImageErrorProp).toBeCalledTimes(1);
  });

  it('should call onDisplayImage once', () => {
    const card = mount(
      <ImageRenderer
        mediaType="image"
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
        <ImageRenderer
          mediaType={mediaType}
          dataURI="some-data"
          onDisplayImage={onDisplayImage}
        />,
      );
      expect(onDisplayImage).toHaveBeenCalledTimes(0);
    });
  });
});
