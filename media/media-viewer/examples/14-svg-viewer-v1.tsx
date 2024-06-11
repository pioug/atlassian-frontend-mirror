import React, { useState } from 'react';

import { MediaViewer } from '../src';
import Button from '@atlaskit/button';
import { CenteredForm } from '../example-helpers/centeredForm';
import { MediaClientProvider } from '@atlaskit/media-client-react';
import { ToggleBox, useSvgUploader } from '../example-helpers/svg';
import { createUploadMediaClientConfig } from '@atlaskit/media-test-helpers';
import { Label } from '@atlaskit/form';

const mediaClientConfig = createUploadMediaClientConfig();
const mediaClientConfig2 = createUploadMediaClientConfig();
const collectionName = 'MediaServicesSample';

const Example = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [useDifferentConfig, setUseDifferentConfig] = useState(false);
	const { identifier, uploadFn, status } = useSvgUploader(
		useDifferentConfig ? mediaClientConfig2 : mediaClientConfig,
		collectionName,
	);

	return (
		<>
			<ToggleBox
				label="Use different config object"
				isChecked={useDifferentConfig}
				onChange={setUseDifferentConfig}
			/>
			<Label htmlFor="single-select-example">Upload a file</Label>
			<br />
			<input type="file" accept="image/svg+xml" onChange={uploadFn} />
			{status ? <h3>File status: {status}</h3> : ''}
			<Button onClick={() => setIsOpen(true)} appearance="primary" isDisabled={!identifier}>
				Open Media Viewer
			</Button>
			{identifier && isOpen && (
				<MediaViewer
					mediaClientConfig={mediaClientConfig}
					selectedItem={identifier}
					items={[]}
					collectionName={collectionName}
					onClose={() => setIsOpen(false)}
				/>
			)}
		</>
	);
};

const BackendProvider = () => {
	return (
		<MediaClientProvider clientConfig={mediaClientConfig}>
			<Example />
		</MediaClientProvider>
	);
};

const NoProvider = () => {
	return <Example />;
};

export default function () {
	const [reloadKey, setReloadkey] = useState(0);
	const [useMediaProvider, setUseMediaProvider] = useState(false);

	return (
		<CenteredForm>
			<p>
				Media Viewer v1 implements an internal MediaClientProvider to integrate with Media SVG
				component.
				<br />
				We need to make sure that the experience remains consistent when there is a higher
				MediaClientProvider parent and when there is not.
				<br />
				Uploading an SVG file and immediately render it in Media Viewer should not result in an
				error. Instead, we should see the SVG local preview.
				<hr />
			</p>
			<ToggleBox
				label="Use global MediaClientProvider"
				isChecked={useMediaProvider}
				onChange={(v) => {
					setReloadkey(reloadKey + 1);
					setUseMediaProvider(v);
				}}
			/>
			{useMediaProvider ? (
				<BackendProvider key={`${reloadKey}`} />
			) : (
				<NoProvider key={`${reloadKey}`} />
			)}
		</CenteredForm>
	);
}
