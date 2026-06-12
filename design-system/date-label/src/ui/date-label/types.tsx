export type DateLabelAppearance = 'neutral' | 'warning' | 'danger';

export interface DateLabelProps {
	/**
	 * The text content to display inside the date label.
	 */
	label: string;

	/**
	 * Controls the visual style of the date label.
	 * - `neutral` — default grey border style
	 * - `warning` — orange border, used for upcoming/near-due dates
	 * - `danger` — red border, used for overdue dates
	 *
	 * @default 'neutral'
	 */
	appearance?: DateLabelAppearance;

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
	 * The accessible label for the icon. This is passed to the icon's `label` prop
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
	 * The maximum width of the date label. Accepts a number (treated as px) or
	 * a string (e.g. `'50%'`). When the label text exceeds this width it will be
	 * truncated with an ellipsis.
	 *
	 * @default 180
	 */
	maxWidth?: number | string;

	/**
	 * When `true`, increases the padding and height of the date label for use in
	 * more spacious layouts (e.g. forms or detail views). Sets the height to 32px
	 * and increases horizontal padding.
	 *
	 * @default false
	 */
	isSpacious?: boolean;

	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
}
