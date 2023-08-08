import { useLayoutEffect } from 'react';
import {
  OptionalPlugin,
  NextEditorPlugin,
  ExtractInjectionAPI,
} from '@atlaskit/editor-common/types';
import WebBridgeImpl from '../native-to-web';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import type { textFormattingPlugin } from '@atlaskit/editor-core';
import { useHyperlinkListener } from './useHyperlinkListener';
import { useTextFormattingListener } from './useTextFormattingListener';

const useListeners = (
  pluginInjectionApi: ExtractInjectionAPI<typeof mobileApiPlugin> | undefined,
  editorView: EditorView,
) => {
  const { hyperlinkState, textFormattingState } = useSharedPluginState(
    pluginInjectionApi,
    ['hyperlink', 'textFormatting'],
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
      typeof textFormattingPlugin,
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
