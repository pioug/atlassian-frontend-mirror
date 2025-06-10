import React, { useState } from 'react';
import { useMediaClient } from '@atlaskit/media-client-react';
import { type ArtifactUploaderProps } from './types';
import { BrowserPicker } from './filePickers/browser';
import { createUploadCaptionsFn, UploadCaptionsForm } from './captions';
import ApiFeedback, { type NotificationTypes } from '../apiFeedback';
import { type MediaItemDetails } from '@atlaskit/media-client';
import { messages } from '../../../../messages';
import { type WrappedComponentProps, injectIntl } from 'react-intl-next';

export type CaptionsUploaderBrowserProps = ArtifactUploaderProps & {
	isOpen: boolean;
	onClose: () => void;
};

const CaptionsUploaderBrowser = ({
	identifier,
	isOpen,
	onClose,
	onStart,
	onEnd,
	onError,
	intl,
}: CaptionsUploaderBrowserProps & WrappedComponentProps) => {
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [file, setFile] = useState<File>();
	const mediaClient = useMediaClient();
	const [notificationType, setNotificationType] = useState<NotificationTypes>(null);
	const _onError = (error: any) => {
		setNotificationType('error');
		onError?.(error);
	};
	const _onEnd = (metadata: MediaItemDetails) => {
		setNotificationType('success');
		onEnd?.(metadata);
	};

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
				uploadFn={createUploadCaptionsFn(mediaClient, identifier, onStart, _onEnd, _onError)}
				onClose={close}
			/>
			<ApiFeedback
				notificationType={notificationType}
				onDismissed={() => setNotificationType(null)}
				successDescription={intl.formatMessage(messages.video_captions_upload_success_description)}
				errorDescription={intl.formatMessage(messages.video_captions_upload_error_description)}
			/>
		</>
	);
};

export default injectIntl(CaptionsUploaderBrowser);
