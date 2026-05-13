import { useMemo } from 'react';

type TRestrictedDialogRole = 'dialog' | 'alertdialog' | 'menu';

type TWcagSupplementalRole =
	| 'tooltip'
	| 'listbox'
	| 'tree'
	| 'grid'
	| 'note'
	| 'status'
	| 'alert'
	| 'log';

/**
 * Props shape passed from legacy `role` / `label` / `titleId` into `@atlaskit/top-layer` `Popup.Content`.
 */
export type TUseRolePropsResult =
	| { role: TRestrictedDialogRole; labelledBy: string }
	| { role: TRestrictedDialogRole; label: string }
	| { role: TWcagSupplementalRole; label: string | undefined };

/**
 * Maps legacy popup role/label/titleId props to the discriminated union
 * that `Popup.Content` expects.
 *
 * `Popup.Content` enforces at the type level that dialog/alertdialog/menu
 * roles must have `label` or `labelledBy`. This hook bridges the legacy
 * flat-prop API (`role`, `label`, `titleId`) to that shape.
 */
export function useRoleProps({
	role,
	label,
	titleId,
}: {
	role: string | undefined;
	label: string | undefined;
	titleId: string | undefined;
}): TUseRolePropsResult {
	return useMemo((): TUseRolePropsResult => {
		if (role === 'dialog' || role === 'alertdialog' || role === 'menu') {
			if (titleId) {
				return { role: role as 'dialog' | 'alertdialog' | 'menu', labelledBy: titleId };
			}
			return {
				role: role as 'dialog' | 'alertdialog' | 'menu',
				label: label ?? 'Popup',
			};
		}
		if (role) {
			return {
				role: role as 'tooltip' | 'listbox' | 'tree' | 'grid' | 'note' | 'status' | 'alert' | 'log',
				label,
			};
		}
		// Default: dialog role with label or labelledBy
		if (titleId) {
			return { role: 'dialog' as const, labelledBy: titleId };
		}
		return {
			role: 'dialog' as const,
			label: label ?? 'Popup',
		};
	}, [role, label, titleId]);
}
