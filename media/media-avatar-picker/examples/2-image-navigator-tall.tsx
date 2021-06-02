// eslint-disable-line no-console
import React from 'react';
import { IntlProvider } from 'react-intl';
import { tallImage } from '@atlaskit/media-test-helpers';
import ImageNavigator from '../src/image-navigator';

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
      <h1>Local tall image</h1>
      <ImageNavigator
        imageSource={tallImage}
        onLoad={onLoad}
        onRemoveImage={() => console.log('onRemoveImage')}
        onImageError={(errorMessage) =>
          console.log('onImageError', errorMessage)
        }
        onImageLoaded={(file) => console.log('onImageLoaded', file)}
        onImageUploaded={(file) => console.log('onImageLoaded', file)}
      />
      <button onClick={exportImage}>Export</button>
      <img
        style={{ position: 'absolute', top: 0, left: '300px' }}
        src=""
        alt=""
        ref={handleImgRef}
      />
    </div>
  </IntlProvider>
);
