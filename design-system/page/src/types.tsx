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
   * Whether the grid should use a fixed-width layout or expand to fill available space.
   */
  layout?: GridLayout;
  /**
   * Applies a `data-testid` to the rendered DOM for use in testing.
   */
  testId?: string;
};

/**
 * The props accepted by the external `Grid` element.
 *
 * @extends BaseGridProps
 */
export type GridProps = BaseGridProps & {
  /**
   * The amount of space between each grid column. Refer to
   * [this example](/packages/design-system/page/example/spacing-example)
   * for a visualization of the different spacing options.
   */
  spacing?: GridSpacing;
  /**
   * The total number of columns available in each row of the grid.
   */
  columns?: number;
};

export type GridColumnProps = {
  /**
   * The number of columns in its parent `Grid` that the `GridColumn` should span.
   */
  medium?: number;
  /**
   * The content to display within the column.
   */
  children?: ReactNode;
  /**
   * Applies a `data-testid` to the rendered DOM for use in testing.
   */
  testId?: string;
};

export type GridLayout = 'fluid' | 'fixed';

/*
  eslint-disable jsdoc/require-asterisk-prefix
  ---
  For some reason having the asterisk on the blank lines was causing ERT
  to render a list on the Atlaskit site.
*/
export type PageProps = {
  /**
   * If you provide the banner or banners you are to use, page will help you
   * coordinate the showing and hiding of them in conjunction with `isBannerOpen`.
   * This is designed to take [our banner](/packages/design-system/banner) component, and
   * matches the animation timing of our banner.
   
   * The only time that two banners should be rendered are when an announcement
   * banner is loaded alongside an error or warning banner.
   */
  banner?: ReactNode;

  /**
   * Takes our [navigation component](/packages/design-system/navigation) and helps
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
   */
  isBannerOpen?: boolean;

  /**
   * 52 is line height (20) + 4*grid. This is the height of all banners aside
   * from the dynamically heighted announcement banner.
   
   * Banner height can be retrieved from banner using its `innerRef`, which always
   * returns its height when expanded even when it's collapsed. 
   
   * In addition to setting the height of the banner's container for dynamically
   * heighted banners, you will need to set the `pageOffset` in navigation. Since
   * this is a lot to think about, [here](/examples/core/page/navigation-example)
   * is an example that implements displaying both an announcement banner and a
   * warning banner on a page, while matching the height of each.
   */
  bannerHeight?: number;

  /**
   * Applies a `data-testid` to the rendered DOM for use in testing.
   */
  testId?: string;
};
/* eslint-enable jsdoc/require-asterisk-prefix */
