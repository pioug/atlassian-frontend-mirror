import type { MouseEvent } from 'react';

import type { CardProps } from '@atlaskit/smart-card';

import type { Providers } from '../provider-factory';

export type OnClickCallback = ({
	event,
	url,
}: {
	event: MouseEvent<HTMLAnchorElement>;
	url?: string;
}) => void;

export interface CardOptions {
	/**
	 * A promise returning the instance of EditorCardProvider
	 *
	 * Example: Promise.resolve(new EditorCardProvider())
	 */
	provider?: Providers['cardProvider'];
	/**
	 * When the URL pattern is in conflict with Smart Links and macros, macros will take priority over Smart Links.
	 * Specify the names of macros to allow card plugin to override the macros behaviour and converts the URL to Smart Link.
	 */
	resolveBeforeMacros?: string[];
	/**
	 * A flag to determine whether editor can display Smart Link with block (Card) appearance.
	 * Default is true.
	 *
	 * Component: block (card)
	 */
	allowBlockCards?: boolean;
	/**
	 * A flag to determine whether editor can display link datasource (Jira issues and Confluence links).
	 * Default is false.
	 *
	 * Component: link datasource (Jira issues, Confluence list)
	 */
	allowDatasource?: boolean;
	/**
	 * A flag to determine whether editor can display Smart Link with embed appearance.
	 * Default is false.
	 *
	 * Component: embed
	 */
	allowEmbeds?: boolean;
	/**
	 * A flag to determine whether Smart Link with embed appearance can be resized.
	 * Default is true.
	 *
	 * Component: embed
	 */
	allowResizing?: boolean;
	/**
	 * Configure visibility of actions available.
	 * By default, smart links show all actions available on the views.
	 * Set `hide` to true to disable all actions.
	 * Set `hide` to false and set `exclude` to enable only specific actions.
	 *
	 * Component: inline (hover preview), block (card)
	 */
	actionOptions?: CardProps['actionOptions'];
	/**
	 * By default, Smart Link with inline appearance resolving states show a frame with a spinner on the left.
	 * An alternative is to remove the frame and place the spinner on the right by setting this value to `on-right-without-skeleton`.
	 * This property is specific to inline links in the editor.
	 * Default is true.
	 *
	 * Component: inline
	 */
	useAlternativePreloader?: boolean;
	/**
	 * A flag to display alignment options in the link toolbar on Smart Link with embed appearance.
	 * Default is true.
	 *
	 * Component: embed
	 */
	allowAlignment?: boolean;
	/**
	 * A flag to display wrapping options in the link toolbar on Smart Link with embed appearance.
	 * Default is true.
	 *
	 * Component: embed
	 */
	allowWrapping?: boolean;
	/**
	 * A flag to display Smart Link upgrade discovery.
	 * Default is true.
	 *
	 * Component: link toolbar
	 */
	showUpgradeDiscoverability?: boolean;
	/**
	 * A callback to determine the link click behaviour.
	 *
	 * Component: inline, block (card), embed
	 */
	onClickCallback?: OnClickCallback;
	/**
	 * Customises the outbound link to configure user preferences
	 *
	 * Component: link toolbar
	 */
	userPreferencesLink?: string;
	/**
	 * A flag to determine whether page is SSRed. Directly render card if page is SSRed
	 * with resolved data and skip lazy load process.
	 * Default is false.
	 *
	 * Component: inline
	 */
	isPageSSRed?: boolean;
}
