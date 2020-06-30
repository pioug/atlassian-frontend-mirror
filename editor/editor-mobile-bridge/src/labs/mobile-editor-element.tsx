import React from 'react';
import { IntlProvider } from 'react-intl';
import { EditorView } from 'prosemirror-view';
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
  processQuickInsertItems,
  quickInsertPluginKey,
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
import {
  initPluginListeners,
  destroyPluginListeners,
} from '../editor/plugin-subscription';
import MobilePicker from '../editor/MobileMediaPicker';
import { EditorViewWithComposition } from '../types';
import {
  createTaskDecisionProvider,
  createQuickInsertProvider,
} from '../providers';
import { getEnableQuickInsertValue } from '../query-param-reader';
import useTranslations from '../editor/useTranslations';
import { useCollabProvider } from '../providers/collab-provider';

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
  shouldFocus?: boolean;
} & Pick<EditorProps, 'placeholder'>;

const handleAnalyticsEvent = (
  event: GasPurePayload | GasPureScreenEventPayload,
) => {
  toNativeBridge.call('analyticsBridge', 'trackEvent', {
    event: JSON.stringify(event),
  });
};

const quickInsertProvider = createQuickInsertProvider(bridge.quickInsertItems);

export default function Editor(props: Props = {}, context: any) {
  const mode = props.mode || 'light';
  const [locale, messages] = useTranslations();
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
                          getEnableQuickInsertValue()
                            ? new Set()
                            : new Set(['quickInsert'])
                        }
                      >
                        <MobileEditor
                          defaultValue={props.defaultValue}
                          onChange={() => {
                            toNativeBridge.updateText(bridge.getContent());
                          }}
                          onMount={() => {
                            bridge.editorView = bridge.editorActions._privateGetEditorView() as EditorView &
                              EditorViewWithComposition;

                            initPluginListeners(
                              bridge.editorActions._privateGetEventDispatcher()!,
                              bridge,
                              bridge.editorView!,
                            );

                            if (getEnableQuickInsertValue()) {
                              const quickInsertPluginState = quickInsertPluginKey.getState(
                                bridge.editorView.state,
                              );
                              bridge.quickInsertItems.resolve(
                                processQuickInsertItems(
                                  quickInsertPluginState.items,
                                  context.intl,
                                ),
                              );
                            }
                          }}
                          onDestroy={() => {
                            destroyPluginListeners(
                              bridge.editorActions._privateGetEventDispatcher(),
                              bridge,
                            );

                            bridge.editorActions._privateUnregisterEditor();
                            bridge.editorView = null;
                            bridge.mentionsPluginState = null;
                          }}
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
