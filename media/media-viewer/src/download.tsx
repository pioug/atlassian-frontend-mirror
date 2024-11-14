import {
	type CreateUIAnalyticsEvent,
	useAnalyticsEvents,
	type UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import DownloadIcon from '@atlaskit/icon/core/migration/download';
import {
	type FileState,
	type Identifier,
	isErrorFileState,
	isExternalImageIdentifier,
	type MediaClient,
} from '@atlaskit/media-client';
import { MediaButton, messages } from '@atlaskit/media-ui';
import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl-next';
import { type MediaTraceContext } from '@atlaskit/media-common';
import {
	type DownloadButtonClickedEventPayload,
	createDownloadButtonClickedEvent,
} from './analytics/events/ui/downloadButtonClicked';
import {
	createDownloadFailedEventPayload,
	createDownloadSucceededEventPayload,
} from './analytics/events/operational/download';
import { fireAnalytics } from './analytics';
import {
	type FailedPreviewDownloadButtonClickedEventPayload,
	createFailedPreviewDownloadButtonClickedEvent,
} from './analytics/events/ui/failedPreviewDownloadButtonClicked';
import { DownloadButtonWrapper } from './styleWrappers';
import { MediaViewerError } from './errors';

const downloadIcon = <DownloadIcon color="currentColor" spacing="spacious" label="Download" />;

type DownloadButtonProps = React.ComponentProps<typeof MediaButton> & {
	analyticspayload:
		| DownloadButtonClickedEventPayload
		| FailedPreviewDownloadButtonClickedEventPayload;
};
function noop() {}

function DownloadButton({
	analyticspayload,
	onClick: providedOnClick = noop,
	...rest
}: DownloadButtonProps) {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const onClick = useCallback(
		(event: React.MouseEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => {
			fireAnalytics(analyticspayload, createAnalyticsEvent);
			providedOnClick(event, analyticsEvent);
		},
		[analyticspayload, providedOnClick, createAnalyticsEvent],
	);

	return <MediaButton {...rest} onClick={onClick} />;
}

const createItemDownloader =
	(
		file: FileState,
		mediaClient: MediaClient,
		options: {
			collectionName?: string;
			traceContext: MediaTraceContext;
			createAnalyticsEvent: CreateUIAnalyticsEvent;
		},
	) =>
	async () => {
		const { collectionName, traceContext, createAnalyticsEvent } = options;
		const id = file.id;
		const name = !isErrorFileState(file) ? file.name : undefined;

		mediaClient.file
			.downloadBinary(id, name, collectionName, traceContext)
			.then(() => {
				fireAnalytics(
					createDownloadSucceededEventPayload(file, traceContext),
					createAnalyticsEvent,
				);
			})
			.catch((e) => {
				fireAnalytics(
					createDownloadFailedEventPayload(
						file.id,
						new MediaViewerError('download', e),
						file,
						traceContext,
					),
					createAnalyticsEvent,
				);
			});
	};

export type ErrorViewDownloadButtonProps = {
	fileState: FileState;
	mediaClient: MediaClient;
	error: MediaViewerError;
	collectionName?: string;
	traceContext: MediaTraceContext;
};

export const ErrorViewDownloadButton = ({
	fileState,
	mediaClient,
	error,
	traceContext,
	collectionName,
}: ErrorViewDownloadButtonProps) => {
	const downloadEvent = createFailedPreviewDownloadButtonClickedEvent(fileState, error);
	const { createAnalyticsEvent } = useAnalyticsEvents();
	return (
		<DownloadButtonWrapper>
			<DownloadButton
				// testId="media-viewer-failed-preview-download-button"
				testId="media-viewer-error-download-button"
				analyticspayload={downloadEvent}
				appearance="primary"
				onClick={createItemDownloader(fileState, mediaClient, {
					collectionName,
					traceContext,
					createAnalyticsEvent,
				})}
			>
				<FormattedMessage {...messages.download} />
			</DownloadButton>
		</DownloadButtonWrapper>
	);
};

export type ToolbarDownloadButtonProps = {
	state: FileState;
	identifier: Identifier;
	mediaClient: MediaClient;
	traceContext: MediaTraceContext;
};

export const ToolbarDownloadButton = ({
	state,
	mediaClient,
	identifier,
	traceContext,
}: ToolbarDownloadButtonProps) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const downloadEvent = createDownloadButtonClickedEvent(state);

	// TODO [MS-1731]: make it work for external files as well
	if (isExternalImageIdentifier(identifier)) {
		return null;
	}

	return (
		<DownloadButton
			testId="media-viewer-download-button"
			analyticspayload={downloadEvent}
			onClick={createItemDownloader(state, mediaClient, {
				collectionName: identifier.collectionName,
				createAnalyticsEvent,
				traceContext,
			})}
			iconBefore={downloadIcon}
		/>
	);
};

export const DisabledToolbarDownloadButton = (
	<MediaButton isDisabled={true} iconBefore={downloadIcon} />
);
