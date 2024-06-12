import type { CSSProperties, ReactElement, SyntheticEvent } from 'react';

import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';

// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
export interface PaginationPropTypes<T = unknown> {
	/**
	 * Replace the built-in page, previous, next and/ or ellipsis component
	 */
	components?: {
		Page?: React.ElementType;
		Previous?: React.ElementType;
		Next?: React.ElementType;
	};
	/**
	 * Index of the page to be selected by default.
	 */
	defaultSelectedIndex?: number;
	/**
	 * Helper function to get text displayed on the page button. This is helpful in scenarios when page the page passed in is an object.
	 */
	getPageLabel?: (page: T, pageIndex: number) => number | string;
	/**
	 * The aria-label for the pagination nav wrapper.
	 * The default value is "pagination".
	 */
	label?: string;
	/**
	 * The aria-label for the next button.
	 * The default value is "next".
	 */
	nextLabel?: string;
	/**
	 * The aria-label for the individual page numbers.
	 * The default value is "page".
	 * The page number is automatically appended to the pageLabel.
	 * For Example, pageLabel="página" will render aria-label="página 1"
	 * as the label for page 1.
	 */
	pageLabel?: string;
	/**
	 * The aria-label for the previous button.
	 * The default value is "previous".
	 */
	previousLabel?: string;
	/**
	 * Style to spread on the container element.
	 */
	style?: CSSProperties;
	/**
	 * Maximum number of pages to be displayed in the pagination.
	 */
	max?: number;
	/**
	 * The onChange handler which is called when the page is changed.
	 */
	onChange?: (event: SyntheticEvent, page: T, analyticsEvent?: UIAnalyticsEvent) => void;
	/**
	 * Array of the pages to display.
	 */
	pages: T[];
	/**
	 * Index of the selected page. This will make this pagination controlled.
	 */
	selectedIndex?: number;
	/**
	 * The react Node returned from the function is rendered instead of the default ellipsis node.
	 */
	renderEllipsis?: (arg: { key: string; from: number; to: number }) => ReactElement;
	/**
	 * Additional information to be included in the `context` of analytics events.
	 */
	analyticsContext?: Record<string, any>;
	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid`
	 * in the rendered code, serving as a hook for automated tests.
	 *
	 * Will set data-testid on these elements when defined:
	 * - Pagination nav wrapper - {testId}
	 * - Page - {testId}--page-{page index}
	 * - Current page - {testId}--current-page-{page index}
	 * - Left navigator - {testId}--left-navigator
	 * - Right navigator - {testId}--right-navigator
	 */
	testId?: string;
	/**
	 * Sets whether the Paginator is disabled
	 */
	isDisabled?: boolean;
}
