/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { base, keyName } from 'w3c-keyname';

import { token } from '@atlaskit/tokens';

import { editorCommandToPMCommand } from '../preset/editor-commands';
import type { Command } from '../types/command';
import type { EditorCommand } from '../types/editor-command';
import { browser } from '../utils';

export const addAltText = makeKeyMapWithCommon('Add Alt Text', 'Mod-Alt-y');
export const navToEditorToolbar = makeKeyMapWithCommon('Navigate to editor toolbar', 'Alt-F9');
export const navToFloatingToolbar = makeKeyMapWithCommon('Navigate to floating toolbar', 'Alt-F10');
export const toggleBold = makeKeyMapWithCommon('Bold', 'Mod-b');
export const toggleItalic = makeKeyMapWithCommon('Italic', 'Mod-i');
export const toggleUnderline = makeKeyMapWithCommon('Underline', 'Mod-u');
export const toggleStrikethrough = makeKeyMapWithCommon('Strikethrough', 'Mod-Shift-s');
export const toggleSubscript = makeKeyMapWithCommon('Subscript', 'Mod-Shift-,');
export const toggleSuperscript = makeKeyMapWithCommon('Superscript', 'Mod-Shift-.');
export const toggleCode = makeKeyMapWithCommon('Code', 'Mod-Shift-m');
export const pastePlainText = makeKeyMapWithCommon('Paste Plain Text', 'Mod-Shift-v');
export const clearFormatting = makeKeyMapWithCommon('Clear formatting', 'Mod-\\');
export const setNormalText = makeKeyMapWithCommon('Normal text', 'Mod-Alt-0');
export const toggleHeading1 = makeKeyMapWithCommon('Heading 1', 'Mod-Alt-1');
export const toggleHeading2 = makeKeyMapWithCommon('Heading 2', 'Mod-Alt-2');
export const toggleHeading3 = makeKeyMapWithCommon('Heading 3', 'Mod-Alt-3');
export const toggleHeading4 = makeKeyMapWithCommon('Heading 4', 'Mod-Alt-4');
export const toggleHeading5 = makeKeyMapWithCommon('Heading 5', 'Mod-Alt-5');
export const toggleHeading6 = makeKeyMapWithCommon('Heading 6', 'Mod-Alt-6');
export const toggleOrderedList = makeKeyMapWithCommon('Numbered list', 'Mod-Shift-7');
export const ctrlBackSpace = makeKeyMapWithCommon('Cmd + Backspace', 'Mod-Backspace');
export const toggleBulletList = makeKeyMapWithCommon('Bullet list', 'Mod-Shift-8');
export const toggleBlockQuote = makeKeyMapWithCommon('Quote', 'Mod-Shift-9');
export const insertNewLine = makeKeyMapWithCommon('Insert new line', 'Shift-Enter');
export const shiftBackspace = makeKeyMapWithCommon('Shift Backspace', 'Shift-Backspace');
export const splitCodeBlock = makeKeyMapWithCommon('Split code block', 'Enter');
export const splitListItem = makeKeyMapWithCommon('Split list item', 'Enter');
export const insertRule = makeKeyMapWithCommon('Insert horizontal rule', 'Mod-Shift--');
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
export const shiftArrowUp = makeKeyMapWithCommon('Shift ArrowUp', 'Shift-ArrowUp');
export const shiftTab = makeKeyMapWithCommon('Shift Tab', 'Shift-Tab');
export const toggleTable = makeKeyMapWithCommon('Table', 'Shift-Alt-t');
export const focusTableResizer = makeKeyMapWithCommon('Focus Table Resizer', 'Mod-Alt-Shift-r');
export const addRowBefore = makeKeyMapWithCommon('Add Row Above', 'Ctrl-Alt-ArrowUp');
export const addRowAfter = makeKeyMapWithCommon('Add Row Below', 'Ctrl-Alt-ArrowDown');
export const addColumnAfter = makeKeyMapWithCommon('Add Column After', 'Ctrl-Alt-ArrowRight');
export const addColumnBefore = makeKeyMapWithCommon('Add Column Before', 'Ctrl-Alt-ArrowLeft');
// The following few shortcuts that end in VO are added specifically for Voice Over users, as shortcuts that perform the same role when using Voice Over don't work because they conflict with default shortcuts in Voice Over
export const addRowBeforeVO = makeKeyMapWithCommon('Add Row Above', 'Mod-Alt-[');
export const addRowAfterVO = makeKeyMapWithCommon('Add Row Below', 'Mod-Alt-]');
export const addColumnAfterVO = makeKeyMapWithCommon('Add Column After', 'Mod-Alt-=');
export const addColumnBeforeVO = makeKeyMapWithCommon('Add Column Before', 'Mod-Alt--');

