/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import ReactDOM from 'react-dom';
import type { WrappedComponentProps } from 'react-intl-next';
import { createIntl, injectIntl } from 'react-intl-next';

import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import {
	fireFailedMediaInlineEvent,
	fireSucceededMediaInlineEvent,
	MediaCardError,
} from '@atlaskit/media-card';
import type { FileIdentifier, FileState, MediaClient } from '@atlaskit/media-client';
import { FileFetcherError } from '@atlaskit/media-client';
import { MediaClientContext } from '@atlaskit/media-client-react';
import { MediaViewer } from '@atlaskit/media-viewer';

import { messages } from '../messages/media-inline-card';

import { referenceHeights } from './constants';
import { InlineImageCard } from './inline-image-card';
import { InlineImageWrapper } from './inline-image-wrapper';
import type { Dimensions, MediaInlineAttrs, MediaSSR } from './types';
import { InlineImageCardErrorView } from './views/error-view';
import { InlineImageCardLoadingView } from './views/loading-view';

export interface MediaInlineImageCardProps {
	identifier: FileIdentifier;
	mediaClient?: MediaClient;
	isSelected?: boolean;
	isLazy?: boolean;
	serializeDataAttrs?: boolean;
	border?: {
		borderSize?: number;
		borderColor?: string;
	};
	ssr?: MediaSSR;
	shouldOpenMediaViewer?: boolean;
}

