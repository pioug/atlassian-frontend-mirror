/**
 * Copied from editor-common: https://bitbucket.org/atlassian/atlassian-frontend/src/d01430a20500d720791d0667fd7cfe25d254f2e3/packages/editor/editor-common/src/keymaps/index.tsx
 */

import browserSupport from './browser-support';

export const backspace = makeKeyMapWithCommon('Backspace', 'Backspace');

export interface Keymap {
	description: string;
	windows: string;
	mac: string;
	common?: string;
}

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

export function makeKeyMapWithCommon(description: string, common: string): Keymap {
	const windows = common.replace(/Mod/i, 'Ctrl');
	const mac = common.replace(/Mod/i, 'Cmd');
	return makeKeymap(description, windows, mac, common);
}

export const arrowKeysMap: Record<string, string> = {
	// for reference: https://wincent.com/wiki/Unicode_representations_of_modifier_keys
	ARROWLEFT: '\u2190',
	ARROWRIGHT: '\u2192',
	ARROWUP: '\u2191',
	ARROWDOWN: '\u2193',
};

export function formatShortcut(keymap: Keymap): string | undefined {
	let shortcut: string;
	if (browserSupport.mac) {
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
	return keys.join(browserSupport.mac ? '' : '+');
}
