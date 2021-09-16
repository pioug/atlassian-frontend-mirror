/* eslint-disable no-console */
import URLSearchParams from 'url-search-params';
import styled from 'styled-components';
import React from 'react';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';

import Editor from './../src/editor';
import EditorContext from './../src/ui/EditorContext';
import { LOCALSTORAGE_defaultTitleKey } from './5-full-page';
import WithEditorActions from './../src/ui/WithEditorActions';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import { getEmojiProvider } from '@atlaskit/util-data-test/get-emoji-provider';
import { mentionResourceProviderWithResolver } from '@atlaskit/util-data-test/mention-story-data';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';
import { customInsertMenuItems } from '@atlaskit/editor-test-helpers/mock-insert-menu';
import { createSocketIOCollabProvider } from '@atlaskit/collab-provider/socket-io-provider';
import { Provider } from '@atlaskit/collab-provider';
import { EditorActions } from '../src';
import { TitleInput } from '../example-helpers/PageElements';

export const getRandomUser = () => {
  return Math.floor(Math.random() * 10000).toString();
};

const defaultCollabUrl =
  'https://pf-collab-service--app.ap-southeast-2.dev.atl-paas.net/ccollab';

export const Content: any = styled.div`
  padding: 0 20px;
  height: 50%;
  background: #fff;
  box-sizing: border-box;
`;
Content.displayName = 'Content';

const SaveAndCancelButtons = (props: { editorActions: EditorActions }) => (
  <ButtonGroup>
    <Button
      appearance="primary"
      onClick={() =>
        props.editorActions
          .getValue()
          .then((value) => console.log(value.toJSON()))
      }
    >
      Publish
    </Button>
    <Button appearance="subtle" onClick={() => props.editorActions.clear()}>
      Close
    </Button>
  </ButtonGroup>
);

interface DropzoneEditorWrapperProps {
  children: (container: HTMLElement) => React.ReactNode;
}

class DropzoneEditorWrapper extends React.Component<
  DropzoneEditorWrapperProps,
  {}
> {
  dropzoneContainer: HTMLElement | null = null;

  handleRef = (node: HTMLElement) => {
    this.dropzoneContainer = node;
    this.forceUpdate();
  };

  render() {
    return (
      <Content innerRef={this.handleRef}>
        {this.dropzoneContainer
          ? this.props.children(this.dropzoneContainer)
          : null}
      </Content>
    );
  }
}

const mediaProvider = storyMediaProviderFactory();

export type Props = {
  onTitleChange?: (title: string) => void;
};
export type State = {
  isInviteToEditButtonSelected: boolean;
  documentId?: string;
  collabUrl?: string;
  documentIdInput?: HTMLInputElement;
  collabUrlInput?: HTMLInputElement;
  hasError?: boolean;
  title?: string;
};

