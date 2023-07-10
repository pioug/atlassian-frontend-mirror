import { useLayoutEffect } from 'react';
import {
  OptionalPlugin,
  NextEditorPlugin,
} from '@atlaskit/editor-common/types';
import WebBridgeImpl from '../native-to-web';

import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';

export const mobileApiPlugin: NextEditorPlugin<
  'mobile',
  {
    dependencies: [OptionalPlugin<typeof analyticsPlugin>];
    pluginConfiguration: { bridge: WebBridgeImpl };
  }
> = ({ bridge }, api) => ({
  name: 'mobile',

  usePluginHook() {
    const editorAnalyticsApi = api?.dependencies.analytics?.actions;

    useLayoutEffect(() => {
      bridge.setAnalyticsApi(editorAnalyticsApi);
    }, [editorAnalyticsApi]);
  },
});
