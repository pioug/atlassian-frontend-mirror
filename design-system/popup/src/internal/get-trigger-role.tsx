/**
 * Narrows a popup `role` to one that `getAriaForTrigger` accepts.
 *
 * Tooltip-family roles and no role give `undefined`, so the trigger gets no `aria-haspopup`.
 */
export function getTriggerRole({
	role,
}: {
	role: string | undefined;
}): 'dialog' | 'alertdialog' | 'menu' | 'listbox' | 'tree' | 'grid' | undefined {
	if (
		role === 'dialog' ||
		role === 'alertdialog' ||
		role === 'menu' ||
		role === 'listbox' ||
		role === 'tree' ||
		role === 'grid'
	) {
		return role;
	}
	return undefined;
}
