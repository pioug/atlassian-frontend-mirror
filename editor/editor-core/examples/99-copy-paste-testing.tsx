/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import type { KeyboardEvent, FormEvent } from 'react';
import React from 'react';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import type { EditorProps, EditorAppearance } from '../src/editor';
import Editor from '../src/editor';
import EditorContext from '../src/ui/EditorContext';
import WithEditorActions from '../src/ui/WithEditorActions';
import { autoformattingProvider } from '@atlaskit/editor-test-helpers/autoformatting-provider';
import { cardProvider } from '@atlaskit/editor-test-helpers/card-provider';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import { macroProvider } from '@atlaskit/editor-test-helpers/mock-macro-provider';
import {
  currentUser,
  getEmojiProvider,
} from '@atlaskit/util-data-test/get-emoji-provider';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import { customInsertMenuItems } from '@atlaskit/editor-test-helpers/mock-insert-menu';
import quickInsertProviderFactory from '../example-helpers/quick-insert-provider';
import { TitleInput } from '../example-helpers/PageElements';
import type { EditorActions } from '../src';
import type { MediaOptions } from '@atlaskit/editor-plugin-media/types';
import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import { MockActivityResource } from '../example-helpers/activity-provider';
import BreadcrumbsMiscActions from '../example-helpers/breadcrumbs-misc-actions';
import {
  defaultCollectionName,
  defaultMediaPickerCollectionName,
} from '@atlaskit/media-test-helpers/collectionNames';
import { createEditorMediaMock } from '@atlaskit/editor-test-helpers/media-mock';

const mediaMock = createEditorMediaMock();
mediaMock.enable();

const wrapper = css`
  box-sizing: border-box;
  height: calc(100vh - 32px);
  display: flex;
`;
const content = css`
  padding: 0;
  height: 100%;
  width: 50%;
  border: 2px solid #ccc;
  box-sizing: border-box;
`;

const getLocalStorageKey = (collectionName: string) =>
  `fabric.editor.example.copypaste-${collectionName}`;
// eslint-disable-next-line no-console
const analyticsHandler = (actionName: string, props?: {}) =>
  console.log(actionName, props);

const LOCALSTORAGE_defaultTitleKey = 'fabric.editor.example.full-page.title';
const createSaveAndCancelButtons =
  (collectionName: string) => (props: { editorActions?: EditorActions }) =>
    (
      <ButtonGroup>
        <Button
          tabIndex={-1}
          appearance="primary"
          onClick={() => {
            if (!props.editorActions) {
              return;
            }

            props.editorActions.getValue().then((value) => {
              // eslint-disable-next-line no-console
              console.log(value);
              localStorage.setItem(
                getLocalStorageKey(collectionName),
                JSON.stringify(value),
              );
            });
          }}
        >
          Publish
        </Button>
        <Button
          tabIndex={-1}
          appearance="subtle"
          onClick={() => {
            if (!props.editorActions) {
              return;
            }
            props.editorActions.clear();
            localStorage.removeItem(getLocalStorageKey(collectionName));
            localStorage.removeItem(LOCALSTORAGE_defaultTitleKey);
          }}
        >
          Close
        </Button>
      </ButtonGroup>
    );

export type State = {
  disabled: boolean;
  title?: string;
  appearance: EditorAppearance;
  mediaOptions: Map<string, Providers>;
};
interface Providers {
  mediaProvider: Promise<MediaProvider>;
  editorProviders: any;
}

const mediaProviders = new Map<string, Providers>();
const getProviders = (collectionName: string): Providers => {
  // It's important to keep the same provider instance for Editor
  let providers = mediaProviders.get(collectionName);
  if (providers) {
    return providers;
  } else {
    const contextIdentifierProvider = storyContextIdentifierProviderFactory({
      objectId: `${collectionName}-OBJECT-ID`,
      containerId: `${collectionName}-CONTAINER-ID`,
      childObjectId: `${collectionName}-CHILD-OBJECT-ID`,
      product: `${collectionName}-atlaskit-examples`,
    });
    const editorProviders: any = {
      emojiProvider: getEmojiProvider({
        uploadSupported: true,
        currentUser,
      }),
      mentionProvider: Promise.resolve(mentionResourceProvider),
      taskDecisionProvider: Promise.resolve(getMockTaskDecisionResource()),
      contextIdentifierProvider,
      activityProvider: Promise.resolve(new MockActivityResource()),
      macroProvider: Promise.resolve(macroProvider),
      autoformattingProvider: Promise.resolve(autoformattingProvider),
    };
    const mediaProvider = storyMediaProviderFactory({
      collectionName,
    });
    providers = {
      mediaProvider,
      editorProviders,
    };

    mediaProviders.set(collectionName, providers);

    return providers;
  }
};

const quickInsertProvider = quickInsertProviderFactory();

export interface ExampleProps {
  onTitleChange?: (title: string) => void;
}

