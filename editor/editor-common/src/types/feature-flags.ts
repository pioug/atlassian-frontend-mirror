import type { DisableSpellcheckByBrowser } from './supported-browsers';

/**
 * Feature Flags for experimental features/behaviours.
 *
 * This feature flags are not meant to be used as plugin configuration and are only for temporary flags that will eventually be enabled be default or removed.
 * If your plugin requires permanent configuration options it's better to keep them in plugin options.
 *
 * # ADDING NEW FEATURE FLAG
 *
 * – Every feature flag must have a description explaining what it's meant to be doing.
 * – Every feature flag must have an associated ticket and a DUE DATE when this flag will be removed and an owner who will remove it.
 *
 * ## TEMPLATE
 *
 * When adding a new feature flag use the following template:
 *
 * ```
 * @description
 * What this feature flag is doing. Do not lead with "Feature flag to".
 *
 * @see https://product-fabric.atlassian.net/browse/ED-1
 * @default false
 * ```
 *
 * ## NAMING
 * – Name feature flags without `allow`.
 * – A name should read as "Feature flag to enable ...".
 *
 * Example: name = "newInsertionBehaviour" -> "Enable new insertion behaviour"
 */
export type FeatureFlags = {
	/**
	 * @description
	 * Whether a placeholder bracket hint was provided (`string => boolean`)
	 * Placeholder text to be displayed when a bracket '{' is typed and the line is empty e.g. 'Did you mean to use '/' to insert content?'
	 * This is used to aid migration for TinyMCE power users to the new Fabric editor power user shortcuts.
	 *
	 * @see https://product-fabric.atlassian.net/l/c/4JLjusAP
	 * @default true
	 */
	placeholderBracketHint?: boolean;

	/**
	 * @description
	 * Whether placeholder hints were provided (`string[] => boolean`)
	 * Placeholder text values to display on new empty lines.
	 *
	 * @see https://product-fabric.atlassian.net/l/c/GG1Yv9cK
	 * @default false
	 */
	placeholderHints?: boolean;

	/**
	 * @description
	 * Enable `localId` generation for extensions.
	 *
	 * @see https://product-fabric.atlassian.net/l/c/2m0i9jLX
	 * @default false
	 */
	extensionLocalIdGeneration?: boolean;

	/**
	 * @description
	 * Enable add column custom step
	 *
	 * @see https://product-fabric.atlassian.net/browse/ED-8856
	 * @default false
	 */
	addColumnWithCustomStep?: boolean;

	/**
	 * @description
	 * Enable undo/redo buttons and functionality within the editor
	 *
	 * @see https://product-fabric.atlassian.net/browse/ED-9537
	 * @default false
	 */
	undoRedoButtons?: boolean;

	/**
	 * @description
	 * Measure render performance for all tracked analytics events
	 *
	 * @default false
	 */
	catchAllTracking?: boolean;

	/**
	 * @private
	 * @deprecated This is always on now and this prop is no longer required.
	 * @description
	 * Yield to user interaction work before sending analytics
	 *
	 * @see https://product-fabric.atlassian.net/browse/ED-10584
	 * @default false
	 */
	queueAnalytics?: boolean;

	/**
	 * Show the avatar group as a plugin
	 * @see https://product-fabric.atlassian.net/browse/CERN-747
	 * @default false
	 */
	showAvatarGroupAsPlugin?: boolean;

	/**
	 * @description
	 * Enables docStructure for unhandleErrorEvents
	 *
	 * @see https://product-fabric.atlassian.net/browse/ED-12998
	 * @default false
	 */
	errorBoundaryDocStructure?: boolean;

	/**
	 * @description
	 * Enables docStructure for synchronyError
	 *
	 * @see https://product-fabric.atlassian.net/browse/ED-12998
	 * @default false
	 */
	synchronyErrorDocStructure?: boolean;

	/**
	 * @decsription
	 * Enables the view update subscription plugin
	 *
	 * @default false
	 */
	enableViewUpdateSubscription?: boolean;

	/**
	 * @description
	 * Enable scroll-to-telepointer for collab avatars
	 *
	 * @see https://product-fabric.atlassian.net/browse/ED-12460
	 * @default false
	 */
	collabAvatarScroll?: boolean;

	/**
	 * Split editor toolbar to two lines when viewport is small
	 * @see https://product-fabric.atlassian.net/browse/CERN-1124
	 * @default false
	 */
	twoLineEditorToolbar?: boolean;

	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/**
	 * @deprecated
	 * @description
	 * Enable new collab service
	 * @see https://product-fabric.atlassian.net/browse/ED-14097
	 * @default false
	 */
	useNativeCollabPlugin?: boolean;

	/**
	 * Enable custom up/down key handler when cursor below/above an inline media
	 * @see https://product-fabric.atlassian.net/browse/ED-13066
	 * Chrome bug: https://bugs.chromium.org/p/chromium/issues/detail?id=1227468
	 * @default undefined
	 */
	chromeCursorHandlerFixedVersion?: number;

	/**
	 * @description
	 * Generic way of disabling spellcheck per browser by version range
	 *
	 * @see https://product-fabric.atlassian.net/browse/ED-14510
	 * @default {}
	 * Example:
	 * {
	 *    ie: {
	 *      minimum: 101,
	 *    },
	 *    chrome: {
	 *      minimum: 96,
	 *      maximum: 109,
	 *    },
	 * };
	 */
	disableSpellcheckByBrowser?: DisableSpellcheckByBrowser | undefined;

	/**
	 * @description
	 * Use the linking platform link picker for link insertion and edit
	 *
	 * @see https://product-fabric.atlassian.net/wiki/spaces/EM/pages/3158246501/PP+Link+Picker+-+Standalone
	 * @see https://product-fabric.atlassian.net/browse/EDM-2577
	 * @default false
	 */
	lpLinkPicker?: boolean;

	/**
	 * @description
	 * Enable the new editor media resize experience.
	 *
	 * @see https://product-fabric.atlassian.net/browse/ED-18316
	 * @default false
	 */
	extendedMediaResizeExperience?: boolean | undefined;

	/**
	 * @description
	 * Enables the drag and drop rows/columns for tables
	 *
	 * @see https://product-fabric.atlassian.net/browse/ED-21807
	 * @default false
	 */
	tableDragAndDrop?: boolean;

	/**
	 * @description
	 * Enables the table selector button and popup in toolbar
	 *
	 * @see https://product-fabric.atlassian.net/browse/ED-21435
	 * @default false
	 */
	tableSelector?: boolean;

	/**
	 * @description
	 * Enables table to scale in the same way as renderer
	 *
	 * @see https://product-fabric.atlassian.net/browse/ED-22364
	 * @default false
	 */
	tablePreserveWidth?: boolean;

	/**
	 * @description
	 * Enables table to scale in the same way as renderer
	 *
	 * @see https://product-fabric.atlassian.net/browse/ED-23471
	 * @default false
	 */
	tableWithFixedColumnWidthsOption?: boolean;

	/**
	 * @description
	 * Enables new column resizing experience
	 *
	 * @see https://product-fabric.atlassian.net/browse/ED-17798
	 * @default false
	 */
	tableNewColumnResizing?: boolean;

	/**
	 * @description
	 * Enables macro interaction visual updates
	 *
	 * @see https://product-fabric.atlassian.net/browse/PGXT-4910
	 * @default false
	 */
	macroInteractionUpdates?: boolean;

	/**
	 * @description
	 * Enables macro interaction visual button updates
	 *
	 * @see https://product-fabric.atlassian.net/browse/PGXT-5513
	 * @default false
	 */
	macroInteractionButtonUpdates?: boolean;

	/**
	 * @description
	 * Enables extra analytics to be added for comments on media
	 *
	 * @see https://product-fabric.atlassian.net/browse/ED-23355
	 * @default false
	 */
	commentsOnMediaAnalytics?: boolean;

	/**
	 * @description
	 * Enables block elements drag and drop
	 *
	 * @see https://product-fabric.atlassian.net/browse/ED-22939
	 * @default false
	 */
	elementDragAndDrop?: boolean;

	/**
	 * @description
	 * Enables fix for comment sidebar is not scrolled into view when adding/viewing a comment on media
	 *
	 * @see https://product-fabric.atlassian.net/browse/ED-23281
	 * @default false

	 */
	commentsOnMediaAutoscrollInEditor?: boolean;

	/**
	 * @description
	 * Enables more elements in view in quick insert typeahead
	 *
	 * @see https://product-fabric.atlassian.net/browse/ED-24231
	 * @default false

	 */
	moreElementsInQuickInsertView?: boolean;

	/**
	 * @description
	 * Enables basic text transformations options in floating toolbar
	 *
	 * @see https://product-fabric.atlassian.net/browse/ED-24447
	 * @default false
	 */
	basicTextTransformations?: boolean;

	/**
	 * @description
	 * Enables nesting nested expands in expands
	 *
	 * @see https://hello.jira.atlassian.cloud/browse/FD-72082
	 * @default false
	 */
	nestedExpandInExpandEx?: boolean;

	/**
	 * @description
	 * Enables nesting media and codeblock in blockquotes
	 *
	 * @see https://hello.jira.atlassian.cloud/browse/FD-73720
	 * @default false
	 */
	nestMediaAndCodeblockInQuote?: boolean;
};

export type FeatureFlagKey = keyof FeatureFlags;
export type GetEditorFeatureFlags = () => FeatureFlags;
