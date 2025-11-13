import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
	quarterRange: {
		id: 'linkDataSource.issueLikeTable.renderType.dateRange.quarterRange',
		description: 'The formatted date range for a quarter range',
		defaultMessage: '{startMonth}-{endMonth}, {year}',
	},
	quarterRangeOverYears: {
		id: 'linkDataSource.issueLikeTable.renderType.dateRange.quarterRangeOverYears',
		description: 'The formatted date range for a quarter range that spans across multiple years',
		defaultMessage: '{startMonth}-{endMonth}, {startYear}-{endYear}',
	},
	fullRange: {
		id: 'linkDataSource.issueLikeTable.renderType.dateRange.fullRange',
		description: 'The formatted date range for a full range (day, month, quarter, or full)',
		defaultMessage: '{start} - {end}',
	},
});
