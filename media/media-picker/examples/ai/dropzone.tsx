import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import type { MediaClientConfig } from '@atlaskit/media-core/auth';
import { BrowserLoader as Browser } from '@atlaskit/media-picker/browser';
import { DropzoneLoader as Dropzone } from '@atlaskit/media-picker/dropzone';
import type { UploadEndEventPayload, UploadsStartEventPayload } from '@atlaskit/media-picker/types';

export default function DropzoneUploadExample({
	mediaClientConfig,
}: {
	mediaClientConfig: MediaClientConfig;
}): React.JSX.Element {
	const [container, setContainer] = useState<HTMLDivElement | null>(null);
	const [browse, setBrowse] = useState<() => void>(() => () => {});
	const [status, setStatus] = useState('Drop an image here, or choose a file');
	const onUploadsStart = ({ files }: UploadsStartEventPayload) =>
		setStatus(`${files.length} file${files.length === 1 ? '' : 's'} uploading`);
	const onEnd = ({ file }: UploadEndEventPayload) => setStatus(`${file.name} uploaded`);
	const onError = () => setStatus('Upload failed. Choose the file again to retry.');
	return (
		<div>
			<div ref={setContainer} role="group" aria-label="Upload images by dropping files here">
				Drop PNG or JPEG files here.
				{container && (
					<Dropzone
						mediaClientConfig={mediaClientConfig}
						config={{ container, uploadParams: { collection: 'example-uploads' } }}
						onUploadsStart={onUploadsStart}
						onEnd={onEnd}
						onError={onError}
					/>
				)}
			</div>
			<Browser
				mediaClientConfig={mediaClientConfig}
				config={{
					uploadParams: { collection: 'example-uploads' },
					fileExtensions: ['image/png', 'image/jpeg'],
				}}
				onBrowseFn={(openPicker) => setBrowse(() => openPicker)}
				onUploadsStart={onUploadsStart}
				onEnd={onEnd}
				onError={onError}
			/>
			<Button onClick={() => browse()}>Choose files</Button>
			<p role="status" aria-live="polite">
				{status}
			</p>
		</div>
	);
}
