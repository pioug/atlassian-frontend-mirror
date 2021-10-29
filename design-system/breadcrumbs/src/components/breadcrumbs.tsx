/** @jsx jsx */
import React, { forwardRef, memo, useMemo, useRef, useState } from 'react';

import { jsx } from '@emotion/core';

import {
  UIAnalyticsEvent,
  usePlatformLeafEventHandler,
} from '@atlaskit/analytics-next';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import GlobalTheme from '@atlaskit/theme/components';
import { GlobalThemeTokens, ThemeModes } from '@atlaskit/theme/types';

import { getStyles } from '../internal/styles';
import { BreadcrumbsProps } from '../types';

import EllipsisItem from './ellipsis-item';
import { useOnRevealed } from './internal/use-on-revealed';

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

const interactiveElementSelector = 'a, button, [tabindex]:not([tabindex="-1"])';

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
    const [isClickedBySpace, setExpansionTrigger] = useState(false);
    const wrapperRef = useRef<HTMLElement>(null);

    const isControlled = typeof isExpanded !== 'undefined';
    const isExpansionHandled = providedExpanse !== noop;
    const shouldExpand = isControlled ? isExpanded : expanded;

    const focusFirstRevealed = () => {
      if (wrapperRef.current) {
        const listItems = [...wrapperRef.current.querySelectorAll('li')];
        const interactiveElements = listItems.map((li) =>
          li.querySelector<HTMLElement>(interactiveElementSelector),
        );

        const elementToFocus = interactiveElements[itemsBeforeCollapse];
        const firstInteractiveElement = interactiveElements[0];

        if (elementToFocus) {
          elementToFocus.focus && elementToFocus.focus();
        } else if (firstInteractiveElement) {
          firstInteractiveElement.focus && firstInteractiveElement.focus();
        } else {
          wrapperRef.current.focus();
        }
      }
      setExpansionTrigger(false);
    };

    useOnRevealed(focusFirstRevealed, {
      isExpanded: shouldExpand!,
      isDisabled: !isClickedBySpace,
    });

    const handleExpansion = usePlatformLeafEventHandler({
      fn: (
        event: React.MouseEvent<Element>,
        analyticsEvent: UIAnalyticsEvent,
      ) => {
        if (!isControlled) {
          setExpanse((expanded) => !expanded);
        }

        if ((isExpansionHandled && isControlled) || !isControlled) {
          setExpansionTrigger(event.target === document.activeElement);
        }

        return providedExpanse(event, analyticsEvent);
      },
      action: 'expanded',
      analyticsData: analyticsContext,
      ...analyticsAttributes,
    });

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

    const breadcrumbsItems = shouldDisplayItems
      ? childrenArray
      : renderItemsWithEllipsis();

    return (
      <nav aria-label={label} ref={mergeRefs([ref, wrapperRef])} tabIndex={-1}>
        <ol data-testid={testId} css={breadcrumbStyles}>
          {breadcrumbsItems}
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
