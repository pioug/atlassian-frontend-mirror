export type SkipLinkData = {
	/**
	 * id for the element that will be skipped to
	 */
	id: string;
	/**
	 * Text for the link that will appear in the skip link menu
	 */
	label: string;
	/**
	 * Desired position in the skip link menu
	 */
	listIndex?: number;

	/**
	 * Called when a user clicks on the skip link,
	 * immediately before focus is moved to the associated element.
	 *
	 * This can be used to update state, such as to show a hidden element.
	 *
	 * @deprecated Only used when `platform_dst_nav4_skip_link_a11y_1` is OFF.
	 * When the gate is on, prefer `navigate` for consumers that need to atomically
	 * commit state and move focus somewhere other than the slot element with id `id`.
	 * This callback can be removed once the gate is fully enabled and cleaned up.
	 */
	onBeforeNavigate?: () => void;

	/**
	 * Replaces the default "focus the element with `id`" behavior when the skip link is activated.
	 *
	 * Use this when the consumer needs to atomically commit state and move focus to
	 * a different element (e.g. SideNav expanding and focusing the first nav item).
	 *
	 * The universal pre/post work owned by `SkipLink` (e.g. `event.preventDefault`,
	 * `window.scrollTo`) still runs around this callback. Only the focus step is replaced.
	 *
	 * Only consumed when `platform_dst_nav4_skip_link_a11y_1` is enabled.
	 */
	navigate?: () => void;

	/**
	 * Used to hide skip links for slots with 0 height or width.
	 *
	 * We can remove this once products conditionally render slots correctly.
	 */
	isHidden?: boolean;
};
