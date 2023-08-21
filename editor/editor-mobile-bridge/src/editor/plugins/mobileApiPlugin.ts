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
import { useHyperlinkListener } from './useHyperlinkListener';
import { useTextFormattingListener } from './useTextFormattingListener';

const useListeners = (
  pluginInjectionApi: ExtractInjectionAPI<typeof mobileApiPlugin> | undefined,
  editorView: EditorView,
) => {
  const { hyperlinkState, textFormattingState } = useSharedPluginState(
    pluginInjectionApi,
    ['hyperlink', 'textFormatting', 'list'],
  );

  useHyperlinkListener(editorView, hyperlinkState);
  useTextFormattingListener(textFormattingState);
};

export const mobileApiPlugin: NextEditorPlugin<
  'mobile',
  {
    dependencies: [
      OptionalPlugin<typeof analyticsPlugin>,
      typeof hyperlinkPlugin,
      TextFormattingPlugin,
      ListPlugin,
    ];
    pluginConfiguration: { bridge: WebBridgeImpl };
  }
> = ({ bridge }, api) => ({
  name: 'mobile',

  usePluginHook({ editorView }) {
    useLayoutEffect(() => {
      bridge.setPluginInjectionApi(api);
    }, []);

    useListeners(api, editorView);
  },
});
