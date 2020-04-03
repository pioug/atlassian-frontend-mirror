/* eslint-disable no-console */
import React from 'react';
import { IntlProvider } from 'react-intl';
import ImageCropper from '../src/image-cropper';
import { tallImage } from '@atlaskit/media-test-helpers';

const naturalWidth = 5360;

const onImageLoaded = (img: HTMLImageElement) =>
  console.log('onImageLoaded', img.naturalWidth, img.naturalHeight);
const onRemoveImage = () => console.log('onRemoveImage');
const onImageError = (errorMessage: string) =>
  console.log('onImageError', errorMessage);

export default () => (
  <IntlProvider locale="en">
    <div>
      <div>
        <h1>default</h1>
        <ImageCropper
          imageOrientation={1}
          imageSource={tallImage}
          imageWidth={naturalWidth}
          top={-80}
          left={-80}
          onDragStarted={() => console.log('DragStarted')}
          onImageLoaded={onImageLoaded}
          onRemoveImage={onRemoveImage}
          onImageError={onImageError}
        />
      </div>
      <div>
        <h1>when image width is not set</h1>
        <ImageCropper
          imageOrientation={1}
          imageSource={tallImage}
          top={-50}
          left={-115}
          onImageLoaded={onImageLoaded}
          onRemoveImage={onRemoveImage}
          onImageError={onImageError}
        />
      </div>
      <div>
        <h1>with custom container size</h1>
        <ImageCropper
          imageOrientation={1}
          imageSource={tallImage}
          imageWidth={naturalWidth}
          onImageLoaded={onImageLoaded}
          top={-50}
          left={-115}
          containerSize={400}
          onRemoveImage={onRemoveImage}
          onImageError={onImageError}
        />
      </div>
      <div>
        <h1>with circular mask</h1>
        <ImageCropper
          imageOrientation={1}
          imageSource={tallImage}
          imageWidth={naturalWidth}
          top={-70}
          left={-90}
          isCircularMask={true}
          onImageLoaded={onImageLoaded}
          onRemoveImage={onRemoveImage}
          onImageError={onImageError}
        />
      </div>
    </div>
  </IntlProvider>
);
