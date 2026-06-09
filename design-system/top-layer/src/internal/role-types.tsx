/**
 * Valid values for the `aria-haspopup` attribute.
 *
 * Derived from the HTML spec - maps popover roles to what the trigger
 * announces. `undefined` means the attribute is omitted entirely (used for
 * non-popup roles like `tooltip`/`status`/`alert`/`note`/`log` where
 * `aria-haspopup` would be misleading).
 *
 * `true` is intentionally NOT in the union - the runtime only ever produces
 * the explicit string forms, so widening the type would invite consumers to
 * pass `true` and get an `aria-haspopup="true"` serialisation that the
 * runtime no longer emits.
 */
export type TAriaHasPopupValue = 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid' | undefined;

/**
 * Roles that require an accessible name (`label` or `labelledBy`) per WCAG 4.1.2.
 * Without a name, assistive technology cannot identify these landmarks.
 */
export type TRoleRequiringAccessibleName = 'dialog' | 'alertdialog' | 'menu';

/**
 * Roles where the accessible name is derived from content or provided externally
 * (e.g. a combobox labels its listbox, tooltip content IS the accessible name).
 */
export type TRoleWithImplicitName =
	| 'tooltip'
	| 'listbox'
	| 'tree'
	| 'grid'
	| 'note'
	| 'status'
	| 'alert'
	| 'log';

// Shared ARIA role discrimination types
//
// These encode the WCAG 4.1.2 constraint: roles like `dialog`, `alertdialog`,
// and `menu` MUST have an accessible name (either `label` or `labelledBy`).
// TypeScript enforces this at compile time via discriminated unions.

type TAccessibleNameRequired =
	| {
			/**
			 * Accessible name via `aria-label`.
			 */
			label: string;
			// eslint-disable-next-line @repo/internal/react/consistent-props-definitions -- maps to aria-labelledby
			labelledBy?: string;
	  }
	| {
			label?: string;
			/**
			 * Accessible name via `aria-labelledby`.
			 */
			// eslint-disable-next-line @repo/internal/react/consistent-props-definitions -- maps to aria-labelledby
			labelledBy: string;
	  };

type TAccessibleNameOptional = {
	label?: string;
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions -- maps to aria-labelledby
	labelledBy?: string;
};

/**
 * ARIA role props where a role is always required.
 *
 * Used by `TPopupContentProps`. Popup content must always declare
 * its role so assistive technology can identify the layer.
 */
export type TAriaRoleRequired =
	| ({ role: TRoleRequiringAccessibleName } & TAccessibleNameRequired)
	| ({ role: TRoleWithImplicitName } & TAccessibleNameOptional);

/**
 * ARIA role props where a role is optional.
 *
 * Used by `TPopoverProps`. The low-level primitive allows omitting
 * the role for cases where it is set externally or not needed.
 */
export type TAriaRoleOptional =
	| ({ role: TRoleRequiringAccessibleName } & TAccessibleNameRequired)
	| ({ role?: TRoleWithImplicitName } & TAccessibleNameOptional);

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
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
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
