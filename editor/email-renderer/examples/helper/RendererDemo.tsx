/* eslint-disable no-console */
import React from 'react';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { token } from '@atlaskit/tokens';

import { document as storyDataDocument } from './story-data';

import type { MetaDataContext } from '../../src';
import EmailSerializer from '../../src';

export interface DemoRendererProps {
	serializer: 'email';
	document?: object;
	maxHeight?: number;
	truncationEnabled?: boolean;
}

export interface DemoRendererState {
	input: string;
}
const context: MetaDataContext = {
	hydration: {
		mediaMetaData: {
			'media-type-image': {
				name: 'Dark wallpaper theme.jpg',
				mediaType: 'image',
				mimeType: 'image/jpeg',
				size: 54981,
			},
			'media-type-doc': {
				name: 'My bachelor thesis.pdf',
				mediaType: 'doc',
				mimeType: 'application/pdf',
				size: 12345,
			},
			'media-type-video': {
				name: 'Metallica full concert.mpeg',
				mediaType: 'video',
				mimeType: 'vide/mpeg',
				size: 982347,
			},
			'media-type-audio': {
				name: 'The sound of silence.mp3',
				mediaType: 'audio',
				mimeType: 'audio/mpeg',
				size: 98734,
			},
			'media-type-archive': {
				name: 'The Slackening.zip',
				mediaType: 'archive',
				mimeType: 'application/zip',
				size: 4383,
			},
			'media-type-unknown': {
				name: '',
				mediaType: 'unknown',
				mimeType: 'unknown',
				size: 54981,
			},
		},
	},
};
export default class RendererDemo extends React.Component<DemoRendererProps, DemoRendererState> {
	emailSerializer = new EmailSerializer(defaultSchema, {
		isImageStubEnabled: true,
		isInlineCSSEnabled: true,
	});
	emailRef?: HTMLIFrameElement;
	inputBox?: HTMLTextAreaElement | null;
	emailTextareaRef?: any;

	constructor(props: DemoRendererProps) {
		super(props);

		const doc = !!this.props.document ? this.props.document : storyDataDocument;

		this.state = {
			input: JSON.stringify(doc, null, 2),
		};
	}

	private onEmailRef = (ref: HTMLIFrameElement | null) => {
		this.emailRef = ref || undefined;

		if (ref && ref.contentDocument) {
			// reset padding/margin for empty iframe with about:src URL
			ref.contentDocument.body.style.padding = '0';
			ref.contentDocument.body.style.margin = '0';

			this.onComponentRendered();
		}
	};

	componentDidMount() {
		this.onComponentRendered();
	}

	componentDidUpdate() {
		this.onComponentRendered();
	}

	render() {
		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div ref="root" style={{ padding: token('space.250', '20px') }}>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<fieldset style={{ marginBottom: token('space.250', '20px') }}>
					<legend>Input</legend>
					<textarea
						id="renderer-value-input"
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							boxSizing: 'border-box',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							border: '1px solid lightgray',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							fontFamily: 'monospace',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							fontSize: 16,
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							padding: token('space.150', '12px'),
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							width: '100%',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							height: 320,
						}}
						ref={(ref) => {
							this.inputBox = ref;
						}}
						onChange={this.onDocumentChange}
						value={this.state.input}
					/>
					<span>
						<button onClick={this.copyHTMLToClipboard}>Copy HTML to clipboard</button>
						<textarea
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							style={{ width: '0px', height: '0px' }}
							ref={(ref) => {
								this.emailTextareaRef = ref;
							}}
						/>
					</span>
				</fieldset>
				{this.renderEmail()}
			</div>
		);
	}

	private onComponentRendered() {
		try {
			const doc = JSON.parse(this.state.input);
			const node = defaultSchema.nodeFromJSON(doc);
			const { result: html } = this.emailSerializer.serializeFragmentWithImages(
				node.content,
				context,
			);

			if (this.emailRef && this.emailRef.contentDocument && html) {
				this.emailRef.contentDocument.body.innerHTML = html;
				this.emailTextareaRef.value = html;
			}
		} catch (ex) {
			console.error(ex);
			// pass
		}
	}

	private renderEmail() {
		if (this.props.serializer !== 'email') {
			return null;
		}

		try {
			JSON.parse(this.state.input);

			return (
				<div>
					<h1>E-mail HTML</h1>
					{/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
					<iframe
						ref={this.onEmailRef}
						frameBorder="0"
						src="about:blank"
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={{ width: '100%', height: '800px' }}
					/>
				</div>
			);
		} catch (ex) {
			console.error(ex instanceof Error ? ex.stack : ex);
			return null;
		}
	}

	private copyHTMLToClipboard = () => {
		if (!this.emailTextareaRef) {
			return;
		}
		this.emailTextareaRef.select();
		document.execCommand('copy');
	};

	private onDocumentChange = () => {
		if (this.inputBox) {
			this.setState({ input: this.inputBox.value });
		}
	};
}
