/**
 * Copied from editor-common: https://bitbucket.org/atlassian/atlassian-frontend/src/d01430a20500d720791d0667fd7cfe25d254f2e3/packages/editor/editor-common/src/keymaps/index.tsx
 */

import type { Keymap } from './keymaps';

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
