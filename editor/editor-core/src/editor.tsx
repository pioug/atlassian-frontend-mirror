import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { EditorView } from 'prosemirror-view';
import { intlShape, IntlShape, IntlProvider } from 'react-intl';
import { name, version } from './version-wrapper';
import {
  ProviderFactory,
  Transformer,
  BaseTheme,
  getAnalyticsAppearance,
  WithCreateAnalyticsEvent,
  startMeasure,
  stopMeasure,
  clearMeasure,
  ExtensionProvider,
  combineExtensionProviders,
  WidthProvider,
} from '@atlaskit/editor-common';
import { Context as CardContext } from '@atlaskit/smart-card';
import { FabricEditorAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';

import { getUiComponent } from './create-editor';
import EditorActions from './actions';
import { EditorProps } from './types/editor-props';
import { ReactEditorView } from './create-editor';
import { EventDispatcher } from './event-dispatcher';
import EditorContext from './ui/EditorContext';
import { PortalProvider, PortalRenderer } from './ui/PortalProvider';
import { nextMajorVersion } from './version-wrapper';
import { createContextAdapter } from './nodeviews';
import measurements from './utils/performance/measure-enum';
import {
  combineQuickInsertProviders,
  extensionProviderToQuickInsertProvider,
} from './utils/extensions';
import {
  fireAnalyticsEvent,
  EVENT_TYPE,
  ACTION_SUBJECT,
  ACTION,
  FireAnalyticsCallback,
} from './plugins/analytics';
import ErrorBoundary from './create-editor/ErrorBoundary';

export {
  AllowedBlockTypes,
  Command,
  CommandDispatch,
  DomAtPos,
  EditorAppearance,
  EditorAppearanceComponentProps,
  EditorConfig,
  EditorInstance,
  EditorPlugin,
  EditorProps,
  ExtensionConfig,
  FeedbackInfo,
  MarkConfig,
  MessageDescriptor,
  NodeConfig,
  NodeViewConfig,
  PMPlugin,
  PMPluginCreateConfig,
  PMPluginFactory,
  PMPluginFactoryParams,
  PluginsOptions,
  ReactComponents,
  ToolbarUIComponentFactory,
  ToolbarUiComponentFactoryParams,
  UIComponentFactory,
  UiComponentFactoryParams,
} from './types';

type Context = {
  editorActions?: EditorActions;
  intl: IntlShape;
};

// allows connecting external React.Context through to nodeviews
const ContextAdapter = createContextAdapter({
  card: CardContext,
});

const WidthProviderFullHeight = styled(WidthProvider)`
  height: 100%;
`;

export default class Editor extends React.Component<EditorProps, {}> {
  static defaultProps: EditorProps = {
    appearance: 'comment',
    disabled: false,
    extensionHandlers: {},
    allowHelpDialog: true,
    allowNewInsertionBehaviour: true,
  };

  static contextTypes = {
    editorActions: PropTypes.object,
    intl: intlShape,
  };

  private providerFactory: ProviderFactory;
  private editorActions: EditorActions;
  private createAnalyticsEvent?: CreateUIAnalyticsEvent;

  constructor(props: EditorProps, context: Context) {
    super(props);
    this.providerFactory = new ProviderFactory();
    this.deprecationWarnings(props);
    this.onEditorCreated = this.onEditorCreated.bind(this);
    this.onEditorDestroyed = this.onEditorDestroyed.bind(this);
    this.editorActions = (context || {}).editorActions || new EditorActions();
    startMeasure(measurements.EDITOR_MOUNTED);
  }

  componentDidMount() {
    stopMeasure(measurements.EDITOR_MOUNTED, (duration, startTime) => {
      if (this.createAnalyticsEvent) {
        fireAnalyticsEvent(this.createAnalyticsEvent)({
          payload: {
            action: ACTION.EDITOR_MOUNTED,
            actionSubject: ACTION_SUBJECT.EDITOR,
            attributes: { duration, startTime },
            eventType: EVENT_TYPE.OPERATIONAL,
          },
        });
      }
    });
    this.handleProviders(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps: EditorProps) {
    this.handleProviders(nextProps);
  }

  componentWillUnmount() {
    this.unregisterEditorFromActions();
    this.providerFactory.destroy();
    clearMeasure(measurements.EDITOR_MOUNTED);
  }

  onEditorCreated(instance: {
    view: EditorView;
    eventDispatcher: EventDispatcher;
    transformer?: Transformer<string>;
  }) {
    this.registerEditorForActions(
      instance.view,
      instance.eventDispatcher,
      instance.transformer,
    );

    if (this.props.onEditorReady) {
      this.props.onEditorReady(this.editorActions);
    }
  }

  private deprecationWarnings(props: EditorProps) {
    const nextVersion = nextMajorVersion();
    const deprecatedProperties = {
      allowTasksAndDecisions: {
        message:
          'To allow tasks and decisions use taskDecisionProvider – <Editor taskDecisionProvider={{ provider }} />',
        type: 'removed',
      },

      allowConfluenceInlineComment: {
        message:
          'To integrate inline comments use experimental annotationProvider – <Editor annotationProvider={{ provider }} />',
        type: 'removed',
      },

      allowUnsupportedContent: {
        message: 'Deprecated. Defaults to true.',
        type: 'removed',
      },
    };

    (Object.keys(deprecatedProperties) as Array<
      keyof typeof deprecatedProperties
    >).forEach(property => {
      if (props.hasOwnProperty(property)) {
        const meta: { type?: string; message?: string } =
          deprecatedProperties[property];
        const type = meta.type || 'enabled by default';

        // eslint-disable-next-line no-console
        console.warn(
          `${property} property is deprecated. ${meta.message ||
            ''} [Will be ${type} in editor-core@${nextVersion}]`,
        );
      }
    });

    if (
      props.hasOwnProperty('quickInsert') &&
      typeof props.quickInsert === 'boolean'
    ) {
      // eslint-disable-next-line no-console
      console.warn(
        `quickInsert property is deprecated. [Will be enabled by default in editor-core@${nextVersion}]`,
      );
    }

    if (
      props.hasOwnProperty('allowTables') &&
      typeof props.allowTables !== 'boolean' &&
      (!props.allowTables || !props.allowTables.advanced)
    ) {
      // eslint-disable-next-line no-console
      console.warn(
        `Advanced table options are deprecated (except isHeaderRowRequired) to continue using advanced table features use - <Editor allowTables={{ advanced: true }} /> [Will be changed in editor-core@${nextVersion}]`,
      );
    }
  }

  onEditorDestroyed(_instance: {
    view: EditorView;
    transformer?: Transformer<string>;
  }) {
    this.unregisterEditorFromActions();

    if (this.props.onDestroy) {
      this.props.onDestroy();
    }
  }

  private registerEditorForActions(
    editorView: EditorView,
    eventDispatcher: EventDispatcher,
    contentTransformer?: Transformer<string>,
  ) {
    this.editorActions._privateRegisterEditor(
      editorView,
      eventDispatcher,
      contentTransformer,
    );
  }

  private unregisterEditorFromActions() {
    if (this.editorActions) {
      this.editorActions._privateUnregisterEditor();
    }
  }

  private handleProviders(props: EditorProps) {
    const {
      emojiProvider,
      mentionProvider,
      taskDecisionProvider,
      contextIdentifierProvider,
      collabEditProvider,
      activityProvider,
      presenceProvider,
      macroProvider,
      legacyImageUploadProvider,
      media,
      collabEdit,
      quickInsert,
      autoformattingProvider,
      extensionProviders,
      UNSAFE_cards,
    } = props;

    this.providerFactory.setProvider('emojiProvider', emojiProvider);
    this.providerFactory.setProvider('mentionProvider', mentionProvider);
    this.providerFactory.setProvider(
      'taskDecisionProvider',
      taskDecisionProvider,
    );
    this.providerFactory.setProvider(
      'contextIdentifierProvider',
      contextIdentifierProvider,
    );
    this.providerFactory.setProvider('mediaProvider', media && media.provider);
    this.providerFactory.setProvider(
      'imageUploadProvider',
      legacyImageUploadProvider,
    );
    this.providerFactory.setProvider(
      'collabEditProvider',
      collabEdit && collabEdit.provider
        ? collabEdit.provider
        : collabEditProvider,
    );
    this.providerFactory.setProvider('activityProvider', activityProvider);
    this.providerFactory.setProvider('presenceProvider', presenceProvider);
    this.providerFactory.setProvider('macroProvider', macroProvider);

    if (UNSAFE_cards && UNSAFE_cards.provider) {
      this.providerFactory.setProvider('cardProvider', UNSAFE_cards.provider);
    }

    this.providerFactory.setProvider(
      'autoformattingProvider',
      autoformattingProvider,
    );

    let extensionProvider: ExtensionProvider | undefined;

    if (extensionProviders) {
      extensionProvider = combineExtensionProviders(extensionProviders);
      this.providerFactory.setProvider(
        'extensionProvider',
        Promise.resolve(extensionProvider),
      );
    }

    if (quickInsert && typeof quickInsert !== 'boolean') {
      const quickInsertProvider = extensionProvider
        ? combineQuickInsertProviders([
            quickInsert.provider,
            extensionProviderToQuickInsertProvider(
              extensionProvider,
              this.editorActions,
              this.createAnalyticsEvent,
            ),
          ])
        : quickInsert.provider;

      this.providerFactory.setProvider(
        'quickInsertProvider',
        quickInsertProvider,
      );
    }
  }

  handleSave = (view: EditorView): void => {
    if (!this.props.onSave) {
      return;
    }

    // ED-4021: if you type a short amount of content
    // inside a content-editable on Android, Chrome only sends a
    // compositionend when it feels like it.
    //
    // to work around the PM editable being out of sync with
    // the document, force a DOM sync before calling onSave
    // if we've already started typing
    // @ts-ignore
    if (view['inDOMChange']) {
      // @ts-ignore
      view['inDOMChange'].finish(true);
    }

    return this.props.onSave(view);
  };

  handleAnalyticsEvent: FireAnalyticsCallback = data =>
    fireAnalyticsEvent(this.createAnalyticsEvent)(data);

  render() {
    const Component = getUiComponent(this.props.appearance!);

    const overriddenEditorProps = {
      ...this.props,
      onSave: this.props.onSave ? this.handleSave : undefined,
    };

    const editor = (
      <FabricEditorAnalyticsContext
        data={{
          packageName: name,
          packageVersion: version,
          componentName: 'editorCore',
          appearance: getAnalyticsAppearance(this.props.appearance),
        }}
      >
        <WithCreateAnalyticsEvent
          render={createAnalyticsEvent =>
            (this.createAnalyticsEvent = createAnalyticsEvent) && (
              <ErrorBoundary
                createAnalyticsEvent={createAnalyticsEvent}
                contextIdentifierProvider={this.props.contextIdentifierProvider}
              >
                <WidthProviderFullHeight>
                  <EditorContext editorActions={this.editorActions}>
                    <ContextAdapter>
                      <PortalProvider
                        onAnalyticsEvent={this.handleAnalyticsEvent}
                        render={portalProviderAPI => (
                          <>
                            <ReactEditorView
                              editorProps={overriddenEditorProps}
                              createAnalyticsEvent={createAnalyticsEvent}
                              portalProviderAPI={portalProviderAPI}
                              providerFactory={this.providerFactory}
                              onEditorCreated={this.onEditorCreated}
                              onEditorDestroyed={this.onEditorDestroyed}
                              allowAnalyticsGASV3={
                                this.props.allowAnalyticsGASV3
                              }
                              disabled={this.props.disabled}
                              render={({
                                editor,
                                view,
                                eventDispatcher,
                                config,
                                dispatchAnalyticsEvent,
                              }) => (
                                <BaseTheme
                                  dynamicTextSizing={
                                    this.props.allowDynamicTextSizing &&
                                    this.props.appearance !== 'full-width'
                                  }
                                >
                                  <Component
                                    appearance={this.props.appearance!}
                                    disabled={this.props.disabled}
                                    editorActions={this.editorActions}
                                    editorDOMElement={editor}
                                    editorView={view}
                                    providerFactory={this.providerFactory}
                                    eventDispatcher={eventDispatcher}
                                    dispatchAnalyticsEvent={
                                      dispatchAnalyticsEvent
                                    }
                                    maxHeight={this.props.maxHeight}
                                    onSave={
                                      this.props.onSave
                                        ? this.handleSave
                                        : undefined
                                    }
                                    onCancel={this.props.onCancel}
                                    popupsMountPoint={
                                      this.props.popupsMountPoint
                                    }
                                    popupsBoundariesElement={
                                      this.props.popupsBoundariesElement
                                    }
                                    popupsScrollableElement={
                                      this.props.popupsScrollableElement
                                    }
                                    contentComponents={config.contentComponents}
                                    primaryToolbarComponents={
                                      config.primaryToolbarComponents
                                    }
                                    secondaryToolbarComponents={
                                      config.secondaryToolbarComponents
                                    }
                                    insertMenuItems={this.props.insertMenuItems}
                                    customContentComponents={
                                      this.props.contentComponents
                                    }
                                    customPrimaryToolbarComponents={
                                      this.props.primaryToolbarComponents
                                    }
                                    customSecondaryToolbarComponents={
                                      this.props.secondaryToolbarComponents
                                    }
                                    contextPanel={this.props.contextPanel}
                                    collabEdit={this.props.collabEdit}
                                    allowAnnotation={
                                      !!this.props.annotationProvider
                                    }
                                  />
                                </BaseTheme>
                              )}
                            />
                            <PortalRenderer
                              portalProviderAPI={portalProviderAPI}
                            />
                          </>
                        )}
                      />
                    </ContextAdapter>
                  </EditorContext>
                </WidthProviderFullHeight>
              </ErrorBoundary>
            )
          }
        />
      </FabricEditorAnalyticsContext>
    );

    return this.context.intl ? (
      editor
    ) : (
      <IntlProvider locale="en">{editor}</IntlProvider>
    );
  }
}
