import React from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';
import EllipsisItem from './EllipsisItem';
import Container from '../styled/BreadcrumbsContainer';

const defaultMaxItems = 8;

const { toArray } = React.Children;

export interface BreadcrumbsStatelessProps extends WithAnalyticsEventsProps {
  /** Override collapsing of the nav when there are more than maxItems */
  isExpanded?: boolean;
  /** Set the maximum number of breadcrumbs to display. When there are more
  than the maximum number, only the first and last will be shown, with an
  ellipsis in between. */
  maxItems?: number;
  /** The items to be included inside the Breadcrumbs wrapper */
  children?: React.ReactNode;
  /** A function to be called when you are in the collapsed view and click
   the ellipsis. */
  onExpand?: (event: React.MouseEvent) => any;
  /** If max items is exceeded, the number of items to show before the ellipsis */
  itemsBeforeCollapse?: number;
  /** If max items is exceeded, the number of items to show after the ellipsis */
  itemsAfterCollapse?: number;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
  In case of `testId` passed through EllipsisItem, the element will be identified like this: 'testId && `${testId}--breadcrumb-ellipsis'.
  This can be used to click the elements when they are collapsed. */
  testId?: string;
}

class BreadcrumbsStateless extends React.Component<
  BreadcrumbsStatelessProps,
  {}
> {
  static defaultProps = {
    isExpanded: false,
    maxItems: defaultMaxItems,
    itemsBeforeCollapse: 1,
    itemsAfterCollapse: 1,
  };

  renderAllItems(): Array<React.ReactNode> {
    const allNonEmptyItems = toArray(this.props.children);
    return allNonEmptyItems.map((child, index) =>
      React.cloneElement(child as React.ReactElement, {
        hasSeparator: index < allNonEmptyItems.length - 1,
      }),
    );
  }

  renderItemsBeforeAndAfter() {
    const { itemsBeforeCollapse, itemsAfterCollapse, testId } = this.props;

    // Not a chance this will trigger, but TS is complaining about items* possibly being undefined.
    if (itemsBeforeCollapse === undefined || itemsAfterCollapse === undefined) {
      return;
    }

    const allItems = this.renderAllItems();
    // This defends against someone passing weird data, to ensure that if all
    // items would be shown anyway, we just show all items without the EllipsisItem
    if (itemsBeforeCollapse + itemsAfterCollapse >= allItems.length) {
      return allItems;
    }

    const beforeItems = allItems.slice(0, itemsBeforeCollapse);
    const afterItems = allItems.slice(
      allItems.length - itemsAfterCollapse,
      allItems.length,
    );

    return [
      ...beforeItems,
      <EllipsisItem
        hasSeparator={itemsAfterCollapse > 0}
        key="ellipsis"
        testId={testId && `${testId}--breadcrumb-ellipsis`}
        onClick={this.props.onExpand}
      />,
      ...afterItems,
    ];
  }

  render() {
    const { children, isExpanded, maxItems, testId } = this.props;
    if (!children) return <Container />;
    return (
      <Container data-testid={testId}>
        {isExpanded || (maxItems && toArray(children).length <= maxItems)
          ? this.renderAllItems()
          : this.renderItemsBeforeAndAfter()}
      </Container>
    );
  }
}

export { BreadcrumbsStateless as BreadcrumbsStatelessWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'breadcrumbs',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onExpand: createAndFireEventOnAtlaskit({
      action: 'expanded',
      actionSubject: 'breadcrumbs',

      attributes: {
        componentName: 'breadcrumbs',
        packageName,
        packageVersion,
      },
    }),
  })(BreadcrumbsStateless),
);