export const moveColumnLeft = makeKeyMapWithCommon('Move Column Left', 'Ctrl-Alt-Shift-ArrowLeft');
export const moveColumnRight = makeKeyMapWithCommon(
	'Move Column Right',
	'Ctrl-Alt-Shift-ArrowRight',
);
export const moveRowDown = makeKeyMapWithCommon('Move Row Down', 'Ctrl-Alt-Shift-ArrowDown');
export const moveRowUp = makeKeyMapWithCommon('Move Row Up', 'Ctrl-Alt-Shift-ArrowUp');

export const deleteColumn = makeKeyMapWithCommon('Delete Column', 'Ctrl-Backspace');
export const deleteRow = makeKeyMapWithCommon('Delete Row', 'Ctrl-Backspace');

export const startColumnResizing = makeKeyMapWithCommon(
	'Activate Column Resize',
	'Mod-Alt-Shift-c',
);
export const cut = makeKeyMapWithCommon('Cut', 'Mod-x');
export const copy = makeKeyMapWithCommon('Copy', 'Mod-c');
export const paste = makeKeyMapWithCommon('Paste', 'Mod-v');
export const altPaste = makeKeyMapWithCommon('Paste', 'Mod-Shift-v');

export const find = makeKeyMapWithCommon('Find', 'Mod-f');

export const alignLeft = makeKeyMapWithCommon('Align Left', 'Mod-Shift-l');
export const alignCenter = makeKeyMapWithCommon('Align Center', 'Mod-Alt-e');
export const alignRight = makeKeyMapWithCommon('Align Right', 'Mod-Alt-t');

export const toggleTaskItemCheckbox = makeKeyMapWithCommon('Toggles task item', 'Mod-Alt-Enter');
export const selectRow = makeKeyMapArrayWithCommon('Select row', [
	'Mod-Alt-Shift-ArrowLeft',
	'Mod-Alt-Shift-ArrowRight',
]);
export const selectColumn = makeKeyMapArrayWithCommon('Select column', [
	'Mod-Alt-Shift-ArrowDown',
	'Mod-Alt-Shift-ArrowUp',
]);
export const selectTable = makeKeyMapWithCommon('Select table', 'Mod-a');
export const selectNode = makeKeyMapWithCommon('Select node', 'Mod-a');

export const increaseMediaSize = makeKeyMapWithCommon('increase image size', 'Mod-Alt-]');
export const decreaseMediaSize = makeKeyMapWithCommon('increase image size', 'Mod-Alt-[');

export const activateVideoControls = makeKeyMapWithCommon(
	'Activate controls panel on video',
	'Shift-F10',
);

export const toggleHighlightPalette = makeKeyMapWithCommon('Toggle Highlight Palette', 'Mod-Alt-b');
export const focusToContextMenuTrigger = makeKeyMapWithCommon(
	'Focus table context menu trigger',
	'Shift-F10',
);

