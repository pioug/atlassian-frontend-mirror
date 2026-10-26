import React from 'react';

import {
	isImageRepresentationReady,
	isErrorFileState,
	addFileAttrsToUrl,
} from '@atlaskit/media-client';
import type { FileItem } from '@atlaskit/media-client/item';
import type { MediaClient } from '@atlaskit/media-client/media-client';
import type { MediaTraceContext } from '@atlaskit/media-common/analytics/types';
import { isImageMimeTypeSupportedByBrowser } from '@atlaskit/media-common/isMimeTypeSupportedByBrowser';
import type { FileState } from '@atlaskit/media-state/file-state';
import { getOrientation } from '@atlaskit/media-ui/imageMetaData/getOrientation';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { buildImgErrorDiagnostics } from '../../buildImgErrorDiagnostics';
import { Outcome } from '../../domain/outcome';
import { MediaViewerError } from '../../MediaViewerError';
import {
	getWarmedImageKey,
	hasWarmedImageForFile,
	takeWarmedImage,
	type WarmedImage,
} from '../../warmedImages';
import { BaseViewer } from '../base-viewer';
import { getImageViewerRequestParams, IMAGE_VIEWER_FETCH_MAX_RES } from './imageRequestParams';
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

	/** Counts `init` calls, so an `init` that a reset has replaced can tell it is stale. */
	private initRuns = 0;

	protected async init(): Promise<void> {
		const initRun = (this.initRuns += 1);
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
				// A hover or focus may already have started this exact request. Taking it
				// means the image downloads once, even while the warm-up is still in
				// flight. The viewer owns the download from here, so closing it aborts the
				// request. A taken request keeps the trace context of whoever started it.
				// Warm-ups only exist in the treatment arm of the
				// `platform_media_viewer_preload_on_hover` experiment, so there is no check
				// here: in control nothing is found and the viewer makes its own request.
				// The key carries the watermark version, so a warm-up made before a
				// watermark config change is not taken. The version is only resolved when
				// a warm-up for this file exists, so control makes the same requests as
				// before.
				let warmed: WarmedImage | undefined;
				if (hasWarmedImageForFile({ id: fileState.id, collectionName })) {
					try {
						const watermarkVersion = await mediaClient.getImageWatermarkVersion(collectionName);
						// Closed or reset while the version resolved. Leave the warm-up in the
						// store, which aborts it on expiry, rather than take it for nobody.
						if (!this.mounted || initRun !== this.initRuns) {
							return;
						}
						warmed = takeWarmedImage(
							getWarmedImageKey({ id: fileState.id, collectionName, watermarkVersion }),
						);
					} catch {
						// No version, so no warm-up can be matched. The viewer's own request below
						// reports the auth failure.
					}
				}

				let blob: Blob | undefined;

				if (warmed) {
					this.cancelImageFetch = () => warmed.controller.abort();
					try {
						blob = await warmed.image;
					} catch {
						// The warm-up failed. Fall through and request it again so the viewer
						// reports its own error if that fails too.
					}

					// Released while the warm-up was downloading, so there is nothing to show.
					if (warmed.controller.signal.aborted) {
						return;
					}
				}

				if (!blob) {
					const item = processedFileStateToMediaItem(fileState);

					const response = mediaClient.getImage(
						item.details.id,
						getImageViewerRequestParams(collectionName),
						controller,
						IMAGE_VIEWER_FETCH_MAX_RES,
						traceContext,
					);
					this.cancelImageFetch = () => controller?.abort();
					blob = await response;
				}

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
