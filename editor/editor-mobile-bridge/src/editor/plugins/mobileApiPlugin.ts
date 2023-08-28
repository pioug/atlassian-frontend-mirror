import { useLayoutEffect } from 'react';
import type {
  OptionalPlugin,
  NextEditorPlugin,
  ExtractInjectionAPI,
} from '@atlaskit/editor-common/types';
import type WebBridgeImpl from '../native-to-web';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import type { ListPlugin } from '@atlaskit/editor-plugin-list';
import type { TextFormattingPlugin } from '@atlaskit/editor-plugin-text-formatting';
import type { quickInsertPlugin } from '@atlaskit/editor-core/src/plugins';
import { useHyperlinkListener } from './useHyperlinkListener';
import { useTextFormattingListener } from './useTextFormattingListener';
import { useListListener } from './useListListener';
import { useQuickInsertListener } from './useQuickInsertListener';
import type { IntlShape } from 'react-intl-next';

const useListeners = (
  pluginInjectionApi: ExtractInjectionAPI<typeof mobileApiPlugin> | undefined,
  editorView: EditorView,
  bridge: WebBridgeImpl,
  intl: IntlShape,
) => {
  const { hyperlinkState, textFormattingState, listState, quickInsertState } =
    useSharedPluginState(pluginInjectionApi, [
      'hyperlink',
      'textFormatting',
      'list',
      'quickInsert',
    ]);

  useHyperlinkListener(editorView, hyperlinkState);
  useTextFormattingListener(textFormattingState, bridge);
  useListListener(listState, bridge);
  useQuickInsertListener(quickInsertState, bridge, intl);
};

export const mobileApiPlugin: NextEditorPlugin<
  'mobile',
  {
    dependencies: [
      OptionalPlugin<typeof analyticsPlugin>,
      typeof hyperlinkPlugin,
      TextFormattingPlugin,
      ListPlugin,
      OptionalPlugin<typeof quickInsertPlugin>,
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
