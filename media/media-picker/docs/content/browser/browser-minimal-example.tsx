/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { mediaPickerAuthProvider } from '@atlaskit/media-test-helpers';
import Button from '@atlaskit/button/standard-button';
import {
	type BrowserConfig,
	type UploadsStartEventPayload,
	type UploadEndEventPayload,
} from '../../../src/types';
import { Browser } from '../../../src';
import { MediaClient, type FileIdentifier } from '@atlaskit/media-client';
import { useState } from 'react';
import { NativeMediaViewer } from '../../../example-helpers/NativeMediaViewer';

const mediaClient = new MediaClient({
	authProvider: mediaPickerAuthProvider(),
});

const BrowserExample = (): React.JSX.Element | null => {
	const [showDialog, setShowDialog] = useState<boolean>(false);
	const [uploadEnd, setUploadEnd] = useState<boolean>(false);
	const [uploadStart, setUploadStart] = useState<boolean>(false);
	const [identifier, setIdentifier] = useState<FileIdentifier>({
		mediaItemType: 'file',
		id: '',
	});

	const onOpen = () => {
		setShowDialog(true);
		setUploadEnd(false);
		setUploadStart(false);
		setIdentifier((state) => {
			return { ...state, id: '' };
		});
	};

	const onClose = () => {
		setShowDialog(false);
	};

	const onEnd = (payload: UploadEndEventPayload) => {
		setUploadEnd(true);
		setUploadStart(false);
		setIdentifier((state) => {
			return { ...state, id: payload.file.id };
		});
	};

	const onUploadsStart = (payload: UploadsStartEventPayload) => {
		setUploadStart(true);
	};
	const browseConfig: BrowserConfig = {
		multiple: true,
		uploadParams: {},
	};

	if (!browseConfig || !mediaClient) {
		return null;
	}

	return (
		<div
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				height: '300px',
			}}
		>
			<Button appearance="primary" onClick={onOpen}>
				Open
			</Button>

			<Browser
				isOpen={showDialog}
				mediaClientConfig={mediaClient.config}
				config={browseConfig}
				onClose={onClose}
				onUploadsStart={onUploadsStart}
				onEnd={onEnd}
			/>
			{/* eslint-disable-next-line @atlaskit/design-system/use-primitives-text */}
			{uploadStart && <p>Upload started. Wait for it to finish !! </p>}
			{uploadEnd && (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				<div style={{ maxWidth: '300px', maxHeight: '250px' }}>
					<NativeMediaViewer id={identifier.id} mediaClient={mediaClient} />
				</div>
			)}
		</div>
	);
};
export default BrowserExample;
