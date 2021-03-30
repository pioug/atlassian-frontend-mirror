import React, { useMemo } from 'react';
import { EditorState } from 'prosemirror-state';
import { Shortcut } from '../../../../../ui/styles';
import { toolbarMessages } from '../toolbar-messages';
import { clearFormattingWithAnalytics } from '../../../commands/clear-formatting';
import {
  pluginKey as clearFormattingPluginKey,
  ClearFormattingState,
} from '../../../pm-plugins/clear-formatting';
import {
  clearFormatting as clearFormattingKeymap,
  tooltip,
} from '../../../../../keymaps';
import { IconHookProps, MenuIconItem } from '../types';
import { INPUT_METHOD } from '../../../../analytics/types/enums';

const clearFormattingToolbar = clearFormattingWithAnalytics(
  INPUT_METHOD.TOOLBAR,
);

const useClearFormattingPluginState = (
  editorState: EditorState,
): ClearFormattingState | null => {
  return useMemo(() => clearFormattingPluginKey.getState(editorState), [
    editorState,
  ]);
};

export const useClearIcon = ({
  intl,
  editorState,
}: IconHookProps): MenuIconItem | null => {
  const pluginState = useClearFormattingPluginState(editorState);
  const isPluginAvailable = Boolean(pluginState);
  const formattingIsPresent = Boolean(pluginState?.formattingIsPresent);
  const clearFormattingLabel = intl.formatMessage(
    toolbarMessages.clearFormatting,
  );

  return useMemo(() => {
    if (!isPluginAvailable) {
      return null;
    }

    return {
      key: 'clearFormatting',
      command: clearFormattingToolbar,
      content: clearFormattingLabel,
      elemAfter: <Shortcut>{tooltip(clearFormattingKeymap)}</Shortcut>,
      value: {
        name: 'clearFormatting',
      },
      isActive: false,
      isDisabled: !formattingIsPresent,
    };
  }, [clearFormattingLabel, isPluginAvailable, formattingIsPresent]);
};
