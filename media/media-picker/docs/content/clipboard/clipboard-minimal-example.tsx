import React, { useState } from 'react';
import { mediaPickerAuthProvider } from '@atlaskit/media-test-helpers';
import { type ClipboardConfig } from '@atlaskit/media-picker/types';
import { Clipboard } from '@atlaskit/media-picker';
import { MediaClient, type FileIdentifier } from '@atlaskit/media-client';
import { type UploadEndEventPayload } from '../../../src/types';
import { NativeMediaViewer } from '../../../example-helpers/NativeMediaViewer';

const mediaClient = new MediaClient({
	authProvider: mediaPickerAuthProvider(),
});

const ClipBoardExample = () => {
	const [uploadEnd, setUploadEnd] = useState<boolean>(false);
	const [identifier, setIdentifier] = useState<FileIdentifier>({
		mediaItemType: 'file',
		id: '',
	});
	const clipboardConfig: ClipboardConfig = {
		uploadParams: {},
	};

	if (!clipboardConfig || !mediaClient) {
		return null;
	}
	const onEnd = (payload: UploadEndEventPayload) => {
		setUploadEnd(true);
		setIdentifier((state) => {
			return { ...state, id: payload.file.id };
		});
	};

	return (
		<div>
			{/* eslint-disable-next-line @atlaskit/design-system/use-heading */}
			<h2>Clipboard example</h2>
			{/* eslint-disable-next-line @atlaskit/design-system/use-primitives-text */}
			<p>
				Use CMD+C to copy an image from finder, followed by CMD+V to paste the image when this
				window is focused.
			</p>
			{/* eslint-disable-next-line @atlaskit/design-system/use-primitives-text */}
			<p>You can also take a screenshot with SHIFT+CTRL+COMMAND+4 (Mac) and paste with CMD+V.</p>
			{/* eslint-disable-next-line @atlaskit/design-system/use-primitives-text */}
			<p>If you paste an image you will see a preview.</p>
			<Clipboard mediaClientConfig={mediaClient.config} config={clipboardConfig} onEnd={onEnd} />
			{uploadEnd && (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				<div style={{ maxWidth: '300px', maxHeight: '250px' }}>
					<NativeMediaViewer id={identifier.id} mediaClient={mediaClient} />
				</div>
			)}
		</div>
	);
};

export default ClipBoardExample;
