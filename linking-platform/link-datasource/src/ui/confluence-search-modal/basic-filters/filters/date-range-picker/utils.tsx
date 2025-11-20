import React, { useMemo } from 'react';

import { FormattedMessage, type IntlShape } from 'react-intl-next';

import { getFormattedDate } from '../../../../../ui/issue-like-table/render-type/date-time';
import { type DateRangeType } from '../../../../common/modal/popup-select/types';

import { dateRangeMessages } from './messages';

export const getDropdownLabel = (
	option: DateRangeType = 'anyTime',
	formatMessage: IntlShape['formatMessage'],
) => {
	const mapping: {
		[key in DateRangeType]: keyof typeof dateRangeMessages;
	} = {
		anyTime: 'dateRangeAnyTime',
		today: 'dateRangeToday',
		yesterday: 'dateRangeYesterday',
		past7Days: 'dateRangeLastWeek',
		past30Days: 'dateRangeLastMonth',
		pastYear: 'dateRangeLastYear',
		custom: 'dateRangeCustom',
	};

	return formatMessage(dateRangeMessages[mapping[option]]);
};

export const getCurrentOptionLabel = (
	formatDate: IntlShape['formatDate'],
	formatMessage: IntlShape['formatMessage'],
	value?: DateRangeType,
	to?: string,
	from?: string,
) => {
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

export const useInvalidDateRange = (from?: string, to?: string): React.JSX.Element | null => {
	return useMemo(() => {
		if (!from && !to) {
			return null;
		}
		const dateFrom: Date = new Date(`${from}${from ? 'T00:00:00' : ''}`);
		const dateTo: Date = new Date(`${to}${to ? 'T00:00:00' : ''}`);
		const now: Date = new Date();
		if (dateFrom > now) {
			return <FormattedMessage {...dateRangeMessages.dateRangeCustomInvalidDateAfterToday} />;
		}
		if (dateFrom > dateTo) {
			return <FormattedMessage {...dateRangeMessages.dateRangeCustomInvalidDateAfterEnd} />;
		}
		if (dateTo > now) {
			return <FormattedMessage {...dateRangeMessages.dateRangeCustomInvalidToDateAfterToday} />;
		}
		return null;
	}, [from, to]);
};
