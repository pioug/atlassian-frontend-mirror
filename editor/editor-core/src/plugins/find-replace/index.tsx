import React from 'react';
import { createPlugin } from './plugin';
import keymapPlugin from './keymap';
import type {
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import FindReplaceToolbarButtonWithState from './FindReplaceToolbarButtonWithState';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';

type Config = {
  takeFullWidth: boolean;
  twoLineEditorToolbar: boolean;
};

export type FindReplacePlugin = NextEditorPlugin<
  'findReplace',
  {
    pluginConfiguration: Config;
    dependencies: [FeatureFlagsPlugin, OptionalPlugin<AnalyticsPlugin>];
  }
>;

export const findReplacePlugin: FindReplacePlugin = ({
  config: props,
  api,
}) => {
  const featureFlags = api?.featureFlags?.sharedState.currentState() || {};

  return {
    name: 'findReplace',

    pmPlugins() {
      return [
        {
          name: 'findReplace',
          plugin: ({ dispatch }) => createPlugin(dispatch),
        },
        {
          name: 'findReplaceKeymap',
          plugin: () => keymapPlugin(api?.analytics?.actions),
        },
      ];
    },

    primaryToolbarComponent({
      popupsBoundariesElement,
      popupsMountPoint,
      popupsScrollableElement,
      isToolbarReducedSpacing,
      editorView,
      containerElement,
      dispatchAnalyticsEvent,
    }) {
      if (props?.twoLineEditorToolbar) {
        return null;
      } else {
        return (
          <FindReplaceToolbarButtonWithState
            popupsBoundariesElement={popupsBoundariesElement}
            popupsMountPoint={popupsMountPoint}
            popupsScrollableElement={popupsScrollableElement}
            isToolbarReducedSpacing={isToolbarReducedSpacing}
            editorView={editorView}
            containerElement={containerElement}
            dispatchAnalyticsEvent={dispatchAnalyticsEvent}
            takeFullWidth={props?.takeFullWidth}
            featureFlags={featureFlags}
            editorAnalyticsAPI={api?.analytics?.actions}
          />
        );
      }
    },
  };
};
export default findReplacePlugin;
