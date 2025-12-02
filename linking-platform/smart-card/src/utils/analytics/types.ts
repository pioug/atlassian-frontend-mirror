export type DestinationProduct = 'jira' | 'confluence' | 'bitbucket' | 'trello';
export type DestinationSubproduct = 'core' | 'software' | 'servicedesk';

export type ClickType = 'left' | 'middle' | 'right' | 'keyboard' | 'none';

export type ClickOutcome =
	| 'prevented'
	| 'clickThrough'
	| 'clickThroughNewTabOrWindow'
	| 'contextMenu'
	| 'alt'
	| 'contentEditable'
	| 'previewPanel'
	| 'unknown';

export type UiLinkClickedEventProps = {
	/**
	 * The user outcome for clicking the link as far as can be reasonably be determined
	 * This ignores any programmatic cancellation of the outcome (ie e.preventDefault()) and
	 * thus this represents the user intent, not necessarily the actual outcome
	 */
	clickOutcome: ClickOutcome;
	/**
	 * Whether the click occurred with the left, middle or right mouse button
	 */
	clickType: ClickType;
	/**
	 * Whether the browser's default behaviour was prevented programmatically
	 */
	defaultPrevented: boolean;
	/**
	 * The keys held by the user at the time of clicking the link (which influence `clickOutcome`)
	 */
	keysHeld: ('alt' | 'ctrl' | 'meta' | 'shift')[];
	/**
	 * Whether the clicked URL is a Confluence shortLink (contains "/l/cp")
	 * Only included when the experiment is enabled
	 */
	isConfluenceShortLink?: boolean;
};
