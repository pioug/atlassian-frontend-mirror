import React from 'react';

import { textColor } from '@atlaskit/adf-schema';

import { EditorPlugin } from '../../types';
import WithPluginState from '../../ui/WithPluginState';

import {
  createPlugin,
  TextColorPluginConfig,
  pluginKey as textColorPluginKey,
  TextColorPluginState,
} from './pm-plugins/main';
import ToolbarTextColor from './ui/ToolbarTextColor';

const pluginConfig = (
  textColorConfig?: TextColorPluginConfig | boolean,
): TextColorPluginConfig | undefined => {
  if (!textColorConfig || typeof textColorConfig === 'boolean') {
    return undefined;
  }

  return textColorConfig;
};

const textColorPlugin = (
  textColorConfig?: TextColorPluginConfig | boolean,
): EditorPlugin => ({
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
    const config = pluginConfig(textColorConfig);
    const showMoreColorsToggle = config?.allowMoreTextColors;

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
            showMoreColorsToggle={showMoreColorsToggle}
            dispatchAnalyticsEvent={dispatchAnalyticsEvent}
            disabled={disabled}
          />
        )}
      />
    );
  },
});

export { textColorPluginKey };
export type { TextColorPluginState };
export default textColorPlugin;
