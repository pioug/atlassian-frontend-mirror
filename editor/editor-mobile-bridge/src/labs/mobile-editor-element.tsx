import React from 'react';
import { EditorView } from 'prosemirror-view';
import FabricAnalyticsListeners, {
  AnalyticsWebClient,
} from '@atlaskit/analytics-listeners';
import {
  GasPurePayload,
  GasPureScreenEventPayload,
} from '@atlaskit/analytics-gas-types';
import { WithCreateAnalyticsEvent } from '@atlaskit/editor-common';
import {
  ProviderFactoryProvider,
  ProviderFactory,
} from '@atlaskit/editor-common/provider-factory';
import {
  EditorPresetMobile,
  Mobile as MobileEditor,
  EditorContext,
} from '@atlaskit/editor-core/labs-next';
import { AtlaskitThemeProvider } from '@atlaskit/theme/components';
import { Provider as SmartCardProvider } from '@atlaskit/smart-card';
import { analyticsBridgeClient } from '../analytics-client';
import { toNativeBridge } from '../editor/web-to-native';
import WebBridgeImpl from '../editor/native-to-web';
import {
  initPluginListeners,
  destroyPluginListeners,
} from '../editor/plugin-subscription';
import { createDefaultProviderFactory } from '../providers/createDefaultProviderFactory';
import MobilePicker from '../editor/MobileMediaPicker';
import { EditorViewWithComposition } from '../types';
import { createCardClient } from '../providers';

// Expose WebBridge instance for use by native side
const bridge = new WebBridgeImpl();
window.bridge = bridge;

type Props = {
  defaultValue?: string;
  placeholder?: string;
  shouldFocus?: boolean;
  mode?: 'light' | 'dark';
  providerFactory?: ProviderFactory;
};

const handleAnalyticsEvent = (
  event: GasPurePayload | GasPureScreenEventPayload,
) => {
  toNativeBridge.call('analyticsBridge', 'trackEvent', {
    event: JSON.stringify(event),
  });
};

export default function Editor(props: Props = {}) {
  const mode = props.mode || 'light';
  const providerFactory = React.useMemo(
    () => createDefaultProviderFactory(),
    [],
  );

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
      <SmartCardProvider client={createCardClient()} authFlow={authFlow}>
        <AtlaskitThemeProvider mode={mode}>
          <EditorContext editorActions={bridge.editorActions}>
            <ProviderFactoryProvider
              value={props.providerFactory || providerFactory}
            >
              <WithCreateAnalyticsEvent
                render={createAnalyticsEvent => {
                  return (
                    <EditorPresetMobile
                      createAnalyticsEvent={createAnalyticsEvent}
                      placeholder={props.placeholder}
                      media={{
                        picker: customMediaPicker,
                        allowMediaSingle: true,
                      }}
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
              ></WithCreateAnalyticsEvent>
            </ProviderFactoryProvider>
          </EditorContext>
        </AtlaskitThemeProvider>
      </SmartCardProvider>
    </FabricAnalyticsListeners>
  );
}
