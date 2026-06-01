import type {
	TAriaHasPopupValue,
	TRoleRequiringAccessibleName,
	TRoleWithImplicitName,
} from './role-types';

/**
 * Maps a popover content role to the correct `aria-haspopup` value
 * for its trigger element.
 *
 * Returns `undefined` for roles that are not popups in the ARIA sense
 * (`tooltip`, `note`, `status`, `alert`, `log`). Triggers for those roles
 * should not announce a popup at all - emitting `aria-haspopup="dialog"`
 * on a tooltip trigger would mislead assistive technology.
 */
export function roleToAriaHasPopup({
	role,
}: {
	role: TRoleRequiringAccessibleName | TRoleWithImplicitName | undefined;
}): TAriaHasPopupValue {
	if (role === 'menu') {
		return 'menu';
	}
	if (role === 'listbox') {
		return 'listbox';
	}
	if (role === 'tree') {
		return 'tree';
	}
	if (role === 'grid') {
		return 'grid';
	}
	if (role === 'dialog' || role === 'alertdialog') {
		return 'dialog';
	}
	// Non-popup roles (tooltip, note, status, alert, log) and the
	// no-role case: omit `aria-haspopup` entirely. React drops the
	// attribute when the value is `undefined`.
	return undefined;
}
