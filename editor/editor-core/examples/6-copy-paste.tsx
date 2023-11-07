/** @jsx jsx */
import type { SerializedStyles } from '@emotion/react';
import { css, jsx } from '@emotion/react';
import type { ReactNode } from 'react';
import React, { Fragment, useEffect, useState } from 'react';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import { ReactRenderer } from '@atlaskit/renderer';
import { Editor } from './../src';
import type { EditorProps, EditorAppearance } from './../src/editor';
import EditorContext from './../src/ui/EditorContext';
import WithEditorActions from './../src/ui/WithEditorActions';
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
import type { EditorActions } from './../src';
import type { MediaOptions } from '@atlaskit/editor-plugin-media/types';
import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import { MockActivityResource } from '../example-helpers/activity-provider';
import BreadcrumbsMiscActions from '../example-helpers/breadcrumbs-misc-actions';
import {
  defaultCollectionName,
  defaultMediaPickerCollectionName,
} from '@atlaskit/media-test-helpers/collectionNames';
import { videoFileId } from '@atlaskit/media-test-helpers/exampleMediaItems';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { DocNode } from '@atlaskit/adf-schema';
import type {
  ImagePreview,
  UploadPreviewUpdateEventPayload,
} from '@atlaskit/media-picker';
import { Clipboard } from '@atlaskit/media-picker';
import { fileToDataURI } from '@atlaskit/media-ui';
import type { MediaClientConfig } from '@atlaskit/media-core/auth';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';

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

const fullWidthEditorStyles = css`
  padding: 0;
  width: 100%;
  border: 2px solid #ccc;
  box-sizing: border-box;
`;

const rendererWrapper = css`
  width: 500px;
`;

const externalClipboardWrapper = css`
  width: 500px;
  padding: 10px;
  border: 1px dashed #ccc;
`;

