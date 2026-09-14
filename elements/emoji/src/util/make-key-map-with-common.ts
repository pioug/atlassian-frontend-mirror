/**
 * Copied from editor-common: https://bitbucket.org/atlassian/atlassian-frontend/src/d01430a20500d720791d0667fd7cfe25d254f2e3/packages/editor/editor-common/src/keymaps/index.tsx
 */

import type { Keymap } from './keymaps';
import { makeKeymap } from './make-keymap';

export function makeKeyMapWithCommon(description: string, common: string): Keymap {
	const windows = common.replace(/Mod/i, 'Ctrl');
	const mac = common.replace(/Mod/i, 'Cmd');
	return makeKeymap(description, windows, mac, common);
}
