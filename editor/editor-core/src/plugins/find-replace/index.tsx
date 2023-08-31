import React from 'react';
import { createPlugin } from './plugin';
import keymapPlugin from './keymap';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import FindReplaceToolbarButtonWithState from './FindReplaceToolbarButtonWithState';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';

type Config = {
  takeFullWidth: boolean;
  twoLineEditorToolbar: boolean;
};
export const findReplacePlugin: NextEditorPlugin<
  'findReplace',
  {
    pluginConfiguration: Config;
    dependencies: [FeatureFlagsPlugin];
  }
> = ({ config: props, api }) => {
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
          plugin: () => keymapPlugin(),
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
          />
        );
      }
    },
  };
};
export default findReplacePlugin;
