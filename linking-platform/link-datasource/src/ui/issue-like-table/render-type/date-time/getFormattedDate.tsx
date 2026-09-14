import { type FormatDateOptions, type IntlShape } from 'react-intl';

const dateOptions: FormatDateOptions = {
	month: 'short',
	day: 'numeric',
	year: 'numeric',
};

const timeOptions: FormatDateOptions = {
	hour12: false,
	hour: '2-digit',
	minute: '2-digit',
};

export function getFormattedDate(
	value: string,
	display: string = 'datetime',
	formatDate: IntlShape['formatDate'],
): string {
	/* In some cases we get a value of `2023-12-20` which when parsed by JS assumes meantime timezone, causing the date
    to be one day off in some timezones. We want it to display the date without converting timezones and a solution
   is to replace the hyphens with slashes. So it should be 20th Dec regardless of the timezone in this case.
    See https://stackoverflow.com/a/31732581
   */
	const dateValue = /^\d{4}-\d{2}-\d{2}$/.exec(value) ? value.replace(/-/g, '/') : value;
	const date = new Date(dateValue);

	if (!value || isNaN(date.getTime())) {
		return '';
	}

	const options: Record<typeof display, FormatDateOptions> = {
		date: dateOptions,
		time: timeOptions,
		datetime: { ...dateOptions, ...timeOptions },
	};

	return formatDate(date, options[display] || options['date']);
}
