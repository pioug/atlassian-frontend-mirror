import type { Shortcut } from '../components/keyboard-shortcut';

const ariaKeyNames = new Map([
	['ctrl', 'Control'],
	['control', 'Control'],
	['⌃', 'Control'],
	['cmd', 'Meta'],
	['command', 'Meta'],
	['meta', 'Meta'],
	['⌘', 'Meta'],
	['option', 'Alt'],
	['alt', 'Alt'],
	['⌥', 'Alt'],
	['shift', 'Shift'],
	['⇧', 'Shift'],
	['altgraph', 'AltGraph'],
	['+', 'Plus'],
	['plus', 'Plus'],
	['space', 'Space'],
	['spacebar', 'Space'],
	['backspace', 'Backspace'],
	['⌫', 'Backspace'],
	['del', 'Delete'],
	['delete', 'Delete'],
	['⌦', 'Delete'],
	['enter', 'Enter'],
	['return', 'Enter'],
	['⏎', 'Enter'],
	['↵', 'Enter'],
	['↩', 'Enter'],
	['esc', 'Escape'],
	['escape', 'Escape'],
	['⎋', 'Escape'],
	['tab', 'Tab'],
	['⇥', 'Tab'],
	['ins', 'Insert'],
	['insert', 'Insert'],
	['home', 'Home'],
	['↖', 'Home'],
	['end', 'End'],
	['↘', 'End'],
	['pgup', 'PageUp'],
	['pageup', 'PageUp'],
	['⇞', 'PageUp'],
	['pgdn', 'PageDown'],
	['pagedown', 'PageDown'],
	['⇟', 'PageDown'],
	['arrowleft', 'ArrowLeft'],
	['←', 'ArrowLeft'],
	['arrowright', 'ArrowRight'],
	['→', 'ArrowRight'],
	['arrowup', 'ArrowUp'],
	['↑', 'ArrowUp'],
	['arrowdown', 'ArrowDown'],
	['↓', 'ArrowDown'],
]);

// Printable ASCII includes keys such as $ and =. Other Unicode symbols can be
// labels for physical keys, so recognize those through the map above.
const printableKeyPattern = /^[!-~\p{L}\p{N}\p{P}\p{Sc}]$/u;
const functionKeyPattern = /^f[1-9]\d*$/iu;
const modifierKeys = new Set(['Control', 'Meta', 'Alt', 'Shift', 'AltGraph']);

export function getAriaKeyShortcuts(shortcut: Shortcut | undefined): string | undefined {
	const keys = shortcut?.map((label) => {
		const key = label.trim();
		const knownKey = ariaKeyNames.get(key.toLowerCase());
		if (knownKey) {
			return knownKey;
		}
		if (label === ' ') {
			return 'Space';
		}
		if (functionKeyPattern.test(key)) {
			return key.toUpperCase();
		}
		return printableKeyPattern.test(key) ? key : '';
	});
	if (!keys?.length) {
		return;
	}

	const key = keys[keys.length - 1];
	const modifiers = keys.slice(0, -1);
	if (!key || modifierKeys.has(key) || !modifiers.every((modifier) => modifierKeys.has(modifier))) {
		return;
	}

	return keys.join('+');
}
