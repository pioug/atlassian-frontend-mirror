import styled from 'styled-components';
import React from 'react';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import { MockActivityResource } from '../example-helpers/activity-provider';
import { createSearchProvider, Scope } from '@atlassian/search-provider';
import ExamplesErrorBoundary from '../example-helpers/ExamplesErrorBoundary';

import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';
import Flag from '@atlaskit/flag';
import Warning from '@atlaskit/icon/glyph/warning';

import { autoformattingProvider } from '@atlaskit/editor-test-helpers/autoformatting-provider';
import { cardProviderStaging } from '@atlaskit/editor-test-helpers/card-provider';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import { customInsertMenuItems } from '@atlaskit/editor-test-helpers/mock-insert-menu';
import { macroProvider } from '@atlaskit/editor-test-helpers/mock-macro-provider';
import { exampleMediaFeatureFlags } from '@atlaskit/media-test-helpers/exampleMediaFeatureFlags';
import {
  ProviderFactory,
  ExtensionProvider,
  combineExtensionProviders,
  Providers,
  TTI_SEVERITY_THRESHOLD_DEFAULTS,
  TTI_FROM_INVOCATION_SEVERITY_THRESHOLD_DEFAULTS,
} from '@atlaskit/editor-common';

import { EmojiProvider } from '@atlaskit/emoji/resource';
import {
  Provider as SmartCardProvider,
  Client as SmartCardClient,
} from '@atlaskit/smart-card';

import {
  currentUser,
  getEmojiProvider,
} from '@atlaskit/util-data-test/get-emoji-provider';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';
import { getMockProfilecardClient } from '@atlaskit/util-data-test/get-mock-profilecard-client';

import Editor, { EditorProps, EditorAppearance } from './../src/editor';
import EditorContext from './../src/ui/EditorContext';
import WithEditorActions from './../src/ui/WithEditorActions';
import {
  fromLocation,
  encode,
  amend,
  check,
  Message,
} from '../example-helpers/adf-url';
import * as FeatureFlagUrl from '../example-helpers/feature-flag-url';
import { copy } from '../example-helpers/copy';
import quickInsertProviderFactory from '../example-helpers/quick-insert-provider';
import { DevTools } from '../example-helpers/DevTools';
import { TitleInput } from '../example-helpers/PageElements';
import { EditorActions, MentionProvider } from './../src';
import { PanelPluginConfig } from '../src/plugins/panel/types';
import {
  NORMAL_SEVERITY_THRESHOLD as BROWSER_FREEZE_NORMAL_SEVERITY_THRESHOLD,
  DEGRADED_SEVERITY_THRESHOLD as BROWSER_FREEZE_DEGRADED_SEVERITY_THRESHOLD,
} from '../src/plugins/base/pm-plugins/frozen-editor';
import {
  PROSEMIRROR_RENDERED_NORMAL_SEVERITY_THRESHOLD,
  PROSEMIRROR_RENDERED_DEGRADED_SEVERITY_THRESHOLD,
} from '../src/create-editor/consts';
import BreadcrumbsMiscActions from '../example-helpers/breadcrumbs-misc-actions';
import {
  DEFAULT_MODE,
  LOCALSTORAGE_defaultMode,
} from '../example-helpers/example-constants';
import { ReactRenderer } from '@atlaskit/renderer';
import { ProfileClient, modifyResponse } from '@atlaskit/profilecard';
import { addGlobalEventEmitterListeners } from '@atlaskit/media-test-helpers/globalEventEmitterListeners';
import {
  isMediaMockOptedIn,
  mediaMock,
} from '@atlaskit/media-test-helpers/media-mock';
import { MediaFeatureFlags } from '@atlaskit/media-common';

addGlobalEventEmitterListeners();
if (isMediaMockOptedIn()) {
  mediaMock.enable();
}

/**
 * +-------------------------------+
 * + [Editor core v] [Full page v] +  48px height
 * +-------------------------------+
 * +                               +  16px padding-top
 * +            Content            +
 * +                               +  16px padding-bottom
 * +-------------------------------+  ----
 *                                    80px - 48px (Outside of iframe)
 *
 */
export const Wrapper: any = styled.div`
  box-sizing: border-box;
  height: 100%;
`;
Wrapper.displayName = 'Wrapper';

export const Content: any = styled.div`
  padding: 0;
  height: 100%;
  box-sizing: border-box;
`;
Content.displayName = 'Content';

