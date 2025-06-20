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
	 */
	onBeforeNavigate?: () => void;

	/**
	 * Used to hide skip links for slots with 0 height or width.s
	 *
	 * We can remove this once products conditionally render slots correctly.
	 */
	isHidden?: boolean;
};
