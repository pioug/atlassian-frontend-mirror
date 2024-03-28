// eslint-disable-line no-console
import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { smallImage } from '@atlaskit/media-test-helpers';
import ImageNavigator from '../src/image-navigator';
import { token } from '@atlaskit/tokens';

let onLoadParams: any;
let imageElement: any;

const onLoad = (params: any) => {
  onLoadParams = params;
};

const exportImage = () => {
  const imageData = onLoadParams.export();

  imageElement.src = imageData;
};

function handleImgRef(img: any) {
  imageElement = img;
}

export default () => (
  <IntlProvider locale="en">
    <div>
      <h1>Local small image</h1>
      <ImageNavigator
        imageSource={smallImage}
        onLoad={onLoad}
        onRemoveImage={() => console.log('onRemoveImage')}
        onImageError={(errorMessage: any) =>
          console.log('onImageError', errorMessage)
        }
        onImageLoaded={(file: any) => console.log('onImageLoaded', file)}
        onImageUploaded={(file: any) => console.log('onImageLoaded', file)}
      />
      <button onClick={exportImage}>Export</button>
    </div>
    <img
      style={{ marginTop: token('space.100', '8px') }}
      src=""
      alt=""
      ref={handleImgRef}
    />
  </IntlProvider>
);
