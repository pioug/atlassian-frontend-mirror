export type DateLabelDropdownTriggerAppearance = 'neutral' | 'warning' | 'danger';

export interface DateLabelDropdownTriggerProps {
	/**
	 * The text content to display inside the trigger (e.g. a formatted date string).
	 */
	label: string;

	/**
	 * Controls the visual style of the trigger.
	 * - `neutral` — default grey border style
	 * - `warning` — orange border, used for upcoming/near-due dates
	 * - `danger` — red border, used for overdue dates
	 *
	 * @default 'neutral'
	 */
	appearance?: DateLabelDropdownTriggerAppearance;

	/**
	 * When `true`, an icon is displayed before the label text.
	 * The icon shown depends on the `appearance`:
	 * - `neutral` → CalendarIcon
	 * - `warning` → ClockIcon
	 * - `danger` → WarningOutlineIcon
	 *
	 * @default true
	 */
	hasIconBefore?: boolean;

	/**
	 * When `true`, a spinner replaces the chevron icon and the trigger becomes non-interactive,
	 * indicating that an async operation is in progress (for example, saving a date selection).
	 *
	 * @default false
	 */
	isLoading?: boolean;

	/**
	 * The accessible label for the leading icon. This is passed to the icon's `label` prop
	 * and is read by screen readers to convey the icon's meaning.
	 *
	 * Defaults to a contextual string based on the `appearance`:
	 * - `neutral` → `'Calendar'`
	 * - `warning` → `'Warning'`
	 * - `danger` → `'Danger'`
	 *
	 * Set to `''` to mark the icon as decorative (when the label text alone is sufficient).
	 */
	iconLabel?: string;

	/**
	 * When `true`, increases the padding and height of the trigger to 32px
	 * and uses the body font size for more spacious layouts.
	 *
	 * @default false
	 */
	isSpacious?: boolean;

	/**
	 * The maximum width of the trigger. Accepts a number (treated as px) or
	 * a string (e.g. `'50%'`). Label text exceeding this width is truncated with an ellipsis.
	 *
	 * @default 200
	 */
	maxWidth?: number | string;

	/**
	 * When `true`, renders the trigger in a selected/active state using the pressed
	 * background colour for the current appearance. Use this when the associated
	 * dropdown is open or the date has been chosen.
	 *
	 * @default false
	 */
	isSelected?: boolean;

	/**
	 * Callback fired when the trigger button is clicked.
	 */
	onClick?: React.MouseEventHandler<HTMLButtonElement>;

	/**
	 * Identifies the popup element that this trigger controls.
	 * Should match the `id` of the popup content for screen readers.
	 */
	'aria-controls'?: string;

	/**
	 * Announces to assistive technology whether the popup is currently open.
	 */
	'aria-expanded'?: boolean;

	/**
	 * Informs assistive technology that this element triggers a popup.
	 */
	'aria-haspopup'?: boolean | 'dialog';

	/**
	 * Defines a string value that labels the trigger element for assistive technology.
	 * If not provided, the `label` text is used as the accessible name.
	 */
	'aria-label'?: string;

	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
}
