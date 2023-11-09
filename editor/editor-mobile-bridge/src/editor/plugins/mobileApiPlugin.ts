import { useLayoutEffect, useEffect } from 'react';
import type { IntlShape } from 'react-intl-next';
import type {
  OptionalPlugin,
  NextEditorPlugin,
  ExtractInjectionAPI,
} from '@atlaskit/editor-common/types';
import type WebBridgeImpl from '../native-to-web';
import {
  useSharedPluginState,
  usePreviousState,
} from '@atlaskit/editor-common/hooks';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { HyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { ListPlugin } from '@atlaskit/editor-plugin-list';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { TextFormattingPlugin } from '@atlaskit/editor-plugin-text-formatting';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { RulePlugin } from '@atlaskit/editor-plugin-rule';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { BasePlugin } from '@atlaskit/editor-plugin-base';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { QuickInsertPlugin } from '@atlaskit/editor-plugin-quick-insert';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { EmojiPlugin } from '@atlaskit/editor-plugin-emoji';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import { useHyperlinkListener } from './useHyperlinkListener';
import { useTextFormattingListener } from './useTextFormattingListener';
import { useListListener } from './useListListener';
import { useQuickInsertListener } from './useQuickInsertListener';
import { useBlockTypeListener } from './useBlockTypeListener';
import { useTextColorListener } from './useTextColorListener';
import type { MentionsPlugin } from '@atlaskit/editor-plugin-mentions';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { CodeBlockPlugin } from '@atlaskit/editor-plugin-code-block';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { StatusPlugin } from '@atlaskit/editor-plugin-status';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { PanelPlugin } from '@atlaskit/editor-plugin-panel';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { BlockTypePlugin } from '@atlaskit/editor-plugin-block-type';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { TextColorPlugin } from '@atlaskit/editor-plugin-text-color';
import type { DatePlugin } from '@atlaskit/editor-plugin-date';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type EditorConfiguration from '../editor-configuration';
import { toNativeBridge } from '../web-to-native';

const useListeners = (
  pluginInjectionApi: ExtractInjectionAPI<typeof mobileApiPlugin> | undefined,
  editorView: EditorView,
  bridge: WebBridgeImpl,
  intl: IntlShape,
) => {
  const {
    hyperlinkState,
    textFormattingState,
    blockTypeState,
    listState,
    quickInsertState,
    textColorState,
  } = useSharedPluginState(pluginInjectionApi, [
    'hyperlink',
    'textFormatting',
    'blockType',
    'list',
    'quickInsert',
    'textColor',
  ]);
  useHyperlinkListener(editorView, hyperlinkState);
  useTextFormattingListener(textFormattingState, bridge);
  useListListener(listState, bridge);
  useQuickInsertListener(quickInsertState, bridge, intl);
  useBlockTypeListener(blockTypeState);
  useTextColorListener(textColorState, bridge);
};

function useTypeAheadSubscription(
  pluginInjectionApi: ExtractInjectionAPI<typeof mobileApiPlugin> | undefined,
  editorConfiguration: EditorConfiguration,
) {
  const { typeAheadState } = useSharedPluginState(pluginInjectionApi, [
    'typeAhead',
  ]);
  const previousTypeAheadState = usePreviousState(typeAheadState);

  const newPluginState = typeAheadState;
  const oldPluginState = previousTypeAheadState;

  useEffect(() => {
    if (!newPluginState || !oldPluginState) {
      return;
    }

    const wasClosed = !newPluginState.isOpen && oldPluginState.isOpen;

    if (wasClosed) {
      toNativeBridge.call('typeAheadBridge', 'dismissTypeAhead');
      return;
    }

    if (!newPluginState.currentHandler) {
      return;
    }
    const {
      currentHandler: { trigger },
    } = newPluginState;

    const wasOpened =
      oldPluginState.currentHandler !== newPluginState.currentHandler;
    const hasQueryChanged = newPluginState.query !== oldPluginState.query;
    const isQuickInsert =
      newPluginState.currentHandler.id === TypeAheadAvailableNodes.QUICK_INSERT;
    const query = newPluginState.query;

    if (isQuickInsert && (wasOpened || hasQueryChanged)) {
      const quickInsertList =
        pluginInjectionApi?.quickInsert?.actions.getSuggestions({
          query,
          disableDefaultItems: true,
        });
      const quickInsertItems = quickInsertList?.map(({ id, title }) => ({
        id,
        title,
      }));

      toNativeBridge.call('typeAheadBridge', 'typeAheadDisplayItems', {
        query,
        trigger,
        items: JSON.stringify(quickInsertItems),
      });
    } else if (hasQueryChanged || wasOpened) {
      toNativeBridge.call('typeAheadBridge', 'typeAheadQuery', {
        query,
        trigger,
      });
    }
    // We need to recreate the hook when there is a new editorConfiguration
  }, [editorConfiguration, newPluginState, oldPluginState, pluginInjectionApi]); // eslint-disable-line react-hooks/exhaustive-deps
  // }, [editorReady, editorConfiguration, editorView, bridge]); // eslint-disable-line react-hooks/exhaustive-deps
}

export const mobileApiPlugin: NextEditorPlugin<
  'mobile',
  {
    dependencies: [
      BasePlugin,
      OptionalPlugin<AnalyticsPlugin>,
      HyperlinkPlugin,
      BlockTypePlugin,
      CodeBlockPlugin,
      PanelPlugin,
      TextFormattingPlugin,
      ListPlugin,
      TypeAheadPlugin,
      OptionalPlugin<QuickInsertPlugin>,
      OptionalPlugin<RulePlugin>,
      EmojiPlugin,
      MentionsPlugin,
      EditorDisabledPlugin,
      DatePlugin,
      StatusPlugin,
      TextColorPlugin,
    ];
    pluginConfiguration: {
      editorConfiguration: EditorConfiguration;
      bridge: WebBridgeImpl;
      intl: IntlShape;
    };
  }
> = ({ config: { bridge, intl, editorConfiguration }, api }) => ({
  name: 'mobile',

  usePluginHook({ editorView }) {
    useLayoutEffect(() => {
      bridge.setPluginInjectionApi(api);
    }, []);

    useListeners(api, editorView, bridge, intl);
    useTypeAheadSubscription(api, editorConfiguration);
  },
});
