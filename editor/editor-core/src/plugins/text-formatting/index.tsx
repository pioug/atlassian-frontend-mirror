import React from 'react';

import {
  code,
  em,
  strike,
  strong,
  subsup,
  underline,
} from '@atlaskit/adf-schema';

import type {
  NextEditorPlugin,
  OptionalPlugin,
  TextFormattingOptions,
} from '@atlaskit/editor-common/types';
import { WithPluginState } from '@atlaskit/editor-common/with-plugin-state';

import {
  plugin as textFormattingPlugin,
  pluginKey as textFormattingPluginKey,
} from './pm-plugins/main';

import {
  plugin as clearFormattingPlugin,
  pluginKey as clearFormattingPluginKey,
} from './pm-plugins/clear-formatting';
import clearFormattingKeymapPlugin from './pm-plugins/clear-formatting-keymap';
import textFormattingCursorPlugin from './pm-plugins/cursor';
import textFormattingInputRulePlugin from './pm-plugins/input-rule';
import keymapPlugin from './pm-plugins/keymap';
import textFormattingSmartInputRulePlugin from './pm-plugins/smart-input-rule';
import Toolbar from './ui/Toolbar';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import {
  toggleSuperscriptWithAnalytics,
  toggleSubscriptWithAnalytics,
  toggleStrikeWithAnalytics,
  toggleCodeWithAnalytics,
  toggleUnderlineWithAnalytics,
  toggleEmWithAnalytics,
  toggleStrongWithAnalytics,
} from './actions';
import type { ToggleMarkWithAnalyticsCommand } from './actions';

const textFormatting: NextEditorPlugin<
  'textFormatting',
  {
    pluginConfiguration: TextFormattingOptions | undefined;
    dependencies: [OptionalPlugin<typeof analyticsPlugin>];
    actions: {
      toggleSuperscript: ToggleMarkWithAnalyticsCommand;
      toggleSubscript: ToggleMarkWithAnalyticsCommand;
      toggleStrike: ToggleMarkWithAnalyticsCommand;
      toggleCode: ToggleMarkWithAnalyticsCommand;
      toggleUnderline: ToggleMarkWithAnalyticsCommand;
      toggleEm: ToggleMarkWithAnalyticsCommand;
      toggleStrong: ToggleMarkWithAnalyticsCommand;
    };
  }
> = (options = {}, api) => ({
  name: 'textFormatting',

  marks() {
    return [
      { name: 'em', mark: em },
      { name: 'strong', mark: strong },
      { name: 'strike', mark: strike },
    ]
      .concat(options.disableCode ? [] : { name: 'code', mark: code })
      .concat(
        options.disableSuperscriptAndSubscript
          ? []
          : { name: 'subsup', mark: subsup },
      )
      .concat(
        options.disableUnderline ? [] : { name: 'underline', mark: underline },
      );
  },

  pmPlugins() {
    return [
      {
        name: 'textFormatting',
        plugin: ({ dispatch }) =>
          textFormattingPlugin(dispatch, api?.dependencies.analytics?.actions),
      },
      {
        name: 'textFormattingCursor',
        plugin: () => textFormattingCursorPlugin,
      },
      {
        name: 'textFormattingInputRule',
        // Don't remove the unused featureFlags, this gets used to test if we're properly passing them to the PM plugin
        plugin: ({ schema, featureFlags }) =>
          textFormattingInputRulePlugin(
            schema,
            featureFlags,
            api?.dependencies.analytics?.actions,
          ),
      },
      {
        name: 'textFormattingSmartRule',
        plugin: () =>
          !options.disableSmartTextCompletion
            ? textFormattingSmartInputRulePlugin(
                api?.dependencies.analytics?.actions,
              )
            : undefined,
      },
      {
        name: 'textFormattingClear',
        plugin: ({ dispatch }) => clearFormattingPlugin(dispatch),
      },
      {
        name: 'textFormattingClearKeymap',
        plugin: () =>
          clearFormattingKeymapPlugin(api?.dependencies.analytics?.actions),
      },
      {
        name: 'textFormattingKeymap',
        plugin: ({ schema }) =>
          keymapPlugin(schema, api?.dependencies.analytics?.actions),
      },
    ];
  },

  primaryToolbarComponent({
    editorView,
    popupsMountPoint,
    popupsScrollableElement,
    isToolbarReducedSpacing,
    toolbarSize,
    disabled,
  }) {
    return (
      <WithPluginState
        plugins={{
          textFormattingState: textFormattingPluginKey,
          clearFormattingPluginState: clearFormattingPluginKey,
        }}
        render={() => {
          return (
            <Toolbar
              editorState={editorView.state}
              popupsMountPoint={popupsMountPoint}
              popupsScrollableElement={popupsScrollableElement}
              toolbarSize={toolbarSize}
              isReducedSpacing={isToolbarReducedSpacing}
              editorView={editorView}
              isToolbarDisabled={disabled}
              shouldUseResponsiveToolbar={Boolean(
                options.responsiveToolbarMenu,
              )}
              editorAnalyticsAPI={api?.dependencies.analytics?.actions}
            />
          );
        }}
      />
    );
  },

  actions: {
    toggleSuperscript: toggleSuperscriptWithAnalytics(
      api?.dependencies.analytics?.actions,
    ),
    toggleSubscript: toggleSubscriptWithAnalytics(
      api?.dependencies.analytics?.actions,
    ),
    toggleStrike: toggleStrikeWithAnalytics(
      api?.dependencies.analytics?.actions,
    ),
    toggleCode: toggleCodeWithAnalytics(api?.dependencies.analytics?.actions),
    toggleUnderline: toggleUnderlineWithAnalytics(
      api?.dependencies.analytics?.actions,
    ),
    toggleEm: toggleEmWithAnalytics(api?.dependencies.analytics?.actions),
    toggleStrong: toggleStrongWithAnalytics(
      api?.dependencies.analytics?.actions,
    ),
  },
});

export default textFormatting;
