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
  TextFormattingState,
  ToolbarUIComponentFactory,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';

import {
  toggleCodeWithAnalytics,
  toggleEmWithAnalytics,
  toggleStrikeWithAnalytics,
  toggleStrongWithAnalytics,
  toggleSubscriptWithAnalytics,
  toggleSuperscriptWithAnalytics,
  toggleUnderlineWithAnalytics,
} from './commands';
import type { ToggleMarkEditorCommand } from './commands';
import {
  plugin as clearFormattingPlugin,
  pluginKey as clearFormattingPluginKey,
} from './pm-plugins/clear-formatting';
import clearFormattingKeymapPlugin from './pm-plugins/clear-formatting-keymap';
import textFormattingCursorPlugin from './pm-plugins/cursor';
import textFormattingInputRulePlugin from './pm-plugins/input-rule';
import keymapPlugin from './pm-plugins/keymap';
import {
  plugin as pmPlugin,
  pluginKey as textFormattingPluginKey,
} from './pm-plugins/main';
import textFormattingSmartInputRulePlugin from './pm-plugins/smart-input-rule';
import { PrimaryToolbarComponent } from './ui/PrimaryToolbarComponent';

export type TextFormattingPlugin = NextEditorPlugin<
  'textFormatting',
  {
    pluginConfiguration: TextFormattingOptions | undefined;
    dependencies: [
      OptionalPlugin<AnalyticsPlugin>,
      OptionalPlugin<PrimaryToolbarPlugin>,
    ];
    commands: {
      toggleSuperscript: ToggleMarkEditorCommand;
      toggleSubscript: ToggleMarkEditorCommand;
      toggleStrike: ToggleMarkEditorCommand;
      toggleCode: ToggleMarkEditorCommand;
      toggleUnderline: ToggleMarkEditorCommand;
      toggleEm: ToggleMarkEditorCommand;
      toggleStrong: ToggleMarkEditorCommand;
    };
    sharedState: TextFormattingState | undefined;
  }
>;

/**
 * Text formatting plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export const textFormattingPlugin: TextFormattingPlugin = ({
  config: options,
  api,
}) => {
  const primaryToolbarComponent: ToolbarUIComponentFactory = ({
    editorView,
    popupsMountPoint,
    popupsScrollableElement,
    isToolbarReducedSpacing,
    toolbarSize,
    disabled,
  }) => {
    return (
      <PrimaryToolbarComponent
        api={api}
        popupsMountPoint={popupsMountPoint}
        popupsScrollableElement={popupsScrollableElement}
        toolbarSize={toolbarSize}
        isReducedSpacing={isToolbarReducedSpacing}
        editorView={editorView}
        disabled={disabled}
        shouldUseResponsiveToolbar={Boolean(options?.responsiveToolbarMenu)}
      />
    );
  };
  return {
    name: 'textFormatting',

    marks() {
      return [
        { name: 'em', mark: em },
        { name: 'strong', mark: strong },
      ]
        .concat(
          options?.disableStrikethrough ? [] : { name: 'strike', mark: strike },
        )
        .concat(options?.disableCode ? [] : { name: 'code', mark: code })
        .concat(
          options?.disableSuperscriptAndSubscript
            ? []
            : { name: 'subsup', mark: subsup },
        )
        .concat(
          options?.disableUnderline
            ? []
            : { name: 'underline', mark: underline },
        );
    },

    pmPlugins() {
      return [
        {
          name: 'textFormatting',
          plugin: ({ dispatch }) => pmPlugin(dispatch, api?.analytics?.actions),
        },
        {
          name: 'textFormattingCursor',
          plugin: () => textFormattingCursorPlugin,
        },
        {
          name: 'textFormattingInputRule',
          plugin: ({ schema }) =>
            textFormattingInputRulePlugin(schema, api?.analytics?.actions),
        },
        {
          name: 'textFormattingSmartRule',
          plugin: () =>
            !options?.disableSmartTextCompletion
              ? textFormattingSmartInputRulePlugin(api?.analytics?.actions)
              : undefined,
        },
        {
          name: 'textFormattingClear',
          plugin: ({ dispatch }) => clearFormattingPlugin(dispatch),
        },
        {
          name: 'textFormattingClearKeymap',
          plugin: () => clearFormattingKeymapPlugin(api?.analytics?.actions),
        },
        {
          name: 'textFormattingKeymap',
          plugin: ({ schema }) => keymapPlugin(schema, api?.analytics?.actions),
        },
      ];
    },

    getSharedState(editorState) {
      if (!editorState) {
        return undefined;
      }
      return {
        ...textFormattingPluginKey.getState(editorState),
        formattingIsPresent:
          clearFormattingPluginKey.getState(editorState)?.formattingIsPresent,
      };
    },

    usePluginHook: () => {
      api?.core?.actions.execute(
        api?.primaryToolbar?.commands.registerComponent({
          name: 'textFormatting',
          component: primaryToolbarComponent,
        }),
      );
    },

    primaryToolbarComponent: !api?.primaryToolbar
      ? primaryToolbarComponent
      : undefined,

    commands: {
      toggleSuperscript: toggleSuperscriptWithAnalytics(
        api?.analytics?.actions,
      ),
      toggleSubscript: toggleSubscriptWithAnalytics(api?.analytics?.actions),
      toggleStrike: toggleStrikeWithAnalytics(api?.analytics?.actions),
      toggleCode: toggleCodeWithAnalytics(api?.analytics?.actions),
      toggleUnderline: toggleUnderlineWithAnalytics(api?.analytics?.actions),
      toggleEm: toggleEmWithAnalytics(api?.analytics?.actions),
      toggleStrong: toggleStrongWithAnalytics(api?.analytics?.actions),
    },
  };
};
