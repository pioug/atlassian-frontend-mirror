import type { ReactNode } from 'react';

import type { GridSpacing } from './constants';

export type { GridSpacing } from './constants';

/**
 * The props accepted by the internal `Grid` element.
 */
export type BaseGridProps = {
	/**
	 * The content of the grid. Direct children should be instances of `GridColumn`.
	 */
	children?: React.ReactNode;
	/**
	 * Controls whether the grid should use a fixed-width layout or expand to fill available space.
	 *
	 * Defaults to `"fixed"`.
	 */
	layout?: GridLayout;
	/**
	 * A unique string that appears as a data attribute `data-testid` in the rendered code. Serves as a hook for automated tests.
	 */
	testId?: string;
};

/**
 * Values set for the theme.
 */
export type ThemeProps = {
	/**
	 * Number of columns in the grid.
	 */
	columns: number;
	/**
	 * The amount of space between each grid column.
	 * `comfortable` adds 40px of spacing, `cosy` adds 16px and `compact` creates 4px gap between columns.
	 *
	 * Defaults to `"cosy"`.
	 */
	spacing: GridSpacing;
	/**
	 * Sets whether the grid is nested or not.
	 */
	isNestedGrid?: boolean;
};

/**
 * The props accepted by the external `Grid` element.
 *
 * @extends BaseGridProps
 */
export type GridProps = BaseGridProps & {
	/**
	 * The amount of space between each grid column.
	 * `comfortable` adds 40px of spacing, `cosy` adds 16px and `compact` creates 4px gap between columns.
	 *
	 * Defaults to `"cosy"`.
	 */
	spacing?: GridSpacing;
	/**
	 * The total number of columns available in each row of the grid.
	 *
	 * Defaults to `12`.
	 */
	columns?: number;
	/**
	 * For consumers still using the theme prop to set the grid layout.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	theme?: ThemeProps;
};

export type GridColumnProps = {
	/**
	 * The number of columns in its parent `Grid` that the `GridColumn` should span.
	 *
	 * Defaults to `12`.
	 */
	medium?: number;
	/**
	 * The content to display within the column.
	 */
	children?: ReactNode;
	/**
	 * A unique string that appears as a data attribute `data-testid` in the rendered code. Serves as a hook for automated tests.
	 */
	testId?: string;
};

export type GridLayout = 'fluid' | 'fixed';

export type PageProps = {
	/**
	 * If you provide the banner or banners you are to use, page will help you
	 * coordinate the showing and hiding of them in conjunction with `isBannerOpen`.
	 * This is designed to take [banner](https://atlassian.design/components/banner/examples) component, and
	 * matches its animation timing.
	 *
	 * The only time that two banners should be rendered are when an announcement
	 * banner is loaded alongside an error or warning banner.
	 */
	banner?: ReactNode;

	/**
	 * Takes [side navigation component](/components/side-navigation/) and helps
	 * position it with consideration to rendered banners.
	 */
	navigation?: ReactNode;

	/**
	 * The contents of the page, to be rendered next to navigation. It will be
	 * correctly position with relation to both any banner, as well as navigation.
	 */
	children?: ReactNode;

	/**
	 * Sets whether to show or hide the banner. This is responsible for moving the
	 * page contents down, as well as whether to render the banner component.
	 *
	 * Defaults to `false`.
	 */
	isBannerOpen?: boolean;

	/**
	 * `52` is line height `(20) + 4 * grid`. This is the height of all banners aside
	 * from the dynamically heighted announcement banner.
	 *
	 * Banner height can be retrieved from banner using its `innerRef`, which always
	 * returns its height when expanded even when it's collapsed.
	 *
	 * In addition to setting the height of the banner's container for dynamically
	 * heighted banners, you will need to set the `pageOffset` in navigation. Since
	 * this is a lot to think about, [here](/components/page/examples#announcement-banners)
	 * is an example that implements displaying both an announcement banner and a
	 * warning banner on a page, while matching the height of each.
	 *
	 * Defaults to `52`.
	 */
	bannerHeight?: number;

	/**
	 * A unique string that appears as a data attribute `data-testid` in the rendered code. Serves as a hook for automated tests.
	 */
	testId?: string;
};
