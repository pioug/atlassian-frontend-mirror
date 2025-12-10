import React, { useCallback, useEffect, useState, useRef } from 'react';
import Loadable from 'react-loadable';
import {
	type FileState,
	type Identifier,
	isExternalImageIdentifier,
	isFileIdentifier,
	type ExternalImageIdentifier,
	type NonErrorFileState,
	type ProcessedFileState,
	toCommonMediaClientError,
} from '@atlaskit/media-client';
import { Text } from '@atlaskit/primitives/compiled';
import { FormattedMessage } from 'react-intl-next';
import { messages, type WithShowControlMethodProp } from '@atlaskit/media-ui';
import { isCodeViewerItem } from '@atlaskit/media-ui/codeViewer';
import { useFileState, useMediaClient } from '@atlaskit/media-client-react';
import { Outcome } from './domain';
import { Spinner } from './loading';
import ErrorMessage from './errorMessage';
import { MediaViewerError } from './errors';
import { ErrorViewDownloadButton } from './download';
import { withAnalyticsEvents, type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { createCommencedEvent } from './analytics/events/operational/commenced';
import { createLoadSucceededEvent } from './analytics/events/operational/loadSucceeded';
import { fireAnalytics, getFileAttributes } from './analytics';
import { InteractiveImg } from './viewers/image/interactive-img';
import ArchiveViewerLoader from './viewers/archiveSidebar/archiveViewerLoader';
import { type MediaFeatureFlags, type MediaTraceContext } from '@atlaskit/media-common';
import { fg } from '@atlaskit/platform-feature-flags';
import type { ImageViewerProps } from './viewers/image';
import type { Props as VideoViewerProps } from './viewers/video';
import type { Props as AudioViewerProps } from './viewers/audio';
import type { Props as DocViewerProps } from './viewers/doc';
import type { Props as CodeViewerProps } from './viewers/codeViewer';
import {
	startMediaFileUfoExperience,
	succeedMediaFileUfoExperience,
} from './analytics/ufoExperiences';
import { type FileStateFlags } from './components/types';
import type { SvgViewerProps } from './viewers/svg';
import { type ViewerOptionsProps } from './viewerOptions';
import { CustomViewer } from './viewers/customViewer/customViewer';

const ImageViewer = Loadable({
	loader: (): Promise<React.ComponentType<ImageViewerProps>> =>
		import(/* webpackChunkName: "@atlaskit-internal_imageViewer" */ './viewers/image').then(
			(mod) => mod.ImageViewer,
		),
	loading: () => <Spinner />,
});
const VideoViewer = Loadable({
	loader: (): Promise<React.ComponentType<VideoViewerProps>> =>
		import(/* webpackChunkName: "@atlaskit-internal_videoViewer" */ './viewers/video').then(
			(mod) => mod.VideoViewer,
		),
	loading: () => <Spinner />,
});
const AudioViewer = Loadable({
	loader: (): Promise<React.ComponentType<AudioViewerProps>> =>
		import(/* webpackChunkName: "@atlaskit-internal_audioViewer" */ './viewers/audio').then(
			(mod) => mod.AudioViewer,
		),
	loading: () => <Spinner />,
});
const DocViewer = Loadable({
	loader: (): Promise<React.ComponentType<DocViewerProps>> =>
		import(/* webpackChunkName: "@atlaskit-internal_docViewer" */ './viewers/doc').then(
			(mod) => mod.DocViewer,
		),
	loading: () => <Spinner />,
});

const CodeViewer = Loadable({
	loader: (): Promise<React.ComponentType<CodeViewerProps>> =>
		import(/* webpackChunkName: "@atlaskit-internal_codeViewer" */ './viewers/codeViewer').then(
			(mod) => mod.CodeViewer,
		),
	loading: () => <Spinner />,
});

const SvgViewer = Loadable({
	loader: (): Promise<React.ComponentType<SvgViewerProps>> =>
		// @ts-ignore: [PIT-1685] Fails in post-office due to backwards incompatibility issue with React 18
		import(/* webpackChunkName: "@atlaskit-internal_svgViewer" */ './viewers/svg').then(
			(mod) => mod.SvgViewer,
		),
	loading: () => <Spinner />,
});

export type Props = Readonly<{
	identifier: Identifier;
	onClose?: () => void;
	previewCount: number;
	contextId?: string;
	featureFlags?: MediaFeatureFlags;
	viewerOptions?: ViewerOptionsProps;
	traceContext: MediaTraceContext;
}> &
	WithAnalyticsEventsProps &
	WithShowControlMethodProp;

export type FileItem = FileState | 'external-image';

export type State = Outcome<FileItem, MediaViewerError>;

// Consts
export const isExternalImageItem = (fileItem: FileItem): fileItem is 'external-image' =>
	fileItem === 'external-image';

export const isFileStateItem = (fileItem: FileItem): fileItem is FileState =>
	!isExternalImageItem(fileItem);

export const MAX_FILE_SIZE_SUPPORTED_BY_CODEVIEWER = 10 * 1024 * 1024;

/**
 * Determines if a file renders natively without backend processing artifacts.
 * These files (text/code, PDF, SVG) can be rendered directly from the original binary
 * without waiting for transcoded artifacts from the backend.
 *
 * Evidence:
 * - CodeViewer: Uses getFileBinaryURL(id) - works with both 'processing' and 'processed' status
 * - DocViewer: Uses getDocumentContent(id) - only needs file ID, not artifacts
 * - SvgViewer: Uses MediaSvg with identifier - never touches status or artifacts
 */
const canRenderWithoutProcessing = (fileState: NonErrorFileState): boolean => {
	const { mimeType, name, size } = fileState;

	// Text/code files via CodeViewer (10MB limit)
	if (isCodeViewerItem(name, mimeType) && size <= MAX_FILE_SIZE_SUPPORTED_BY_CODEVIEWER) {
		return true;
	}

	// PDF files via DocViewer
	if (mimeType === 'application/pdf') {
		return true;
	}

	// SVG files via SvgViewer
	if (mimeType === 'image/svg+xml') {
		return true;
	}

	return false;
};

/**
 * Creates a synthetic ProcessedFileState for native-rendered files.
 * These files don't need backend processing, so we normalize to 'processed'
 * to prevent unnecessary re-renders when the actual status changes.
 * Note: artifacts are not used by native viewers (CodeViewer, DocViewer, SvgViewer)
 * as they fetch the original binary directly via file ID.
 */
const createProcessedFileState = (fileState: NonErrorFileState): ProcessedFileState =>
	({
		status: 'processed',
		id: fileState.id,
		name: fileState.name,
		size: fileState.size,
		mediaType: fileState.mediaType,
		mimeType: fileState.mimeType,
		artifacts: {},
		preview: fileState.preview,
		createdAt: fileState.createdAt,
	}) as ProcessedFileState;

export const ItemViewerBase = ({
	identifier,
	showControls,
	onClose,
	previewCount,
	contextId,
	createAnalyticsEvent,
	viewerOptions,
	traceContext,
}: Props): React.ReactElement | null => {
	// States and Refs
	const [item, setItem] = useState<State>(Outcome.pending());
	const fileStateFlagsRef = useRef<FileStateFlags>({
		wasStatusUploading: false,
		wasStatusProcessing: false,
	});

	const createAnalyticsEventRef = useRef(createAnalyticsEvent);
	createAnalyticsEventRef.current = createAnalyticsEvent;

	// Hooks
	const mediaClient = useMediaClient();
	const { fileState } = useFileState(isExternalImageIdentifier(identifier) ? '' : identifier.id, {
		collectionName: isExternalImageIdentifier(identifier) ? '' : identifier.collectionName,
		skipRemote: isExternalImageIdentifier(identifier),
	});

	const renderDownloadButton = useCallback(
		(fileState: FileState, error: MediaViewerError) => {
			const collectionName = isFileIdentifier(identifier) ? identifier.collectionName : undefined;
			return (
				<ErrorViewDownloadButton
					fileState={fileState}
					mediaClient={mediaClient}
					error={error}
					collectionName={collectionName}
					traceContext={traceContext}
				/>
			);
		},
		[mediaClient, identifier, traceContext],
	);

	// Did mount

	useEffect(() => {
		if (isExternalImageIdentifier(identifier)) {
			return;
		}

		fireAnalytics(
			createCommencedEvent(identifier?.id, traceContext),
			createAnalyticsEventRef.current,
		);
		startMediaFileUfoExperience();
	}, [identifier, traceContext]);

	const isNativeFileOptimizationEnabled = fg('media_viewer_prevent_rerender_on_polling');

	useEffect(() => {
		// External images don't need backend subscriptions
		if (isExternalImageIdentifier(identifier)) {
			setItem(Outcome.successful('external-image'));
			return;
		}

		if (!fileState) {
			return;
		}

		const { status } = fileState;

		// Track status flags for analytics
		if (status === 'processing') {
			fileStateFlagsRef.current.wasStatusProcessing = true;
		} else if (status === 'uploading') {
			fileStateFlagsRef.current.wasStatusUploading = true;
		}

		// Handle error state
		if (status === 'error') {
			setItem(
				Outcome.failed(
					new MediaViewerError('itemviewer-fetch-metadata', toCommonMediaClientError(fileState)),
				),
			);
			return;
		}

		// Optimization: normalize native files to ProcessedFileState to prevent
		// unnecessary re-renders when status changes (e.g., processing → processed)
		if (isNativeFileOptimizationEnabled && canRenderWithoutProcessing(fileState)) {
			setItem((prev) => {
				// Keep stable reference if we already have a processed state for this file
				if (
					prev.status === 'SUCCESSFUL' &&
					prev.data &&
					isFileStateItem(prev.data) &&
					prev.data.id === fileState.id &&
					prev.data.status === 'processed'
				) {
					return prev;
				}
				// First load or different file: create normalized processed state
				return Outcome.successful(createProcessedFileState(fileState));
			});
			return;
		}

		// Non-native files: standard behavior
		setItem(Outcome.successful(fileState));
		// fileState object reference changes often when polling items (especially during processing); only re-run when fileState.status changes
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isNativeFileOptimizationEnabled ? fileState?.status : fileState, identifier]);

	const onSuccess = useCallback(() => {
		item.whenSuccessful((fileItem) => {
			if (isFileStateItem(fileItem)) {
				const fileAttributes = getFileAttributes(fileItem);
				fireAnalytics(
					createLoadSucceededEvent(fileAttributes, traceContext),
					createAnalyticsEventRef.current,
				);
				succeedMediaFileUfoExperience({
					fileAttributes,
					fileStateFlags: fileStateFlagsRef.current,
				});
			}
		});
	}, [item, traceContext]);

	const onLoadFail = useCallback(
		(mediaViewerError: MediaViewerError) => {
			setItem(Outcome.failed(mediaViewerError, fileState));
		},
		[fileState],
	);

	const renderItem = (fileItem: NonErrorFileState) => {
		const collectionName = isFileIdentifier(identifier) ? identifier.collectionName : undefined;
		const viewerProps = {
			mediaClient,
			item: fileItem,
			collectionName,
			onClose,
			previewCount,
			viewerOptions,
			traceContext,
		};

		const customRenderer = viewerOptions?.customRenderers?.find((renderer) =>
			renderer.shouldUseCustomRenderer({ fileItem }),
		);
		if (customRenderer) {
			return (
				<CustomViewer
					customRendererConfig={customRenderer}
					onError={onLoadFail}
					onSuccess={onSuccess}
					{...viewerProps}
				/>
			);
		}

		// TODO: fix all of the item errors

		if (isCodeViewerItem(fileItem.name, fileItem.mimeType)) {
			//Render error message if code file has size over 10MB.
			//Required by https://product-fabric.atlassian.net/browse/MEX-1788
			if (fileItem.size > MAX_FILE_SIZE_SUPPORTED_BY_CODEVIEWER) {
				return renderError(new MediaViewerError('codeviewer-file-size-exceeds'), fileItem);
			}

			return <CodeViewer onSuccess={onSuccess} onError={onLoadFail} {...viewerProps} />;
		}

		if (isFileIdentifier(identifier) && fileItem.mimeType === 'image/svg+xml') {
			return (
				<SvgViewer
					identifier={identifier}
					onLoad={onSuccess}
					onError={onLoadFail}
					onClose={onClose}
					traceContext={traceContext}
				/>
			);
		}

		const { mediaType } = fileItem;

		switch (mediaType) {
			case 'image':
				return (
					<ImageViewer
						onLoad={onSuccess}
						onError={onLoadFail}
						contextId={contextId}
						{...viewerProps}
					/>
				);
			case 'audio':
				return (
					<AudioViewer
						showControls={showControls}
						onCanPlay={onSuccess}
						onError={onLoadFail}
						{...viewerProps}
					/>
				);
			case 'video':
				return (
					<VideoViewer
						identifier={identifier}
						showControls={showControls}
						onCanPlay={onSuccess}
						onError={onLoadFail}
						{...viewerProps}
					/>
				);
			case 'doc':
				return <DocViewer onSuccess={onSuccess} onError={onLoadFail} {...viewerProps} />;
			case 'archive':
				return <ArchiveViewerLoader onSuccess={onSuccess} onError={onLoadFail} {...viewerProps} />;
		}
		return renderError(new MediaViewerError('unsupported'), fileItem);
	};

	const renderError = useCallback(
		(error: MediaViewerError, fileItem?: FileItem) => {
			if (fileItem) {
				let fileState: FileState;
				if (fileItem === 'external-image') {
					// external image error outcome
					fileState = { id: 'external-image', status: 'error' };
				} else {
					// FileState error outcome
					fileState = fileItem;
				}
				return (
					<ErrorMessage
						fileId={isFileIdentifier(identifier) ? identifier.id : 'undefined'}
						error={error}
						fileState={fileState}
						fileStateFlags={fileStateFlagsRef.current}
						traceContext={traceContext}
					>
						<Text>
							<FormattedMessage {...messages.try_downloading_file} />
						</Text>
						{renderDownloadButton(fileState, error)}
					</ErrorMessage>
				);
			} else {
				return (
					<ErrorMessage
						fileId={isFileIdentifier(identifier) ? identifier.id : 'undefined'}
						error={error}
						fileStateFlags={fileStateFlagsRef.current}
					/>
				);
			}
		},
		[identifier, renderDownloadButton, traceContext],
	);

	return item.match({
		successful: (fileItem) => {
			if (fileItem === 'external-image') {
				// render an external image
				const { dataURI, name } = identifier as ExternalImageIdentifier;
				return (
					<InteractiveImg
						src={dataURI}
						alt={name ?? ''}
						onLoad={() => {
							fireAnalytics(
								createLoadSucceededEvent({
									fileId: 'external-image',
								}),
								createAnalyticsEventRef.current,
							);
							succeedMediaFileUfoExperience({
								fileAttributes: {
									fileId: 'external-image',
								},
								fileStateFlags: fileStateFlagsRef.current,
							});
						}}
						onError={() => {
							setItem(Outcome.failed(new MediaViewerError('imageviewer-external-onerror')));
						}}
					/>
				);
			} else {
				// render a FileState fetched through media-client
				switch (fileItem.status) {
					case 'processed':
					case 'uploading':
					case 'processing':
						return renderItem(fileItem);
					case 'failed-processing':
						if (fileItem.mediaType === 'doc' && fileItem.mimeType === 'application/pdf') {
							return renderItem(fileItem);
						}
						return renderError(
							new MediaViewerError('itemviewer-file-failed-processing-status'),
							fileItem,
						);
					case 'error':
						return renderError(
							new MediaViewerError(
								'itemviewer-file-error-status',
								toCommonMediaClientError(fileItem),
							),
							fileItem,
						);
				}
			}
		},
		pending: () => <Spinner />,
		failed: (error) => renderError(error, item.data),
	});
};

const ViewerWithKey = (props: Props) => {
	const { identifier } = props;
	const key = isFileIdentifier(identifier) ? identifier.id : identifier.dataURI;
	return <ItemViewerBase {...props} key={key} />;
};

export const ItemViewer = withAnalyticsEvents()(ViewerWithKey);
