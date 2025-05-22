import React, { useState } from 'react';
import { useMediaClient } from '@atlaskit/media-client-react';
import { type ArtifactUploaderProps } from './types';
import { BrowserPicker } from './filePickers/browser';
import { createUploadCaptionsFn, UploadCaptionsForm } from './captions';

export type CaptionsUploaderBrowserProps = ArtifactUploaderProps & {
	isOpen: boolean;
	onClose: () => void;
};

export const CaptionsUploaderBrowser = ({
	identifier,
	isOpen,
	onClose,
	onStart,
	onEnd,
	onError,
}: CaptionsUploaderBrowserProps) => {
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [file, setFile] = useState<File>();
	const mediaClient = useMediaClient();

	const close = () => {
		setIsFormOpen(false);
		setFile(undefined);
		onClose();
	};

	const onFilesPicked = (files: FileList) => {
		const file = files[0];
		if (!file) {
			return;
		}
		setFile(file);
		setIsFormOpen(true);
	};

	return (
		<>
			<BrowserPicker
				isOpen={isOpen}
				type={'captions'}
				onFilesPicked={onFilesPicked}
				onClose={close}
			/>
			<UploadCaptionsForm
				isOpen={isFormOpen}
				file={file}
				uploadFn={createUploadCaptionsFn(mediaClient, identifier, onStart, onEnd, onError)}
				onClose={close}
			/>
		</>
	);
};