export const dragToMoveUp = makeKeyMapWithCommon(
	'Move node up in the document',
	'Ctrl-Shift-ArrowUp',
);
export const dragToMoveDown = makeKeyMapWithCommon(
	'Move node down in the document',
	'Ctrl-Shift-ArrowDown',
);
export const dragToMoveLeft = makeKeyMapWithCommon(
	'Move node to the left column in the document',
	'Ctrl-Shift-Alt-ArrowLeft',
);
export const dragToMoveRight = makeKeyMapWithCommon(
	'Move node to the right column in the document',
	'Ctrl-Shift-Alt-ArrowRight',
);

export const showElementDragHandle = makeKeyMapWithCommon(
	'Show drag handle for editor element',
	'Ctrl-Shift-h',
);

export const continueInRovoChat = makeKeyMapWithCommon('Continue in Rovo chat', 'Alt-Enter');

const arrowKeysMap: Record<string, string> = {
	// for reference: https://wincent.com/wiki/Unicode_representations_of_modifier_keys
	ARROWLEFT: '\u2190',
	ARROWRIGHT: '\u2192',
	ARROWUP: '\u2191',
	ARROWDOWN: '\u2193',
};

const tooltipShortcutStyle = css({
	borderRadius: '2px',
	backgroundColor: token('color.background.inverse.subtle'),
	padding: `0 ${token('space.025', '2px')}`,
	// NOTE: This might not actually do anything: https://atlassian.slack.com/archives/CFG3PSQ9E/p1647395052443259?thread_ts=1647394572.556029&cid=CFG3PSQ9E
	label: 'tooltip-shortcut',
});

export function formatShortcut(keymap: Keymap): string | undefined {
	let shortcut: string;
	if (browser.mac) {
		// for reference: https://wincent.com/wiki/Unicode_representations_of_modifier_keys
		shortcut = keymap.mac
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			.replace(/Cmd/i, '\u2318')
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			.replace(/Shift/i, '\u21E7')
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			.replace(/Ctrl/i, '\u2303')
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			.replace(/Alt/i, '\u2325')
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			.replace(/Backspace/i, '\u232B')
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			.replace(/Enter/i, '\u23CE');
	} else {
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
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

export function tooltip(keymap?: Keymap, description?: string): string | undefined {
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
			<Fragment>
				{description}
				{shortcut && description && '\u00A0'}
				{shortcut && <span css={tooltipShortcutStyle}>{shortcut}</span>}
			</Fragment>
		) : null;
	},
);

export const TooltipContentWithMultipleShortcuts = React.memo(
	({
		helpDescriptors,
	}: {
		helpDescriptors: { description?: string | React.ReactNode; keymap?: Keymap }[];
	}) => {
		const keymapCount = helpDescriptors.length;
		return (
			<Fragment>
				{helpDescriptors.map((descriptor, index) => (
					// Ignored via go/ees005
					// eslint-disable-next-line react/no-array-index-key
					<Fragment key={index}>
						<ToolTipContent
							// Ignored via go/ees005
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...descriptor}
						/>{' '}
						{index < keymapCount - 1 && <br />}
					</Fragment>
				))}
			</Fragment>
		);
	},
);

export function findKeymapByDescription(description: string): Keymap | undefined {
	const matches = ALL.filter(
		(keymap) => keymap.description.toUpperCase() === description.toUpperCase(),
	);
	return matches[0];
}

