import React from 'react';
import { Component, ReactElement } from 'react';
import styled from 'styled-components';
import { Actions, Context, Mode, State } from './context';
import { getProvider, Provider, ProviderProps } from '../provider';
import { Document } from '../model';
import { akEditorGutterPadding } from '@atlaskit/editor-shared-styles';

export const akEditorFullPageMaxWidth = 680;
const Content = styled.div`
  line-height: 24px;
  height: 100%;
  width: 100%;
  max-width: ${akEditorFullPageMaxWidth + akEditorGutterPadding * 2}px;
  padding-top: 50px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-bottom: 55px;

  & > * {
    padding: 0 32px;
  }
`;

export interface Props extends ProviderProps {
  /* The ARI for the resource that points or refers to this document e.g. a page in Confluence */
  objectId: string;

  /* The ID of the embedded document. */
  documentId?: string;

  /* The ARI for the container that owns the document e.g. a space in Confluence */
  containerId?: string;

  /* The language of the embedded document. */
  language?: string;

  /* The mode of the embedded document. View or edit. */
  mode?: Mode;

  renderTitle?: (mode: Mode, doc?: any) => ReactElement<any>;
  renderToolbar?: (mode: Mode, editorActions?: any) => ReactElement<any>;
}

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

  async componentDidMount() {
    const { documentId, language, objectId } = this.props;
    if (documentId) {
      await this.getDocument(documentId, language);
    } else {
      await this.getDocumentByObjectId(objectId, language);
    }
  }

  private getDocumentByObjectId = async (
    objectId: string,
    language?: string,
  ) => {
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

  private setDocumentMode = async (mode: Mode) => {
    this.setState({
      mode,
    });
  };

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

  private createDocument = async (body: any) => {
    const { objectId, language } = this.props;

    const doc = await this.provider.createDocument(
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

  render() {
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
