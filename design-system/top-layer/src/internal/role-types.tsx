/**
 * Roles that require an accessible name (`label` or `labelledBy`) per WCAG 4.1.2.
 * Without a name, assistive technology cannot identify these layers.
 */
export type TRoleRequiringAccessibleName = 'dialog' | 'alertdialog' | 'menu';

/**
 * Roles where the accessible name comes from the content or from another element
 * (for example a combobox labels its listbox, and the content of a tooltip is its name).
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

/**
 * Roles that move focus into the popover when it opens. Only these roles accept
 * `initialFocusRef`. See `notes/decisions/role-and-focus.md`.
 */
export type TRoleWithInitialFocus = 'dialog' | 'alertdialog' | 'menu' | 'listbox';

/**
 * Name props for a role in `TRoleRequiringAccessibleName`. The union makes TypeScript require
 * `label`, `labelledBy` or both, so the WCAG 4.1.2 rule is checked at compile time.
 */
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

/**
 * Name props for a role in `TRoleWithImplicitName`. Both are optional.
 */
type TAccessibleNameOptional = {
	label?: string;
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions -- maps to aria-labelledby
	labelledBy?: string;
};

/**
 * Role and name props where a role is always required. Used by `TPopoverProps`.
 *
 * A popover must always declare its role, so assistive technology can identify the layer. A role
 * in `TRoleRequiringAccessibleName` also needs `label` or `labelledBy`.
 */
export type TAriaRoleRequired =
	| ({ role: TRoleRequiringAccessibleName } & TAccessibleNameRequired)
	| ({ role: TRoleWithImplicitName } & TAccessibleNameOptional);
