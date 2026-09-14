import React from 'react';

import {
	type MediaClient,
	type FileItem,
	type FileState,
	isImageRepresentationReady,
	isErrorFileState,
	addFileAttrsToUrl,
} from '@atlaskit/media-client';
import { isImageMimeTypeSupportedByBrowser } from '@atlaskit/media-common';
import { type MediaTraceContext } from '@atlaskit/media-common';
import { getOrientation } from '@atlaskit/media-ui/imageMetaData/getOrientation';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { MediaViewerError } from '../../MediaViewerError';
import { buildImgErrorDiagnostics } from '../../buildImgErrorDiagnostics';
import { Outcome } from '../../domain/outcome';
import { BaseViewer } from '../base-viewer';
import { InteractiveImg } from './interactive-img';

export type ObjectUrl = string;

export type ImageViewerProps = {
	mediaClient: MediaClient;
	item: FileState;
	collectionName?: string;
	onLoad: () => void;
	onError: (error: MediaViewerError) => void;
	onClose?: () => void;
	contextId?: string;
	traceContext: MediaTraceContext;
};

export interface ImageViewerContent {
	objectUrl: ObjectUrl;
	originalBinaryImageUrl?: string;
	orientation?: number;
	clientId?: string;
}

function processedFileStateToMediaItem(file: FileState): FileItem {
	return {
		type: 'file',
		details: {
			id: file.id,
		},
	};
}

export class ImageViewer extends BaseViewer<ImageViewerContent, ImageViewerProps> {
	protected get initialState(): {
		content: Outcome<ImageViewerContent, MediaViewerError>;
	} {
		return { content: Outcome.pending<ImageViewerContent, MediaViewerError>() };
	}

	private cancelImageFetch?: () => void;

	protected async init(): Promise<void> {
		const { item: fileState, mediaClient, collectionName, traceContext } = this.props;
		if (isErrorFileState(fileState)) {
			return;
		}

		const controller = typeof AbortController !== 'undefined' ? new AbortController() : undefined;

		try {
			let orientation = 1;
			let objectUrl: string;
			let originalBinaryImageUrl: string | undefined;
			let isLocalFileReference: boolean = false;
			let clientId: string | undefined;
			// The MIME type of the actual bytes that will be rendered.
			let renderedBlobMimeType: string | undefined;

			// Fetch clientId for cross-client copy
			try {
				clientId = await mediaClient.getClientId(collectionName);
			} catch {
				// ClientId is optional, silently fail
			}

			const { preview } = fileState;
			if (preview) {
				const { value, origin } = await preview;
				if (value instanceof Blob) {
					orientation = await getOrientation(value as File);
					objectUrl = URL.createObjectURL(value);
					isLocalFileReference = origin === 'local';
					renderedBlobMimeType = value.type || undefined;
				} else {
					objectUrl = value;
				}
			} else if (isImageRepresentationReady(fileState)) {
				const item = processedFileStateToMediaItem(fileState);

				const response = mediaClient.getImage(
					item.details.id,
					{
						collection: collectionName,
						mode: 'fit',
					},
					controller,
					true,
					traceContext,
				);
				this.cancelImageFetch = () => controller?.abort();
				const blob = await response;
				renderedBlobMimeType = blob.type || undefined;
				objectUrl = URL.createObjectURL(blob);
			} else {
				this.setState({
					content: Outcome.pending(),
				});
				return;
			}

			if (
				!isLocalFileReference && // objectUrl at this point is binary file already
				!isErrorFileState(fileState) &&
				fileState.status !== 'uploading' &&
				fileState.mediaType === 'image'
			) {
				// Prefer the MIME type of the actual fetched bytes over the declared one.

				const effectiveMimeType = fg('platform_media_unsupported_mime_routing')
					? (renderedBlobMimeType ?? fileState.mimeType)
					: fileState.mimeType;
				if (isImageMimeTypeSupportedByBrowser(effectiveMimeType)) {
					originalBinaryImageUrl = await mediaClient.file.getFileBinaryURL(
						fileState.id,
						collectionName,
					);
				} else if (fg('platform_media_unsupported_mime_routing')) {
					// Route unsupported MIME types browser can't natively decode straight to the
					// unsupported/download view instead of handing a guaranteed-undecodable blob
					// to <img>, which would only ever fire onerror and
					// surface as an opaque `imageviewer-src-onerror` failure.
					this.revokeObjectUrl(objectUrl);
					const unsupportedError = new MediaViewerError('imageviewer-unsupported-mime');
					this.setState({
						content: Outcome.failed(unsupportedError),
					});
					this.props.onError(unsupportedError);
					return;
				}
			}

			this.setState({
				content: Outcome.successful({
					objectUrl,
					orientation,
					originalBinaryImageUrl,
					clientId,
				}),
			});
		} catch (err) {
			// TODO : properly handle aborted requests (MS-2843)
			if (!controller?.signal.aborted) {
				const imgError = new MediaViewerError(
					'imageviewer-fetch-url',
					err instanceof Error ? err : undefined,
				);
				this.setState({
					content: Outcome.failed(imgError),
				});
				this.props.onError(imgError);
			}
		}
	}

	protected release(): void {
		if (this.cancelImageFetch) {
			this.cancelImageFetch();
		}

		this.state.content.whenSuccessful(({ objectUrl }) => {
			this.revokeObjectUrl(objectUrl);
		});
	}

	// This method is spied on by some test cases, so don't rename or remove it.
	public revokeObjectUrl(objectUrl: string): void {
		URL.revokeObjectURL(objectUrl);
	}

	protected renderSuccessful(content: ImageViewerContent): React.JSX.Element | null {
		const { item, onClose, contextId, collectionName } = this.props;
		if (isErrorFileState(item)) {
			return null;
		}
		const src = contextId
			? addFileAttrsToUrl(content.objectUrl, {
					id: item.id,
					contextId,
					collection: collectionName,
					clientId: content.clientId ?? '',
				})
			: content.objectUrl;

		return (
			<InteractiveImg
				onLoad={this.onLoad}
				onError={this.onImgError}
				src={src}
				alt={item.name}
				originalBinaryImageSrc={content.originalBinaryImageUrl}
				orientation={content.orientation}
				onClose={onClose}
			/>
		);
	}

	private onLoad = () => {
		this.props.onLoad();
		this.onMediaDisplayed();
	};

	private onImgError = (event?: React.SyntheticEvent<HTMLImageElement, Event>) => {
		let secondaryError: Error | undefined;
		try {
			secondaryError = buildImgErrorDiagnostics(this.props.item, event);
		} catch {
			secondaryError = undefined;
		}
		this.props.onError(new MediaViewerError('imageviewer-src-onerror', secondaryError));
	};
}
