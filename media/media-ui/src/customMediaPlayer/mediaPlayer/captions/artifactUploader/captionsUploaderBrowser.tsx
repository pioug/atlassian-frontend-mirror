import React, { useState } from 'react';

import { type WithIntlProps, type WrappedComponentProps, injectIntl } from 'react-intl';

import { type MediaItemDetails } from '@atlaskit/media-client';
import { useMediaClient } from '@atlaskit/media-client-react/use-media-client';
import { type MediaTraceContext } from '@atlaskit/media-common';

import { messages } from '../../../../messages';
import ApiFeedback, { type NotificationTypes } from '../apiFeedback';
import { createUploadCaptionsFn } from './captions/uploader';
import { default as UploadCaptionsForm } from './captions/uploadForm';
import { BrowserPicker } from './filePickers/browser';
import type { ArtifactUploaderProps } from './types';

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
	const _onError = (error: any, traceContext: MediaTraceContext) => {
		setNotificationType('error');
		onError?.(error, traceContext);
	};
	const _onEnd = (metadata: MediaItemDetails, traceContext: MediaTraceContext) => {
		setNotificationType('success');
		onEnd?.(metadata, traceContext);
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

const _default_1: React.FC<
	WithIntlProps<
		ArtifactUploaderProps & {
			isOpen: boolean;
			onClose: () => void;
		} & WrappedComponentProps
	>
> & {
	WrappedComponent: React.ComponentType<
		ArtifactUploaderProps & {
			isOpen: boolean;
			onClose: () => void;
		} & WrappedComponentProps
	>;
} = injectIntl(CaptionsUploaderBrowser);
export default _default_1;
