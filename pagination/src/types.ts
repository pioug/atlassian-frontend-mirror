import { ReactElement, SyntheticEvent } from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

export interface PaginationPropTypes {
  /** Custom collapse range function */
  collapseRange?: (
    pages: ReactElement<any>[],
    selectedIndex: number,
    arg: { max: number; ellipsis: (arg: { key: string }) => ReactElement<any> },
  ) => ReactElement<any>[];
  /** This prop should not be accessed under any circumstances. It is
   provided by @atlaskit/analytics-next. */
  createAnalyticsEvent?: any;
  /** Replace the built-in Page, Previous, Next and/ or Ellipsis component */
  components?: {
    Page?: React.ElementType<any>;
    Previous?: React.ElementType<any>;
    Next?: React.ElementType<any>;
  };
  /** Index of the page to be selected by default */
  defaultSelectedIndex?: number;
  /** Helper function to get text displayed on the page button. It is helpful in scenarios when page the page passed in is an object  */
  getPageLabel?: (page: any, pageIndex: number) => number | string;
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
    event: SyntheticEvent<any>,
    page: any,
    analyticsEvent?: UIAnalyticsEvent,
  ) => void;
  /** Array of the pages to display */
  pages: any[];
  /** Index of the selected page. This will make this pagination controlled */
  selectedIndex?: number;
  /** The react Node returned from the function is rendered instead of the default ellipsis node */
  renderEllipsis?: (arg: { key: string }) => ReactElement;
}
