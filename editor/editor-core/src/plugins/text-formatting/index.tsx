import React from 'react';

import {
  code,
  em,
  strike,
  strong,
  subsup,
  underline,
} from '@atlaskit/adf-schema';

import { EditorPlugin } from '../../types';
import WithPluginState from '../../ui/WithPluginState';

import {
  plugin as textFormattingPlugin,
  pluginKey as textFormattingPluginKey,
} from './pm-plugins/main';

import { plugin as clearFormattingPlugin } from './pm-plugins/clear-formatting';
import clearFormattingKeymapPlugin from './pm-plugins/clear-formatting-keymap';
import textFormattingCursorPlugin from './pm-plugins/cursor';
import textFormattingInputRulePlugin from './pm-plugins/input-rule';
import keymapPlugin from './pm-plugins/keymap';
import textFormattingSmartInputRulePlugin from './pm-plugins/smart-input-rule';
import { TextFormattingOptions } from './types';
import Toolbar from './ui/Toolbar';

const textFormatting = (options: TextFormattingOptions = {}): EditorPlugin => ({
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
        plugin: ({ dispatch }) => textFormattingPlugin(dispatch),
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
        plugin: () => clearFormattingKeymapPlugin(),
      },
      {
        name: 'textFormattingKeymap',
        plugin: ({ schema }) => keymapPlugin(schema),
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
        plugins={{ textFormattingState: textFormattingPluginKey }}
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
            />
          );
        }}
      />
    );
  },
});

export default textFormatting;
