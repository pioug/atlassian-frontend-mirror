import React, { forwardRef, memo, type SyntheticEvent } from 'react';

import {
  type UIAnalyticsEvent,
  usePlatformLeafEventHandler,
} from '@atlaskit/analytics-next';
import noop from '@atlaskit/ds-lib/noop';
import useControlled from '@atlaskit/ds-lib/use-controlled';
import ChevronLeftLargeIcon from '@atlaskit/icon/glyph/chevron-left-large';
import ChevronRightLargeIcon from '@atlaskit/icon/glyph/chevron-right-large';
import { Box, Inline, xcss } from '@atlaskit/primitives';

import Navigator from './internal/components/navigator';
import PageComponent from './internal/components/page';
import renderDefaultEllipsis from './internal/components/render-ellipsis';
import { emptyObject } from './internal/constants';
import collapseRange from './internal/utils/collapse-range';
import { type PaginationPropTypes } from './types';

const analyticsAttributes = {
  componentName: 'pagination',
  packageName: process.env._PACKAGE_NAME_ as string,
  packageVersion: process.env._PACKAGE_VERSION_ as string,
};

interface OnChangeData {
  event: SyntheticEvent;
  selectedPageIndex: number;
}

const paginationMenuStyles = xcss({
  padding: 'space.0',
  margin: 'space.0',
});

const paginationMenuItemStyles = xcss({
  marginBlockStart: 'space.0',
});

function InnerPagination<T extends React.ReactNode>(
  {
    components = emptyObject,
    defaultSelectedIndex = 0,
    selectedIndex,
    label = 'pagination',
    pageLabel = 'page',
    previousLabel = 'previous',
    nextLabel = 'next',
    style = emptyObject,
    max = 7,
    onChange = noop,
    pages,
    getPageLabel,
    renderEllipsis = renderDefaultEllipsis,
    analyticsContext,
    testId,
    isDisabled,
  }: PaginationPropTypes<T>,
  ref: React.Ref<HTMLDivElement>,
) {
  const [selectedIndexValue, setSelectedIndexValue] = useControlled(
    selectedIndex,
    () => defaultSelectedIndex || 0,
  );

  const onChangeWithAnalytics = usePlatformLeafEventHandler<OnChangeData>({
    fn: (value: OnChangeData, analyticsEvent: UIAnalyticsEvent) => {
      const { event, selectedPageIndex } = value;
      if (selectedIndex === undefined) {
        setSelectedIndexValue(selectedPageIndex);
      }
      if (onChange) {
        onChange(event, pages[selectedPageIndex], analyticsEvent);
      }
    },
    action: 'changed',
    actionSubject: 'pageNumber',
    analyticsData: analyticsContext,
    ...analyticsAttributes,
  });

  const transform = (page: T, currPageIndex: number, testId?: string) => {
    const selectedPage = pages[selectedIndexValue];
    const pageIndexLabel = `${pageLabel} ${
      getPageLabel ? getPageLabel(page, currPageIndex) : page
    }`;
    const isCurrentPage = page === selectedPage;

    return (
      <Inline
        as="li"
        xcss={paginationMenuItemStyles}
        key={`page-${
          getPageLabel ? getPageLabel(page, currPageIndex) : currPageIndex
        }`}
      >
        <PageComponent
          component={components!.Page}
          onClick={(event) =>
            onChangeWithAnalytics({ event, selectedPageIndex: currPageIndex })
          }
          aria-current={isCurrentPage ? 'page' : undefined}
          aria-label={pageIndexLabel}
          isSelected={isCurrentPage}
          isDisabled={isDisabled}
          page={page}
          testId={
            testId &&
            `${testId}--${isCurrentPage ? 'current-' : ''}page-${currPageIndex}`
          }
        >
          {getPageLabel ? getPageLabel(page, currPageIndex) : page}
        </PageComponent>
      </Inline>
    );
  };

  return (
    <Box testId={testId} style={style} ref={ref} aria-label={label} as="nav">
      <Inline space="space.0" alignBlock="center">
        <Navigator
          key="left-navigator"
          component={components!.Previous}
          onClick={(event: SyntheticEvent) =>
            onChangeWithAnalytics({
              event,
              selectedPageIndex: selectedIndexValue - 1,
            })
          }
          isDisabled={isDisabled || selectedIndexValue === 0}
          iconBefore={<ChevronLeftLargeIcon label="" />}
          aria-label={previousLabel}
          testId={testId && `${testId}--left-navigator`}
        />
        <Inline
          space="space.0"
          alignBlock="baseline"
          as="ul"
          xcss={paginationMenuStyles}
        >
          {collapseRange(
            pages,
            selectedIndexValue,
            {
              max: max!,
              ellipsis: renderEllipsis!,
              transform,
            },
            testId,
          )}
        </Inline>
        <Navigator
          key="right-navigator"
          component={components!.Next}
          onClick={(event: SyntheticEvent) =>
            onChangeWithAnalytics({
              event,
              selectedPageIndex: selectedIndexValue + 1,
            })
          }
          isDisabled={isDisabled || selectedIndexValue === pages.length - 1}
          iconBefore={<ChevronRightLargeIcon label="" />}
          aria-label={nextLabel}
          testId={testId && `${testId}--right-navigator`}
        />
      </Inline>
    </Box>
  );
}

const Pagination = forwardRef(InnerPagination);

export default memo(Pagination) as typeof InnerPagination;
