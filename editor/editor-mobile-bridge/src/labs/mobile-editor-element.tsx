import React from 'react';
import { IntlProvider } from 'react-intl';
import FabricAnalyticsListeners, {
  AnalyticsWebClient,
} from '@atlaskit/analytics-listeners';
import {
  GasPurePayload,
  GasPureScreenEventPayload,
} from '@atlaskit/analytics-gas-types';
import { WithCreateAnalyticsEvent } from '@atlaskit/editor-common';
import { Provider as CollabProvider } from '@atlaskit/collab-provider';
import {
  ProviderFactoryProvider,
  ProviderFactory,
} from '@atlaskit/editor-common/provider-factory';
import {
  MentionProvider,
  MediaProvider as MediaProviderType,
} from '@atlaskit/editor-core';
import {
  EditorPresetMobile,
  Mobile as MobileEditor,
  EditorContext,
  EditorProps,
} from '@atlaskit/editor-core/labs-next';
import { AtlaskitThemeProvider } from '@atlaskit/theme/components';
import {
  Provider as SmartCardProvider,
  EditorCardProvider,
  Client as EditorCardClient,
} from '@atlaskit/smart-card';
import { EmojiResource } from '@atlaskit/emoji/resource';
import { analyticsBridgeClient } from '../analytics-client';
import { toNativeBridge } from '../editor/web-to-native';
import WebBridgeImpl from '../editor/native-to-web';
import MobilePicker from '../editor/MobileMediaPicker';
import {
  createTaskDecisionProvider,
  createQuickInsertProvider,
} from '../providers';
import { getLocaleValue } from '../query-param-reader';
import { useTranslations } from '../i18n/use-translations';
import { useCollabProvider } from '../providers/collab-provider';
import { useEditorConfiguration } from '../editor/hooks/use-editor-configuration';
import MobileEditorConfiguration from '../editor/editor-configuration';
import { useEditorLifecycle } from '../editor/hooks/use-editor-life-cycle';
import { usePluginListeners } from '../editor/hooks/use-plugin-listeners';

// Expose WebBridge instance for use by native side
const bridge = new WebBridgeImpl();
window.bridge = bridge;

type Props = {
  defaultValue?: string;
  mode?: 'light' | 'dark';
  createCollabProvider?: (bridge: WebBridgeImpl) => Promise<CollabProvider>;
  cardProvider?: Promise<EditorCardProvider>;
  cardClient?: EditorCardClient;
  emojiProvider?: Promise<EmojiResource>;
  mediaProvider?: Promise<MediaProviderType>;
  mentionProvider?: Promise<MentionProvider>;
  initialEditorConfig?: MobileEditorConfiguration;
  shouldFocus?: boolean;
} & Pick<EditorProps, 'placeholder'>;

const handleAnalyticsEvent = (
  event: GasPurePayload | GasPureScreenEventPayload,
) => {
  toNativeBridge.call('analyticsBridge', 'trackEvent', {
    event: JSON.stringify(event),
  });
};

const quickInsertProvider = createQuickInsertProvider(
  bridge.quickInsertItems,
  bridge.allowList,
  bridge.getEditorConfiguration().isQuickInsertEnabled(),
);

export default function Editor(props: Props = {}, context: any) {
  const mode = props.mode || 'light';
  const { locale, messages } = useTranslations(getLocaleValue());
  const editorConfiguration = useEditorConfiguration(
    bridge,
    props.initialEditorConfig,
  );
  const {
    handleEditorReady,
    handleEditorDestroyed,
    editorReady,
  } = useEditorLifecycle(bridge);

  usePluginListeners(editorReady, editorConfiguration, bridge);
  const collabProvider = useCollabProvider(bridge, props.createCollabProvider);
  const providerFactory = React.useMemo(
    () =>
      ProviderFactory.create({
        mentionProvider: props.mentionProvider,
        emojiProvider: props.emojiProvider,
        mediaProvider: props.mediaProvider,
        taskDecisionProvider: Promise.resolve(createTaskDecisionProvider()),
        cardProvider: props.cardProvider,
        quickInsertProvider: quickInsertProvider,
        collabEditProvider: collabProvider,
      }),
    [
      props.mentionProvider,
      props.emojiProvider,
      props.mediaProvider,
      props.cardProvider,
      collabProvider,
    ],
  );
  const isQuickInsertEnabled = bridge
    .getEditorConfiguration()
    .isQuickInsertEnabled();

  if (!messages) {
    return null;
  }

  // Temporarily opting out of the default oauth2 flow for phase 1 of Smart Links
  // See https://product-fabric.atlassian.net/browse/FM-2149 for details.
  const authFlow = 'disabled';
  const analyticsClient: AnalyticsWebClient = analyticsBridgeClient(
    handleAnalyticsEvent,
  );
  const customMediaPicker = new MobilePicker();
  bridge.mediaPicker = customMediaPicker;

  return (
    <FabricAnalyticsListeners client={analyticsClient}>
      <SmartCardProvider client={props.cardClient} authFlow={authFlow}>
        <AtlaskitThemeProvider mode={mode}>
          <IntlProvider locale={locale.replace('_', '-')} messages={messages}>
            <EditorContext editorActions={bridge.editorActions}>
              <ProviderFactoryProvider value={providerFactory}>
                <WithCreateAnalyticsEvent
                  render={createAnalyticsEvent => {
                    return (
                      <EditorPresetMobile
                        createAnalyticsEvent={createAnalyticsEvent}
                        media={{
                          picker: customMediaPicker,
                          allowMediaSingle: true,
                        }}
                        excludes={
                          isQuickInsertEnabled
                            ? new Set()
                            : new Set(['quickInsert'])
                        }
                      >
                        <MobileEditor
                          defaultValue={props.defaultValue}
                          onChange={() => {
                            toNativeBridge.updateText(bridge.getContent());
                          }}
                          onMount={handleEditorReady}
                          onDestroy={handleEditorDestroyed}
                        />
                      </EditorPresetMobile>
                    );
                  }}
                />
              </ProviderFactoryProvider>
            </EditorContext>
          </IntlProvider>
        </AtlaskitThemeProvider>
      </SmartCardProvider>
    </FabricAnalyticsListeners>
  );
}
