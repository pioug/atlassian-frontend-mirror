/**
 * Valid values for the `aria-haspopup` attribute.
 * Derived from the HTML spec — maps popover roles to what the trigger announces.
 */
export type TAriaHasPopupValue = 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid' | true;

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

// ── Shared ARIA role discrimination types ──
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
 * Used by `TPopupContentProps` — popup content must always declare
 * its role so assistive technology can identify the layer.
 */
export type TAriaRoleRequired =
	| ({ role: TRoleRequiringAccessibleName } & TAccessibleNameRequired)
	| ({ role: TRoleWithImplicitName } & TAccessibleNameOptional);

/**
 * ARIA role props where a role is optional.
 *
 * Used by `TPopoverProps` — the low-level primitive allows omitting
 * the role for cases where it is set externally or not needed.
 */
export type TAriaRoleOptional =
	| ({ role: TRoleRequiringAccessibleName } & TAccessibleNameRequired)
	| ({ role?: TRoleWithImplicitName } & TAccessibleNameOptional);

/**
 * Maps a popover content role to the correct `aria-haspopup` value
 * for its trigger element.
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
	// Default: return 'dialog' for all unmapped roles (tooltip, alertdialog,
	// note, status, alert, log, etc). This is a kinder API — rather than
	// throwing on unknown roles, we fall back to the most common popup type.
	// New roles that need specific aria-haspopup values should be added
	// as explicit cases above.
	return 'dialog';
}
