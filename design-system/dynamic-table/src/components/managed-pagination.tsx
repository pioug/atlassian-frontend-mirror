import React from 'react';

import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import Pagination from '@atlaskit/pagination';

import type { I18nShape } from '../types';

interface ManagedPaginationProps {
  value?: number;
  onChange: (newValue: any, analyticsEvent?: UIAnalyticsEvent) => void;
  total: number;
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  i18n?: I18nShape;
  testId?: string;
  isDisabled?: boolean;
}

export default class ManagedPagination extends React.Component<ManagedPaginationProps> {
  onChange = (
    _event: any,
    newValue: any,
    analyticsEvent?: UIAnalyticsEvent,
  ) => {
    this.props.onChange(newValue, analyticsEvent);
  };

  render() {
    const { total, value = 1, i18n, testId, isDisabled } = this.props;
    const pages = [...Array(total)].map((_, index) => index + 1);
    // Pagination accepts array now thus selectedIndex starts with 0
    // So, we are substracting value by one thus not breaking dynamic table
    const selectedIndex = value - 1;
    return (
      <Pagination
        selectedIndex={selectedIndex}
        isDisabled={isDisabled}
        label={i18n?.label}
        nextLabel={i18n?.next}
        previousLabel={i18n?.prev}
        pageLabel={i18n?.pageLabel}
        onChange={this.onChange}
        pages={pages}
        testId={testId && `${testId}--pagination`}
      />
    );
  }
}
