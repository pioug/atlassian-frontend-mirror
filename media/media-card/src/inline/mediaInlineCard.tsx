import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import {
	FileFetcherError,
	toCommonMediaClientError,
	type FileIdentifier,
	type FileState,
	type Identifier,
	type MediaClient,
} from '@atlaskit/media-client';
import {
	MediaInlineCardErroredView,
	MediaInlineCardLoadedView,
	MediaInlineCardLoadingView,
	messages,
} from '@atlaskit/media-ui';
import { formatDate } from '@atlaskit/media-ui/formatDate';
import { MimeTypeIcon } from '@atlaskit/media-ui/mime-type-icon';
import { MediaViewer, type ViewerOptionsProps } from '@atlaskit/media-viewer';
import Tooltip from '@atlaskit/tooltip';
import React, { type FC, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { createIntl, injectIntl, IntlProvider, type WrappedComponentProps } from 'react-intl-next';
import { MediaCardError } from '../errors';
import { type InlineCardEvent, type InlineCardOnClickCallback } from '../types';
import { fireMediaCardEvent } from '../utils/analytics';
import {
	getErrorStatusPayload,
	getFailedProcessingStatusPayload,
	getSucceededStatusPayload,
} from './mediaInlineCardAnalytics';
import { useCopyIntent } from '@atlaskit/media-client-react';
import usePressTracing from '@atlaskit/react-ufo/use-press-tracing';

export interface MediaInlineCardProps {
	identifier: FileIdentifier;
	mediaClient: MediaClient;
	shouldOpenMediaViewer?: boolean;
	shouldDisplayToolTip?: boolean; // undefined is default to true
	isSelected?: boolean;
	onClick?: InlineCardOnClickCallback;
	mediaViewerItems?: Identifier[];
	viewerOptions?: ViewerOptionsProps;
}

// UI component which renders an inline link in the appropiate state based on a media file
export const MediaInlineCardInternal: FC<MediaInlineCardProps & WrappedComponentProps> = ({
	mediaClient,
	identifier,
	shouldOpenMediaViewer,
	shouldDisplayToolTip,
	isSelected,
	onClick,
	mediaViewerItems,
	intl,
	viewerOptions,
}) => {
	const [fileState, setFileState] = useState<FileState | undefined>();
	const [subscribeError, setSubscribeError] = useState<Error>();
	const [isSucceededEventSent, setIsSucceededEventSent] = useState(false);
	const [isFailedEventSent, setIsFailedEventSent] = useState(false);
	const [isMediaViewerVisible, setMediaViewerVisible] = useState(false);
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const pressTracing = usePressTracing('click-media-inline-card');

	const fireFailedOperationalEvent = (
		error: MediaCardError = new MediaCardError('missing-error-data'),
		failReason?: 'failed-processing',
	) => {
		if (isFailedEventSent) {
			return;
		}
		const payload = failReason
			? getFailedProcessingStatusPayload(identifier.id, fileState)
			: getErrorStatusPayload(identifier.id, error, fileState);
		setIsFailedEventSent(true);
		fireMediaCardEvent(payload, createAnalyticsEvent);
	};
	const fireSucceededOperationalEvent = () => {
		const payload = getSucceededStatusPayload(fileState);
		setIsSucceededEventSent(true);
		fireMediaCardEvent(payload, createAnalyticsEvent);
	};

	const { copyNodeRef } = useCopyIntent(identifier.id, {
		collectionName: identifier.collectionName,
	});

	const onMediaInlineCardClick = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent) => {
		if (onClick) {
			const inlineCardEvent: InlineCardEvent = {
				event,
				mediaItemDetails: identifier,
			};
			onClick(inlineCardEvent);
		}

		if (shouldOpenMediaViewer) {
			setMediaViewerVisible(true);
		}

		// Abort VC when click media inline card
		pressTracing();
	};

	const onMediaViewerClose = () => setMediaViewerVisible(false);
	const renderMediaViewer = () => {
		if (isMediaViewerVisible) {
			return ReactDOM.createPortal(
				<MediaViewer
					collectionName={identifier.collectionName || ''}
					items={mediaViewerItems || []}
					mediaClientConfig={mediaClient.mediaClientConfig}
					selectedItem={identifier}
					onClose={onMediaViewerClose}
					viewerOptions={viewerOptions}
				/>,
				document.body,
			);
		}
		return null;
	};

	const renderContent = (children: React.ReactElement) => {
		return intl ? children : <IntlProvider locale="en">{children}</IntlProvider>;
	};
	const defaultIntl = createIntl({ locale: 'en' });

	useEffect(() => {
		const subscription = mediaClient.file
			.getFileState(identifier.id, {
				collectionName: identifier.collectionName,
			})
			.subscribe({
				next: (fileState) => {
					setFileState(fileState);
					setSubscribeError(undefined);
				},
				error: (e) => {
					setSubscribeError(e);
				},
			});
		return () => {
			subscription?.unsubscribe();
		};
	}, [identifier.collectionName, identifier.id, mediaClient.file]);

	if (subscribeError) {
		const errorMessage =
			fileState?.status === 'uploading' ? messages.failed_to_upload : messages.couldnt_load_file;
		const errorReason = fileState?.status === 'uploading' ? 'upload' : 'metadata-fetch';
		fireFailedOperationalEvent(new MediaCardError(errorReason, subscribeError));

		return renderContent(
			<>
				<MediaInlineCardErroredView
					innerRef={copyNodeRef}
					message={(intl || defaultIntl).formatMessage(errorMessage)}
					isSelected={isSelected}
					onClick={onMediaInlineCardClick}
				/>
				{renderMediaViewer()}
			</>,
		);
	}

	if (fileState?.status === 'error') {
		const error = new MediaCardError('error-file-state', toCommonMediaClientError(fileState));
		fireFailedOperationalEvent(error);
		return renderContent(
			<>
				<MediaInlineCardErroredView
					innerRef={copyNodeRef}
					message={(intl || defaultIntl).formatMessage(messages.couldnt_load_file)}
					isSelected={isSelected}
					onClick={onMediaInlineCardClick}
				/>
				{renderMediaViewer()}
			</>,
		);
	}

	// Empty file handling
	if (fileState && !fileState.name) {
		const error = new MediaCardError(
			'metadata-fetch',
			new FileFetcherError('emptyFileName', { id: fileState.id }),
		);
		fireFailedOperationalEvent(error);
		return renderContent(
			<>
				<MediaInlineCardErroredView
					innerRef={copyNodeRef}
					message={(intl || defaultIntl).formatMessage(messages.couldnt_load_file)}
					isSelected={isSelected}
					onClick={onMediaInlineCardClick}
				/>
				{renderMediaViewer()}
			</>,
		);
	}

	if (fileState?.status === 'uploading') {
		return (
			<MediaInlineCardLoadingView
				innerRef={copyNodeRef}
				message={fileState.name}
				isSelected={isSelected}
			/>
		);
	}

	if (!fileState) {
		return (
			<MediaInlineCardLoadingView
				innerRef={copyNodeRef}
				message={(intl || defaultIntl).formatMessage(messages.loading_file)}
				isSelected={isSelected}
			/>
		);
	}

	// Failed to process should still display the loaded view and enable Media Client to download
	if (fileState?.status === 'failed-processing') {
		fireFailedOperationalEvent(undefined, 'failed-processing');
	}

	const { mediaType, name, mimeType } = fileState;
	const linkIcon = (
		<MimeTypeIcon
			testId={'media-inline-card-file-type-icon'}
			size="small"
			mediaType={mediaType}
			mimeType={mimeType}
			name={name}
		/>
	);

	let formattedDate;
	if (fileState.createdAt) {
		const { locale = 'en' } = intl || { locale: 'en' };
		formattedDate = formatDate(fileState.createdAt, locale);
	}

	if (fileState.status === 'processed' && !isSucceededEventSent) {
		fireSucceededOperationalEvent();
	}

	if (shouldDisplayToolTip === undefined || shouldDisplayToolTip === true) {
		return renderContent(
			<>
				<Tooltip position="bottom" content={formattedDate} tag="span">
					<MediaInlineCardLoadedView
						innerRef={copyNodeRef}
						icon={linkIcon}
						title={name}
						onClick={onMediaInlineCardClick}
						isSelected={isSelected}
					/>
				</Tooltip>
				{renderMediaViewer()}
			</>,
		);
	} else {
		return renderContent(
			<>
				<MediaInlineCardLoadedView
					innerRef={copyNodeRef}
					icon={linkIcon}
					title={name}
					onClick={onMediaInlineCardClick}
					isSelected={isSelected}
				/>
				{renderMediaViewer()}
			</>,
		);
	}
};

export const MediaInlineCard: React.FC<MediaInlineCardProps> = injectIntl(MediaInlineCardInternal, {
	enforceContext: false,
});
