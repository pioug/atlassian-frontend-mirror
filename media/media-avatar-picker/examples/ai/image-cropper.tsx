import React, { useState } from 'react';

import { IntlProvider } from 'react-intl';

import ImageCropper from '@atlaskit/media-avatar-picker/image-cropper';

type ImageCropperExampleProps = {
	imageSource: string;
};

export default function ImageCropperExample({
	imageSource,
}: ImageCropperExampleProps): React.JSX.Element {
	const [status, setStatus] = useState('Adjust the image, then save or remove it.');

	return (
		<IntlProvider locale="en">
			<section aria-labelledby="cropper-heading">
				<h2 id="cropper-heading">Crop a profile image</h2>
				<ImageCropper
					imageSource={imageSource}
					imageOrientation={1}
					top={0}
					left={0}
					onImageLoaded={(image) => setStatus(`Image loaded at ${image.naturalWidth} pixels wide.`)}
					onRemoveImage={() => setStatus('Image removed. Choose another image in the host flow.')}
					onImageError={(message) => setStatus(message)}
				/>
				<p role="status">{status}</p>
			</section>
		</IntlProvider>
	);
}
