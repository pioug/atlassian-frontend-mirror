import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import type { MediaClientConfig } from '@atlaskit/media-core/auth';
import { BrowserLoader as Browser } from '@atlaskit/media-picker/browser';

export default function BrowserUploadExample({
	mediaClientConfig,
}: {
	mediaClientConfig: MediaClientConfig;
}): React.JSX.Element {
	const [browse, setBrowse] = useState<() => void>(() => () => {});
	const [status, setStatus] = useState('No files selected');
	return (
		<div>
			<Button onClick={() => browse()}>Choose files</Button>
			<Browser
				mediaClientConfig={mediaClientConfig}
				config={{
					multiple: true,
					fileExtensions: ['image/png', 'image/jpeg'],
					uploadParams: { collection: 'example-uploads' },
				}}
				onBrowseFn={(openPicker) => setBrowse(() => openPicker)}
				onUploadsStart={({ files }) =>
					setStatus(`${files.length} file${files.length === 1 ? '' : 's'} uploading`)
				}
				onEnd={({ file }) => setStatus(`${file.name} uploaded`)}
				onError={() => setStatus('Upload failed. Choose the file again to retry.')}
			/>
			<p role="status">{status}</p>
		</div>
	);
}
