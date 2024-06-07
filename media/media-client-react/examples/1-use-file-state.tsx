import React, { type SyntheticEvent, useState } from 'react';

import {
	defaultCollectionName,
	defaultMediaPickerAuthProvider,
} from '@atlaskit/media-test-helpers';

import { MediaClientProvider, useFileState, useMediaClient } from '../src';

const mediaClientConfig = {
	authProvider: defaultMediaPickerAuthProvider(),
};

function App() {
	return (
		<MediaClientProvider clientConfig={mediaClientConfig}>
			<MyApp />
		</MediaClientProvider>
	);
}

function MyApp() {
	const [fileId, setFileId] = useState<string>('');
	const mediaClient = useMediaClient();
	const { fileState } = useFileState(fileId, {
		collectionName: defaultCollectionName,
		skipRemote: !fileId,
	});

	const uploadFile = (event: SyntheticEvent<HTMLInputElement>) => {
		const file = event.currentTarget.files![0];

		mediaClient.file
			.upload({
				content: file,
				name: file.name,
				collection: defaultCollectionName,
			})
			.subscribe((stream) => {
				setFileId(stream.id);
			});
	};
	return (
		<div>
			<input type="file" onChange={uploadFile} />
			<h1>File</h1>
			<div>id: {fileState?.id}</div>
			<div>Status: {fileState?.status}</div>
		</div>
	);
}

export default App;
