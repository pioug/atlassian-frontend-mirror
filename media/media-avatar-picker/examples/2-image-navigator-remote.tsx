// eslint-disable-line no-console
import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { remoteImage } from '@atlaskit/media-test-helpers';
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

export default (): React.JSX.Element => (
	<IntlProvider locale="en">
		<div>
			<h1>Remote image</h1>
			<ImageNavigator
				imageSource={remoteImage}
				onImageLoaded={(file: any) => console.log('onImageLoaded', file)}
				onRemoveImage={() => console.log('onRemoveImage')}
				onImageError={(errorMessage: any) => console.log('onImageError', errorMessage)}
				onLoad={onLoad}
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
