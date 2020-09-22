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
import { ButtonGroup } from '../../ui/styles';
import WithPluginState from '../../ui/WithPluginState';

import {
  plugin as clearFormattingPlugin,
  pluginKey as clearFormattingPluginKey,
} from './pm-plugins/clear-formatting';
import clearFormattingKeymapPlugin from './pm-plugins/clear-formatting-keymap';
import textFormattingCursorPlugin from './pm-plugins/cursor';
import textFormattingInputRulePlugin from './pm-plugins/input-rule';
import keymapPlugin from './pm-plugins/keymap';
import {
  plugin as textFormattingPlugin,
  pluginKey as textFormattingPluginKey,
} from './pm-plugins/main';
import textFormattingSmartInputRulePlugin from './pm-plugins/smart-input-rule';
import { TextFormattingOptions } from './types';
import ToolbarAdvancedTextFormatting from './ui/ToolbarAdvancedTextFormatting';
import ToolbarTextFormatting from './ui/ToolbarTextFormatting';
import { akEditorMobileMaxWidth } from '@atlaskit/editor-shared-styles';
import { pluginKey as widthPluginKey } from '../../plugins/width/index';

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
        plugin: ({ schema }) => textFormattingInputRulePlugin(schema),
      },
      {
        name: 'textFormattingSmartRule',
        plugin: () =>
          !options.disableSmartTextCompletion
            ? textFormattingSmartInputRulePlugin
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
    disabled,
  }) {
    return (
      <WithPluginState
        plugins={{
          textFormattingState: textFormattingPluginKey,
          clearFormattingState: clearFormattingPluginKey,
          widthState: widthPluginKey,
        }}
        render={({
          textFormattingState,
          clearFormattingState,
          widthState,
        }): any => {
          return (
            <ButtonGroup width={isToolbarReducedSpacing ? 'small' : 'large'}>
              {/* render toolbar buttons for non-mobile views */}
              {widthState.width > akEditorMobileMaxWidth && (
                <ToolbarTextFormatting
                  disabled={disabled}
                  editorView={editorView}
                  textFormattingState={textFormattingState}
                  isReducedSpacing={isToolbarReducedSpacing}
                />
              )}
              <ToolbarAdvancedTextFormatting
                editorView={editorView}
                isDisabled={disabled}
                isReducedSpacing={isToolbarReducedSpacing}
                textFormattingState={textFormattingState}
                clearFormattingState={clearFormattingState}
                popupsMountPoint={popupsMountPoint}
                popupsScrollableElement={popupsScrollableElement}
              />
            </ButtonGroup>
          );
        }}
      />
    );
  },
});

export default textFormatting;
