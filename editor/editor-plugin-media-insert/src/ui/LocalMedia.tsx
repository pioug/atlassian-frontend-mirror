import React from 'react';

import { useIntl } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import { type DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { mediaInsertMessages } from '@atlaskit/editor-common/messages';
import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import UploadIcon from '@atlaskit/icon/glyph/upload';
import {
	Browser,
	type ImagePreview,
	type MediaErrorName,
	type Preview,
	type UploadPreviewUpdateEventPayload,
} from '@atlaskit/media-picker';
import { Stack } from '@atlaskit/primitives';
import SectionMessage from '@atlaskit/section-message';

import { type OnInsertAttrs } from './types';
import { useAnalyticsEvents } from './useAnalyticsEvents';

type Props = {
	mediaProvider: MediaProvider;
	onInsert: (attrs: OnInsertAttrs) => void;
	onClose: () => void;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
};

type UploadState = {
	isOpen: boolean;
	error: null | MediaErrorName;
};

const INITIAL_UPLOAD_STATE: Readonly<UploadState> = Object.freeze({
	isOpen: false,
	error: null,
});

type ACTIONS =
	| { type: 'open' }
	| { type: 'close' }
	| { type: 'error'; error: MediaErrorName }
	| { type: 'reset' };

const uploadReducer = (state: UploadState, action: ACTIONS): UploadState => {
	switch (action.type) {
		case 'open':
			return { ...INITIAL_UPLOAD_STATE, isOpen: true };
		case 'close':
			// This is the only case where we don't reset state. This is because
			// onClose gets called for cancel _and_ upload, so we don't want to
			// reset any loading or error states that may have occured
			return { ...state, isOpen: false };
		case 'error':
			return { ...INITIAL_UPLOAD_STATE, error: action.error };
		case 'reset':
			return INITIAL_UPLOAD_STATE;
	}
};

const isImagePreview = (preview: Preview): preview is ImagePreview => {
	return 'dimensions' in preview;
};

export const LocalMedia = ({ mediaProvider, onInsert, dispatchAnalyticsEvent }: Props) => {
	const intl = useIntl();
	const strings = {
		upload: intl.formatMessage(mediaInsertMessages.upload),
		networkError: intl.formatMessage(mediaInsertMessages.localFileNetworkErrorMessage),
		genericError: intl.formatMessage(mediaInsertMessages.localFileErrorMessage),
	};

	const {
		onUploadButtonClickedAnalytics,
		onUploadCommencedAnalytics,
		onUploadSuccessAnalytics,
		onUploadFailureAnalytics,
	} = useAnalyticsEvents(dispatchAnalyticsEvent);

	const [uploadState, dispatch] = React.useReducer(uploadReducer, INITIAL_UPLOAD_STATE);

	const onUpload = ({ file, preview }: UploadPreviewUpdateEventPayload): void => {
		onUploadSuccessAnalytics('local');
		const insertPayload: OnInsertAttrs = {
			id: file.id,
			collection: mediaProvider.uploadParams?.collection,
			occurrenceKey: file.occurrenceKey,
		};

		if (isImagePreview(preview)) {
			insertPayload.height = preview.dimensions.height;
			insertPayload.width = preview.dimensions.width;
		}

		onInsert(insertPayload);

		// Probably not needed but I guess it _could_ fail to close for some reason
		dispatch({ type: 'reset' });
	};

	const { uploadParams, uploadMediaClientConfig } = mediaProvider;

	return (
		<Stack grow="fill" space="space.200">
			{uploadState.error && (
				<SectionMessage appearance="error">
					{uploadState.error === 'upload_fail' ? strings.networkError : strings.genericError}
				</SectionMessage>
			)}
			<Button
				iconBefore={UploadIcon}
				shouldFitContainer
				isDisabled={!uploadMediaClientConfig || !uploadParams}
				onClick={() => {
					onUploadButtonClickedAnalytics();
					dispatch({ type: 'open' });
				}}
				autoFocus
			>
				{strings.upload}
			</Button>
			{uploadMediaClientConfig && uploadParams && (
				<Browser
					isOpen={uploadState.isOpen}
					config={{ uploadParams: uploadParams }}
					mediaClientConfig={uploadMediaClientConfig}
					onUploadsStart={() => {
						onUploadCommencedAnalytics('local');
					}}
					onPreviewUpdate={onUpload}
					// NOTE: this will fire for some errors like network failures, but not
					// for others like empty files. Those have their own feedback toast
					// owned by media.
					onError={(payload) => {
						onUploadFailureAnalytics(payload.error.name, 'local');
						dispatch({ type: 'error', error: payload.error.name });
					}}
					onClose={() => {
						dispatch({ type: 'close' });
					}}
				/>
			)}
		</Stack>
	);
};
