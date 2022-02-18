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

const typeToDescriptorMap: Record<DateTimeType, MessageDescriptor> = {
  created: messages.created_on,
  modified: messages.modified_on,
};

const DateTime: React.FC<DateTimeProps> = ({
  date,
  type,
  testId = 'smart-element-date-time',
}) => {
  const { formatRelativeTime } = useIntl();
  if (!type || !date) {
    return null;
  }
  const { value, unit } = selectUnit(date, Date.now());

  const context = formatRelativeTime(value, unit, {
    numeric: 'auto',
  });

  return (
    <span css={styles} data-smart-element-date-time data-testid={testId}>
      <FormattedMessage {...typeToDescriptorMap[type]} values={{ context }} />
    </span>
  );
};

export default DateTime;