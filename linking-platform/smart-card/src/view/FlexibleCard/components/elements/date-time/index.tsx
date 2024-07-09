/** @jsx jsx */
import { useIntl, FormattedMessage, type MessageDescriptor } from 'react-intl-next';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { type DateTimeProps, type DateTimeType } from './types';
import { getTruncateStyles } from '../../utils';
import { token } from '@atlaskit/tokens';
import { selectUnit } from '@formatjs/intl-utils';
import { messages } from '../../../../../messages';

const styles = css(
	{
		color: token('color.text.subtlest', '#626F86'),
		fontSize: '0.75rem',
		lineHeight: '1rem',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	getTruncateStyles(1),
);

type DateTypeVariation = 'relative' | 'absolute';

const typeToDescriptorMap: Record<DateTimeType, Record<DateTypeVariation, MessageDescriptor>> = {
	created: {
		relative: messages.created_on_relative,
		absolute: messages.created_on_absolute,
	},
	modified: {
		relative: messages.modified_on_relative,
		absolute: messages.modified_on_absolute,
	},
	sent: {
		relative: messages.sent_on_relative,
		absolute: messages.sent_on_absolute,
	},
};

/**
 * A base element that displays an ISO Timestamp in text.
 * @internal
 * @param {DateTimeProps} DateTimeProps - The props necessary for the DateTime element.
 * @see CreatedOn
 * @see ModifiedOn
 * @see SentOn
 */
const DateTime = ({
	date,
	name,
	overrideCss,
	type,
	testId = 'smart-element-date-time',
	text,
}: DateTimeProps) => {
	const { formatRelativeTime, formatDate } = useIntl();
	if (!type || !date) {
		return null;
	}
	const isLongerThenWeek = Math.abs(date.getTime() - Date.now()) > 1000 * 60 * 60 * 24 * 7;
	let context: string;
	let typeVariant: DateTypeVariation;
	if (isLongerThenWeek) {
		typeVariant = 'absolute';
		context = formatDate(date, {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	} else {
		const { value, unit } = selectUnit(date, Date.now());
		typeVariant = 'relative';
		context = formatRelativeTime(value, unit, {
			numeric: 'auto',
		});
	}

	return (
		<span
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			css={[styles, overrideCss]}
			data-separator
			data-smart-element={name}
			data-smart-element-date-time
			data-testid={testId}
		>
			{text ? (
				`${text} ${context}`
			) : (
				<FormattedMessage {...typeToDescriptorMap[type][typeVariant]} values={{ context }} />
			)}
		</span>
	);
};

export default DateTime;
