import React, { Component } from 'react';
import type { ReactElement } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from 'styled-components';
import type { Actions, Mode, State } from './context';
import { Context } from './context';
import type { Provider } from '../provider/provider';
import type { ProviderProps } from '../provider';
import { getProvider } from '../provider';
import type { Document } from '../model';
import { akEditorGutterPaddingDynamic } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

export const akEditorFullPageMaxWidth = 680;
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Content = styled.div({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: '24px',
	height: '100%',
	width: '100%',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	maxWidth: `${akEditorFullPageMaxWidth + akEditorGutterPaddingDynamic() * 2}px`,
	paddingTop: token('space.600', '48px'),
	margin: '0 auto',
	display: 'flex',
	flexDirection: 'column',
	flexGrow: 1,
	paddingBottom: token('space.600', '48px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > *': {
		padding: `0 ${token('space.400', '32px')}`,
	},
});

export interface Props extends ProviderProps {
	children?: React.ReactNode;

	/* The ARI for the container that owns the document e.g. a space in Confluence */
	containerId?: string;

	/* The ID of the embedded document. */
	documentId?: string;

	/* The language of the embedded document. */
	language?: string;

	/* The mode of the embedded document. View or edit. */
	mode?: Mode;

	/* The ARI for the resource that points or refers to this document e.g. a page in Confluence */
	objectId: string;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	renderTitle?: (mode: Mode, doc?: any) => ReactElement<any>;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	renderToolbar?: (mode: Mode, editorActions?: any) => ReactElement<any>;
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class EmbeddedDocument extends Component<Props, State> {
	private actions: Actions;
	private provider: Provider;

	constructor(props: Props) {
		super(props);

		this.actions = {
			getDocument: this.getDocument,
			setDocumentMode: this.setDocumentMode,
			updateDocument: this.updateDocument,
			createDocument: this.createDocument,
			getDocumentByObjectId: this.getDocumentByObjectId,
		};

		this.provider = getProvider(props);

		this.state = {
			mode: props.mode || 'view',
			isLoading: true,
		};
	}

	async componentDidMount(): Promise<void> {
		const { documentId, language, objectId } = this.props;
		if (documentId) {
			await this.getDocument(documentId, language);
		} else {
			await this.getDocumentByObjectId(objectId, language);
		}
	}

	private getDocumentByObjectId = async (objectId: string, language?: string) => {
		this.setState({
			isLoading: true,
		});
		const doc = await this.provider.getDocumentByObjectId(objectId, language);
		this.setDocumentState(doc);
	};

	private getDocument = async (documentId: string, language?: string) => {
		this.setState({
			isLoading: true,
		});

		const doc = await this.provider.getDocument(documentId, language);
		this.setDocumentState(doc);
	};

	// Ignored via go/ees005
	// eslint-disable-next-line require-await
	private setDocumentMode = async (mode: Mode) => {
		this.setState({
			mode,
		});
	};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private updateDocument = async (body: any) => {
		const { documentId, objectId, language } = this.state.doc || this.props;

		if (!documentId) {
			return this.createDocument(body);
		}

		const doc = await this.provider.updateDocument(
			documentId,
			JSON.stringify(body),
			objectId,
			'',
			language,
		);

		if (doc) {
			this.setState({
				doc,
				mode: 'view',
			});
			return doc;
		} else {
			this.setState({
				hasError: true,
				mode: 'view',
			});

			throw new Error('Failed to update document');
		}
	};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private createDocument = async (body: any) => {
		const { objectId, language } = this.props;

		const doc = await this.provider.createDocument(JSON.stringify(body), objectId, '', language);

		if (doc) {
			this.setState({
				doc,
				mode: 'view',
			});

			return doc;
		} else {
			this.setState({
				hasError: true,
				mode: 'view',
			});

			throw new Error('Failed to create document');
		}
	};

	private setDocumentState = (doc: Document | null) => {
		if (doc) {
			this.setState({
				isLoading: false,
				doc,
			});
		} else {
			this.setState({
				isLoading: false,
				mode: 'edit',
			});
		}
	};

	/**
	 * Toolbar will only be rendered here if we're in "view"-mode.
	 *
	 * In all other modes, the toolbar rendering will be triggered
	 * by the Document-component.
	 */
	private renderToolbar() {
		const { mode } = this.state;
		const { renderToolbar } = this.props;

		if (mode !== 'view' || !renderToolbar) {
			return;
		}

		return renderToolbar(mode);
	}

	/**
	 * Title will only be rendered here if we're in "view"-mode.
	 *
	 * In all other modes, the title rendering will be triggered
	 * by the Document-component.
	 */
	private renderTitle() {
		const { mode, doc } = this.state;
		const { renderTitle } = this.props;

		if (mode !== 'view' || !renderTitle) {
			return;
		}

		return renderTitle(mode, doc);
	}

	private renderContent() {
		const { mode } = this.state;
		if (mode === 'view') {
			return (
				<>
					{this.renderToolbar()}
					<Content>
						{this.renderTitle()}
						{this.props.children}
					</Content>
				</>
			);
		}

		return this.props.children;
	}

	render(): React.JSX.Element {
		const { renderTitle, renderToolbar } = this.props;
		return (
			<Context.Provider
				value={{
					value: this.state,
					actions: this.actions,
					renderProps: {
						renderTitle,
						renderToolbar,
					},
				}}
			>
				{this.renderContent()}
			</Context.Provider>
		);
	}
}
