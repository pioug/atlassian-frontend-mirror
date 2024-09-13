import React from 'react';
import Loadable from 'react-loadable';
import {
	type MediaClient,
	type FileState,
	type ProcessedFileState,
	type UploadingFileState,
	type ProcessingFileState,
	type Identifier,
	isExternalImageIdentifier,
	isFileIdentifier,
	type ExternalImageIdentifier,
	type MediaSubscription,
	type ProcessingFailedState,
} from '@atlaskit/media-client';
import { FormattedMessage } from 'react-intl-next';
import { messages, type WithShowControlMethodProp } from '@atlaskit/media-ui';
import { isCodeViewerItem } from '@atlaskit/media-ui/codeViewer';
import { Outcome } from './domain';
import { Spinner } from './loading';
import deepEqual from 'deep-equal';
import ErrorMessage from './errorMessage';
import { MediaViewerError } from './errors';
import { ErrorViewDownloadButton } from './download';
import { withAnalyticsEvents, type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { createCommencedEvent } from './analytics/events/operational/commenced';
import { createLoadSucceededEvent } from './analytics/events/operational/loadSucceeded';
import { fireAnalytics, getFileAttributes } from './analytics';
import { InteractiveImg } from './viewers/image/interactive-img';
import ArchiveViewerLoader from './viewers/archiveSidebar/archiveViewerLoader';
import {
	getRandomHex,
	type MediaFeatureFlags,
	type MediaTraceContext,
} from '@atlaskit/media-common';
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
import { MediaClientProvider } from '@atlaskit/media-client-react';
import { type SvgViewerProps } from './viewers/svg';

const ImageViewer = Loadable({
	loader: (): Promise<React.ComponentType<ImageViewerProps>> =>
		import('./viewers/image').then((mod) => mod.ImageViewer),
	loading: () => <Spinner />,
});
const VideoViewer = Loadable({
	loader: (): Promise<React.ComponentType<VideoViewerProps>> =>
		import('./viewers/video').then((mod) => mod.VideoViewer),
	loading: () => <Spinner />,
});
const AudioViewer = Loadable({
	loader: (): Promise<React.ComponentType<AudioViewerProps>> =>
		import('./viewers/audio').then((mod) => mod.AudioViewer),
	loading: () => <Spinner />,
});
const DocViewer = Loadable({
	loader: (): Promise<React.ComponentType<DocViewerProps>> =>
		import('./viewers/doc').then((mod) => mod.DocViewer),
	loading: () => <Spinner />,
});
const CodeViewer = Loadable({
	loader: (): Promise<React.ComponentType<CodeViewerProps>> =>
		import('./viewers/codeViewer').then((mod) => mod.CodeViewer),
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
	mediaClient: MediaClient;
	onClose?: () => void;
	previewCount: number;
	contextId?: string;
	featureFlags?: MediaFeatureFlags;
}> &
	WithAnalyticsEventsProps &
	WithShowControlMethodProp;

export type FileItem = FileState | 'external-image';

export const isExternalImageItem = (fileItem: FileItem): fileItem is 'external-image' =>
	fileItem === 'external-image';

export const isFileStateItem = (fileItem: FileItem): fileItem is FileState =>
	!isExternalImageItem(fileItem);

export type State = {
	item: Outcome<FileItem, MediaViewerError>;
};

const initialState: State = {
	item: Outcome.pending(),
};

export const MAX_FILE_SIZE_SUPPORTED_BY_CODEVIEWER = 10 * 1024 * 1024;

export class ItemViewerBase extends React.Component<Props, State> {
	state: State = initialState;

	private subscription?: MediaSubscription;
	private fileStateFlags: FileStateFlags = {
		wasStatusUploading: false,
		wasStatusProcessing: false,
	};

	mounted = false;

	private traceContext: MediaTraceContext = { traceId: getRandomHex(8) };

	safeSetState = (newState: State) => {
		if (this.mounted) {
			this.setState(newState);
		}
	};

	UNSAFE_componentWillReceiveProps(nextProps: Props) {
		if (this.needsReset(this.props, nextProps)) {
			this.release();
			this.safeSetState(initialState);
		}
	}

	componentDidUpdate(oldProps: Props) {
		if (this.needsReset(oldProps, this.props)) {
			this.init(this.props);
		}
	}

	componentWillUnmount() {
		this.mounted = false;
		this.release();
	}

	componentDidMount() {
		this.mounted = true;
		this.init(this.props);
	}

	private onSuccess = () => {
		const { item } = this.state;
		item.whenSuccessful((fileItem) => {
			if (isFileStateItem(fileItem)) {
				const fileAttributes = getFileAttributes(fileItem);
				fireAnalytics(
					createLoadSucceededEvent(fileAttributes, this.traceContext),
					this.props.createAnalyticsEvent,
				);
				succeedMediaFileUfoExperience({
					fileAttributes,
					fileStateFlags: this.fileStateFlags,
				});
			}
		});
	};

	private onLoadFail = (mediaViewerError: MediaViewerError, data?: FileItem) => {
		const { item } = this.state;
		this.safeSetState({
			item: Outcome.failed(mediaViewerError, data || item.data),
		});
	};

	private onExternalImgSuccess = () => {
		fireAnalytics(
			createLoadSucceededEvent({
				fileId: 'external-image',
			}),
			this.props.createAnalyticsEvent,
		);
		succeedMediaFileUfoExperience({
			fileAttributes: {
				fileId: 'external-image',
			},
			fileStateFlags: this.fileStateFlags,
		});
	};

	private onExternalImgError = () => {
		this.safeSetState({
			item: Outcome.failed(new MediaViewerError('imageviewer-external-onerror')),
		});
	};

	private renderItem(
		fileState:
			| ProcessedFileState
			| UploadingFileState
			| ProcessingFileState
			| ProcessingFailedState,
	) {
		const { mediaClient, identifier, showControls, onClose, previewCount, contextId } = this.props;
		const collectionName = isFileIdentifier(identifier) ? identifier.collectionName : undefined;
		const viewerProps = {
			mediaClient,
			item: fileState,
			collectionName,
			onClose,
			previewCount,
		};

		if (isCodeViewerItem(fileState.name, fileState.mimeType)) {
			//Render error message if code file has size over 10MB.
			//Required by https://product-fabric.atlassian.net/browse/MEX-1788
			if (fileState.size > MAX_FILE_SIZE_SUPPORTED_BY_CODEVIEWER) {
				return this.renderError(new MediaViewerError('codeviewer-file-size-exceeds'), fileState);
			}

			return <CodeViewer onSuccess={this.onSuccess} onError={this.onLoadFail} {...viewerProps} />;
		}

		if (isFileIdentifier(identifier) && fileState.mimeType === `image/svg+xml`) {
			return (
				<MediaClientProvider clientConfig={mediaClient.config}>
					<SvgViewer
						identifier={identifier}
						onLoad={this.onSuccess}
						onError={this.onLoadFail}
						onClose={onClose}
						traceContext={this.traceContext}
					/>
				</MediaClientProvider>
			);
		}

		switch (fileState.mediaType) {
			case 'image':
				return (
					<ImageViewer
						onLoad={this.onSuccess}
						onError={this.onLoadFail}
						contextId={contextId}
						traceContext={this.traceContext}
						{...viewerProps}
					/>
				);
			case 'audio':
				return (
					<AudioViewer
						showControls={showControls}
						onCanPlay={this.onSuccess}
						onError={this.onLoadFail}
						{...viewerProps}
					/>
				);
			case 'video':
				return (
					<VideoViewer
						showControls={showControls}
						onCanPlay={this.onSuccess}
						onError={this.onLoadFail}
						{...viewerProps}
					/>
				);
			case 'doc':
				return (
					<DocViewer
						onSuccess={this.onSuccess}
						onError={(err) => {
							this.onLoadFail(err, fileState);
						}}
						{...viewerProps}
					/>
				);
			case 'archive':
				return (
					<ArchiveViewerLoader
						onSuccess={this.onSuccess}
						onError={this.onLoadFail}
						{...viewerProps}
					/>
				);
		}

		return this.renderError(new MediaViewerError('unsupported'), fileState);
	}

	private renderError(error: MediaViewerError, fileItem?: FileItem) {
		const { identifier } = this.props;
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
					fileStateFlags={this.fileStateFlags}
					traceContext={this.traceContext}
				>
					<p>
						<FormattedMessage {...messages.try_downloading_file} />
					</p>
					{this.renderDownloadButton(fileState, error)}
				</ErrorMessage>
			);
		} else {
			return (
				<ErrorMessage
					fileId={isFileIdentifier(identifier) ? identifier.id : 'undefined'}
					error={error}
					fileStateFlags={this.fileStateFlags}
				/>
			);
		}
	}

	render() {
		const { item } = this.state;
		const { identifier } = this.props;

		return item.match({
			successful: (fileItem) => {
				if (fileItem === 'external-image') {
					// render an external image
					const { dataURI } = identifier as ExternalImageIdentifier;
					return (
						<InteractiveImg
							src={dataURI}
							onLoad={this.onExternalImgSuccess}
							onError={this.onExternalImgError}
						/>
					);
				} else {
					// render a FileState fetched through media-client
					switch (fileItem.status) {
						case 'processed':
						case 'uploading':
						case 'processing':
							return this.renderItem(fileItem);
						case 'failed-processing':
							if (fileItem.mediaType === 'doc' && fileItem.mimeType === 'application/pdf') {
								return this.renderItem(fileItem);
							}
							return this.renderError(
								new MediaViewerError('itemviewer-file-failed-processing-status'),
								fileItem,
							);
						case 'error':
							return this.renderError(
								new MediaViewerError('itemviewer-file-error-status'),
								fileItem,
							);
					}
				}
			},
			pending: () => <Spinner />,
			failed: (error, data) => this.renderError(error, data),
		});
	}

	private renderDownloadButton(fileState: FileState, error: MediaViewerError) {
		const { mediaClient, identifier } = this.props;
		const collectionName = isFileIdentifier(identifier) ? identifier.collectionName : undefined;
		return (
			<ErrorViewDownloadButton
				fileState={fileState}
				mediaClient={mediaClient}
				error={error}
				collectionName={collectionName}
			/>
		);
	}

	updateFileStateFlag(fileState?: FileState) {
		if (!fileState) {
			return;
		}
		const { status } = fileState;
		if (status === 'processing') {
			this.fileStateFlags.wasStatusProcessing = true;
		} else if (status === 'uploading') {
			this.fileStateFlags.wasStatusUploading = true;
		}
	}

	private init(props: Props) {
		const { mediaClient, identifier, createAnalyticsEvent } = props;

		if (isExternalImageIdentifier(identifier)) {
			// external images do not need to talk to our backend,
			// so therefore no need for media-client subscriptions.
			// just set a successful outcome of type "external-image".
			this.safeSetState({
				item: Outcome.successful('external-image'),
			});
			return;
		}

		const { id } = identifier;

		fireAnalytics(createCommencedEvent(id, this.traceContext), createAnalyticsEvent);
		startMediaFileUfoExperience();
		this.subscription = mediaClient.file
			.getFileState(id, {
				collectionName: identifier.collectionName,
			})
			.subscribe({
				next: (file) => {
					this.updateFileStateFlag(file);
					this.safeSetState({
						item: Outcome.successful(file),
					});
				},
				error: (error: Error) => {
					this.safeSetState({
						item: Outcome.failed(new MediaViewerError('itemviewer-fetch-metadata', error)),
					});
				},
			});
	}

	private needsReset(propsA: Props, propsB: Props) {
		return !deepEqual(propsA.identifier, propsB.identifier);
	}

	private release() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}
}

export const ItemViewer = withAnalyticsEvents()(ItemViewerBase);
