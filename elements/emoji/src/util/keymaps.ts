/**
 * Copied from editor-common: https://bitbucket.org/atlassian/atlassian-frontend/src/d01430a20500d720791d0667fd7cfe25d254f2e3/packages/editor/editor-common/src/keymaps/index.tsx
 */

import { makeKeyMapWithCommon } from './make-key-map-with-common';

export const backspace: Keymap = makeKeyMapWithCommon('Backspace', 'Backspace');

export interface Keymap {
	common?: string;
	description: string;
	mac: string;
	windows: string;
}

export const arrowKeysMap: Record<string, string> = {
	// for reference: https://wincent.com/wiki/Unicode_representations_of_modifier_keys
	ARROWLEFT: '\u2190',
	ARROWRIGHT: '\u2192',
	ARROWUP: '\u2191',
	ARROWDOWN: '\u2193',
};
