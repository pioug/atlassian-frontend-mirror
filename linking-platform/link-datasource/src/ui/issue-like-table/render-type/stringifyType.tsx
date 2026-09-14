import { type IntlShape } from 'react-intl';

import type { DatasourceType } from '@atlaskit/linking-types/datasource';

import { getFormattedDateRange } from './date-range/getFormattedDateRange';
import { getFormattedDate } from './date-time/getFormattedDate';
import { parseRichText } from './richtext/parseRichText';
import { userTypeMessages } from './user/messages';

export const stringifyType = (
	{ type, value }: DatasourceType,
	formatMessage: IntlShape['formatMessage'],
	formatDate: IntlShape['formatDate'],
): string => {
	switch (type) {
		case 'boolean':
		case 'number':
			return value?.toString() || '';
		case 'date':
			return getFormattedDate(value, 'date', formatDate);
		case 'datetime':
			return getFormattedDate(value, 'datetime', formatDate);
		case 'daterange': {
			return getFormattedDateRange(value.start, value.end, formatDate, formatMessage);
		}
		case 'time':
			return getFormattedDate(value, 'time', formatDate);
		case 'icon':
			return value?.label || '';
		case 'status':
			return value?.text.toString() || '';
		case 'string':
			return value;
		case 'tag':
			return value?.text || '';
		case 'user':
			return value?.displayName || formatMessage(userTypeMessages.userDefaultdisplayNameValue);
		case 'richtext':
			if (value.html && value.html.trim() !== '') {
				return '';
			} else {
				const adfPlainText = parseRichText(value);
				return adfPlainText || '';
			}
		case 'link':
		default:
			return '';
	}
};
