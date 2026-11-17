import type { TLayerRole } from '../internal/role-types';

/**
 * Roles that wrap Tab focus, per the WAI-ARIA APG dialog pattern. Not `menu`:
 * Tab leaves a menu (see `notes/decisions/menu-keyboard.md`).
 */
export function roleRequiresFocusWrap({ role }: { role: TLayerRole | undefined }): boolean {
	return role === 'dialog' || role === 'alertdialog';
}
