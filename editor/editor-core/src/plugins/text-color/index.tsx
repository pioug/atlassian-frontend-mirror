import React from 'react';

import { textColor } from '@atlaskit/adf-schema';

import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import WithPluginState from '../../ui/WithPluginState';

import type {
  TextColorPluginConfig,
  TextColorPluginState,
} from './pm-plugins/main';
import {
  createPlugin,
  pluginKey as textColorPluginKey,
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

type Config = TextColorPluginConfig | boolean;
const textColorPlugin: NextEditorPlugin<
  'textColor',
  {
    pluginConfiguration: Config | undefined;
    dependencies: [FeatureFlagsPlugin];
  }
> = ({ config: textColorConfig, api }) => {
  const featureFlags = api?.featureFlags?.sharedState.currentState() || {};

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
              featureFlags={featureFlags}
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
