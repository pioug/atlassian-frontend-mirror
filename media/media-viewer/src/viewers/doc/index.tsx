import React from 'react';
import { type MediaClient, type FileState, isPreviewableFileState } from '@atlaskit/media-client';
import { Outcome } from '../../domain';
import { MediaViewerError } from '../../errors';
import { PDFRenderer } from './pdfRenderer';
import { BaseViewer } from '../base-viewer';
import { getObjectUrlFromFileState } from '../../utils/getObjectUrlFromFileState';
import { type MediaTraceContext } from '@atlaskit/media-common';

export type Props = {
	mediaClient: MediaClient;
	item: FileState;
	collectionName?: string;
	onClose?: () => void;
	onError: (error: MediaViewerError) => void;
	onSuccess: () => void;
	traceContext: MediaTraceContext;
};

export type State = {
	content: Outcome<string, MediaViewerError>;
};

export class DocViewer extends BaseViewer<string, Props, State> {
	private isObjectUrl = false;
	protected get initialState() {
		return {
			content: Outcome.pending<string, MediaViewerError>(),
		};
	}

	protected needsReset(propsA: Props, propsB: Props): boolean {
		if (this.state.content.status === 'SUCCESSFUL') {
			return false;
		}

		return propsA.item.status !== propsB.item.status;
	}

	protected async init() {
		const { item, mediaClient, collectionName, onError } = this.props;

		if (isPreviewableFileState(item) && item.mimeType.toLowerCase() === 'application/pdf') {
			const src = await getObjectUrlFromFileState(item);
			if (src) {
				this.isObjectUrl = true;
				this.setState({
					content: Outcome.successful(src),
				});
				return;
			}
		}
		if (item.status === 'processed') {
			try {
				const src = await mediaClient.file.getArtifactURL(
					item.artifacts,
					'document.pdf',
					collectionName,
				);
				this.onMediaDisplayed();
				this.setState({
					content: Outcome.successful(src),
				});
			} catch (error) {
				const docError = new MediaViewerError(
					'docviewer-fetch-url',
					error instanceof Error ? error : undefined,
				);
				this.setState({
					content: Outcome.failed(docError),
				});
				if (onError) {
					onError(docError);
				}
			}
		} else if (item.status === 'failed-processing') {
			try {
				const src = await mediaClient.file.getFileBinaryURL(
					item.id,
					collectionName,
					2940, // 2940 seconds ~= 50 mins
				);
				this.onMediaDisplayed();
				this.setState({
					content: Outcome.successful(src),
				});
			} catch (error) {
				const docError = new MediaViewerError(
					'docviewer-fetch-url',
					error instanceof Error ? error : undefined,
				);
				this.setState({
					content: Outcome.failed(docError),
				});
				if (onError) {
					onError(docError);
				}
			}
		}
	}

	protected release() {
		if (!this.isObjectUrl) {
			return;
		}
		const { content } = this.state;
		if (content.data) {
			URL.revokeObjectURL(content.data);
		}
	}

	protected renderSuccessful(content: string) {
		const { item, onClose, onSuccess, onError } = this.props;

		return (
			<PDFRenderer
				item={item}
				src={content}
				onSuccess={onSuccess}
				onError={onError}
				onClose={onClose}
			/>
		);
	}
}
