import React from 'react';
import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import {
  Editor,
  MediaProvider as MediaProviderType,
  EditorProps,
  MentionProvider,
  EditorContext,
} from '@atlaskit/editor-core';
import FabricAnalyticsListeners from '@atlaskit/analytics-listeners';
import { Provider as CollabProvider } from '@atlaskit/collab-provider';
import { toNativeBridge } from './web-to-native';
import WebBridgeImpl from './native-to-web';
import {
  SmartCardProvider,
  EditorCardProvider,
  CardClient as EditorCardClient,
} from '@atlaskit/link-provider';
import { EmojiResource } from '@atlaskit/emoji/resource';
import { useCollabEdit } from './hooks/use-collab-edit';
import { useQuickInsert } from './hooks/use-quickinsert';
import { useAnalytics } from './hooks/use-analytics';
import { useMedia } from './hooks/use-media';
import { useSmartCards } from './hooks/use-smart-cards';
import { useTaskAndDecision } from './hooks/use-task-decision';
import { useReflowDectector } from './hooks/use-reflow-detector';
import throttle from 'lodash/throttle';
import { withIntlProvider } from '../i18n/with-intl-provider';
import { IntlShape, injectIntl } from 'react-intl-next';
import { useCollabListeners } from './hooks/use-collab-listeners';
import { geti18NMessages } from './editor-localisation-provider';
import { withSystemTheme } from '../WithSystemTheme';
import {
  getEnableLightDarkTheming,
  getAllowCaptions,
  getMediaImageResize,
  getAllowMediaInline,
  getEnableNewMediaCard,
} from '../query-param-reader';
import { useEditorLifecycle } from './hooks/use-editor-life-cycle';
import { usePluginListeners } from './hooks/use-plugin-listeners';
import EditorConfiguration from './editor-configuration';
import { isEmptyDocument } from '@atlaskit/editor-core';
import { useToolbarSubscription } from './hooks/use-toolbar-subscription';
import { useTypeAheadSubscription } from './hooks/use-type-ahead-subscription';
export interface MobileEditorProps extends EditorProps {
  createCollabProvider: (bridge: WebBridgeImpl) => Promise<CollabProvider>;
  cardProvider: Promise<EditorCardProvider>;
  cardClient: EditorCardClient;
  emojiProvider: Promise<EmojiResource>;
  mediaProvider: Promise<MediaProviderType>;
  mentionProvider: Promise<MentionProvider>;
  intl: IntlShape;
  bridge: WebBridgeImpl;
  editorConfiguration: EditorConfiguration;
  locale?: string;
}

// Editor options. Keep as external cost to prevent unnecessary re-renders;
const getLayoutOptions = memoizeOne(
  (featureFlags: { [featureFlag: string]: string | boolean } | undefined) => ({
    allowBreakout: true,
    UNSAFE_addSidebarLayouts: true,
    UNSAFE_allowSingleColumnLayout:
      featureFlags &&
      (typeof featureFlags.singleLayout === 'boolean'
        ? featureFlags.singleLayout
        : featureFlags.singleLayout === 'true'),
  }),
  isEqual,
);

const tableOptions: EditorProps['allowTables'] = {
  allowCellOptionsInFloatingToolbar: true,
  allowControls: true,
  allowBackgroundColor: true,
  allowHeaderColumn: true,
  allowHeaderRow: true,
  allowMergeCells: true,
  allowNumberColumn: true,
};

const expandOptions: EditorProps['allowExpand'] = {
  allowInsertion: true,
};

const codeBlockOptions: EditorProps['codeBlock'] = {
  allowCopyToClipboard: true,
  appearance: 'mobile' as EditorProps['appearance'],
};

const templatePlaceholdersOptions: EditorProps['allowTemplatePlaceholders'] = {
  allowInserting: true,
};
// End Editor options.

