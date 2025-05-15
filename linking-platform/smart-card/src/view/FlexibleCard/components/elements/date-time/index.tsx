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

import { type DateTimeProps, type DateTimeType } from './types';

// TODO: Remove on fg cleanup: platform-linking-visual-refresh-v1
const stylesOld = css({
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

const styles = css({
	color: token('color.text.subtle'),
	font: token('font.body.small'),
	display: '-webkit-box',
	minWidth: 0,
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	wordBreak: 'break-word',
	WebkitLineClamp: 1,
	WebkitBoxOrient: 'vertical',
	'@supports not (-webkit-line-clamp: 1)': {
		maxHeight: 'calc(1 * 16px)',
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
const DateTime = ({
	date,
	name,
	className,
	type,
	testId = 'smart-element-date-time',
	text,
	hideDatePrefix = false,
	color,
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

	let content;
	if (hideDatePrefix && fg('platform-linking-additional-flexible-element-props')) {
		content = context;
	} else if (text) {
		content = `${text} ${context}`;
	} else {
		content = <FormattedMessage {...typeToDescriptorMap[type][typeVariant]} values={{ context }} />;
	}

	return (
		<span
			css={[
				!fg('platform-linking-visual-refresh-v1') && stylesOld,
				fg('platform-linking-visual-refresh-v1') && styles,
			]}
			style={{
				color:
					color && fg('platform-linking-additional-flexible-element-props') ? color : undefined,
			}}
			data-separator
			data-smart-element={name}
			data-smart-element-date-time
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
		>
			{content}
		</span>
	);
};

export default DateTime;
