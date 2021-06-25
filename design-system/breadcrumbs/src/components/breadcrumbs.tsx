/** @jsx jsx */
import React, { forwardRef, memo, useMemo, useState } from 'react';

import { jsx } from '@emotion/core';

import {
  UIAnalyticsEvent,
  usePlatformLeafEventHandler,
} from '@atlaskit/analytics-next';
import GlobalTheme from '@atlaskit/theme/components';
import { GlobalThemeTokens, ThemeModes } from '@atlaskit/theme/types';

import { getStyles } from '../internal/styles';
import { BreadcrumbsProps } from '../types';

import EllipsisItem from './ellipsis-item';

const defaultMaxItems = 8;
const defaultBreadcrumbsLabel = 'Breadcrumbs';
const defaultEllipsisLabel = 'Show more breadcrumbs';

const { toArray } = React.Children;

interface ThemedBreadcrumbsProps extends BreadcrumbsProps {
  mode: ThemeModes;
}

const analyticsAttributes = {
  componentName: 'breadcrumbs',
  packageName: process.env._PACKAGE_NAME_ as string,
  packageVersion: process.env._PACKAGE_VERSION_ as string,
};

const noop = () => {};

const InnerBreadcrumbs = forwardRef(
  (props: ThemedBreadcrumbsProps, ref: React.Ref<any>) => {
    const {
      defaultExpanded = false,
      isExpanded,
      maxItems = defaultMaxItems,
      itemsBeforeCollapse = 1,
      itemsAfterCollapse = 1,
      children = [],
      testId,
      onExpand: providedExpanse = noop,
      analyticsContext,
      mode = 'light',
      label = defaultBreadcrumbsLabel,
      ellipsisLabel = defaultEllipsisLabel,
    } = props;

    const [expanded, setExpanse] = useState(defaultExpanded);
    const isControlled = typeof isExpanded !== 'undefined';
    const handleExpansion = usePlatformLeafEventHandler({
      fn: (
        event: React.MouseEvent<Element>,
        analyticsEvent: UIAnalyticsEvent,
      ) => {
        if (!isControlled) {
          setExpanse((expanded) => !expanded);
        }
        return providedExpanse(event, analyticsEvent);
      },
      action: 'expanded',
      analyticsData: analyticsContext,
      ...analyticsAttributes,
    });

    const shouldExpand = isControlled ? isExpanded : expanded;
    const renderItemsWithEllipsis = () => {
      const allItems = childrenArray;
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
          key="ellipsis"
          testId={testId && `${testId}--breadcrumb-ellipsis`}
          onClick={handleExpansion}
          label={ellipsisLabel}
        />,
        ...afterItems,
      ];
    };

    const breadcrumbStyles = useMemo(() => getStyles(mode), [mode]);
    const childrenArray = toArray(children);
    const shouldDisplayItems =
      shouldExpand || (maxItems && childrenArray.length <= maxItems);

    return (
      <nav aria-label={label} ref={ref}>
        <ol data-testid={testId} css={breadcrumbStyles}>
          {shouldDisplayItems ? children : renderItemsWithEllipsis()}
        </ol>
      </nav>
    );
  },
);

const Breadcrumbs = memo(
  forwardRef((props: BreadcrumbsProps, ref: React.Ref<any>) => {
    return (
      <GlobalTheme.Consumer>
        {(tokens: GlobalThemeTokens) => {
          return <InnerBreadcrumbs {...props} mode={tokens.mode} ref={ref} />;
        }}
      </GlobalTheme.Consumer>
    );
  }),
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Breadcrumbs;