// eslint-disable-next-line no-console
const SAVE_ACTION = () => console.log('Save');

const defaultMediaFeatureFlags: MediaFeatureFlags = {
  ...exampleMediaFeatureFlags,
  captions: true,
};

export const LOCALSTORAGE_defaultDocKey = 'fabric.editor.example.full-page';
export const LOCALSTORAGE_defaultTitleKey =
  'fabric.editor.example.full-page.title';

export const saveChanges = ({
  editorActions,
  setMode,
}: {
  editorActions?: EditorActions;
  setMode?: (mode: boolean) => void;
}) => async () => {
  if (!editorActions) {
    return;
  }

  const value = await editorActions.getValue();

  // eslint-disable-next-line no-console
  console.log(value);

  localStorage.setItem(LOCALSTORAGE_defaultDocKey, JSON.stringify(value));
  if (setMode) {
    setMode(false);
  }
};

export const SaveAndCancelButtons = (props: {
  editorActions?: EditorActions;
  setMode?: (mode: boolean) => void;
}) => (
  <ButtonGroup>
    <Button
      tabIndex={-1}
      appearance="primary"
      onClick={saveChanges(props)}
      testId="publish-button"
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
        localStorage.removeItem(LOCALSTORAGE_defaultDocKey);
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
  warning?: Message;
};

const searchProvider = createSearchProvider(
  'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5',
  Scope.ConfluencePageBlog,
  'https://api-private.stg.atlassian.com/gateway/api/xpsearch-aggregator',
);

export const providers: Partial<Providers> = {
  emojiProvider: getEmojiProvider({
    uploadSupported: true,
    currentUser,
  }) as Promise<EmojiProvider>,
  mentionProvider: Promise.resolve(mentionResourceProvider),
  taskDecisionProvider: Promise.resolve(getMockTaskDecisionResource()),
  contextIdentifierProvider: storyContextIdentifierProviderFactory(),
  activityProvider: Promise.resolve(new MockActivityResource()),
  searchProvider: Promise.resolve(searchProvider),
  macroProvider: Promise.resolve(macroProvider),
  autoformattingProvider: Promise.resolve(autoformattingProvider),
};

export const mediaProvider = storyMediaProviderFactory({
  includeUserAuthProvider: false,
});

export const quickInsertProvider = quickInsertProviderFactory();

export const getAppearance = (): 'full-page' | 'full-width' => {
  return (localStorage.getItem(LOCALSTORAGE_defaultMode) || DEFAULT_MODE) ===
    DEFAULT_MODE
    ? 'full-page'
    : 'full-width';
};

export interface ExampleProps {
  onTitleChange?: (title: string) => void;
  setMode?: (isEditing: boolean) => void;
  customPrimaryToolbarComponents?: EditorProps['primaryToolbarComponents'];
  onExampleEditorReady?: (
    editorActions: EditorActions,
    timeTaken?: number,
  ) => void;
  clickToEdit?: boolean;
}

const smartCardClient = new SmartCardClient('staging');
export class ExampleEditorComponent extends React.Component<
  EditorProps & ExampleProps,
  State
