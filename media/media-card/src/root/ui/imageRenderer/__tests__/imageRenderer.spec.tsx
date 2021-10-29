import React from 'react';
import { mount } from 'enzyme';
import { ImageRenderer } from '../imageRenderer';
import { resizeModeToMediaImageProps } from '../../../../utils/resizeModeToMediaImageProps';
import { MediaType } from '@atlaskit/media-client';
import { MediaImage } from '@atlaskit/media-ui';

const nonImageMediaTypes: MediaType[] = ['video', 'audio', 'doc', 'unknown'];

describe('ImageRenderer', () => {
  it('should render MediaImage with props', () => {
    const mediaType = 'image';
    const mediaItemType = 'file';
    const dataURI = 'some-data';
    const resizeMode = 'stretchy-fit';
    const previewOrientation = 6;
    const alt = 'this is a test';
    const onImageLoad = jest.fn();
    const onImageError = jest.fn();
    const component = mount(
      <ImageRenderer
        mediaType={mediaType}
        mediaItemType={mediaItemType}
        dataURI={dataURI}
        resizeMode={resizeMode}
        previewOrientation={previewOrientation}
        alt={alt}
        onImageLoad={onImageLoad}
        onImageError={onImageError}
      />,
    );

    const mediaImage = component.find(MediaImage);
    expect(mediaImage).toHaveLength(1);
    expect(mediaImage.props()).toMatchObject({
      dataURI,
      previewOrientation,
      alt,
      onImageLoad,
      onImageError,
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

  it('should call onDisplayImage once', () => {
    const onDisplayImage = jest.fn();
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

  it.each(nonImageMediaTypes)(
    `should not call onDisplayImage when mediaType is %s`,
    (mediaType) => {
      const onDisplayImage = jest.fn();
      mount(
        <ImageRenderer
          mediaType={mediaType}
          mediaItemType="file"
          dataURI="some-data"
          onDisplayImage={onDisplayImage}
        />,
      );
      expect(onDisplayImage).toHaveBeenCalledTimes(0);
    },
  );
});
