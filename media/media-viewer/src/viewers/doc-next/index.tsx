/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';
import { type MediaClient, type FileState } from '@atlaskit/media-client';
import { DOCUMENT_SCROLL_ROOT_ID, DocumentViewer } from '@atlaskit/media-document-viewer';
import { Outcome } from '../../domain';
import { MediaViewerError } from '../../errors';
import { BaseViewer } from '../base-viewer';
import { type MediaTraceContext } from '@atlaskit/media-common';
import { ZoomControls } from '../../zoomControls';
import { ZoomLevel } from '../../domain/zoomLevel';

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
};

const documentViewerStyles = css({
	height: '100vh',
	width: '100vw',
	overflow: 'auto',
});

export class DocViewer extends BaseViewer<string, Props, State> {
	private isObjectUrl = false;
	protected get initialState() {
		return {
			content: Outcome.pending<string, MediaViewerError>(),
			zoomLevel: new ZoomLevel(1.75),
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

	private getContent = async (pageStart: number, pageEnd: number) => {
		const src = await this.props.mediaClient.mediaStore.getDocumentContent(this.props.item.id, {
			pageStart,
			pageEnd,
			collectionName: this.props.collectionName,
		});
		return src;
	};

	private getPageImageUrl = async (pageNumber: number, zoom: number) => {
		const src = await this.props.mediaClient.mediaStore.getDocumentPageImage(this.props.item.id, {
			page: pageNumber,
			zoom,
			collectionName: this.props.collectionName,
		});
		return URL.createObjectURL(src);
	};

	private onZoomChange = (newZoomLevel: ZoomLevel) => {
		this.setState({ zoomLevel: newZoomLevel });
	};

	protected renderSuccessful() {
		return (
			<div css={documentViewerStyles} id={DOCUMENT_SCROLL_ROOT_ID}>
				<DocumentViewer
					getContent={this.getContent}
					getPageImageUrl={this.getPageImageUrl}
					zoom={this.state.zoomLevel.value}
				/>
				<ZoomControls onChange={this.onZoomChange} zoomLevel={this.state.zoomLevel} />
			</div>
		);
	}
}