export const MediaInlineImageCardInternal = ({
	mediaClient,
	identifier,
	isSelected,
	intl,
	alt,
	isLazy,
	width,
	height,
	border,
	ssr,
	serializeDataAttrs,
	shouldOpenMediaViewer,
}: MediaInlineImageCardProps & WrappedComponentProps & MediaInlineAttrs) => {
	const [fileState, setFileState] = useState<FileState | undefined>();
	const [subscribeError, setSubscribeError] = useState<Error>();
	const [isFailedEventSent, setIsFailedEventSent] = useState(false);
	const [isSucceededEventSent, setIsSucceededEventSent] = useState(false);
	const [isMediaViewerVisible, setMediaViewerVisible] = useState(false);
	const { formatMessage } = intl || createIntl({ locale: 'en' });
	const { createAnalyticsEvent } = useAnalyticsEvents();

	const fireFailedOperationalEvent = (
		error: MediaCardError = new MediaCardError('missing-error-data'),
		failReason?: 'failed-processing',
	) => {
		if (!isFailedEventSent && fileState) {
			setIsFailedEventSent(true);
			fireFailedMediaInlineEvent(fileState, error, failReason, createAnalyticsEvent);
		}
	};

	const fireSucceededOperationalEvent = () => {
		if (!isSucceededEventSent && fileState) {
			setIsSucceededEventSent(true);
			fireSucceededMediaInlineEvent(fileState, createAnalyticsEvent);
		}
	};

	useEffect(() => {
		if (mediaClient) {
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
				subscription.unsubscribe();
			};
		}
	}, [identifier, mediaClient]);

	const content = (dimensions: Dimensions) => {
		if (!mediaClient) {
			return <InlineImageCardLoadingView />;
		}

		if (!ssr) {
			if (subscribeError) {
				const isUploading = fileState?.status === 'uploading';
				const errorMessage = isUploading ? messages.failedToUpload : messages.unableToLoadContent;
				const errorReason = fileState?.status === 'uploading' ? 'upload' : 'metadata-fetch';
				fireFailedOperationalEvent(new MediaCardError(errorReason, subscribeError));

				return <InlineImageCardErrorView message={formatMessage(errorMessage)} />;
			}

			if (!fileState || fileState?.status === 'uploading') {
				return <InlineImageCardLoadingView />;
			}

			if (fileState.status === 'error') {
				fireFailedOperationalEvent(
					new MediaCardError('error-file-state', new Error(fileState.message)),
				);
				return <InlineImageCardErrorView message={formatMessage(messages.unableToLoadContent)} />;
			} else if (fileState.status === 'failed-processing') {
				fireFailedOperationalEvent(undefined, 'failed-processing');
				return <InlineImageCardErrorView message={formatMessage(messages.unableToLoadContent)} />;
			} else if (!fileState.name) {
				fireFailedOperationalEvent(
					new MediaCardError('metadata-fetch', new FileFetcherError('emptyFileName', fileState.id)),
				);
				return <InlineImageCardErrorView message={formatMessage(messages.unableToLoadContent)} />;
			}

			if (fileState.status === 'processed') {
				fireSucceededOperationalEvent();
			}
		}

		return (
			<MediaClientContext.Provider value={mediaClient}>
				<InlineImageCard
					dimensions={dimensions}
					identifier={identifier}
					renderError={() => (
						<InlineImageCardErrorView message={formatMessage(messages.unableToLoadContent)} />
					)}
					alt={alt}
					ssr={ssr?.mode}
					isLazy={isLazy}
					crop={true}
					stretch={false}
				/>
			</MediaClientContext.Provider>
		);
	};

	const aspectRatio = useMemo(
		() => (width && height ? width / height : undefined),
		[width, height],
	);

	/**
	 * scaledDimensions is used to define the correct media size fetched from media service
	 * inline images will only ever be rendered at a maximum height of H1 and so scaled dimensions
	 * will only ever return a width and height where the height has a maximum height of H1
	 */
	const scaledDimension = useMemo(() => {
		if (!width || !height || !aspectRatio) {
			return { width, height };
		}

		return {
			width: Math.round(aspectRatio * referenceHeights['h1']),
			height: referenceHeights['h1'],
		};
	}, [width, height, aspectRatio]);

	const htmlAttributes = useMemo(() => {
		if (serializeDataAttrs) {
			const resolvedAttrs =
				fileState && fileState.status !== 'error'
					? {
							'data-file-size': fileState.size,
							'data-file-mime-type': fileState.mimeType,
							'data-file-name': fileState.name,
						}
					: {};

			return {
				'data-type': 'image',
				'data-node-type': 'mediaInline',
				'data-id': identifier.id,
				'data-collection': identifier.collectionName,
				'data-width': width,
				'data-height': height,
				'data-alt': alt,
				...resolvedAttrs,
			};
		}
		return {};
	}, [alt, fileState, height, identifier, width, serializeDataAttrs]);

	const onMediaInlineImageClick = useCallback(() => {
		if (shouldOpenMediaViewer) {
			setMediaViewerVisible(true);
		}
	}, [shouldOpenMediaViewer]);

	const onMediaInlinePreviewClose = useCallback(() => {
		setMediaViewerVisible(false);
	}, []);

	const mediaViewer = useMemo(() => {
		if (isMediaViewerVisible && mediaClient?.mediaClientConfig) {
			return ReactDOM.createPortal(
				<MediaViewer
					collectionName={identifier.collectionName || ''}
					items={[identifier]}
					mediaClientConfig={mediaClient?.mediaClientConfig}
					selectedItem={identifier}
					onClose={onMediaInlinePreviewClose}
				/>,
				document.body,
			);
		}
		return null;
	}, [identifier, isMediaViewerVisible, mediaClient?.mediaClientConfig, onMediaInlinePreviewClose]);

	return (
		<Fragment>
			<InlineImageWrapper
				isSelected={isSelected}
				isInteractive={shouldOpenMediaViewer}
				aspectRatio={aspectRatio}
				borderColor={border?.borderColor}
				borderSize={border?.borderSize}
				htmlAttrs={htmlAttributes}
				onClick={onMediaInlineImageClick}
			>
				{content(scaledDimension)}
			</InlineImageWrapper>
			{mediaViewer}
		</Fragment>
	);
};

export const MediaInlineImageCard: React.ComponentType<
	React.PropsWithChildren<MediaInlineImageCardProps & MediaInlineAttrs>
> = injectIntl(MediaInlineImageCardInternal, { enforceContext: false });
