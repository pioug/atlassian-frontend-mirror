import React from 'react';

import { FormatDateOptions, useIntl } from 'react-intl-next';

import { DateTimeType, DateType, TimeType } from '@atlaskit/linking-types';

export interface DateProps {
  testId?: string;
  value: (DateType | TimeType | DateTimeType)['value'];
  display: (DateType | TimeType | DateTimeType)['type'];
}

export const DATETIME_TYPE_TEST_ID = 'link-datasource-render-type--datetime';

const dateOptions: FormatDateOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
};

const timeOptions: FormatDateOptions = {
  hour12: false,
  hour: '2-digit',
  minute: '2-digit',
};

const DateTimeRenderType = ({
  value,
  testId = DATETIME_TYPE_TEST_ID,
  display = 'datetime',
}: DateProps) => {
  const dateString = value?.value;

  const date = new Date(dateString);
  const intl = useIntl();

  if (!dateString || isNaN(date.getTime())) {
    return <></>;
  }

  const options: Record<typeof display, FormatDateOptions> = {
    date: dateOptions,
    time: timeOptions,
    datetime: { ...dateOptions, ...timeOptions },
  };

  const formattedString = intl.formatDate(
    date,
    options[display] || options['date'],
  );

  return <span data-testid={testId}>{formattedString}</span>;
};

export default DateTimeRenderType;
