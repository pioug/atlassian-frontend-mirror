import React, { useState } from 'react';

import { IntlProvider } from 'react-intl';

import ImageNavigator from '@atlaskit/media-avatar-picker/image-navigator';
import type { LoadParameters } from '@atlaskit/media-avatar-picker/image-navigator';
import Slider from '@atlaskit/media-avatar-picker/slider';

export default function ImageNavigatorExample(): React.JSX.Element {
	const [status, setStatus] = useState('Upload an image to begin editing.');
	const [exportImage, setExportImage] = useState<LoadParameters['export']>();
	const [preview, setPreview] = useState<string>();
	const [zoom, setZoom] = useState(50);

	return (
		<IntlProvider locale="en">
			<section aria-labelledby="navigator-heading">
				<h2 id="navigator-heading">Edit a profile image</h2>
				<ImageNavigator
					onImageLoaded={(file) => setStatus(`Loaded ${file.name || 'image'}.`)}
					onImageUploaded={(file) => setStatus(`Selected ${file.name || 'image'} for editing.`)}
					onImageError={(message) => setStatus(message)}
					onRemoveImage={() => {
						setStatus('Image removed. Upload another image to continue.');
						setExportImage(undefined);
						setPreview(undefined);
					}}
					onLoad={(parameters) => setExportImage(() => parameters.export)}
				/>
				<p role="status">{status}</p>
				<button
					type="button"
					disabled={!exportImage}
					onClick={() => exportImage && setPreview(exportImage())}
				>
					Preview cropped image
				</button>
				{preview && <img src={preview} alt="Cropped profile preview" />}
				<h3>Standalone zoom control</h3>
				<Slider value={zoom} onChange={setZoom} />
				<p>Zoom: {zoom}%</p>
			</section>
		</IntlProvider>
	);
}
