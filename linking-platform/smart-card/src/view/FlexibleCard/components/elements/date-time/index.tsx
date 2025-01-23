/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { selectUnit } from '@formatjs/intl-utils';
import { FormattedMessage, type MessageDescriptor, useIntl } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { messages } from '../../../../../messages';

import DateTimeOld from './DateTimeOld';
import { type DateTimeProps, type DateTimeType } from './types';

const styles = css({
	color: token('color.text.subtlest', '#626F86'),
	font: token('font.body.UNSAFE_small'),
	display: '-webkit-box',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	wordBreak: 'break-word',
	WebkitLineClamp: 1,
	WebkitBoxOrient: 'vertical',
	'@supports not (-webkit-line-clamp: 1)': {
		maxHeight: 'calc(1 * 1rem)',
	},
});

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
const DateTimeNew = ({
	date,
	name,
	className,
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
			css={[styles]}
			data-separator
			data-smart-element={name}
			data-smart-element-date-time
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
		>
			{text ? (
				`${text} ${context}`
			) : (
				<FormattedMessage {...typeToDescriptorMap[type][typeVariant]} values={{ context }} />
			)}
		</span>
	);
};

const DateTime = (props: DateTimeProps): JSX.Element => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <DateTimeNew {...props} />;
	} else {
		return <DateTimeOld {...props} />;
	}
};

export default DateTime;
