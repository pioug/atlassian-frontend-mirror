import React from 'react';

import {
  UIAnalyticsEvent,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';

export interface BreadcrumbsProps extends WithAnalyticsEventsProps {
  // eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
  defaultExpanded?: boolean;
  /**
   * Override collapsing of the nav when there are more than maxItems
   */
  isExpanded?: boolean;
  /**
   * Set the maximum number of breadcrumbs to display. When there are more
   * than the maximum number, only the first and last will be shown, with an
   * ellipsis in between.
   */
  maxItems?: number;
  /**
   * The items to be included inside the Breadcrumbs wrapper
   */
  children?: React.ReactNode;
  /**
   * A function to be called when you are in the collapsed view and click the ellipsis.
   */
  onExpand?: (
    event: React.MouseEvent,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
  /**
   * If max items is exceeded, the number of items to show before the ellipsis
   */
  itemsBeforeCollapse?: number;
  /**
   * If max items is exceeded, the number of items to show after the ellipsis
   */
  itemsAfterCollapse?: number;

  /**
   * Additional information to be included in the `context` of analytics events
   */
  analyticsContext?: Record<string, any>;

  /**
   * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
   */
  testId?: string;

  /**
   * Text to be used as label of navigation region that wraps the breadcrumbs
   */
  label?: string;

  /**
   * Text to be used as label of ellipsis button
   */
  ellipsisLabel?: string;
}

export interface EllipsisItemProps {
  onClick?: (event: React.MouseEvent<Element>) => void;
  /**
   * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
   */
  testId?: string;
  /**
   * A `label` prop is used as aria-label for ellipsis button
   */
  label: string;
}

export interface BreadcrumbsItemProps extends WithAnalyticsEventsProps {
  /**
   * The url or path which the breadcrumb should act as a link to.
   */
  href?: string;
  /**
   * An icon to display before the breadcrumb.
   */
  iconBefore?: React.ReactChild;
  /**
   * An icon to display after the breadcrumb.
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
   * Provide a custom component to use instead of the default button.
   *  The custom component should accept a className prop so it can be styled
   *  and possibly all action handlers
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  component?: React.ClassType<any, any, any>;

  /**
   * Additional information to be included in the `context` of analytics events
   */
  analyticsContext?: Record<string, any>;

  /**
   * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
   * In case of `testId` passed through EllipsisItem, the element will be identified like this: 'testId && `${testId}--breadcrumb-ellipsis'.
   * This can be used to click the elements when they are collapsed.
   */
  testId?: string;
}
