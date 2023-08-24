import React from 'react';

import styled from '@emotion/styled';
import { FormatDateOptions, useIntl } from 'react-intl-next';

import { DateTimeType, DateType, TimeType } from '@atlaskit/linking-types';

import { FieldTextFontSize } from '../../styled';

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

const DateTimeWrapper = styled.span`
  font-size: ${FieldTextFontSize};
`;

const DateTimeRenderType = ({
  value,
  testId = DATETIME_TYPE_TEST_ID,
  display = 'datetime',
}: DateProps) => {
  const date = new Date(value);
  const intl = useIntl();

  if (!value || isNaN(date.getTime())) {
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

  return (
    <DateTimeWrapper data-testid={testId}>{formattedString}</DateTimeWrapper>
  );
};

export default DateTimeRenderType;