const pastedImageStyles = css`
  max-width: 200px;
  height: auto;
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

const rendererDoc: DocNode = {
  type: 'doc',
  version: 1,
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This is a paragraph with a text node',
        },
      ],
    },
    {
      type: 'mediaSingle',
      attrs: {
        layout: 'full-width',
      },
      content: [
        {
          type: 'media',
          attrs: {
            id: '2aa22582-ca0e-4bd4-b1bc-9369d10a0719',
            type: 'file',
            collection: 'MediaServicesSample',
            width: 5845,
            height: 1243,
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: '\n',
        },
        {
          type: 'text',
          text: 'that contains a new line',
        },
      ],
    },
    {
      type: 'mediaSingle',
      content: [
        {
          type: 'media',
          attrs: {
            id: videoFileId.id,
            type: 'file',
            collection: 'MediaServicesSample',
            width: 300,
            height: 150,
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: '\n',
        },
        {
          type: 'text',
          text: 'some text bellow the video',
        },
      ],
    },
    {
      type: 'mediaGroup',
      content: [
        {
          type: 'media',
          attrs: {
            type: 'file',
            id: '26adc5af-3af4-42a8-9c24-62b6ce0f9369',
            collection: 'MediaServicesSample',
            width: 480,
            height: 320,
          },
        },
        {
          type: 'media',
          attrs: {
            type: 'file',
            id: '71cd7e7d-4e86-4b89-a0b4-7f6ffe013c94',
            collection: 'MediaServicesSample',
          },
        },
        {
          type: 'media',
          attrs: {
            type: 'file',
            id: '1b01a476-83b4-4f44-8192-f83b2d00913a',
            collection: 'MediaServicesSample',
          },
        },
        {
          type: 'media',
          attrs: {
            type: 'file',
            id: 'a965c8df-1d64-4db8-9de5-16dfa8fd2e12',
            collection: 'MediaServicesSample',
          },
        },
        {
          type: 'media',
          attrs: {
            type: 'file',
            id: '2dfcc12d-04d7-46e7-9fdf-3715ff00ba40',
            collection: 'MediaServicesSample',
          },
        },
      ],
    },
  ],
};
const defaultCollectionNameProviders = getProviders(defaultCollectionName);
const mediaProvider = defaultCollectionNameProviders.mediaProvider;
const dataProviders = ProviderFactory.create({
  mediaProvider,
  contextIdentifierProvider:
    defaultCollectionNameProviders.editorProviders.contextIdentifierProvider,
});

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

  private onKeyPressed = (e: React.KeyboardEvent, actions: EditorActions) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      this.setState({
        disabled: false,
      });
      actions.focus();
      return false;
    }
    return;
  };

  private handleTitleChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
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

  renderEditor = (collectionName: string, contentStyles?: SerializedStyles) => {
    const defaultValue =
      (localStorage &&
        localStorage.getItem(getLocalStorageKey(collectionName))) ||
      undefined;
    const SaveAndCancelButtons = createSaveAndCancelButtons(collectionName);
    const { mediaOptions } = this.state;
    const providers = mediaOptions.get(collectionName);
    if (!providers) {
      return null;
    }

    const media: MediaOptions = {
      provider: providers.mediaProvider,
      allowMediaSingle: true,
      allowResizing: true,
      allowAltTextOnImages: true,
      featureFlags: {
        mediaInline: true,
      },
    };

    return (
      <EditorContext key={collectionName}>
        <div css={contentStyles || content}>
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
                  defaultValue={defaultValue}
                  contentComponents={
                    <Fragment>
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
                        onKeyDown={(e: React.KeyboardEvent) => {
                          this.onKeyPressed(e, actions);
                        }}
                      />
                    </Fragment>
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

  renderRenderer = () => {
    return (
      <div css={rendererWrapper}>
        <h2>Renderer ({defaultCollectionName})</h2>
        <ReactRenderer
          document={rendererDoc}
          adfStage="stage0"
          dataProviders={dataProviders}
        />
      </div>
    );
  };

  render() {
    return (
      <div>
        <div css={wrapper}>
          {this.renderEditor(defaultCollectionName)}
          {this.renderEditor(defaultMediaPickerCollectionName)}
          {this.renderRenderer()}
          <div css={externalClipboardWrapper}>
            <ExampleExternalClipboard />
            <ClipboardWidthPopup
              content={
                <div style={{ padding: 20 }}>
                  <h3>Clipboard in popup: </h3>
                  {this.renderEditor(
                    defaultCollectionName,
                    fullWidthEditorStyles,
                  )}
                  <ExampleExternalClipboard />
                </div>
              }
            />
          </div>
        </div>
      </div>
    );
  }
}

interface ClipboardWrapperProps {
  mediaProvider: Promise<MediaProvider>;
  children: Function;
}

const ClipboardWrapper = (props: ClipboardWrapperProps) => {
  const { mediaProvider, children } = props;
  const [mediaClientConfig, setMediaClientConfig] =
    useState<MediaClientConfig>();

  useEffect(() => {
    const getMediaClientConfig = async () => {
      const mP = await mediaProvider;
      if (!mP || !mP.uploadParams) {
        return;
      }
      const resolvedMediaClientConfig =
        (await mP.uploadMediaClientConfig) || (await mP.viewMediaClientConfig);
      if (!resolvedMediaClientConfig) {
        return;
      }
      setMediaClientConfig(resolvedMediaClientConfig);
    };
    getMediaClientConfig();
  }, [mediaProvider]);

  return (
    <div>
      <h2>External Clipboard example</h2>
      <p>
        Use CMD+C to copy an image from finder, followed by CMD+V to paste the
        image when this window is focused.
      </p>
      <p>
        You can also take a screenshot with SHIFT+CTRL+COMMAND+4 (Mac) and paste
        with CMD+V.
      </p>
      <p>
        If you paste an image you will see a preview. You should <b>NOT</b> see
        the image pasted in <b>Editor</b>.
      </p>
      <p>
        If you paste an image in <b>Editor</b>, you should <b>NOT</b> see a
        preview in here.
      </p>
      <p>
        Because Editor's paste event should only be listened within the
        editorDomElement.
      </p>

      <p>
        Notes: If you paste an image in <b>Renderer</b>, you will see a preview
        here, because external Clipboard bind paste event globally by default.
      </p>
      {children(mediaClientConfig)}
    </div>
  );
};

const ClipboardWidthPopup = ({ content }: { content: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button
        appearance="primary"
        isSelected={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        style={{ marginTop: 16 }}
      >
        {isOpen ? 'Close' : 'Open'} pop with editor and clipboard{' '}
      </Button>
      <ModalTransition>
        {isOpen && (
          <Modal onClose={() => setIsOpen(false)} width="large">
            <ModalHeader>
              <ModalTitle>Editor inside Modal</ModalTitle>
            </ModalHeader>
            <ModalBody>{content}</ModalBody>
            <ModalFooter>
              <Button appearance="subtle" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>
    </div>
  );
};

const ExampleExternalClipboard = () => {
  const [pastedImgSrc, setPastedImgSrc] = useState('');
  const [pastedImgScaleFactor, setPastedImgScaleFactor] = useState(1);
  const [pastedImgWidth, setPastedImgWidth] = useState(0);
  const [pastedImgHeight, setPastedImgHeight] = useState(0);

  const onUploadPreviewUpdate = async (
    data: UploadPreviewUpdateEventPayload,
  ) => {
    if (data.preview.file && data.preview.file.type.indexOf('image/') === 0) {
      const src = await fileToDataURI(data.preview.file);
      const imgPreview = data.preview as ImagePreview;
      const scaleFactor = imgPreview.scaleFactor;
      const width = imgPreview.dimensions.width;
      const height = imgPreview.dimensions.height;
      setPastedImgSrc(src);
      setPastedImgScaleFactor(scaleFactor);
      setPastedImgWidth(width);
      setPastedImgHeight(height);
    }
  };

  const onReset = () => {
    setPastedImgSrc('');
    setPastedImgScaleFactor(1);
    setPastedImgWidth(0);
    setPastedImgHeight(0);
  };

  return (
    <ClipboardWrapper mediaProvider={mediaProvider}>
      {(mediaClientConfig: MediaClientConfig) => (
        <div>
          <Clipboard
            mediaClientConfig={mediaClientConfig}
            onUploadsStart={() => console.log('clipboard start')}
            onEnd={() => console.log('clipboard ended')}
            onError={() => console.log('clipboard error')}
            onPreviewUpdate={onUploadPreviewUpdate}
          />
          <br />
          <Button
            className="close_button"
            appearance="primary"
            onClick={onReset}
          >
            Clear pasted media
          </Button>
          {pastedImgSrc && (
            <p>
              <img
                src={pastedImgSrc}
                width={Math.round(pastedImgWidth / pastedImgScaleFactor)}
                height={Math.round(pastedImgHeight / pastedImgScaleFactor)}
                css={pastedImageStyles}
              />
            </p>
          )}
        </div>
      )}
    </ClipboardWrapper>
  );
};

export default function Example(props: EditorProps & ExampleProps) {
  return (
    <div style={{ height: '100%' }}>
      <ExampleEditorComponent {...props} />
    </div>
  );
}
