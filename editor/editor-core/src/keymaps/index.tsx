import React from 'react';
import { browser } from '@atlaskit/editor-common';
import { Command } from '../types/command';
import styled from 'styled-components';
import { N400 } from '@atlaskit/theme/colors';

export const addAltText = makeKeyMapWithCommon('Add Alt Text', 'Mod-Alt-y');
export const toggleBold = makeKeyMapWithCommon('Bold', 'Mod-b');
export const toggleItalic = makeKeyMapWithCommon('Italic', 'Mod-i');
export const toggleUnderline = makeKeyMapWithCommon('Underline', 'Mod-u');
export const toggleStrikethrough = makeKeyMapWithCommon(
  'Strikethrough',
  'Mod-Shift-s',
);
export const toggleCode = makeKeyMapWithCommon('Code', 'Mod-Shift-m');
export const pastePlainText = makeKeyMapWithCommon(
  'Paste Plain Text',
  'Mod-Shift-v',
);
export const clearFormatting = makeKeyMapWithCommon(
  'Clear formatting',
  'Mod-\\',
);
export const setNormalText = makeKeyMapWithCommon('Normal text', 'Mod-Alt-0');
export const toggleHeading1 = makeKeyMapWithCommon('Heading 1', 'Mod-Alt-1');
export const toggleHeading2 = makeKeyMapWithCommon('Heading 2', 'Mod-Alt-2');
export const toggleHeading3 = makeKeyMapWithCommon('Heading 3', 'Mod-Alt-3');
export const toggleHeading4 = makeKeyMapWithCommon('Heading 4', 'Mod-Alt-4');
export const toggleHeading5 = makeKeyMapWithCommon('Heading 5', 'Mod-Alt-5');
export const toggleHeading6 = makeKeyMapWithCommon('Heading 6', 'Mod-Alt-6');
export const toggleOrderedList = makeKeyMapWithCommon(
  'Numbered list',
  'Mod-Shift-7',
);
export const ctrlBackSpace = makeKeyMapWithCommon(
  'Cmd + Backspace',
  'Mod-Backspace',
);
export const toggleBulletList = makeKeyMapWithCommon(
  'Bullet list',
  'Mod-Shift-8',
);
export const toggleBlockQuote = makeKeymap('Quote', '', 'Cmd-Alt-9');
export const insertNewLine = makeKeyMapWithCommon(
  'Insert new line',
  'Shift-Enter',
);
export const shiftBackspace = makeKeyMapWithCommon(
  'Shift Backspace',
  'Shift-Backspace',
);
export const splitCodeBlock = makeKeyMapWithCommon('Split code block', 'Enter');
export const splitListItem = makeKeyMapWithCommon('Split list item', 'Enter');
export const insertRule = makeKeyMapWithCommon(
  'Insert horizontal rule',
  'Mod-Shift--',
);
export const undo = makeKeyMapWithCommon('Undo', 'Mod-z');
export const moveUp = makeKeyMapWithCommon('Move up', 'ArrowUp');
export const moveDown = makeKeyMapWithCommon('Move down', 'ArrowDown');
export const moveLeft = makeKeyMapWithCommon('Move left', 'ArrowLeft');
export const moveRight = makeKeyMapWithCommon('Move right', 'ArrowRight');
export const indentList = makeKeyMapWithCommon('Indent List', 'Tab');
export const outdentList = makeKeyMapWithCommon('Outdent List', 'Shift-Tab');
export const redo = makeKeymap('Redo', 'Ctrl-y', 'Mod-Shift-z');
export const openHelp = makeKeyMapWithCommon('Open Help', 'Mod-/');
export const addLink = makeKeyMapWithCommon('Link', 'Mod-k');
export const addInlineComment = makeKeyMapWithCommon('Annotate', 'Mod-Alt-c');
export const submit = makeKeyMapWithCommon('Submit Content', 'Mod-Enter');
export const enter = makeKeyMapWithCommon('Enter', 'Enter');
export const shiftEnter = makeKeyMapWithCommon('Shift Enter', 'Shift-Enter');
export const tab = makeKeyMapWithCommon('Tab', 'Tab');
export const indent = makeKeyMapWithCommon('Indent', 'Tab');
export const outdent = makeKeyMapWithCommon('Outdent', 'Shift-Tab');
export const backspace = makeKeyMapWithCommon('Backspace', 'Backspace');
export const deleteKey = makeKeyMapWithCommon('Delete', 'Delete');
export const forwardDelete = makeKeymap('Forward Delete', '', 'Ctrl-d');
export const space = makeKeyMapWithCommon('Space', 'Space');
export const escape = makeKeyMapWithCommon('Escape', 'Escape');
export const nextCell = makeKeyMapWithCommon('Next cell', 'Tab');
export const previousCell = makeKeyMapWithCommon('Previous cell', 'Shift-Tab');
export const shiftTab = makeKeyMapWithCommon('Shift Tab', 'Shift-Tab');
export const toggleTable = makeKeyMapWithCommon('Table', 'Shift-Alt-t');
export const addRowBefore = makeKeyMapWithCommon(
  'Add Row Above',
  'Ctrl-Alt-ArrowUp',
);
export const addRowAfter = makeKeyMapWithCommon(
  'Add Row Below',
  'Ctrl-Alt-ArrowDown',
);
export const addColumnAfter = makeKeyMapWithCommon(
  'Add Column After',
  'Ctrl-Alt-ArrowRight',
);
export const addColumnBefore = makeKeyMapWithCommon(
  'Add Column Before',
  'Ctrl-Alt-ArrowLeft',
);
export const cut = makeKeyMapWithCommon('Cut', 'Mod-x');
export const copy = makeKeyMapWithCommon('Copy', 'Mod-c');
export const paste = makeKeyMapWithCommon('Paste', 'Mod-v');
export const altPaste = makeKeyMapWithCommon('Paste', 'Mod-Shift-v');