export function findShortcutByDescription(description: string): string | undefined {
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

export function getAriaKeyshortcuts(keymap: Keymap | string | undefined): string | undefined {
	let keyShortcuts;
	if (typeof keymap === 'string') {
		keyShortcuts = keymap;
	} else if (typeof keymap === 'object') {
		keyShortcuts = keymap[browser.mac ? 'mac' : 'windows'];
	}
	if (keyShortcuts) {
		return keyShortcuts
			.toLowerCase()
			.split('-')
			.map((modifier) => {
				switch (modifier) {
					case 'cmd':
						return 'Meta';
					case 'ctrl':
						return 'Control';
					case 'alt':
						return 'Alt';
					case 'shift':
						return 'Shift';
					case 'enter':
						return 'Enter';
					case 'esc':
						return 'Esc';
					case 'tab':
						return 'Tab';
					case 'space':
						return 'Space';
					case 'backspace':
						return 'Backspace';
					case 'arrowup':
						return 'Arrow Up';
					case 'arrowdown':
						return 'Arrow Down';
					default:
						return modifier.split('').join(' ');
				}
			})
			.join('+');
	} else {
		return undefined;
	}
}

const ALL = [
	toggleOrderedList,
	toggleBulletList,
	toggleBold,
	toggleItalic,
	toggleUnderline,
	toggleStrikethrough,
	toggleSubscript,
	toggleSuperscript,
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
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		windows: windows.replace(/Mod/i, 'Ctrl'),
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		mac: mac.replace(/Mod/i, 'Cmd'),
		common: common,
	};
}

export function makeKeyMapWithCommon(description: string, common: string): Keymap {
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	const windows = common.replace(/Mod/i, 'Ctrl');
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	const mac = common.replace(/Mod/i, 'Cmd');
	return makeKeymap(description, windows, mac, common);
}

export function makeKeyMapArrayWithCommon(description: string, shortcuts: string[]): Keymap[] {
	const keymapArray: Keymap[] = [];
	shortcuts.forEach((shortcut) => {
		keymapArray.push(makeKeyMapWithCommon(description, shortcut));
	});
	return keymapArray;
}

export interface Keymap {
	description: string;
	windows: string;
	mac: string;
	common?: string;
}

function combineWithOldCommand(cmd: Command, oldCmd: Command): Command {
	return (state, dispatch, editorView) => {
		return oldCmd(state, dispatch) || cmd(state, dispatch, editorView);
	};
}

export function bindKeymapWithCommand(
	shortcut: string,
	cmd: Command,
	keymap: { [key: string]: Command },
) {
	const oldCmd = keymap[shortcut];
	keymap[shortcut] = oldCmd ? combineWithOldCommand(cmd, oldCmd) : cmd;
}

// If there is a need to use the same command with several shortcuts
export function bindKeymapArrayWithCommand(
	shortcutsArray: Keymap[],
	cmd: Command,
	keymap: { [key: string]: Command },
) {
	shortcutsArray.forEach((shortcut) => {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return bindKeymapWithCommand(shortcut.common!, cmd, keymap);
	});
}

export function bindKeymapWithEditorCommand(
	shortcut: string,
	cmd: EditorCommand,
	keymap: { [key: string]: Command },
) {
	bindKeymapWithCommand(shortcut, editorCommandToPMCommand(cmd), keymap);
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

/**
 * ED-20175: on windows OS if the capsLock is ON then it registers the key with capital case
 * which creates a command (Ctrl-B) and all the keymap bindings are in lower case (Ctrl-b).
 *
 */
export function isCapsLockOnAndModifyKeyboardEvent(event: KeyboardEvent) {
	let keyboardEvent = event;
	const name = keyName(event);
	if (
		event.ctrlKey &&
		event.getModifierState('CapsLock') &&
		!event.getModifierState('Shift') &&
		name.length === 1 &&
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		/^[A-Z]/.test(name)
	) {
		keyboardEvent = new KeyboardEvent('keydown', {
			key: base[event.keyCode].toLowerCase(),
			code: event.code,
			ctrlKey: true,
		});
	}
	return keyboardEvent;
}

export {
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	DOWN,
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	HEADING_KEYS,
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	KEY_0,
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	KEY_1,
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	KEY_2,
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	KEY_3,
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	KEY_4,
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	KEY_5,
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	KEY_6,
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	LEFT,
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	RIGHT,
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	UP,
} from './consts';

// eslint-disable-next-line @atlaskit/editor/no-re-export
export { keymap } from './keymap';
