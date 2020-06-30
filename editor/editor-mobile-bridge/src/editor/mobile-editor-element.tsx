import React from 'react';
import { EditorView } from 'prosemirror-view';
import { EditorViewWithComposition } from '../types';
import {
  Editor,
  MediaProvider as MediaProviderType,
  EditorProps,
  MentionProvider,
  setMobilePaddingTop,
  quickInsertPluginKey,
  processQuickInsertItems,
} from '@atlaskit/editor-core';
import FabricAnalyticsListeners, {
  AnalyticsWebClient,
} from '@atlaskit/analytics-listeners';
import {
  GasPurePayload,
  GasPureScreenEventPayload,
} from '@atlaskit/analytics-gas-types';
import { Provider as CollabProvider } from '@atlaskit/collab-provider';
import { AtlaskitThemeProvider } from '@atlaskit/theme';
import { toNativeBridge } from './web-to-native';
import WebBridgeImpl from './native-to-web';
import MobilePicker from './MobileMediaPicker';
import {
  initPluginListeners,
  destroyPluginListeners,
} from './plugin-subscription';
import { createTaskDecisionProvider } from '../providers';
import {
  Provider as SmartCardProvider,
  EditorCardProvider,
  Client as EditorCardClient,
} from '@atlaskit/smart-card';
import { EmojiResource } from '@atlaskit/emoji/resource';
import { analyticsBridgeClient } from '../analytics-client';
import { createQuickInsertProvider } from '../providers';
import { getEnableQuickInsertValue } from '../query-param-reader';
import { useCollabProvider } from '../providers/collab-provider';

export const bridge: WebBridgeImpl = (window.bridge = new WebBridgeImpl());

const handleAnalyticsEvent = (
  event: GasPurePayload | GasPureScreenEventPayload,
) => {
  toNativeBridge.call('analyticsBridge', 'trackEvent', {
    event: JSON.stringify(event),
  });
};

class EditorWithState extends Editor {
  onEditorCreated(instance: {
    view: EditorView & EditorViewWithComposition;
    eventDispatcher: any;
    transformer?: any;
  }) {
    super.onEditorCreated(instance);

    const { eventDispatcher, view } = instance;
    const mobilePaddingTop = bridge.getPadding().top;

    bridge.editorView = view;
    bridge.editorActions._privateRegisterEditor(view, eventDispatcher);
    if (this.props.media && this.props.media.customMediaPicker) {
      bridge.mediaPicker = this.props.media.customMediaPicker;
    }

    initPluginListeners(eventDispatcher, bridge, view);

    if (getEnableQuickInsertValue()) {
      const quickInsertPluginState = quickInsertPluginKey.getState(view.state);
      bridge.quickInsertItems.resolve(
        processQuickInsertItems(
          quickInsertPluginState.items,
          this.context.intl,
        ),
      );
    }

    /**
     * Because native side calls `setPadding` in bridge implementation before editorView is created,
     * we need to dispatch the `setMobilePaddingTop` action again when the editor view is created,
     * in order to set the padding on the editor side for height calculations
     */
    if (mobilePaddingTop > 0) {
      setMobilePaddingTop(mobilePaddingTop)(view.state, view.dispatch);
    }
  }

  onEditorDestroyed(instance: {
    view: EditorView;
    eventDispatcher: any;
    transformer?: any;
  }) {
    super.onEditorDestroyed(instance);

    destroyPluginListeners(instance.eventDispatcher, bridge);

    bridge.editorActions._privateUnregisterEditor();
    bridge.editorView = null;
    bridge.mentionsPluginState = null;
  }
}

export interface MobileEditorProps extends EditorProps {
  mode?: 'light' | 'dark';
  createCollabProvider: (bridge: WebBridgeImpl) => Promise<CollabProvider>;
  cardProvider: Promise<EditorCardProvider>;
  cardClient: EditorCardClient;
  emojiProvider: Promise<EmojiResource>;
  mediaProvider: Promise<MediaProviderType>;
  mentionProvider: Promise<MentionProvider>;
}

export default function MobileEditor(props: MobileEditorProps) {
  const collabProvider = useCollabProvider(bridge, props.createCollabProvider);
  const mode = props.mode || 'light';

  // Temporarily opting out of the default oauth2 flow for phase 1 of Smart Links
  // See https://product-fabric.atlassian.net/browse/FM-2149 for details.
  const authFlow = 'disabled';
  const analyticsClient: AnalyticsWebClient = analyticsBridgeClient(
    handleAnalyticsEvent,
  );

  const quickInsert = getEnableQuickInsertValue()
    ? {
        provider: createQuickInsertProvider(bridge.quickInsertItems),
      }
    : false;

  const collabEdit: EditorProps['collabEdit'] | undefined = collabProvider
    ? {
        useNativePlugin: true,
        provider: collabProvider,
      }
    : undefined;

  return (
    <FabricAnalyticsListeners client={analyticsClient}>
      <SmartCardProvider client={props.cardClient} authFlow={authFlow}>
        <AtlaskitThemeProvider mode={mode}>
          <EditorWithState
            appearance="mobile"
            mentionProvider={props.mentionProvider}
            emojiProvider={props.emojiProvider}
            media={{
              customMediaPicker: new MobilePicker(),
              provider: props.mediaProvider,
              allowMediaSingle: true,
              allowAltTextOnImages: true,
            }}
            allowConfluenceInlineComment={true}
            onChange={() => {
              toNativeBridge.updateText(bridge.getContent());
            }}
            allowPanel={true}
            allowTables={{
              allowControls: false,
            }}
            UNSAFE_cards={{
              provider: props.cardProvider,
              allowEmbeds: true,
              allowBlockCards: true,
              allowResizing: false,
            }}
            allowExtension={true}
            allowTextColor={true}
            allowDate={true}
            allowRule={true}
            allowStatus={true}
            allowLayouts={{
              allowBreakout: true,
            }}
            allowAnalyticsGASV3={true}
            allowExpand={true}
            allowTemplatePlaceholders={{ allowInserting: true }}
            taskDecisionProvider={Promise.resolve(createTaskDecisionProvider())}
            quickInsert={quickInsert}
            collabEdit={collabEdit}
            {...props}
          />
        </AtlaskitThemeProvider>
      </SmartCardProvider>
    </FabricAnalyticsListeners>
  );
}
