import React from 'react';
import { textColor } from '@atlaskit/adf-schema';
import { WithPluginState } from '@atlaskit/editor-common/with-plugin-state';
import type {
  TextColorPluginConfig,
  TextColorPluginState,
} from './pm-plugins/main';
import {
  createPlugin,
  pluginKey as textColorPluginKey,
} from './pm-plugins/main';
import ToolbarTextColor from './ui/ToolbarTextColor';
import type { TextColorPlugin } from './types';

const pluginConfig = (
  textColorConfig?: TextColorPluginConfig | boolean,
): TextColorPluginConfig | undefined => {
  if (!textColorConfig || typeof textColorConfig === 'boolean') {
    return undefined;
  }

  return textColorConfig;
};

const textColorPlugin: TextColorPlugin = ({ config: textColorConfig, api }) => {
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
export default textColorPlugin;
