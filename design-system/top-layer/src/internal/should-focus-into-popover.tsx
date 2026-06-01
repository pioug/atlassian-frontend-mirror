import type { TRoleRequiringAccessibleName, TRoleWithImplicitName } from './role-types';

const rolesThatMoveFocus = new Set<TRoleRequiringAccessibleName | TRoleWithImplicitName>([
	'dialog',
	'alertdialog',
	'menu',
	'listbox',
	'tree',
	'grid',
]);

/**
 * Returns `true` when the given popover role moves focus into the popover
 * on open, and `false` otherwise (including when `role` is `undefined`).
 */
export function shouldFocusIntoPopover({
	role,
}: {
	role: TRoleRequiringAccessibleName | TRoleWithImplicitName | undefined;
}): boolean {
	if (!role) {
		return false;
	}
	return rolesThatMoveFocus.has(role);
}
