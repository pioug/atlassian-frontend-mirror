import React from 'react';
import { type MediaClient, type FileState } from '@atlaskit/media-client';
import { Outcome } from '../../domain';
import { MediaViewerError } from '../../errors';
import { BaseViewer } from '../base-viewer';
import { type MediaTraceContext } from '@atlaskit/media-common';
import { ZoomLevel } from '../../domain/zoomLevel';
import { DocViewer as DocViewerComponent } from './doc-viewer';

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
	zoomLevel: ZoomLevel;
	isPasswordProtected: boolean;
	password?: string;
	hasPasswordError: boolean;
};
export class DocViewer extends BaseViewer<string, Props, State> {
	private isObjectUrl = false;
	protected get initialState() {
		return {
			content: Outcome.pending<string, MediaViewerError>(),
			zoomLevel: new ZoomLevel(1.75),
			isPasswordProtected: false,
			hasPasswordError: false,
		};
	}

	protected needsReset(propsA: Props, propsB: Props): boolean {
		if (this.state.content.status === 'SUCCESSFUL') {
			return false;
		}

		return propsA.item.status !== propsB.item.status;
	}

	protected async init() {
		const { item } = this.props;
		this.setState({
			content: Outcome.successful(item.id),
		});
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

	protected renderSuccessful() {
		return (
			<DocViewerComponent
				mediaClient={this.props.mediaClient}
				fileState={this.props.item}
				collectionName={this.props.collectionName}
				onError={this.props.onError}
				traceContext={this.props.traceContext}
			/>
		);
	}
}
