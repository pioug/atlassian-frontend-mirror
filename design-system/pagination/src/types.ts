import { ReactElement, SyntheticEvent } from 'react';

import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

export interface PaginationPropTypes<T = unknown> {
  /** Custom collapse range function */
  collapseRange?: (
    pages: ReactElement[],
    selectedIndex: number,
    arg: { max: number; ellipsis: (arg: { key: string }) => ReactElement },
  ) => ReactElement[];
  /** Replace the built-in Page, Previous, Next and/ or Ellipsis component */
  components?: {
    Page?: React.ElementType;
    Previous?: React.ElementType;
    Next?: React.ElementType;
  };
  /** Index of the page to be selected by default */
  defaultSelectedIndex?: number;
  /** Helper function to get text displayed on the page button. It is helpful in scenarios when page the page passed in is an object  */
  getPageLabel?: (page: T, pageIndex: number) => number | string;
  /** The aria-label for next and previous buttons */
  i18n?: {
    prev: string;
    next: string;
  };
  /** Styles to spread on the container element */
  innerStyles?: Object;
  /** Maximum number of pages to be displayed in the pagination */
  max?: number;
  /** The onChange handler which is called when the page is changed */
  onChange?: (
    event: SyntheticEvent,
    page: T,
    analyticsEvent?: UIAnalyticsEvent,
  ) => void;
  /** Array of the pages to display */
  pages: T[];
  /** Index of the selected page. This will make this pagination controlled */
  selectedIndex?: number;
  /** The react Node returned from the function is rendered instead of the default ellipsis node */
  renderEllipsis?: (arg: { key: string }) => ReactElement;
  /** Additional information to be included in the `context` of analytics events */
  analyticsContext?: Record<string, any>;
  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid`
   * in the rendered code, serving as a hook for automated tests
   * */
  testId?: string;
}
