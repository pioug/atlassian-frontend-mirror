import isYesterday from 'date-fns/isYesterday';
import { type IntlShape } from 'react-intl-next';

import { isMoreThanOneWeekAgo } from '../../common/utils/date';
import { selectUnit } from '../../common/utils/dateUtils';

import { timeMessages } from './messages';

const formatTime = (timeStamp: Date, intl: IntlShape): string => {
  const isAbsolute = isMoreThanOneWeekAgo(timeStamp);

  if (isAbsolute) {
    return intl.formatDate(timeStamp, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  const { value, unit } = selectUnit(timeStamp, new Date(), {
    day: 7, // treat a week as 7 days (default is 5)
  });
  //formats as 'yesterday' instead of '1 day ago'
  if (isYesterday(timeStamp)) {
    return intl.formatRelativeTime(value, unit, { numeric: 'auto' });
  }
  return intl.formatRelativeTime(value, unit);
};

const renderAbsoluteOrRelativeDate = (
  timeStamp: Date,
  pageAction: 'updated' | 'viewed',
  intl: IntlShape,
): string => {
  return intl.formatMessage(timeMessages[pageAction], {
    time: formatTime(timeStamp, intl),
  });
};

export const transformTimeStamp = (
  intl: IntlShape,
  lastViewedDate?: Date,
  lastUpdatedDate?: Date,
) => {
  if (lastViewedDate) {
    return renderAbsoluteOrRelativeDate(lastViewedDate, 'viewed', intl);
  }
  if (lastUpdatedDate) {
    return renderAbsoluteOrRelativeDate(lastUpdatedDate, 'updated', intl);
  }
};
