/** @jsx jsx */
import React from 'react';
import { useIntl, FormattedMessage, MessageDescriptor } from 'react-intl-next';
import { css, jsx } from '@emotion/core';

import { DateTimeProps, DateTimeType } from './types';
import { getTruncateStyles } from '../../utils';
import { tokens } from '../../../../../utils/token';
import { selectUnit } from '@formatjs/intl-utils';
import { messages } from '../../../../../messages';

const styles = css`
  color: ${tokens.text};
  font-size: 0.75rem;
  line-height: 1rem;
  ${getTruncateStyles(1)}
`;

type DateTypeVariation = 'relative' | 'absolute';

const typeToDescriptorMap: Record<
  DateTimeType,
  Record<DateTypeVariation, MessageDescriptor>
> = {
  created: {
    relative: messages.created_on_relative,
    absolute: messages.created_on_absolute,
  },
  modified: {
    relative: messages.modified_on_relative,
    absolute: messages.modified_on_absolute,
  },
};

/**
 * A base element that displays an ISO Timestamp in text.
 * @internal
 * @param {DateTimeProps} DateTimeProps - The props necessary for the DateTime element.
 * @see CreatedOn
 * @see ModifiedOn
 */
const DateTime: React.FC<DateTimeProps> = ({
  date,
  name,
  overrideCss,
  type,
  testId = 'smart-element-date-time',
  text,
}) => {
  const { formatRelativeTime, formatDate } = useIntl();
  if (!type || !date) {
    return null;
  }
  const isLongerThenWeek =
    Math.abs(date.getTime() - Date.now()) > 1000 * 60 * 60 * 24 * 7;
  let context: string;
  let typeVariant: DateTypeVariation;
  if (isLongerThenWeek) {
    typeVariant = 'absolute';
    context = formatDate(date, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } else {
    const { value, unit } = selectUnit(date, Date.now());
    typeVariant = 'relative';
    context = formatRelativeTime(value, unit, {
      numeric: 'auto',
    });
  }

  return (
    <span
      css={[styles, overrideCss]}
      data-separator
      data-smart-element={name}
      data-smart-element-date-time
      data-testid={testId}
    >
      {text ? (
        `${text} ${context}`
      ) : (
        <FormattedMessage
          {...typeToDescriptorMap[type][typeVariant]}
          values={{ context }}
        />
      )}
    </span>
  );
};

export default DateTime;
