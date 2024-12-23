import React, { Component } from 'react';
import { Editor, EditorContext, type EditorProps, WithEditorActions } from '@atlaskit/editor-core';
import { ReactRenderer, type RendererProps } from '@atlaskit/renderer';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { type Props as BaseProps } from '../context/embedded-document';
import { type Mode } from '../context/context';
import { type Document as DocumentModel } from '../model';

export interface Props extends BaseProps {
	doc?: DocumentModel;
	isLoading?: boolean;
	hasError?: boolean;

	mode: Mode;
	editorProps?: Partial<EditorProps>;
	rendererProps?: Partial<RendererProps>;
}

const emptyDoc = '{ "type": "doc", "version": 1, "content": [] }';

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class Document extends Component<Props> {
	private renderToolbar() {
		const { mode, renderToolbar } = this.props;

		if (renderToolbar) {
			return <WithEditorActions render={(actions) => renderToolbar(mode, actions)} />;
		}

		return;
	}

	private renderTitle() {
		const { renderTitle, mode, doc } = this.props;

		if (renderTitle) {
			return renderTitle(mode, doc);
		}

		return;
	}

	private renderEditor() {
		const { doc, editorProps } = this.props;
		const { body = emptyDoc } = doc || {};

		return (
			<EditorContext>
				<Editor
					appearance="full-page"
					placeholder="Write something..."
					defaultValue={body}
					primaryToolbarComponents={this.renderToolbar()}
					contentComponents={this.renderTitle()}
					// Ignored via go/ees005
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...editorProps}
				/>
			</EditorContext>
		);
	}

	render() {
		const { doc, isLoading, hasError, mode, editorProps, rendererProps } = this.props;

		if (hasError) {
			return <div>Something went wrong 😔</div>;
		}

		if (isLoading) {
			return <div>Loading document... 🐨</div>;
		}

		switch (mode) {
			case 'create':
			case 'edit':
				return this.renderEditor();

			default:
				const { body = emptyDoc } = doc || {};

				let dataProviders: ProviderFactory | undefined;

				if (editorProps) {
					const { mentionProvider, emojiProvider, media } = editorProps;

					dataProviders = ProviderFactory.create({
						// Ignored via go/ees005
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						mentionProvider: mentionProvider!,
						// Ignored via go/ees005
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						emojiProvider: emojiProvider!,
					});

					if (media && media.provider) {
						dataProviders.setProvider('mediaProvider', media.provider);
					}
				}

				return (
					<ReactRenderer
						dataProviders={dataProviders}
						document={JSON.parse(body)}
						// Ignored via go/ees005
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...rendererProps}
					/>
				);
		}
	}
}