const doc = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: ' ',
        },
        {
          type: 'mediaInline',
          attrs: {
            type: 'file',
            id: 'a3d20d67-14b1-4cfc-8ba8-918bbc8d71e1',
            collection: 'MediaServicesSample',
            alt: '',
          },
        },
        {
          type: 'text',
          text: ' ',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

class ExampleEditorComponent extends React.Component<
  EditorProps & ExampleProps,
  State
> {
  state: State = {
    disabled: true,
    title: localStorage.getItem(LOCALSTORAGE_defaultTitleKey) || '',
    appearance: 'full-page',
    mediaOptions: new Map(),
  };

  private mediaProviderTimeoutId: number | undefined;

  async componentDidMount() {
    const { mediaOptions } = this.state;
    // Simulate adding mediaProvider async
    await new Promise((resolve) => {
      this.mediaProviderTimeoutId = window.setTimeout(resolve, 1000);
    });
    mediaOptions.set(
      defaultCollectionName,
      getProviders(defaultCollectionName),
    );
    mediaOptions.set(
      defaultMediaPickerCollectionName,
      getProviders(defaultMediaPickerCollectionName),
    );
    this.setState({ mediaOptions });
  }

  componentWillUnmount() {
    window.clearTimeout(this.mediaProviderTimeoutId);
  }

  componentDidUpdate(prevProps: EditorProps) {
    if (prevProps.appearance !== this.props.appearance) {
      this.setState(() => ({
        appearance: this.props.appearance || 'full-page',
      }));
    }
  }

  private setFullWidthMode = (fullWidthMode: boolean) => {
    this.setState({ appearance: fullWidthMode ? 'full-width' : 'full-page' });
  };

  private onKeyPressed = (e: KeyboardEvent, actions: EditorActions) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      this.setState({
        disabled: false,
      });
      actions.focus();
      return false;
    }
    return;
  };

  private handleTitleChange = (e: FormEvent<HTMLTextAreaElement>) => {
    const title = (e.target as HTMLInputElement).value;
    this.setState({
      title,
    });

    if (this.props.onTitleChange) {
      this.props.onTitleChange(title);
    }
  };

  private handleTitleOnFocus = () => this.setState({ disabled: true });
  private handleTitleOnBlur = () => this.setState({ disabled: false });
  private handleTitleRef = (ref?: HTMLElement) => {
    if (ref) {
      ref.focus();
    }
  };

  renderEditor = (
    collectionName: string,
    doc: Object | undefined = undefined,
  ) => {
    const SaveAndCancelButtons = createSaveAndCancelButtons(collectionName);
    const { mediaOptions } = this.state;
    const providers = mediaOptions.get(collectionName);
    if (!providers) {
      return null;
    }

    const media: MediaOptions = {
      provider: providers.mediaProvider,
      allowMediaSingle: true,
      featureFlags: {
        mediaInline: true,
      },
    };

    return (
      <EditorContext key={collectionName}>
        <div data-testid={`editor-${collectionName}`} css={content}>
          <h2>Editor ({collectionName})</h2>
          <SmartCardProvider>
            <WithEditorActions
              render={(actions) => (
                <Editor
                  analyticsHandler={analyticsHandler}
                  allowAnalyticsGASV3={true}
                  quickInsert={{
                    provider: Promise.resolve(quickInsertProvider),
                  }}
                  allowTextColor={true}
                  allowTables={{
                    advanced: true,
                  }}
                  allowBreakout={true}
                  allowJiraIssue={true}
                  allowPanel={true}
                  allowExtension={{
                    allowBreakout: true,
                  }}
                  allowRule={true}
                  allowDate={true}
                  allowLayouts={{
                    allowBreakout: true,
                    UNSAFE_addSidebarLayouts: true,
                  }}
                  allowTextAlignment={true}
                  allowIndentation={true}
                  allowTemplatePlaceholders={{ allowInserting: true }}
                  smartLinks={{
                    provider: Promise.resolve(cardProvider),
                  }}
                  allowStatus={true}
                  {...providers.editorProviders}
                  editorActions={actions}
                  media={media}
                  placeholder="Use markdown shortcuts to format your page as you type, like * for lists, # for headers, and *** for a horizontal rule."
                  shouldFocus={false}
                  disabled={this.state.disabled}
                  defaultValue={doc}
                  contentComponents={
                    <React.Fragment>
                      <BreadcrumbsMiscActions
                        appearance={this.state.appearance}
                        onFullWidthChange={this.setFullWidthMode}
                      />
                      <TitleInput
                        value={this.state.title}
                        onChange={this.handleTitleChange}
                        innerRef={this.handleTitleRef}
                        onFocus={this.handleTitleOnFocus}
                        onBlur={this.handleTitleOnBlur}
                        onKeyDown={(e: KeyboardEvent) => {
                          this.onKeyPressed(e, actions);
                        }}
                      />
                    </React.Fragment>
                  }
                  primaryToolbarComponents={[
                    <SaveAndCancelButtons
                      key={collectionName}
                      editorActions={actions}
                    />,
                  ]}
                  insertMenuItems={customInsertMenuItems}
                  extensionHandlers={extensionHandlers}
                  {...this.props}
                  appearance={this.state.appearance}
                />
              )}
            />
          </SmartCardProvider>
        </div>
      </EditorContext>
    );
  };

  render() {
    return (
      <div>
        <div css={wrapper}>
          {this.renderEditor(defaultCollectionName, doc)}
          {this.renderEditor(defaultMediaPickerCollectionName)}
        </div>
      </div>
    );
  }
}

export default function Example(props: EditorProps & ExampleProps) {
  return (
    <div style={{ height: '100%' }}>
      <ExampleEditorComponent {...props} />
    </div>
  );
}
