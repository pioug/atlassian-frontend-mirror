import { useLayoutEffect } from 'react';
import {
  OptionalPlugin,
  NextEditorPlugin,
  ExtractInjectionAPI,
} from '@atlaskit/editor-common/types';
import WebBridgeImpl from '../native-to-web';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { EditorView } from 'prosemirror-view';

import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import { useHyperlinkListener } from './useHyperlinkListener';

const useListeners = (
  pluginInjectionApi: ExtractInjectionAPI<typeof mobileApiPlugin> | undefined,
  editorView: EditorView,
) => {
  const { hyperlinkState } = useSharedPluginState(pluginInjectionApi, [
    'hyperlink',
  ]);

  useHyperlinkListener(editorView, hyperlinkState);
};

export const mobileApiPlugin: NextEditorPlugin<
  'mobile',
  {
    dependencies: [
      OptionalPlugin<typeof analyticsPlugin>,
      typeof hyperlinkPlugin,
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