> {
  state: State = {
    disabled: true,
    title: localStorage.getItem(LOCALSTORAGE_defaultTitleKey) || '',
    appearance: this.props.appearance || getAppearance(),
  };

  private startTime: number = 0;
  private editorActions: EditorActions | null = null;

  componentWillMount() {
    this.startTime = new Date().getTime();
  }

  componentDidMount() {
    // eslint-disable-next-line no-console
    console.log(`To try the macro paste handler, paste one of the following links:

  www.dumbmacro.com?paramA=CFE
  www.smartmacro.com?paramB=CFE
    `);
  }

  componentDidUpdate(prevProps: EditorProps) {
    if (prevProps.appearance !== this.props.appearance) {
      this.setState(() => ({
        appearance: this.props.appearance || 'full-page',
      }));
    }

    if (prevProps.defaultValue !== this.props.defaultValue) {
      this.editorActions?.replaceDocument(this.props.defaultValue, false);
    }
  }

  onEditorReady = (editorActions: EditorActions) => {
    const timeTaken = new Date().getTime() - this.startTime;
    console.log('Editor init time', timeTaken, 'ms');

    if (this.props.onExampleEditorReady) {
      this.props.onExampleEditorReady(editorActions, timeTaken);
    }
  };

  onCopyLinkWithContent = async () => {
    if (!this.editorActions) {
      return;
    }

    const value = await this.editorActions.getValue();
    if (!value) {
      return;
    }

    const encoded = encode(value);
    const url = amend(window.parent.location, encoded);

    window.parent.history.pushState(value, window.parent.document.title, url);
    copy(url);

    const warning = check(url);

    if (warning) {
      this.setState({
        warning,
      });
    }
  };

  render() {
    const { media } = this.props;
    const mediaEditorProps = media
      ? media.featureFlags
      : defaultMediaFeatureFlags;
    return (
      <ExamplesErrorBoundary>
        <Wrapper>
          <Content>
            <SmartCardProvider client={smartCardClient}>
              <Editor
                UNSAFE_allowUndoRedoButtons={true}
                allowAnalyticsGASV3={true}
                quickInsert={{ provider: Promise.resolve(quickInsertProvider) }}
                allowTextColor={{
                  allowMoreTextColors: true,
                }}
                allowTables={{
                  advanced: true,
                  allowColumnSorting: true,
                  stickyHeaders: true,
                  tableCellOptimization: true,
                  allowCollapse: true,
                  allowDistributeColumns: true,
                }}
                allowBreakout={true}
                allowJiraIssue={true}
                allowPanel
                allowExtension={{
                  allowBreakout: true,
                }}
                allowRule={true}
                allowDate={true}
                allowLayouts={{
                  allowBreakout: true,
                  UNSAFE_addSidebarLayouts: true,
                  UNSAFE_allowSingleColumnLayout: true,
                }}
                allowTextAlignment={true}
                allowIndentation={true}
                allowDynamicTextSizing={true}
                allowTemplatePlaceholders={{ allowInserting: true }}
                smartLinks={{
                  provider: Promise.resolve(cardProviderStaging),
                  allowBlockCards: true,
                  allowEmbeds: true,
                  allowResizing: true,
                  useAlternativePreloader: false,
                }}
                allowExpand={{
                  allowInsertion: true,
                  allowInteractiveExpand: true,
                }}
                waitForMediaUpload={true}
                allowStatus={true}
                allowFindReplace={{
                  allowMatchCase: true,
                }}
                allowNestedTasks
                codeBlock={{ allowCopyToClipboard: true }}
                {...providers}
                media={{
                  provider: mediaProvider,
                  allowMediaSingle: true,
                  allowResizing: true,
                  allowAnnotation: true,
                  allowLinking: true,
                  allowResizingInTables: true,
                  allowAltTextOnImages: true,
                  allowMediaInline: true,
                  altTextValidator: (value: string) => {
                    const errors = [];
                    if (!/^[A-Z]/g.test(value)) {
                      errors.push('Please start with capital letter.');
                    }
                    if (!/^[^"<>&\\]*$/g.test(value)) {
                      errors.push('Please remove special characters.');
                    }
                    if (!/(\w.+\s).+/g.test(value)) {
                      errors.push('Please use at least two words.');
                    }
                    return errors;
                  },
                  useMediaPickerPopup: false,
                  featureFlags: mediaEditorProps,
                }}
                allowHelpDialog
                placeholder="Use markdown shortcuts to format your page as you type, like * for lists, # for headers, and *** for a horizontal rule."
                placeholderHints={[
                  "Type '/' to insert content.",
                  "Type ':' to insert an emoji.",
                  "Type '@' to insert a mention.",
                  "We added more background colors to tables cells. Try it, type '/tables'.",
                  "Do you need more help? Type '/help'",
                ]}
                placeholderBracketHint="Did you mean to use '/' to insert content?"
                shouldFocus={true}
                disabled={this.state.disabled}
                defaultValue={
                  (localStorage &&
                    localStorage.getItem(LOCALSTORAGE_defaultDocKey)) ||
                  undefined
                }
                contentComponents={
                  <WithEditorActions
                    render={(actions) => (
                      <>
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
                      </>
                    )}
                  />
                }
                primaryToolbarComponents={[
                  <WithEditorActions
                    key={1}
                    render={(actions) => {
                      this.editorActions = actions;

                      return (
                        <>
                          {this.props.customPrimaryToolbarComponents}
                          <Button
                            isDisabled={!actions}
                            onClick={this.onCopyLinkWithContent}
                            style={{ marginRight: 5 }}
                          >
                            Copy link
                          </Button>
                          <SaveAndCancelButtons
                            editorActions={actions}
                            setMode={this.props.setMode}
                          />
                        </>
                      );
                    }}
                  />,
                ]}
                primaryToolbarIconBefore={
                  <Button
                    iconBefore={<AtlassianIcon />}
                    appearance="subtle"
                    shouldFitContainer
                  ></Button>
                }
                onSave={SAVE_ACTION}
                insertMenuItems={customInsertMenuItems}
                extensionHandlers={extensionHandlers}
                performanceTracking={{
                  ttiTracking: {
                    enabled: true,
                    trackSeverity: true,
                    ttiSeverityNormalThreshold:
                      TTI_SEVERITY_THRESHOLD_DEFAULTS.NORMAL,
                    ttiSeverityDegradedThreshold:
                      TTI_SEVERITY_THRESHOLD_DEFAULTS.DEGRADED,
                    ttiFromInvocationSeverityNormalThreshold:
                      TTI_FROM_INVOCATION_SEVERITY_THRESHOLD_DEFAULTS.NORMAL,
                    ttiFromInvocationSeverityDegradedThreshold:
                      TTI_FROM_INVOCATION_SEVERITY_THRESHOLD_DEFAULTS.DEGRADED,
                  },
                  transactionTracking: { enabled: true },
                  uiTracking: { enabled: true },
                  nodeViewTracking: { enabled: true },
                  inputTracking: { enabled: true, countNodes: true },
                  bFreezeTracking: {
                    trackInteractionType: true,
                    trackSeverity: true,
                    severityNormalThreshold: BROWSER_FREEZE_NORMAL_SEVERITY_THRESHOLD,
                    severityDegradedThreshold: BROWSER_FREEZE_DEGRADED_SEVERITY_THRESHOLD,
                  },
                  proseMirrorRenderedTracking: {
                    trackSeverity: true,
                    severityNormalThreshold: PROSEMIRROR_RENDERED_NORMAL_SEVERITY_THRESHOLD,
                    severityDegradedThreshold: PROSEMIRROR_RENDERED_DEGRADED_SEVERITY_THRESHOLD,
                  },
                  contentRetrievalTracking: {
                    enabled: true,
                    successSamplingRate: 2,
                    failureSamplingRate: 1,
                    reportErrorStack: true,
                  },
                  onEditorReadyCallbackTracking: { enabled: true },
                  pasteTracking: { enabled: true },
                  renderTracking: {
                    editor: {
                      enabled: true,
                      useShallow: false,
                    },
                    reactEditorView: {
                      enabled: true,
                      useShallow: false,
                    },
                  },
                }}
                {...this.props}
                featureFlags={this.props.featureFlags}
                appearance={this.state.appearance}
                onEditorReady={this.onEditorReady}
                trackValidTransactions={{ samplingRate: 100 }}
              />
            </SmartCardProvider>
          </Content>
          {this.state.warning && (
            <div
              style={{
                position: 'fixed',
                top: 90,
                right: 15,
                width: 400,
                zIndex: 100,
              }}
            >
              <Flag
                actions={[
                  {
                    content: 'Sure',
                    onClick: () => this.setState({ warning: undefined }),
                  },
                ]}
                appearance="warning"
                description={this.state.warning.message}
                icon={<Warning label="Heads up!" />}
                title={this.state.warning.title}
                id="warning"
              />
            </div>
          )}
        </Wrapper>
      </ExamplesErrorBoundary>
    );
  }
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

  private handleTitleChange = (e: KeyboardEvent) => {
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

  private setFullWidthMode = (fullWidthMode: boolean) => {
    this.setState({ appearance: fullWidthMode ? 'full-width' : 'full-page' });
  };
}

export const ExampleEditor = ExampleEditorComponent;

const MockProfileClient = getMockProfilecardClient(
  ProfileClient,
  modifyResponse,
);

const mentionProvider = Promise.resolve({
  shouldHighlightMention(mention: { id: string }) {
    return mention.id === 'ABCDE-ABCDE-ABCDE-ABCDE';
  },
} as MentionProvider);

const emojiProvider = getEmojiProvider();

const profilecardProvider = Promise.resolve({
  cloudId: 'DUMMY-CLOUDID',
  resourceClient: new MockProfileClient({
    cacheSize: 10,
    cacheMaxAge: 5000,
  }),
  getActions: (id: string) => {
    const actions = [
      {
        label: 'Mention',
        callback: () => console.log('profile-card:mention'),
      },
      {
        label: 'Message',
        callback: () => console.log('profile-card:message'),
      },
    ];

    return id === '1' ? actions : actions.slice(0, 1);
  },
});

const taskDecisionProvider = Promise.resolve(getMockTaskDecisionResource());

const contextIdentifierProvider = storyContextIdentifierProviderFactory();

const providerFactory = ProviderFactory.create({
  mentionProvider,
  mediaProvider,
  emojiProvider,
  profilecardProvider,
  taskDecisionProvider,
  contextIdentifierProvider,
});

const Renderer = (props: {
  document?: string | object;
  setMode: (mode: boolean) => void;
  extensionProviders?: (ExtensionProvider | Promise<ExtensionProvider>)[];
  allowCustomPanel?: boolean;
  clickToEdit?: boolean;
  mediaFeatureFlags?: MediaFeatureFlags;
}) => {
  if (props.extensionProviders && props.extensionProviders.length > 0) {
    providerFactory.setProvider(
      'extensionProvider',
      Promise.resolve(combineExtensionProviders(props.extensionProviders)),
    );
  }

  const document = !props.document
    ? undefined
    : typeof props.document === 'string'
    ? JSON.parse(props.document)
    : props.document;

  const mediaFeatureFlags = props.mediaFeatureFlags
    ? props.mediaFeatureFlags
    : defaultMediaFeatureFlags;

  return (
    <div
      style={{
        margin: '30px 0',
      }}
    >
      <Button
        appearance="primary"
        onClick={() => props.setMode(true)}
        style={{
          position: 'absolute',
          right: '0',
          margin: '0 20px',
          zIndex: 100,
        }}
        testId="edit-button"
      >
        Edit
      </Button>
      <SmartCardProvider client={smartCardClient}>
        <ReactRenderer
          allowHeadingAnchorLinks
          allowAltTextOnImages
          allowColumnSorting
          adfStage="stage0"
          dataProviders={providerFactory}
          extensionHandlers={extensionHandlers}
          document={document}
          appearance={getAppearance()}
          media={{
            featureFlags: mediaFeatureFlags,
          }}
          UNSAFE_allowCustomPanels={props.allowCustomPanel}
          eventHandlers={{
            onUnhandledClick: props.clickToEdit
              ? (e) => {
                  console.log('onUnhandledClick called');
                  props.setMode(true);
                }
              : undefined,
          }}
        />
      </SmartCardProvider>
    </div>
  );
};

export default function Example(props: EditorProps & ExampleProps) {
  const [isEditingMode, setMode] = React.useState(true);

  const maybeDoc =
    props.defaultValue || fromLocation<object>(window.parent.location);
  const doc = maybeDoc instanceof window.Error ? undefined : maybeDoc;
  const localDraft =
    (localStorage && localStorage.getItem(LOCALSTORAGE_defaultDocKey)) ||
    undefined;

  const maybeFlags = FeatureFlagUrl.fromLocation<string>(
    window.parent.location,
  );

  const defaultFeatureFlags = {
    mouseMoveOptimization: true,
    initialRenderOptimization: true,
    tableRenderOptimization: true,
    stickyHeadersOptimization: true,
    tableOverflowShadowsOptimization: true,
  };

  const featureFlags =
    !maybeFlags || maybeFlags instanceof window.Error
      ? defaultFeatureFlags
      : JSON.parse(maybeFlags ?? '{}');

  let allowCustomPanel = false;
  if (props.allowPanel && typeof props.allowPanel === 'object') {
    allowCustomPanel =
      (props.allowPanel as PanelPluginConfig).UNSAFE_allowCustomPanel || false;
  }

  const { media } = props;
  const mediaProps = media?.featureFlags
    ? media.featureFlags
    : defaultMediaFeatureFlags;

  return (
    <EditorContext>
      <div style={{ height: '100%' }}>
        <DevTools />
        {isEditingMode ? (
          <ExampleEditor
            {...props}
            featureFlags={featureFlags}
            defaultValue={doc || localDraft}
            setMode={setMode}
          />
        ) : (
          <Renderer
            document={localDraft || doc}
            setMode={setMode}
            extensionProviders={
              typeof props.extensionProviders === 'function'
                ? props.extensionProviders()
                : props.extensionProviders
            }
            allowCustomPanel={allowCustomPanel}
            clickToEdit={props.clickToEdit}
            mediaFeatureFlags={mediaProps}
          />
        )}
      </div>
    </EditorContext>
  );
}