export function MobileEditor(props: MobileEditorProps) {
  const {
    bridge,
    editorConfiguration,
    createCollabProvider,
    intl,
    mentionProvider,
    emojiProvider,
    mediaProvider,
    cardProvider,
    cardClient,
    featureFlags,
  } = props;

  const collabEdit = useCollabEdit(
    bridge,
    editorConfiguration,
    createCollabProvider,
  );

  const analyticsClient = useAnalytics();
  const quickInsert = useQuickInsert(
    bridge,
    intl,
    editorConfiguration.isQuickInsertEnabled(),
  );
  useCollabListeners(bridge, collabEdit);

  // Hooks to create the options once and prevent rerender
  const mediaOptions = {
    ...useMedia(mediaProvider),
    allowResizing: getMediaImageResize(),
    allowResizingInTables: getMediaImageResize(),
    featureFlags: {
      captions: getAllowCaptions(),
      mediaInline: getAllowMediaInline(),
      newCardExperience: getEnableNewMediaCard(),
    },
    alignLeftOnInsert: true,
  };
  const cardsOptions = useSmartCards(cardProvider);
  const taskDecisionProvider = useTaskAndDecision();

  // Create the handle change only once
  // AFP-2511 TODO: Fix automatic suppressions below
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChange = React.useCallback(
    throttle(
      () => {
        toNativeBridge.updateTextWithADFStatus(
          bridge.getContent(),
          isEmptyDocument(bridge.editorView!.state.doc),
        );
      },
      100,
      { leading: false, trailing: true },
    ),
    [bridge, editorConfiguration],
  );

  const { handleEditorReady, handleEditorDestroyed, editorReady } =
    useEditorLifecycle(bridge, mediaOptions);

  usePluginListeners(editorReady, editorConfiguration, bridge);
  useToolbarSubscription(editorReady, editorConfiguration, bridge, intl);
  useTypeAheadSubscription(editorReady, bridge, editorConfiguration);

  // @ts-expect-error: this one is needed for passing tests
  const mode = editorConfiguration.getMode();

  // enable reflowDetector
  useReflowDectector(bridge);

  // Temporarily opting out of the default oauth2 flow for phase 1 of Smart Links
  // See https://product-fabric.atlassian.net/browse/FM-2149 for details.
  const authFlow = 'disabled';

  const isCustomPanelEnabled = editorConfiguration.isCustomPanelEnabled();

  const customPanelOptions = {
    allowCustomPanel: isCustomPanelEnabled,
    allowCustomPanelEdit: editorConfiguration.isCustomPanelEditable(),
  };

  const panelConfiguration = isCustomPanelEnabled ? customPanelOptions : true;

  const taskDecisionOptions = editorConfiguration.isTasksAndDecisionsAllowed()
    ? taskDecisionProvider
    : undefined;

  // This is used to enable a specific performance tracking event which is typing performance.
  // Sampling rate is 10 because mobile users don't type many characters.
  // We can increase the sampling rate in future if needed
  const performanceTracking = {
    inputTracking: {
      enabled: true,
      samplingRate: 10,
    },
  };

  // Editor config overrides feature flags from props
  type Flags = { [key: string]: string | boolean };
  const extendedFeatureFlags: Flags = {
    ...featureFlags,
    tableCellOptionsInFloatingToolbar:
      editorConfiguration.isTableCellOptionsInFloatingToolbar(),
    enableViewUpdateSubscription: true,
  };

  return (
    <FabricAnalyticsListeners client={analyticsClient}>
      <SmartCardProvider client={cardClient} authFlow={authFlow}>
        <EditorContext>
          <Editor
            appearance="mobile"
            onEditorReady={handleEditorReady}
            onDestroy={handleEditorDestroyed}
            media={mediaOptions}
            allowConfluenceInlineComment={true}
            onChange={handleChange}
            allowIndentation={editorConfiguration.isIndentationAllowed()}
            allowPanel={panelConfiguration}
            allowTables={tableOptions}
            smartLinks={cardsOptions}
            allowExtension={true}
            allowTextColor={true}
            allowTextAlignment={true}
            allowDate={true}
            allowRule={true}
            allowStatus={true}
            allowLayouts={getLayoutOptions(featureFlags)}
            allowAnalyticsGASV3={true}
            allowExpand={expandOptions}
            codeBlock={codeBlockOptions}
            allowTemplatePlaceholders={templatePlaceholdersOptions}
            persistScrollGutter={editorConfiguration.isScrollGutterPersisted()}
            taskDecisionProvider={taskDecisionOptions}
            quickInsert={quickInsert}
            collabEdit={collabEdit}
            performanceTracking={performanceTracking}
            {...props}
            featureFlags={extendedFeatureFlags}
            mentionProvider={mentionProvider}
            emojiProvider={emojiProvider}
            placeholder={editorConfiguration.getPlaceholder()}
          />
        </EditorContext>
      </SmartCardProvider>
    </FabricAnalyticsListeners>
  );
}

const MobileEditorWithBridge: React.FC<MobileEditorProps> = (props) => {
  return <MobileEditor {...props} />;
};

const MobileEditorWithIntlProvider = withIntlProvider(
  injectIntl(MobileEditorWithBridge),
  geti18NMessages,
);

export default withSystemTheme(
  MobileEditorWithIntlProvider,
  getEnableLightDarkTheming(),
);
