import React from 'react';
import {
  Editor,
  MediaProvider as MediaProviderType,
  EditorProps,
  MentionProvider,
} from '@atlaskit/editor-core';
import FabricAnalyticsListeners, {
  AnalyticsWebClient,
} from '@atlaskit/analytics-listeners';
import { Provider as CollabProvider } from '@atlaskit/collab-provider';
import { toNativeBridge } from './web-to-native';
import WebBridgeImpl from './native-to-web';
import {
  Provider as SmartCardProvider,
  EditorCardProvider,
  Client as EditorCardClient,
} from '@atlaskit/smart-card';
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
import { InjectedIntl, injectIntl } from 'react-intl';
import { usePageTitle } from './hooks/use-page-title';
import { geti18NMessages } from './editor-localisation-provider';
import { withSystemTheme } from '../WithSystemTheme';
import { getEnableLightDarkTheming } from '../query-param-reader';
import { useEditorLifecycle } from './hooks/use-editor-life-cycle';
import { usePluginListeners } from './hooks/use-plugin-listeners';
import EditorConfiguration from './editor-configuration';

export interface MobileEditorProps extends EditorProps {
  createCollabProvider: (bridge: WebBridgeImpl) => Promise<CollabProvider>;
  cardProvider: Promise<EditorCardProvider>;
  cardClient: EditorCardClient;
  emojiProvider: Promise<EmojiResource>;
  mediaProvider: Promise<MediaProviderType>;
  mentionProvider: Promise<MentionProvider>;
  intl: InjectedIntl;
  bridge: WebBridgeImpl;
  editorConfiguration: EditorConfiguration;
  locale?: string;
}

// Editor options. Keep as external cost to prevent unnecessary re-renders;
const layoutOptions = {
  allowBreakout: true,
};

const tableOptions = {
  allowControls: false,
};

const templatePlaceholdersOptions = { allowInserting: true };
// End Editor options.

export function MobileEditor(props: MobileEditorProps) {
  const { bridge, editorConfiguration } = props;
  const collabEdit = useCollabEdit(bridge, props.createCollabProvider);
  const analyticsClient: AnalyticsWebClient = useAnalytics();
  const quickInsert = useQuickInsert(
    bridge,
    props.intl,
    editorConfiguration.isQuickInsertEnabled(),
  );
  usePageTitle(bridge, collabEdit);

  // Hooks to create the options once and prevent rerender
  const mediaOptions = useMedia(props.mediaProvider);
  const cardsOptions = useSmartCards(props.cardProvider);
  const taskDecisionProvider = useTaskAndDecision();

  // Create the handle change only once
  // AFP-2511 TODO: Fix automatic suppressions below
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChange = React.useCallback(
    throttle(
      () => {
        toNativeBridge.updateText(bridge.getContent());
      },
      100,
      { leading: false, trailing: true },
    ),
    [bridge],
  );

  const {
    handleEditorReady,
    handleEditorDestroyed,
    editorReady,
  } = useEditorLifecycle(bridge, mediaOptions);

  usePluginListeners(editorReady, editorConfiguration, bridge);

  // @ts-expect-error: this one is needed for passing tests
  const mode = editorConfiguration.getMode();

  // enable reflowDetector
  useReflowDectector(bridge);

  // Temporarily opting out of the default oauth2 flow for phase 1 of Smart Links
  // See https://product-fabric.atlassian.net/browse/FM-2149 for details.
  const authFlow = 'disabled';

  // This is used to enable a specific performance tracking event which is typing performance.
  // Sampling rate is 10 because mobile users don't type many characters.
  // We can increase the sampling rate in future if needed
  const performanceTracking = {
    inputTracking: {
      enabled: true,
      samplingRate: 10,
    },
  };

  return (
    <FabricAnalyticsListeners client={analyticsClient}>
      <SmartCardProvider client={props.cardClient} authFlow={authFlow}>
        <Editor
          appearance="mobile"
          onEditorReady={handleEditorReady}
          onDestroy={handleEditorDestroyed}
          media={mediaOptions}
          allowConfluenceInlineComment={true}
          onChange={handleChange}
          allowPanel={true}
          allowTables={tableOptions}
          UNSAFE_cards={cardsOptions}
          allowExtension={true}
          allowTextColor={true}
          allowDate={true}
          allowRule={true}
          allowStatus={true}
          allowLayouts={layoutOptions}
          allowAnalyticsGASV3={true}
          allowExpand={true}
          allowTemplatePlaceholders={templatePlaceholdersOptions}
          allowScrollGutter={editorConfiguration.isAllowScrollGutter()}
          UNSAFE_predictableLists={editorConfiguration.isPredictableListEnabled()}
          taskDecisionProvider={taskDecisionProvider}
          quickInsert={quickInsert}
          collabEdit={collabEdit}
          performanceTracking={performanceTracking}
          {...props}
          mentionProvider={props.mentionProvider}
          emojiProvider={props.emojiProvider}
        />
      </SmartCardProvider>
    </FabricAnalyticsListeners>
  );
}

const MobileEditorWithBridge: React.FC<MobileEditorProps> = props => {
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
