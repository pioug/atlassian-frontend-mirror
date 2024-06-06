import React from 'react';
import { type MediaClient, type FileState, isPreviewableFileState } from '@atlaskit/media-client';
import { Outcome } from '../../domain';
import { MediaViewerError } from '../../errors';
import { PDFRenderer } from './pdfRenderer';
import { BaseViewer } from '../base-viewer';
import { getObjectUrlFromFileState } from '../../utils/getObjectUrlFromFileState';

export type Props = {
	mediaClient: MediaClient;
	item: FileState;
	collectionName?: string;
	onClose?: () => void;
	onError: (error: MediaViewerError) => void;
	onSuccess: () => void;
};

export type State = {
	content: Outcome<string, MediaViewerError>;
};

export class DocViewer extends BaseViewer<string, Props> {
	protected get initialState() {
		return {
			content: Outcome.pending<string, MediaViewerError>(),
		};
	}

	protected async init() {
		const { item, mediaClient, collectionName, onError } = this.props;

		if (isPreviewableFileState(item)) {
			const src = await getObjectUrlFromFileState(item);
			if (!src) {
				this.setState({
					content: Outcome.pending(),
				});
				return;
			}
			this.setState({
				content: Outcome.successful(src),
			});
		} else if (item.status === 'processed') {
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
		const { content } = this.state;
		if (!content.data) {
			return;
		}

		URL.revokeObjectURL(content.data);
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