const getQueryParam = (param: string) => {
  const win = window.parent || window;
  const urlParams = new URLSearchParams(win.document.location.search);
  return urlParams.get(param);
};
export default class Example extends React.Component<Props, State> {
  state = {
    isInviteToEditButtonSelected: false,
    documentId: getQueryParam('documentId'),
    collabUrl: getQueryParam('collabUrl') || defaultCollabUrl,
    documentIdInput: undefined,
    collabUrlInput: undefined,
    hasError: false,
    title: localStorage.getItem(LOCALSTORAGE_defaultTitleKey) || '',
  };

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  renderErrorFlag() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            margin: 0,
            backgroundColor: '#FF5630',
            padding: '10px',
          }}
        >
          <strong>NOTE!</strong> Something went wrong in the editor. You may be
          out of sync.
        </div>
      );
    }
    return;
  }

  renderDocumentId() {
    return (
      <div
        style={{
          margin: 0,
          backgroundColor: '#00B8D9',
          padding: '10px',
        }}
      >
        <div>
          <strong>DocumentId:</strong> {this.state.documentId}
        </div>
        <div>
          <strong>CollabUrl:</strong> {this.state.collabUrl}
        </div>
      </div>
    );
  }

  renderEditor() {
    const { documentId, collabUrl } = this.state;
    // Enable the debug log
    (window as any).COLLAB_PROVIDER_LOGGER = true;
    const collabProvider = createSocketIOCollabProvider({
      url: collabUrl,
      documentAri: `ari:cloud:confluence:collab-test:blog/${documentId}`,
    });
    collabProvider.on('error', (err) => {
      console.error('error from collabProvider:', {
        message: err.message,
        code: err.code,
        status: err.status,
      });
    });
    collabProvider.on('metadata:changed', (data: any) => {
      this.setState({
        title: data.title,
      });
    });

    return (
      <div>
        {this.renderErrorFlag()}
        {this.renderDocumentId()}
        <DropzoneEditorWrapper>
          {(parentContainer) => (
            <EditorContext>
              <Editor
                appearance="full-page"
                allowStatus={true}
                allowAnalyticsGASV3={true}
                allowLayouts={true}
                allowTextColor={true}
                allowTables={{
                  advanced: true,
                  allowColumnSorting: true,
                  allowAddColumnWithCustomStep: true,
                }}
                allowTemplatePlaceholders={{ allowInserting: true }}
                media={{
                  provider: mediaProvider,
                  allowMediaSingle: true,
                  customDropzoneContainer: parentContainer,
                }}
                allowPanel={true}
                emojiProvider={getEmojiProvider()}
                mentionProvider={Promise.resolve(
                  mentionResourceProviderWithResolver,
                )}
                taskDecisionProvider={Promise.resolve(
                  getMockTaskDecisionResource(),
                )}
                contextIdentifierProvider={storyContextIdentifierProviderFactory()}
                sanitizePrivateContent={true}
                collabEdit={{
                  useNativePlugin: true,
                  provider: Promise.resolve(collabProvider),
                  inviteToEditHandler: this.inviteToEditHandler,
                  isInviteToEditButtonSelected: this.state
                    .isInviteToEditButtonSelected,
                }}
                placeholder="Write something..."
                shouldFocus={false}
                primaryToolbarComponents={
                  <WithEditorActions
                    render={(actions) => (
                      <SaveAndCancelButtons editorActions={actions} />
                    )}
                  />
                }
                allowExtension={true}
                insertMenuItems={customInsertMenuItems}
                extensionHandlers={extensionHandlers}
                contentComponents={
                  <WithEditorActions
                    render={(actions) => (
                      <>
                        <TitleInput
                          value={this.state.title}
                          provider={collabProvider}
                          onChange={this.handleTitleChange}
                          onKeyDown={(e: KeyboardEvent) => {
                            this.onKeyPressed(e, actions);
                          }}
                        />
                      </>
                    )}
                  />
                }
              />
            </EditorContext>
          )}
        </DropzoneEditorWrapper>
      </div>
    );
  }

  private handleRef = (input: HTMLInputElement) => {
    if (input) {
      if (input.name === 'documentId') {
        this.setState({
          documentIdInput: input,
        });
      }

      if (input.name === 'collabUrl') {
        this.setState({
          collabUrlInput: input,
        });
      }
    }
  };

  private onJoin = () => {
    const { documentIdInput, collabUrlInput } = this.state;
    if (documentIdInput) {
      const documentId = (documentIdInput! as HTMLInputElement).value;
      const collabUrl =
        (collabUrlInput! as HTMLInputElement).value || defaultCollabUrl;
      if (documentId) {
        try {
          const win = window.parent || window;
          const url = new URL(win.location.href);
          url.searchParams.set('documentId', documentId);
          url.searchParams.set('collabUrl', collabUrl);
          win.history.pushState({}, '', url.toString());
        } catch (err) {}
        this.setState({
          documentId,
          collabUrl,
        });
      }
    }
  };

  render() {
    if (this.state.documentId) {
      return this.renderEditor();
    }

    return (
      <form onSubmit={this.onJoin}>
        Document name:
        <input name="documentId" ref={this.handleRef} />
        Collab url:
        <input name="collabUrl" ref={this.handleRef} />
        <label>
          {' '}
          Default to <b>{defaultCollabUrl}</b>
        </label>
        <br />
        <button type="submit">Join</button>
      </form>
    );
  }

  private inviteToEditHandler = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({
      isInviteToEditButtonSelected: !this.state.isInviteToEditButtonSelected,
    });
    console.log('target', event.target);
  };
  private onKeyPressed = (e: KeyboardEvent, actions: EditorActions) => {
    if ((e.key === 'Tab' && !e.shiftKey) || e.key === 'Enter') {
      // Move to the editor view
      const target = e.currentTarget as HTMLInputElement;
      target.blur();
      e.preventDefault();
      actions.focus();
      return false;
    }
    return;
  };

  private handleTitleChange = (e: KeyboardEvent, provider?: Provider) => {
    const title = (e.target as HTMLInputElement).value;
    if (provider) {
      provider.setMetadata({ title });
    }
    this.setState({
      title,
    });
  };
}
