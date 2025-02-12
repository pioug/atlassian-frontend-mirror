import { defineMessages } from 'react-intl-next';

export const dateRangeMessages = defineMessages({
	dateRangeTitle: {
		id: 'linkDataSource.confluence-search.configmodal.date.range.title',
		defaultMessage: 'Last updated',
		description: 'Filter by the date content was modified',
	},
	dateRangeAnyTime: {
		id: 'linkDataSource.confluence-search.configmodal.date.range.any.time',
		defaultMessage: 'Anytime',
		description: 'Option to show content from any time',
	},
	dateRangeToday: {
		id: 'linkDataSource.confluence-search.configmodal.date.range.today',
		defaultMessage: 'Today',
		description: 'Date range of content modified today',
	},
	dateRangeYesterday: {
		id: 'linkDataSource.confluence-search.configmodal.date.range.yesterday',
		defaultMessage: 'Yesterday',
		description: 'Date range of content modified yesterday',
	},
	dateRangeLastWeek: {
		id: 'linkDataSource.confluence-search.configmodal.date.range.last.week',
		defaultMessage: 'Past 7 days',
		description: 'Date range of content modified in the last 7 days',
	},
	dateRangeLastMonth: {
		id: 'linkDataSource.confluence-search.configmodal.date.range.last.month',
		defaultMessage: 'Past 30 days',
		description: 'Date range of content modified in the last 30 days',
	},
	dateRangeLastYear: {
		id: 'linkDataSource.confluence-search.configmodal.date.range.last.year',
		defaultMessage: 'Past year',
		description: 'Date range of content modified in the last 365 days',
	},
	dateRangeCustom: {
		id: 'linkDataSource.confluence-search.configmodal.date.range.custom',
		defaultMessage: 'Custom',
		description: 'Custom date range',
	},
	dateRangeFrom: {
		id: 'linkDataSource.confluence-search.configmodal.date.range.from',
		defaultMessage: 'From',
		description: 'Filter starting from a custom date',
	},
	dateRangeTo: {
		id: 'linkDataSource.confluence-search.configmodal.date.range.to',
		defaultMessage: 'To',
		description: 'Filter up to a custom date',
	},
	dateRangeDateInputPlaceholder: {
		id: 'linkDataSource.confluence-search.configmodal.date.range.input.placeholder',
		defaultMessage: 'Choose a date',
		description: 'Placeholder text for date input',
	},
	dateRangeCustomInvalidDateAfterToday: {
		id: 'linkDataSource.confluence-search.configmodal.date.range.custom.invalid.after.today',
		defaultMessage: 'The From date can’t be in the future',
		description: 'error displayed when a date range begins after the current date',
	},
	dateRangeCustomInvalidToDateAfterToday: {
		id: 'linkDataSource.confluence-search.configmodal.date.range.custom.invalid.to.after.today',
		defaultMessage: 'The To date can’t be in the future',
		description: 'error displayed when a date range ends after the current date',
	},
	dateRangeCustomInvalidDateAfterEnd: {
		id: 'linkDataSource.confluence-search.configmodal.date.range.custom.invalid.after.end',
		defaultMessage: 'The From date has to be before the To date',
		description: 'error displayed when a date range begins after the end date',
	},
	dateRangeToLabel: {
		id: 'linkDataSource.confluence-search.configmodal.date.range.to.Label',
		defaultMessage: 'to',
		description: "'to' in between from and to date pickers",
	},
	dateRangeUpdateButton: {
		id: 'linkDataSource.confluence-search.configmodal.date.range.update.button',
		defaultMessage: 'Update',
		description: 'Text for update button in date filter picker',
	},
	dateRangeBeforeLabel: {
		id: 'linkDataSource.confluence-search.configmodal.date.range.before.label',
		defaultMessage: 'before {date}',
		description: '`before date` for date picker dropdown',
	},
	dateRangeAfterLabel: {
		id: 'linkDataSource.confluence-search.configmodal.date.range.after.label',
		defaultMessage: 'after {date}',
		description: '`after date` for date picker dropdown',
	},
	dateRangeError: {
		id: 'linkDataSource.confluence-search.configmodal.date.range.error',
		defaultMessage: 'Date range error',
		description: 'Label of the icon that is displayed before the error message',
	},
});
