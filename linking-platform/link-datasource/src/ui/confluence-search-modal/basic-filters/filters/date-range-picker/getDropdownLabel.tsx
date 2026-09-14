import { type IntlShape } from 'react-intl';

import { type DateRangeType } from '../../../../common/modal/popup-select/types';

import { dateRangeMessages } from './messages';

export const getDropdownLabel = (
	option: DateRangeType | undefined = 'anyTime',
	formatMessage: IntlShape['formatMessage'],
): string => {
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
