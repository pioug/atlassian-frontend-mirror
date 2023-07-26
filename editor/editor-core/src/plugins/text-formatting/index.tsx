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
import type { TextFormattingOptions } from './types';
import Toolbar from './ui/Toolbar';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';

const textFormatting: NextEditorPlugin<
  'textFormatting',
  {
    pluginConfiguration: TextFormattingOptions | undefined;
    dependencies: [OptionalPlugin<typeof analyticsPlugin>];
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
        plugin: ({ schema, featureFlags }) =>
          textFormattingInputRulePlugin(schema, featureFlags),
      },
      {
        name: 'textFormattingSmartRule',
        plugin: ({ featureFlags }) =>
          !options.disableSmartTextCompletion
            ? textFormattingSmartInputRulePlugin(featureFlags)
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
});

export default textFormatting;
