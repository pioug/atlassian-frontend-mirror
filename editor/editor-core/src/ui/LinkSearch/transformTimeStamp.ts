import { IntlShape } from 'react-intl-next';
import formatDistance from 'date-fns/formatDistance';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import format from 'date-fns/format';
import messages from '../../messages';

const renderAbsoluteOrRelativeDate = (
  timeStamp: Date,
  pageAction: 'updated' | 'viewed',
  intl: IntlShape,
) => {
  let pageActionText: string = '';
  switch (pageAction) {
    case 'updated':
      pageActionText = intl.formatMessage(messages.timeUpdated);
      break;
    case 'viewed':
      pageActionText = intl.formatMessage(messages.timeViewed);
      break;
  }

  if (differenceInCalendarDays(timeStamp, Date.now()) < -7) {
    return {
      pageAction: pageActionText,
      dateString: format(timeStamp, 'MMMM dd, yyyy'),
    };
  }
  return {
    pageAction: pageActionText,
    dateString: formatDistance(timeStamp, Date.now()),
    timeSince: intl.formatMessage(messages.timeAgo),
  };
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
