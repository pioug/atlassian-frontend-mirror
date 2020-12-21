/** @jsx jsx */
import React, { useMemo } from 'react';

import { jsx } from '@emotion/core';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import { ThemeModes } from '@atlaskit/theme/types';

import { getStyles } from '../internal/styles';
import { BreadcrumbsStatelessProps } from '../types';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';

import EllipsisItem from './EllipsisItem';

const defaultMaxItems = 8;

const { toArray } = React.Children;

interface BreadcrumbsInternalProps extends BreadcrumbsStatelessProps {
  /** mode: used for global theming API */
  mode?: ThemeModes;
}

const analyticsAttributes = {
  componentName: 'breadcrumbs',
  packageName,
  packageVersion,
};

const noop = () => {};

const BreadcrumbsStateless = (props: BreadcrumbsInternalProps) => {
  const {
    isExpanded = false,
    maxItems = defaultMaxItems,
    itemsBeforeCollapse = 1,
    itemsAfterCollapse = 1,
    mode = 'light',
    children = [],
    testId,
    onExpand: onExpandProvided = noop,
    analyticsContext,
  } = props;

  const handleExpand = usePlatformLeafEventHandler({
    fn: onExpandProvided,
    action: 'expanded',
    analyticsData: analyticsContext,
    ...analyticsAttributes,
  });

  const renderAllItems = () => {
    const allNonEmptyItems = toArray(children);
    return allNonEmptyItems.map((child, index) =>
      React.cloneElement(child as React.ReactElement, {
        hasSeparator: index < allNonEmptyItems.length - 1,
      }),
    );
  };

  const renderItemsBeforeAndAfter = () => {
    // Not a chance this will trigger, but TS is complaining about items* possibly being undefined.
    if (itemsBeforeCollapse === undefined || itemsAfterCollapse === undefined) {
      return;
    }

    const allItems = renderAllItems();
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
        onClick={handleExpand}
      />,
      ...afterItems,
    ];
  };

  const breadcrumbStyles = useMemo(() => getStyles(mode), [mode]);

  return (
    <div data-testid={testId} css={breadcrumbStyles}>
      {isExpanded || (maxItems && toArray(children).length <= maxItems)
        ? renderAllItems()
        : renderItemsBeforeAndAfter()}
    </div>
  );
};

export default BreadcrumbsStateless;
