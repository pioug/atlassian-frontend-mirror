import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import type { MediaClientConfig } from '@atlaskit/media-core/auth';
import { BrowserLoader as Browser } from '@atlaskit/media-picker/browser';
import { ClipboardLoader as Clipboard } from '@atlaskit/media-picker/clipboard';
import TextArea from '@atlaskit/textarea/text-area';

export default function ClipboardUploadExample({
	mediaClientConfig,
}: {
	mediaClientConfig: MediaClientConfig;
}): React.JSX.Element {
	const [container, setContainer] = useState<HTMLDivElement | null>(null);
	const [browse, setBrowse] = useState<() => void>(() => () => {});
	const [status, setStatus] = useState('Focus the paste area or choose a file');
	return (
		<div>
			<div ref={setContainer}>
				<TextArea
					aria-label="Paste an image to upload"
					placeholder="Paste PNG or JPEG files here.
			"
				/>
			</div>
			{container && (
				<Clipboard
					mediaClientConfig={mediaClientConfig}
					config={{ container, uploadParams: { collection: 'example-uploads' } }}
					onUploadsStart={({ files }) =>
						setStatus(`${files.length} file${files.length === 1 ? '' : 's'} uploading`)
					}
					onEnd={({ file }) => setStatus(`${file.name} uploaded`)}
					onError={() => setStatus('Upload failed. Try the file again.')}
				/>
			)}
			<Browser
				mediaClientConfig={mediaClientConfig}
				config={{
					uploadParams: { collection: 'example-uploads' },
					fileExtensions: ['image/png', 'image/jpeg'],
				}}
				onBrowseFn={(openPicker) => setBrowse(() => openPicker)}
				onUploadsStart={({ files }) =>
					setStatus(`${files.length} file${files.length === 1 ? '' : 's'} uploading`)
				}
				onEnd={({ file }) => setStatus(`${file.name} uploaded`)}
				onError={() => setStatus('Upload failed. Choose the file again to retry.')}
			/>
			<Button onClick={() => browse()}>Choose files</Button>
			<p role="status" aria-live="polite">
				{status}
			</p>
		</div>
	);
}
