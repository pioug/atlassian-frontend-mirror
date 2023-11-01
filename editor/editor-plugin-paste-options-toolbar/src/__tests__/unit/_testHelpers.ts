import { Slice } from '@atlaskit/editor-prosemirror/model';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';

import type { PasteOtionsPluginState } from '../../types';
import { ToolbarDropdownOption } from '../../types';

export const getDefaultMarkdownPluginState = (): PasteOtionsPluginState => {
  return {
    showToolbar: false,
    pasteStartPos: 0,
    pasteEndPos: 0,
    plaintext: '',
    richTextSlice: Slice.empty,
    isPlainText: true,
    highlightContent: false,
    highlightDecorationSet: DecorationSet.empty,
    selectedOption: ToolbarDropdownOption.Markdown,
  };
};

export const getDefaultPlainTextPluginState = (): PasteOtionsPluginState => {
  return {
    showToolbar: false,
    pasteStartPos: 0,
    pasteEndPos: 0,
    plaintext: '',
    richTextSlice: Slice.empty,
    isPlainText: true,
    highlightContent: false,
    highlightDecorationSet: DecorationSet.empty,
    selectedOption: ToolbarDropdownOption.PlainText,
  };
};

export const getDefaultRichTextPluginState = (): PasteOtionsPluginState => {
  return {
    showToolbar: false,
    pasteStartPos: 0,
    pasteEndPos: 0,
    plaintext: '',
    richTextSlice: Slice.empty,
    isPlainText: false,
    highlightContent: false,
    highlightDecorationSet: DecorationSet.empty,
    selectedOption: ToolbarDropdownOption.PlainText,
  };
};
