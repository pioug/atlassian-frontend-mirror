import React from 'react';

import FindReplaceToolbarButtonWithState from './FindReplaceToolbarButtonWithState';
import keymapPlugin from './pm-plugins/keymap';
import { createPlugin } from './pm-plugins/main';
import { findReplacePluginKey } from './pm-plugins/plugin-key';
import type {
  FindReplacePlugin,
  FindReplaceToolbarButtonActionProps,
} from './types';

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

    getSharedState(editorState) {
      if (!editorState) {
        return undefined;
      }
      return findReplacePluginKey.getState(editorState) || undefined;
    },

    actions: {
      getToolbarButton: ({
        popupsBoundariesElement,
        popupsMountPoint,
        popupsScrollableElement,
        editorView,
        containerElement,
        dispatchAnalyticsEvent,
        isToolbarReducedSpacing,
      }: FindReplaceToolbarButtonActionProps) => {
        return (
          <FindReplaceToolbarButtonWithState
            popupsBoundariesElement={popupsBoundariesElement}
            popupsMountPoint={popupsMountPoint}
            popupsScrollableElement={popupsScrollableElement}
            editorView={editorView}
            containerElement={containerElement}
            dispatchAnalyticsEvent={dispatchAnalyticsEvent}
            // `allowMatchCase` comes through the preset, but not the feature flags
            // prop with the `ComposableEditor` - grab the FFs from the editor API
            // instead until we clean this up.
            featureFlags={featureFlags}
            isToolbarReducedSpacing={isToolbarReducedSpacing}
            api={api}
          />
        );
      },
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
            api={api}
          />
        );
      }
    },
  };
};
