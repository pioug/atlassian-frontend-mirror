// eslint-disable-line no-console
import React from 'react';
import { IntlProvider } from 'react-intl-next';
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
      <h1>Uploader</h1>
      <ImageNavigator
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
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
      style={{ marginTop: token('space.100', '8px') }}
      src=""
      alt=""
      ref={handleImgRef}
    />
  </IntlProvider>
);
