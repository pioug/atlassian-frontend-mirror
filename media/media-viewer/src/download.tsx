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
import React, { type ReactNode, useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl-next';
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
import Tooltip from '@atlaskit/tooltip';
import { AbuseModal } from '@atlaskit/media-ui/abuseModal';

const downloadIcon = <DownloadIcon color="currentColor" spacing="spacious" label="Download" />;

type DownloadButtonProps = React.ComponentProps<typeof MediaButton> & {
	tooltip?: string;
	analyticspayload:
		| DownloadButtonClickedEventPayload
		| FailedPreviewDownloadButtonClickedEventPayload;
};
function noop() {}

function DownloadButton({
	analyticspayload,
	onClick: providedOnClick = noop,
	tooltip,
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

	const downloadButton = <MediaButton {...rest} onClick={onClick} />;

	return tooltip ? (
		<Tooltip content={tooltip} position="bottom" tag="span">
			{downloadButton}
		</Tooltip>
	) : (
		downloadButton
	);
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

const useDownloadButtonDisabledProps = (mediaClient: MediaClient) => {
	const { formatMessage } = useIntl();
	const isDisabled = mediaClient.config.enforceDataSecurityPolicy;
	const tooltip = isDisabled
		? formatMessage(messages.download_disabled_security_policy)
		: undefined;

	return { isDisabled, tooltip };
};

type DownloadItemProps = {
	testId: string;
	fileState: FileState;
	mediaClient: MediaClient;
	collectionName?: string;
	appearance?: DownloadButtonProps['appearance'];
	analyticspayload: DownloadButtonProps['analyticspayload'];
	children?: ReactNode;
	iconBefore?: DownloadButtonProps['iconBefore'];
	traceContext: MediaTraceContext;
};

const DownloadItem = ({
	testId,
	fileState,
	mediaClient,
	collectionName,
	appearance,
	analyticspayload,
	traceContext,
	iconBefore,
	children,
}: DownloadItemProps) => {
	const [isAbuseModalOpen, setIsAbuseModalOpen] = useState(false);
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const { isDisabled, tooltip } = useDownloadButtonDisabledProps(mediaClient);

	const shouldRenderAbuseModal = !isErrorFileState(fileState) && !!fileState.abuseClassification;

	const itemDownloader = createItemDownloader(fileState, mediaClient, {
		collectionName: collectionName,
		createAnalyticsEvent,
		traceContext,
	});

	return (
		<>
			{shouldRenderAbuseModal && (
				<AbuseModal
					isOpen={isAbuseModalOpen}
					onConfirm={itemDownloader}
					onClose={() => setIsAbuseModalOpen(false)}
				/>
			)}
			<DownloadButton
				testId={testId}
				appearance={appearance}
				analyticspayload={analyticspayload}
				isDisabled={isDisabled}
				tooltip={tooltip}
				onClick={() => {
					if (shouldRenderAbuseModal) {
						setIsAbuseModalOpen(true);
					} else {
						itemDownloader();
					}
				}}
				iconBefore={iconBefore}
			>
				{children}
			</DownloadButton>
		</>
	);
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
}: ToolbarDownloadButtonProps): React.JSX.Element | null => {
	// TODO [MS-1731]: make it work for external files as well
	if (isExternalImageIdentifier(identifier)) {
		return null;
	}
	const downloadEvent = createDownloadButtonClickedEvent(state);
	const testId = 'media-viewer-download-button';

	return (
		<DownloadItem
			testId={testId}
			analyticspayload={downloadEvent}
			fileState={state}
			mediaClient={mediaClient}
			collectionName={identifier.collectionName}
			traceContext={traceContext}
			iconBefore={downloadIcon}
		/>
	);
};

export const DisabledToolbarDownloadButton: React.JSX.Element = (
	<MediaButton isDisabled={true} iconBefore={downloadIcon} />
);
