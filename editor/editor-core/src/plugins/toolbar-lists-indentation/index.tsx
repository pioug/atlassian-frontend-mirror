import React from 'react';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import ToolbarListsIndentation from './ui';
import WithPluginState from '../../ui/WithPluginState';
import { ToolbarSize } from '../../ui/Toolbar/types';
import { pluginKey as listPluginKey } from '../list/pm-plugins/main';
import {
  pluginKey as indentationButtonsPluginKey,
  createPlugin as indentationButtonsPlugin,
} from './pm-plugins/indentation-buttons';
import type featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { OptionalPlugin } from '@atlaskit/editor-common/types';

type Config = {
  showIndentationButtons: boolean;
  allowHeadingAndParagraphIndentation: boolean;
};
const toolbarListsIndentationPlugin: NextEditorPlugin<
  'toolbarListsIndentation',
  {
    pluginConfiguration: Config;
    dependencies: [
      typeof featureFlagsPlugin,
      OptionalPlugin<typeof analyticsPlugin>,
    ];
  }
> = ({ showIndentationButtons, allowHeadingAndParagraphIndentation }, api) => {
  const featureFlags =
    api?.dependencies.featureFlags.sharedState.currentState() || {};
  const editorAnalyticsAPI = api?.dependencies.analytics?.actions;

  return {
    name: 'toolbarListsIndentation',

    pmPlugins() {
      return [
        {
          name: 'indentationButtons',
          plugin: ({ dispatch }) =>
            indentationButtonsPlugin({
              dispatch,
              showIndentationButtons,
              allowHeadingAndParagraphIndentation,
            }),
        },
      ];
    },

    primaryToolbarComponent({
      editorView,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      toolbarSize,
      disabled,
      isToolbarReducedSpacing,
    }) {
      const isSmall = toolbarSize < ToolbarSize.L;

      return (
        <WithPluginState
          plugins={{
            listState: listPluginKey,
            indentationState: indentationButtonsPluginKey,
          }}
          render={({ listState, indentationState }) => {
            if (!listState) {
              return null;
            }

            return (
              <ToolbarListsIndentation
                featureFlags={featureFlags}
                isSmall={isSmall}
                isReducedSpacing={isToolbarReducedSpacing}
                disabled={disabled}
                editorView={editorView}
                popupsMountPoint={popupsMountPoint}
                popupsBoundariesElement={popupsBoundariesElement}
                popupsScrollableElement={popupsScrollableElement}
                bulletListActive={listState!.bulletListActive}
                bulletListDisabled={listState!.bulletListDisabled}
                orderedListActive={listState!.orderedListActive}
                orderedListDisabled={listState!.orderedListDisabled}
                showIndentationButtons={!!showIndentationButtons}
                indentDisabled={indentationState!.indentDisabled}
                outdentDisabled={indentationState!.outdentDisabled}
                editorAnalyticsAPI={editorAnalyticsAPI}
              />
            );
          }}
        />
      );
    },
  };
};

export default toolbarListsIndentationPlugin;
