import { type RefObject, useMemo } from 'react';

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

type TInitialFocusRef = RefObject<HTMLElement | null>;

/**
 * Props shape passed from legacy `role` / `label` / `titleId` into `@atlaskit/top-layer` `Popup.Content`.
 *
 * `initialFocusRef` is only on the variants whose roles move focus on open,
 * matching `Popover`'s types.
 *
 * The `{ role: undefined }` variant covers the legacy contract where a
 * consumer omits `role` to opt out of any popup semantics (and the
 * associated role-based initial-focus movement). Legacy `Popup` left the
 * popup element role-less in that case; we preserve that behaviour here
 * rather than defaulting to `'dialog'`, which would move focus into the
 * popup on open.
 */
export type TUseRolePropsResult =
	| { role: TRestrictedDialogRole; labelledBy: string; initialFocusRef: TInitialFocusRef }
	| { role: TRestrictedDialogRole; label: string; initialFocusRef: TInitialFocusRef }
	| { role: 'listbox'; label: string | undefined; initialFocusRef: TInitialFocusRef }
	| { role: Exclude<TWcagSupplementalRole, 'listbox'>; label: string | undefined }
	| { role: undefined; label: string | undefined };

/**
 * Maps legacy popup role/label/titleId props to the discriminated union
 * that `Popup.Content` expects.
 *
 * `Popup.Content` enforces at the type level that dialog/alertdialog/menu
 * roles must have `label` or `labelledBy`. This hook bridges the legacy
 * flat-prop API (`role`, `label`, `titleId`) to that shape.
 *
 * `initialFocusRef` (the `setInitialFocusRef` target) is passed on only for
 * roles that move focus. Other roles, and no role, do not move focus.
 *
 * When `role` is omitted entirely, the result carries `role: undefined`
 * (no implicit default). This matches the legacy `Popup` contract and
 * keeps the underlying `Popover` from running role-based initial focus.
 */
export function useRoleProps({
	role,
	label,
	titleId,
	initialFocusRef,
}: {
	role: string | undefined;
	label: string | undefined;
	titleId: string | undefined;
	initialFocusRef: TInitialFocusRef;
}): TUseRolePropsResult {
	return useMemo((): TUseRolePropsResult => {
		if (role === 'dialog' || role === 'alertdialog' || role === 'menu') {
			if (titleId) {
				return { role, labelledBy: titleId, initialFocusRef };
			}
			return { role, label: label ?? 'Popup', initialFocusRef };
		}
		if (role === 'listbox') {
			return { role, label, initialFocusRef };
		}
		if (role) {
			return {
				role: role as Exclude<TWcagSupplementalRole, 'listbox'>,
				label,
			};
		}
		// No role supplied: preserve the legacy "no popup semantics" contract.
		return { role: undefined, label };
	}, [role, label, titleId, initialFocusRef]);
}