export const find = makeKeyMapWithCommon('Find', 'Mod-f');

const arrowKeysMap: Record<string, string> = {
  // for reference: https://wincent.com/wiki/Unicode_representations_of_modifier_keys
  ARROWLEFT: '\u2190',
  ARROWRIGHT: '\u2192',
  ARROWUP: '\u2191',
  ARROWDOWN: '\u2193',
};

export const TooltipShortcut = styled.span`
  border-radius: 2px;
  background-color: ${N400};
  padding: 0 2px;
`;

function formatShortcut(keymap: Keymap): string | undefined {
  let shortcut: string;
  if (browser.mac) {
    // for reference: https://wincent.com/wiki/Unicode_representations_of_modifier_keys
    shortcut = keymap.mac
      .replace(/Cmd/i, '\u2318')
      .replace(/Shift/i, '\u21E7')
      .replace(/Ctrl/i, '\u2303')
      .replace(/Alt/i, '\u2325')
      .replace(/Backspace/i, '\u232B')
      .replace(/Enter/i, '\u23CE');
  } else {
    shortcut = keymap.windows.replace(/Backspace/i, '\u232B');
  }
  const keys = shortcut.split('-');
  let lastKey = keys[keys.length - 1];
  if (lastKey.length === 1) {
    // capitalise single letters
    lastKey = lastKey.toUpperCase();
  }
  keys[keys.length - 1] = arrowKeysMap[lastKey.toUpperCase()] || lastKey;
  return keys.join(browser.mac ? '' : '+');
}

export function tooltip(
  keymap?: Keymap,
  description?: string,
): string | undefined {
  if (keymap) {
    const shortcut = formatShortcut(keymap);
    return description ? `${description} ${shortcut}` : shortcut;
  }
  return;
}

export const ToolTipContent = React.memo(
  ({
    description,
    shortcutOverride,
    keymap,
  }: {
    description?: string | React.ReactNode;
    keymap?: Keymap;
    shortcutOverride?: string;
  }) => {
    const shortcut = shortcutOverride || (keymap && formatShortcut(keymap));
    return shortcut || description ? (
      <>
        {description}
        {shortcut && description && '\u00A0'}
        {shortcut && <TooltipShortcut>{shortcut}</TooltipShortcut>}
      </>
    ) : null;
  },
);

export function findKeymapByDescription(
  description: string,
): Keymap | undefined {
  const matches = ALL.filter(
    (keymap) => keymap.description.toUpperCase() === description.toUpperCase(),
  );
  return matches[0];
}

export function findShortcutByDescription(
  description: string,
): string | undefined {
  const keymap = findKeymapByDescription(description);
  if (keymap) {
    return findShortcutByKeymap(keymap);
  }
  return;
}

export function findShortcutByKeymap(keymap: Keymap): string | undefined {
  if (browser.mac) {
    return keymap.mac;
  }

  return keymap.windows;
}

const ALL = [
  toggleOrderedList,
  toggleBulletList,
  toggleBold,
  toggleItalic,
  toggleUnderline,
  toggleStrikethrough,
  toggleCode,
  setNormalText,
  toggleHeading1,
  toggleHeading2,
  toggleHeading3,
  toggleHeading4,
  toggleHeading5,
  toggleHeading6,
  toggleBlockQuote,
  insertNewLine,
  insertRule,
  splitCodeBlock,
  splitListItem,
  redo,
  undo,
  find,
  escape,
  enter,
  shiftEnter,
];

export function makeKeymap(
  description: string,
  windows: string,
  mac: string,
  common?: string,
): Keymap {
  return {
    description: description,
    windows: windows.replace(/Mod/i, 'Ctrl'),
    mac: mac.replace(/Mod/i, 'Cmd'),
    common: common,
  };
}

export function makeKeyMapWithCommon(
  description: string,
  common: string,
): Keymap {
  const windows = common.replace(/Mod/i, 'Ctrl');
  const mac = common.replace(/Mod/i, 'Cmd');
  return makeKeymap(description, windows, mac, common);
}

export interface Keymap {
  description: string;
  windows: string;
  mac: string;
  common?: string;
}

export function bindKeymapWithCommand(
  shortcut: string,
  cmd: Command,
  keymap: { [key: string]: Function },
) {
  const oldCmd = keymap[shortcut];
  let newCmd = cmd;
  if (keymap[shortcut]) {
    newCmd = (state, dispatch, editorView) => {
      return oldCmd(state, dispatch) || cmd(state, dispatch, editorView);
    };
  }
  keymap[shortcut] = newCmd;
}

export function findKeyMapForBrowser(keyMap: Keymap): string | undefined {
  if (keyMap) {
    if (browser.mac) {
      return keyMap.mac;
    }

    return keyMap.windows;
  }
  return;
}

export {
  DOWN,
  HEADING_KEYS,
  KEY_0,
  KEY_1,
  KEY_2,
  KEY_3,
  KEY_4,
  KEY_5,
  KEY_6,
  LEFT,
  RIGHT,
  UP,
} from './consts';
