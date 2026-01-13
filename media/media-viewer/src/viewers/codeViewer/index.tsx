import React, { type ComponentType } from 'react';
import {
	type MediaClient,
	type FileState,
	isErrorFileState,
	request,
	type ErrorFileState,
} from '@atlaskit/media-client';
import { Outcome } from '../../domain';
import { MediaViewerError } from '../../errors';
import { Spinner } from '../../loading';
import { type Props as RendererProps } from './codeViewerRenderer';
import { BaseViewer } from '../base-viewer';
import { DEFAULT_LANGUAGE, normaliseLineBreaks } from './util';
import { getLanguageType, getExtension } from '@atlaskit/media-ui/codeViewer';
import { msgToText } from './msg-parser';
import { type MediaTraceContext } from '@atlaskit/media-common';
import { CodeRendererAdvanced } from './CodeRendererAdvanced/CodeRendererAdvanced';
import { fg } from '@atlaskit/platform-feature-flags';

const moduleLoader = () =>
	import(/* webpackChunkName: "@atlaskit-internal_media-code-viewer" */ './codeViewerRenderer');

const componentLoader: () => Promise<ComponentType<RendererProps>> = () =>
	moduleLoader().then((module) => module.CodeViewRenderer);

export type Props = {
	mediaClient: MediaClient;
	item: Exclude<FileState, ErrorFileState>;
	collectionName?: string;
	onClose?: () => void;
	onError: (error: MediaViewerError) => void;
	onSuccess: () => void;
	traceContext: MediaTraceContext;
};

export class CodeViewer extends BaseViewer<string, Props> {
	static CodeViewerComponent: ComponentType<RendererProps>;

	protected get initialState() {
		return {
			content: Outcome.pending<string, MediaViewerError>(),
		};
	}

	protected async init(): Promise<void> {
		if (!CodeViewer.CodeViewerComponent) {
			await this.loadCodeViewer();
		}
		const { item, mediaClient, collectionName, onError } = this.props;

		if (item.status === 'processed' || item.status === 'processing') {
			try {
				const downloadUrl = await mediaClient.file.getFileBinaryURL(item.id, collectionName);
				const response = await request(downloadUrl, {
					method: 'GET',
					endpoint: '/file/{fileId}/binary',
				});
				const ext = getExtension(item.name);

				// Pass through EmailViewer logic
				if (ext === 'msg') {
					const arrayBuffer = await response.arrayBuffer();
					const src = msgToText(arrayBuffer);
					// email contents parsed successfully
					if (typeof src === 'string') {
						this.onMediaDisplayed();
						this.setState({
							content: Outcome.successful(normaliseLineBreaks(src)),
						});
					} else {
						throw new MediaViewerError('codeviewer-parse-email');
					}
				} else {
					const src = await response.text();
					this.onMediaDisplayed();
					this.setState({
						content: Outcome.successful(normaliseLineBreaks(src)),
					});
				}
			} catch (error) {
				const codeViewerError = new MediaViewerError(
					'codeviewer-fetch-src',
					error instanceof Error ? error : undefined,
				);
				this.setState({
					content: Outcome.failed(codeViewerError),
				});
				if (onError) {
					onError(codeViewerError);
				}
			}
		}
	}

	private async loadCodeViewer() {
		CodeViewer.CodeViewerComponent = await componentLoader();
		this.forceUpdate();
	}

	private getCodeLanguage(item: FileState) {
		if (!isErrorFileState(item)) {
			return getLanguageType(item.name, item.mimeType);
		}
		return DEFAULT_LANGUAGE;
	}

	protected release(): void {}

	protected renderSuccessful(content: string): React.JSX.Element {
		const { item, onClose, onSuccess, onError } = this.props;
		const { CodeViewerComponent } = CodeViewer;

		if (!CodeViewerComponent) {
			return <Spinner />;
		}

		if (fg('media_advanced_text_viewer')) {
			return (
				<CodeRendererAdvanced
					item={item}
					src={content}
					onSuccess={onSuccess}
					onError={onError}
					onClose={onClose}
				/>
			);
		}

		return (
			<CodeViewerComponent
				item={item}
				src={content}
				language={this.getCodeLanguage(this.props.item) || DEFAULT_LANGUAGE}
				onSuccess={onSuccess}
				onError={onError}
				onClose={onClose}
			/>
		);
	}
}
