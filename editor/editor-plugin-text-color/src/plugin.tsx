import React from 'react';

import { textColor } from '@atlaskit/adf-schema';

import { changeColor } from './commands/change-color';
import type {
  TextColorPluginConfig,
  TextColorPluginState,
} from './pm-plugins/main';
import {
  createPlugin,
  pluginKey as textColorPluginKey,
} from './pm-plugins/main';
import type { TextColorPlugin } from './types';
import { PrimaryToolbarComponent } from './ui/PrimaryToolbarComponent';

const pluginConfig = (
  textColorConfig?: TextColorPluginConfig | boolean,
): TextColorPluginConfig | undefined => {
  if (!textColorConfig || typeof textColorConfig === 'boolean') {
    return undefined;
  }

  return textColorConfig;
};

export const textColorPlugin: TextColorPlugin = ({
  config: textColorConfig,
  api,
}) => {
  return {
    name: 'textColor',

    marks() {
      return [{ name: 'textColor', mark: textColor }];
    },

    pmPlugins() {
      return [
        {
          name: 'textColor',
          plugin: ({ dispatch }) =>
            createPlugin(dispatch, pluginConfig(textColorConfig)),
        },
      ];
    },

    getSharedState(editorState) {
      if (!editorState) {
        return undefined;
      }
      return textColorPluginKey.getState(editorState);
    },

    actions: {
      changeColor: (color: string) => {
        return changeColor(color, api?.analytics?.actions);
      },
    },

    primaryToolbarComponent({
      editorView,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      isToolbarReducedSpacing,
      dispatchAnalyticsEvent,
      disabled,
    }) {
      return (
        <PrimaryToolbarComponent
          isReducedSpacing={isToolbarReducedSpacing}
          editorView={editorView}
          popupsMountPoint={popupsMountPoint}
          popupsBoundariesElement={popupsBoundariesElement}
          popupsScrollableElement={popupsScrollableElement}
          dispatchAnalyticsEvent={dispatchAnalyticsEvent}
          disabled={disabled}
          api={api}
        />
      );
    },
  };
};

export { textColorPluginKey };
export type { TextColorPluginState };
