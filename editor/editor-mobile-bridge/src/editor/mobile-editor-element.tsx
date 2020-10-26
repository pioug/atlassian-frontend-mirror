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
import { AtlaskitThemeProvider } from '@atlaskit/theme/components';
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
import { useEditorReady } from './hooks/use-editor-ready';
import { useEditorDestroyed } from './hooks/use-editor-destroyed';
import { useReflowDectector } from './hooks/use-reflow-detector';
import throttle from 'lodash/throttle';
import { withIntlProvider } from '../i18n/with-intl-provider';
import { InjectedIntl, injectIntl } from 'react-intl';

const MOBILE_SAMPLING_LIMIT = 10;

// Bridge creation and initialize on window
export const bridge: WebBridgeImpl = (window.bridge = new WebBridgeImpl());

export interface MobileEditorProps extends EditorProps {
  mode?: 'light' | 'dark';
  bridge: WebBridgeImpl;
  createCollabProvider: (bridge: WebBridgeImpl) => Promise<CollabProvider>;
  cardProvider: Promise<EditorCardProvider>;
  cardClient: EditorCardClient;
  emojiProvider: Promise<EmojiResource>;
  mediaProvider: Promise<MediaProviderType>;
  mentionProvider: Promise<MentionProvider>;
  intl: InjectedIntl;
}

// Editor options. Keep as external cost to prevent unnecesary re-renders;
const layoutOptions = {
  allowBreakout: true,
};

const tableOptions = {
  allowControls: false,
};

const templatePlaceholdersOptions = { allowInserting: true };
// End Editor options.

export function MobileEditor(props: MobileEditorProps) {
  const { bridge } = props;
  const collabEdit = useCollabEdit(bridge, props.createCollabProvider);
  const analyticsClient: AnalyticsWebClient = useAnalytics();
  const quickInsert = useQuickInsert(bridge);

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

  const handleEditorReady = useEditorReady(bridge, props.intl, mediaOptions);
  const handleEditorDestroyed = useEditorDestroyed(bridge);

  const mode = props.mode || 'light';

  // enable reflowDetector
  useReflowDectector(bridge);

  // Temporarily opting out of the default oauth2 flow for phase 1 of Smart Links
  // See https://product-fabric.atlassian.net/browse/FM-2149 for details.
  const authFlow = 'disabled';

  return (
    <FabricAnalyticsListeners client={analyticsClient}>
      <SmartCardProvider client={props.cardClient} authFlow={authFlow}>
        <AtlaskitThemeProvider mode={mode}>
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
            taskDecisionProvider={taskDecisionProvider}
            quickInsert={quickInsert}
            collabEdit={collabEdit}
            inputSamplingLimit={MOBILE_SAMPLING_LIMIT}
            {...props}
            mentionProvider={props.mentionProvider}
            emojiProvider={props.emojiProvider}
          />
        </AtlaskitThemeProvider>
      </SmartCardProvider>
    </FabricAnalyticsListeners>
  );
}

const MobileEditorWithBridge: React.FC<Omit<
  MobileEditorProps,
  'bridge'
>> = props => {
  return <MobileEditor {...props} bridge={bridge} />;
};

export default withIntlProvider(injectIntl(MobileEditorWithBridge));
