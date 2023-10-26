import React from 'react';

import { textColor } from '@atlaskit/adf-schema';
import { WithPluginState } from '@atlaskit/editor-common/with-plugin-state';

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
import ToolbarTextColor from './ui/ToolbarTextColor';

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
        <WithPluginState
          plugins={{
            textColor: textColorPluginKey,
          }}
          render={({ textColor }) => (
            <ToolbarTextColor
              pluginState={textColor!}
              isReducedSpacing={isToolbarReducedSpacing}
              editorView={editorView}
              popupsMountPoint={popupsMountPoint}
              popupsBoundariesElement={popupsBoundariesElement}
              popupsScrollableElement={popupsScrollableElement}
              dispatchAnalyticsEvent={dispatchAnalyticsEvent}
              disabled={disabled}
              pluginInjectionApi={api}
            />
          )}
        />
      );
    },
  };
};

export { textColorPluginKey };
export type { TextColorPluginState };
