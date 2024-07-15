/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { format, isValid, parseISO } from 'date-fns';
import pick from 'lodash/pick';

import {
	createAndFireEvent,
	withAnalyticsContext,
	withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import SelectClearIcon from '@atlaskit/icon/glyph/select-clear';
import { mergeStyles, type StylesConfig } from '@atlaskit/select';
import { N500, N70 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { defaultTimes, formatDateTimeZoneIntoIso } from '../internal';
import { DateTimePickerContainer } from '../internal/date-time-picker-container';
import { convertTokens } from '../internal/parse-tokens';
import { type DateTimePickerBaseProps } from '../types';

import DatePicker from './date-picker';
import TimePicker from './time-picker';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

type DateTimePickerProps = typeof dateTimePickerDefaultProps & DateTimePickerBaseProps;

interface State {
	dateValue: string;
	isFocused: boolean;
	timeValue: string;
	value: string;
	zoneValue: string;
}

// Make DatePicker 50% the width of DateTimePicker
// If rendering an icon container, shrink the TimePicker
const datePickerContainerStyles = css({
	flexBasis: '50%',
	flexGrow: 1,
	flexShrink: 0,
});

const timePickerContainerStyles = css({
	flexBasis: '50%',
	flexGrow: 1,
});

const iconContainerStyles = css({
	display: 'flex',
	margin: token('border.width', '1px'),
	alignItems: 'center',
	flexBasis: 'inherit',
	backgroundColor: 'inherit',
	border: 'none',
	color: token('color.text.subtlest', N70),
	paddingBlockEnd: token('space.075', '6px'),
	paddingBlockStart: token('space.075', '6px'),
	paddingInlineEnd: token('space.100', '8px'),
	paddingInlineStart: token('space.050', '4px'),
	transition: `color 150ms`,
	'&:hover': {
		color: token('color.text.subtle', N500),
	},
});

// react-select overrides (via @atlaskit/select).
const styles: StylesConfig = {
	control: (style) => ({
		...style,
		backgroundColor: 'transparent',
		border: 2,
		borderRadius: 0,
		paddingLeft: 0,
		':hover': {
			backgroundColor: 'transparent',
			cursor: 'inherit',
		},
	}),
};

const dateTimePickerDefaultProps = {
	appearance: 'default' as NonNullable<DateTimePickerBaseProps['appearance']>,
	autoFocus: false,
	isDisabled: false,
	name: '',
	// These disables are here for proper typing when used as defaults. They
	// should *not* use the `noop` function.
	/* eslint-disable @repo/internal/react/use-noop */
	onBlur: (_event: React.FocusEvent<HTMLInputElement>) => {},
	onChange: (_value: string) => {},
	onFocus: (_event: React.FocusEvent<HTMLInputElement>) => {},
	/* eslint-enable @repo/internal/react/use-noop */
	innerProps: {},
	id: '',
	defaultValue: '',
	timeIsEditable: false,
	isInvalid: false,
	datePickerProps: {},
	timePickerProps: {},
	datePickerSelectProps: {},
	timePickerSelectProps: {},
	times: defaultTimes,
	spacing: 'default' as NonNullable<DateTimePickerBaseProps['spacing']>,
	locale: 'en-US',
	// Not including a default prop for value as it will
	// Make the component a controlled component
};

export const datePickerDefaultAriaLabel = 'Date';
export const timePickerDefaultAriaLabel = 'Time';

class DateTimePickerComponent extends React.Component<DateTimePickerProps, State> {
	static defaultProps: DateTimePickerProps = dateTimePickerDefaultProps;

	state: State = {
		dateValue: '',
		isFocused: false,
		timeValue: '',
		value: this.props.defaultValue,
		zoneValue: '',
	};

	// All state needs to be accessed via this function so that the state is mapped from props
	// correctly to allow controlled/uncontrolled usage.
	getSafeState = () => {
		const mappedState = {
			...this.state,
			...pick(this.props, ['value']),
		};

		return {
			...mappedState,
			...this.parseValue(
				mappedState.value,
				mappedState.dateValue,
				mappedState.timeValue,
				mappedState.zoneValue,
			),
		};
	};

	parseValue(value: string, dateValue: string, timeValue: string, zoneValue: string) {
		if (this.props.parseValue) {
			return this.props.parseValue(value, dateValue, timeValue, zoneValue);
		}

		const parsed = parseISO(value);

		return isValid(parsed)
			? {
					dateValue: format(parsed, convertTokens('YYYY-MM-DD')),
					timeValue: format(parsed, convertTokens('HH:mm')),
					zoneValue: format(parsed, convertTokens('ZZ')),
				}
			: { dateValue, timeValue, zoneValue };
	}

	onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		this.setState({ isFocused: false });
		this.props.onBlur(event);
	};

	onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
		this.setState({ isFocused: true });
		this.props.onFocus(event);
	};

	onDateChange = (dateValue: string) => {
		this.onValueChange({ ...this.getSafeState(), dateValue });
	};

	onTimeChange = (timeValue: string) => {
		this.onValueChange({ ...this.getSafeState(), timeValue });
	};

	onClear = () => {
		this.onValueChange({
			...this.getSafeState(),
			timeValue: '',
			dateValue: '',
		});
	};

	onValueChange({
		dateValue,
		timeValue,
		zoneValue,
	}: {
		dateValue: string;
		timeValue: string;
		zoneValue: string;
	}) {
		this.setState({ dateValue, timeValue, zoneValue });
		if (dateValue && timeValue) {
			const value = formatDateTimeZoneIntoIso(dateValue, timeValue, zoneValue);
			const { zoneValue: parsedZone } = this.parseValue(value, dateValue, timeValue, zoneValue);
			const valueWithValidZone = formatDateTimeZoneIntoIso(dateValue, timeValue, parsedZone);
			this.setState({ value: valueWithValidZone });
			this.props.onChange(valueWithValidZone);
			// If the date or time value was cleared when there is an existing datetime value, then clear the value.
		} else if (this.getSafeState().value) {
			this.setState({ value: '' });
			this.props.onChange('');
		}
	}

	render() {
		const {
			autoFocus,
			id,
			innerProps,
			isDisabled,
			name,
			timeIsEditable,
			dateFormat,
			datePickerProps,
			datePickerSelectProps,
			timePickerProps,
			timePickerSelectProps,
			times,
			timeFormat,
			locale,
			testId,
		} = this.props;
		const { isFocused, value, dateValue, timeValue } = this.getSafeState();
		const bothProps = {
			isDisabled,
			onBlur: this.onBlur,
			onFocus: this.onFocus,
			isInvalid: this.props.isInvalid,
			appearance: this.props.appearance,
			spacing: this.props.spacing,
		};

		const { styles: datePickerStyles = {} } = datePickerSelectProps;
		const { styles: timePickerStyles = {} } = timePickerSelectProps;

		const mergedDatePickerSelectProps = {
			...datePickerSelectProps,
			'aria-label':
				datePickerProps['label'] ||
				datePickerSelectProps['aria-label'] ||
				datePickerDefaultAriaLabel,
			styles: mergeStyles(styles, datePickerStyles),
		};

		const mergedTimePickerSelectProps = {
			...timePickerSelectProps,
			'aria-label':
				timePickerProps['label'] ||
				timePickerSelectProps['aria-label'] ||
				timePickerDefaultAriaLabel,
			styles: mergeStyles(styles, timePickerStyles),
		};

		// Render DateTimePicker's IconContainer when a value has been filled
		// Don't use Date or TimePicker's because they can't be customised
		const isClearable = Boolean(dateValue || timeValue);

		return (
			<DateTimePickerContainer
				appearance={bothProps.appearance}
				isDisabled={isDisabled}
				isFocused={isFocused}
				isInvalid={bothProps.isInvalid}
				testId={testId}
				innerProps={innerProps}
			>
				<input name={name} type="hidden" value={value} data-testid={testId && `${testId}--input`} />
				<div css={datePickerContainerStyles}>
					<DatePicker
						{...bothProps}
						autoFocus={autoFocus}
						dateFormat={dateFormat}
						hideIcon
						id={id}
						onChange={this.onDateChange}
						selectProps={mergedDatePickerSelectProps}
						value={dateValue}
						locale={locale}
						testId={testId && `${testId}--datepicker`}
						{...datePickerProps}
					/>
				</div>
				<div css={timePickerContainerStyles}>
					<TimePicker
						{...bothProps}
						hideIcon
						onChange={this.onTimeChange}
						selectProps={mergedTimePickerSelectProps}
						value={timeValue}
						timeIsEditable={timeIsEditable}
						times={times}
						timeFormat={timeFormat}
						locale={locale}
						testId={testId && `${testId}--timepicker`}
						{...timePickerProps}
					/>
				</div>
				{isClearable && !isDisabled ? (
					<button
						css={iconContainerStyles}
						onClick={this.onClear}
						data-testid={testId && `${testId}--icon--container`}
						tabIndex={-1}
						type="button"
					>
						<SelectClearIcon size="small" primaryColor="inherit" label="clear" />
					</button>
				) : null}
			</DateTimePickerContainer>
		);
	}
}

export { DateTimePickerComponent as DateTimePickerWithoutAnalytics };

/**
 * __Date time picker__
 *
 * A date time picker allows the user to select an associated date and time.
 *
 * - [Examples](https://atlassian.design/components/datetime-picker/examples)
 * - [Code](https://atlassian.design/components/datetime-picker/code)
 * - [Usage](https://atlassian.design/components/datetime-picker/usage)
 */
const DateTimePicker = withAnalyticsContext({
	componentName: 'dateTimePicker',
	packageName,
	packageVersion,
})(
	withAnalyticsEvents({
		onChange: createAndFireEvent('atlaskit')({
			action: 'changed',
			actionSubject: 'dateTimePicker',

			attributes: {
				componentName: 'dateTimePicker',
				packageName,
				packageVersion,
			},
		}),
	})(DateTimePickerComponent),
);

export default DateTimePicker;
