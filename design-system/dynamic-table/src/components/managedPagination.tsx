import React from 'react';
import Pagination from '@atlaskit/pagination';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

interface Props {
  value?: number;
  onChange: (newValue: any, analyticsEvent?: UIAnalyticsEvent) => void;
  total: number;
  i18n?: {
    next: string;
    prev: string;
  };
}

export default class ManagedPagination extends React.Component<Props> {
  onChange = (
    _event: any,
    newValue: any,
    analyticsEvent?: UIAnalyticsEvent,
  ) => {
    this.props.onChange(newValue, analyticsEvent);
  };

  render() {
    const { total, value = 1, i18n } = this.props;
    const pages = [...Array(total)].map((_, index) => index + 1);
    // Pagination accepts array now thus selectedIndex starts with 0
    // So, we are substracting value by one thus not breaking dynamic table
    const selectedIndex = value - 1;
    return (
      <Pagination
        selectedIndex={selectedIndex}
        i18n={i18n}
        onChange={this.onChange}
        pages={pages}
      />
    );
  }
}
