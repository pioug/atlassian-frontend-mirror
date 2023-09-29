import { useLayoutEffect } from 'react';
import type { IntlShape } from 'react-intl-next';
import type {
  OptionalPlugin,
  NextEditorPlugin,
  ExtractInjectionAPI,
} from '@atlaskit/editor-common/types';
import type WebBridgeImpl from '../native-to-web';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { HyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import type { ListPlugin } from '@atlaskit/editor-plugin-list';
import type { TextFormattingPlugin } from '@atlaskit/editor-plugin-text-formatting';
import type { RulePlugin } from '@atlaskit/editor-plugin-rule';
import type { BasePlugin } from '@atlaskit/editor-plugin-base';
import type { QuickInsertPlugin } from '@atlaskit/editor-plugin-quick-insert';
import { useHyperlinkListener } from './useHyperlinkListener';
import { useTextFormattingListener } from './useTextFormattingListener';
import { useListListener } from './useListListener';
import { useQuickInsertListener } from './useQuickInsertListener';
import { useBlockTypeListener } from './useBlockTypeListener';
import type { CodeBlockPlugin } from '@atlaskit/editor-core/src/plugins/code-block';
import type { PanelPlugin } from '@atlaskit/editor-core/src/plugins/panel';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import type { BlockTypePlugin } from '@atlaskit/editor-plugin-block-type';

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
  } = useSharedPluginState(pluginInjectionApi, [
    'hyperlink',
    'textFormatting',
    'blockType',
    'list',
    'quickInsert',
  ]);
  useHyperlinkListener(editorView, hyperlinkState);
  useTextFormattingListener(textFormattingState, bridge);
  useListListener(listState, bridge);
  useQuickInsertListener(quickInsertState, bridge, intl);
  useBlockTypeListener(blockTypeState);
};

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
      OptionalPlugin<QuickInsertPlugin>,
      OptionalPlugin<RulePlugin>,
    ];
    pluginConfiguration: { bridge: WebBridgeImpl; intl: IntlShape };
  }
> = ({ config: { bridge, intl }, api }) => ({
  name: 'mobile',

  usePluginHook({ editorView }) {
    useLayoutEffect(() => {
      bridge.setPluginInjectionApi(api);
    }, []);

    useListeners(api, editorView, bridge, intl);
  },
});
