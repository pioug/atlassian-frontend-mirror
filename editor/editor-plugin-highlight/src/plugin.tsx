import React from 'react';

import { backgroundColor } from '@atlaskit/adf-schema';
import type {
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { TextFormattingPlugin } from '@atlaskit/editor-plugin-text-formatting';

import { changeColor } from './commands';
import type { HighlightPluginState } from './pm-plugin';
import { createPlugin, highlightPluginKey } from './pm-plugin';
import { ToolbarHighlightColorWithIntl as ToolbarHighlightColor } from './ui/ToolbarHighlightColor';

export type HighlightPlugin = NextEditorPlugin<
  'highlight',
  {
    dependencies: [
      // Optional, we won't log analytics if it's not available
      OptionalPlugin<AnalyticsPlugin>,
      // Optional, used to allow clearing highlights when clear
      OptionalPlugin<TextFormattingPlugin>,
    ];
    sharedState: HighlightPluginState | undefined;
  }
>;

export const highlightPlugin: HighlightPlugin = ({ api }) => {
  const editorAnalyticsAPI = api?.analytics?.actions;

  return {
    name: 'highlight',

    commands: {
      changeColor: changeColor(editorAnalyticsAPI),
    },

    marks() {
      return [{ name: 'backgroundColor', mark: backgroundColor }];
    },

    pmPlugins: () => [
      {
        name: 'highlight',
        plugin: () => createPlugin({ api }),
      },
    ],

    getSharedState(editorState) {
      if (!editorState) {
        return;
      }
      return highlightPluginKey.getState(editorState);
    },

    primaryToolbarComponent: ({
      editorView,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      disabled,
      isToolbarReducedSpacing,
      dispatchAnalyticsEvent,
    }) => (
      <ToolbarHighlightColor
        popupsMountPoint={popupsMountPoint}
        popupsBoundariesElement={popupsBoundariesElement}
        popupsScrollableElement={popupsScrollableElement}
        disabled={disabled}
        isToolbarReducedSpacing={isToolbarReducedSpacing}
        dispatchAnalyticsEvent={dispatchAnalyticsEvent}
        pluginInjectionApi={api}
      />
    ),
  };
};
