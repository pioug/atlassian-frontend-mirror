import type React from 'react';

import { type UIAnalyticsEvent, type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';

export interface BreadcrumbsProps extends WithAnalyticsEventsProps {
	/**
	 * Controls whether the legacy collapsed breadcrumbs start expanded.
	 *
	 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-58821 Internal documentation for deprecation (no external access)}
	 * Only used by the legacy breadcrumbs collapse behavior. The refreshed breadcrumbs collapse responsively and ignore this prop.
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	defaultExpanded?: boolean;
	/**
	 * Override collapsing of the nav when there are more than the maximum number of items.
	 *
	 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-58821 Internal documentation for deprecation (no external access)}
	 * Only used by the legacy breadcrumbs collapse behavior. The refreshed breadcrumbs collapse responsively and ignore this prop.
	 */
	isExpanded?: boolean;
	/**
	 * Set the maximum number of breadcrumbs to display. When there are more
	 * than the maximum number, only the first and last will be shown, with an
	 * ellipsis in between.
	 *
	 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-58821 Internal documentation for deprecation (no external access)}
	 * Only used by the legacy breadcrumbs collapse behavior. The refreshed breadcrumbs collapse based on available space and ignore this prop.
	 */
	maxItems?: number;
	/**
	 * The items to be included inside the Breadcrumbs wrapper.
	 */
	children?: React.ReactNode;
	/**
	 * A function to be called when you are in the collapsed view and click the ellipsis.
	 *
	 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-58821 Internal documentation for deprecation (no external access)}
	 * Only used by the legacy breadcrumbs collapse behavior. The refreshed breadcrumbs manage collapse responsively and ignore this prop.
	 */
	onExpand?: (event: React.MouseEvent, analyticsEvent: UIAnalyticsEvent) => void;
	/**
	 * If max items is exceeded, the number of items to show before the ellipsis.
	 *
	 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-58821 Internal documentation for deprecation (no external access)}
	 * Only used by the legacy breadcrumbs collapse behavior. The refreshed breadcrumbs automatically choose which items to collapse and ignore this prop.
	 */
	itemsBeforeCollapse?: number;
	/**
	 * If max items is exceeded, the number of items to show after the ellipsis.
	 *
	 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-58821 Internal documentation for deprecation (no external access)}
	 * Only used by the legacy breadcrumbs collapse behavior. The refreshed breadcrumbs automatically choose which items to collapse and ignore this prop.
	 */
	itemsAfterCollapse?: number;

	/**
	 * Additional information to be included in the `context` of analytics events.
	 */
	analyticsContext?: Record<string, any>;

	/**
	 * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;

	/**
	 * Text to be used as label of navigation region that wraps the breadcrumbs.
	 */
	label?: string;

	/**
	 * Text to be used as an accessible label for the ellipsis button that reveals
	 * collapsed breadcrumb items in a popup.
	 */
	ellipsisLabel?: string;

	/**
	 * The size variant of the breadcrumbs. Use `'small'` for a compact presentation
	 * with smaller text (`font.body.small`) and smaller icons.
	 *
	 * @default 'medium'
	 */
	size?: 'medium' | 'small';
}

export interface BreadcrumbsCurrentItemProps {
	/**
	 * The text label for the current page.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	text: string;

	/**
	 * An element to display before the breadcrumb text.
	 */
	elemBefore?: React.ReactChild;

	/**
	 * An icon to display before the breadcrumb text.
	 *
	 * @deprecated Use `elemBefore` instead.
	 */
	iconBefore?: React.ReactChild;

	/**
	 * The URL of the current page. A copy-link icon is shown on hover that copies
	 * this URL to the clipboard.
	 */
	href: string;

	/**
	 * The maximum width in pixels that the current item link can have before it is
	 * truncated. If this is not set, truncation will only occur when it cannot fit
	 * alone on a line. If there is no truncationWidth, tooltips are not provided
	 * on truncation.
	 */
	truncationWidth?: number;

	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;

	/**
	 * Callback fired after the link URL has been successfully copied to the
	 * clipboard.
	 */
	onCopyLink?: () => void;

	/**
	 * A function to be called when a truncated current item's tooltip is shown.
	 */
	onTooltipShown?: () => void;
}

export interface BreadcrumbsSkeletonItemProps {
	/**
	 * Width of the text placeholder.
	 */
	width: string | number;
	/**
	 * Whether the breadcrumb placeholder should render a leading icon placeholder.
	 */
	hasIcon?: boolean;
}

export interface BreadcrumbsSkeletonProps {
	/**
	 * The placeholder items to render. Use `BreadcrumbsSkeletonItem` children to
	 * define a custom loading shape. If omitted, three default items are shown.
	 */
	children?: React.ReactNode;
	/**
	 * Text used as the accessible label for the loading navigation landmark.
	 *
	 * @default 'Loading breadcrumbs'
	 */
	label?: string;
	/**
	 * Enables the shimmering animation.
	 *
	 * @default true
	 */
	isShimmering?: boolean;
	/**
	 * Visual size of the skeleton placeholder.
	 *
	 * @default 'medium'
	 */
	size?: 'medium' | 'small';
	/**
	 * A `testId` prop is provided for specified elements, which is a unique string
	 * that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
}

export interface BreadcrumbsItemProps extends WithAnalyticsEventsProps {
	/**
	 * The url or path which the breadcrumb should act as a link to.
	 */
	href?: string;
	/**
	 * Accessible label applied to the interactive breadcrumb control.
	 */
	'aria-label'?: string;
	/**
	 * Accessible labelling relationship applied to the interactive breadcrumb control.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions -- Standard ARIA attribute retained for backwards-compatible prop passthrough.
	'aria-labelledby'?: string;
	/**
	 * An element to display before the breadcrumb.
	 */
	elemBefore?: React.ReactChild;

	/**
	 * An icon to display before the breadcrumb.
	 *
	 * @deprecated Use `elemBefore` instead.
	 */
	iconBefore?: React.ReactChild;
	/**
	 * An icon to display after the breadcrumb.
	 *
	 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-58821 Internal documentation for deprecation (no external access)}
	 * Use `elemBefore` to place an icon on a breadcrumb item. Icons after breadcrumb text are not recommended as they visually conflict with the separator.
	 */
	iconAfter?: React.ReactChild;
	/**
	 * Handler to be called on click. *
	 */
	onClick?: (event: React.MouseEvent) => void;
	/**
	 * The text to appear within the breadcrumb as a link.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	text: string;
	/**
	 * The maximum width in pixels that an item can have before it is truncated.
	 * If this is not set, truncation will only occur when it cannot fit alone on a
	 * line. If there is no truncationWidth, tooltips are not provided on truncation.
	 */
	truncationWidth?: number;
	target?: '_blank' | '_parent' | '_self' | '_top' | '';
	/**
	 * Advisory text applied to the interactive breadcrumb control.
	 */
	title?: string;
	/**
	 * Provide a custom component to use instead of the default button.
	 *  The custom component should accept a className prop so it can be styled
	 *  and possibly all action handlers.
	 *
	 * @deprecated - No longer necessary as breadcrumb will inherit and utilize router link configuration from App Provider. [See the documentation](https://atlassian.design/components/app-provider/examples#router-links) to ensure App Provider is configured in your app.
	 */
	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	component?: React.ClassType<any, any, any>;

	/**
	 * Additional information to be included in the `context` of analytics events.
	 */
	analyticsContext?: Record<string, any>;

	/**
	 * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
	 * In case of `testId` passed through EllipsisItem, the element will be identified like this: 'testId && `${testId}--breadcrumb-ellipsis'.
	 * This can be used to click the elements when they are collapsed.
	 */
	testId?: string;

	/**
	 * A function to be called when a truncated breadcrumb item's tooltip is shown.
	 */
	onTooltipShown?: () => void;
}
