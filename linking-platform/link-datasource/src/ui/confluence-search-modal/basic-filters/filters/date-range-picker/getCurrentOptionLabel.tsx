import { type IntlShape } from 'react-intl';

import { type DateRangeType } from '../../../../common/modal/popup-select/types';
import { getFormattedDate } from '../../../../issue-like-table/render-type/date-time/getFormattedDate';

import { getDropdownLabel } from './getDropdownLabel';
import { dateRangeMessages } from './messages';

export const getCurrentOptionLabel = (
	formatDate: IntlShape['formatDate'],
	formatMessage: IntlShape['formatMessage'],
	value?: DateRangeType,
	to?: string,
	from?: string,
): string => {
	const selectedOption = value;
	if (selectedOption === 'custom') {
		const hasFromDate = !!from;
		const hasToDate = !!to;

		const formattedFromDate = getFormattedDate(from || '', 'date', formatDate);

		const formattedToDate = getFormattedDate(to || '', 'date', formatDate);

		if (hasFromDate && !hasToDate) {
			return formatMessage(dateRangeMessages.dateRangeAfterLabel, {
				date: formattedFromDate,
			});
		}

		if (!hasFromDate && hasToDate) {
			return formatMessage(dateRangeMessages.dateRangeBeforeLabel, {
				date: formattedToDate,
			});
		}

		if (hasFromDate && hasToDate) {
			return `${formattedFromDate} - ${formattedToDate}`;
		}
	}

	return getDropdownLabel(selectedOption, formatMessage);
};
