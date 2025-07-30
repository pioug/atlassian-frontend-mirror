/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, cssMap, jsx } from '@compiled/react';
import { selectUnit } from '@formatjs/intl-utils';
import { FormattedMessage, type MessageDescriptor, useIntl } from 'react-intl-next';

import type { Prettify } from '@atlaskit/linking-common';
import { token } from '@atlaskit/tokens';

import { messages } from '../../../../../../messages';
import type { ElementProps } from '../../../elements';

export type DateTimeType = 'created' | 'modified' | 'sent';

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

const fontOverrideStyleMap = cssMap({
	'font.body': {
		font: token('font.body'),
	},
	'font.body.large': {
		font: token('font.body.large'),
	},
	'font.body.small': {
		font: token('font.body.small'),
	},
	'font.body.UNSAFE_small': {
		font: token('font.body.UNSAFE_small'),
	},
});

export type BaseDateTimeElementProps = ElementProps & {
	/**
	 * Whether the date time element text should contain "Modified" or "Created" or "sent"
	 */
	type?: DateTimeType;
	/**
	 * The date to display in the element.
	 */
	date?: Date;
	/**
	 * The override text which will show next to the date
	 */
	text?: string;
	/**
	 * Hide the date prefix (e.g. "Created on", "Modified on", "Sent on")
	 */
	hideDatePrefix?: boolean;
	/**
	 * Color of the text
	 */
	color?: string;
	/**
	 * Override the default font size.
	 */
	fontSize?: Prettify<
		Extract<
			Parameters<typeof token>[0],
			'font.body' | 'font.body.large' | 'font.body.small' | 'font.body.UNSAFE_small'
		>
	>;
};

/**
 * A base element that displays an ISO Timestamp in text.
 * @internal
 * @param {BaseDateTimeElementProps} BaseDateTimeElementProps - The props necessary for the DateTime element.
 * @see CreatedOn
 * @see ModifiedOn
 * @see SentOn
 */
const BaseDateTimeElement = ({
	date,
	name,
	className,
	type,
	testId = 'smart-element-date-time',
	text,
	hideDatePrefix = false,
	color,
	fontSize,
}: BaseDateTimeElementProps) => {
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
	if (hideDatePrefix) {
		content = context;
	} else if (text) {
		content = `${text} ${context}`;
	} else {
		content = <FormattedMessage {...typeToDescriptorMap[type][typeVariant]} values={{ context }} />;
	}

	return (
		<span
			css={[styles, fontSize !== undefined && fontOverrideStyleMap[fontSize]]}
			style={{
				color,
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

export default BaseDateTimeElement;

export const toDateTimeProps = (
	type: 'created' | 'modified' | 'sent',
	dateString?: string,
): Partial<BaseDateTimeElementProps> | undefined => {
	return dateString ? { date: new Date(dateString), type } : undefined;
};
