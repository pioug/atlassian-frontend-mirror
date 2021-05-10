import React, { forwardRef, memo, SyntheticEvent } from 'react';

import {
  UIAnalyticsEvent,
  usePlatformLeafEventHandler,
} from '@atlaskit/analytics-next';
import noop from '@atlaskit/ds-lib/noop';
import useControlled from '@atlaskit/ds-lib/use-controlled';
import ChevronLeftLargeIcon from '@atlaskit/icon/glyph/chevron-left-large';
import ChevronRightLargeIcon from '@atlaskit/icon/glyph/chevron-right-large';

import Navigator from './internal/components/navigator';
import PageComponent from './internal/components/page';
import renderDefaultEllipsis from './internal/components/render-ellipsis';
import { emptyObject } from './internal/constants';
import collapseRangeHelper from './internal/utils/collapse-range';
import { PaginationPropTypes } from './types';

const analyticsAttributes = {
  componentName: 'pagination',
  packageName: process.env._PACKAGE_NAME_ as string,
  packageVersion: process.env._PACKAGE_VERSION_ as string,
};

interface OnChangeData {
  event: SyntheticEvent;
  selectedPageIndex: number;
}

function InnerPagination<T>(
  {
    collapseRange = collapseRangeHelper,
    components = emptyObject,
    defaultSelectedIndex = 0,
    selectedIndex,
    i18n = {
      prev: 'previous',
      next: 'next',
    },
    innerStyles = emptyObject,
    max = 7,
    onChange = noop,
    pages,
    getPageLabel,
    renderEllipsis = renderDefaultEllipsis,
    analyticsContext,
    testId,
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

  const pagesToComponents = (pages: Array<T>) => {
    return pages.map((page, index) => {
      return (
        <PageComponent
          key={`page-${getPageLabel ? getPageLabel(page, index) : index}`}
          component={components!.Page}
          onClick={event =>
            onChangeWithAnalytics({ event, selectedPageIndex: index })
          }
          isSelected={selectedIndexValue === index}
          page={page}
        >
          {getPageLabel ? getPageLabel(page, index) : page}
        </PageComponent>
      );
    });
  };

  return (
    <div
      data-testid={testId}
      style={{ display: 'flex', ...innerStyles }}
      ref={ref}
    >
      <Navigator
        key="left-navigator"
        component={components!.Previous}
        onClick={(event: SyntheticEvent) =>
          onChangeWithAnalytics({
            event,
            selectedPageIndex: selectedIndexValue - 1,
          })
        }
        isDisabled={selectedIndexValue === 0}
        iconBefore={<ChevronLeftLargeIcon label="" />}
        aria-label={i18n.prev}
        pages={pages}
      />
      {collapseRange(pagesToComponents(pages), selectedIndexValue, {
        max: max!,
        ellipsis: renderEllipsis!,
      })}
      <Navigator
        key="right-navigator"
        component={components!.Next}
        onClick={(event: SyntheticEvent) =>
          onChangeWithAnalytics({
            event,
            selectedPageIndex: selectedIndexValue + 1,
          })
        }
        isDisabled={selectedIndexValue === pages.length - 1}
        iconBefore={<ChevronRightLargeIcon label="" />}
        aria-label={i18n!.next}
        pages={pages}
      />
    </div>
  );
}

const Pagination = forwardRef(InnerPagination);

export default memo(Pagination) as typeof InnerPagination;
