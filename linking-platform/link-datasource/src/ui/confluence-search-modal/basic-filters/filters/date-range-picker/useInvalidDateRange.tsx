import React, { useMemo } from 'react';

import { FormattedMessage } from 'react-intl';

import { dateRangeMessages } from './messages';

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
