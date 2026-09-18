import React from 'react';

import { FormattedMessage } from 'react-intl';

import { type FileState, type MediaClient } from '@atlaskit/media-client';
import { type MediaTraceContext } from '@atlaskit/media-common';
import { messages } from '@atlaskit/media-ui/messages';

import { createFailedPreviewDownloadButtonClickedEvent } from './analytics/events/ui/failedPreviewDownloadButtonClicked';
import { DownloadItem } from './DownloadItem';
import type { MediaViewerError } from './MediaViewerError';
import { DownloadButtonWrapper } from './styleWrappers';

export const ErrorViewDownloadButton = ({
	fileState,
	mediaClient,
	error,
	traceContext,
	collectionName,
}: ErrorViewDownloadButtonProps): React.JSX.Element => {
	const downloadEvent = createFailedPreviewDownloadButtonClickedEvent(fileState, error);
	const testId = 'media-viewer-error-download-button';

	return (
		<DownloadButtonWrapper>
			<DownloadItem
				testId={testId}
				analyticspayload={downloadEvent}
				appearance="primary"
				fileState={fileState}
				mediaClient={mediaClient}
				collectionName={collectionName}
				traceContext={traceContext}
			>
				<FormattedMessage {...messages.download} />
			</DownloadItem>
		</DownloadButtonWrapper>
	);
};
export type ErrorViewDownloadButtonProps = {
	fileState: FileState;
	mediaClient: MediaClient;
	error: MediaViewerError;
	collectionName?: string;
	traceContext: MediaTraceContext;
};
