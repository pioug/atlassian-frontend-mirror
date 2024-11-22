import React from 'react';

import {
	DatePicker,
	type DatePickerProps,
	DateTimePicker,
	TimePicker,
} from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';
import Heading from '@atlaskit/heading';
import LocaleSelect, { type Locale } from '@atlaskit/locale/LocaleSelect';
import { Box } from '@atlaskit/primitives';
import Select, { type ValueType } from '@atlaskit/select';

const onChange = (value: string) => {
	console.log(value);
};

type WeekStartDayOption = {
	value: DatePickerProps['weekStartDay'];
	label: string;
};

export default () => {
	const [locale, setLocale] = React.useState('ja-JP');
	const [weekStartDay, setWeekStartDay] = React.useState<DatePickerProps['weekStartDay']>(0);

	const handleLocaleChange = React.useCallback(
		(newLocale: Locale) => setLocale(newLocale.value),
		[],
	);

	const handleWeekStartDayChange = React.useCallback(
		(weekStartDayValue: ValueType<WeekStartDayOption>) =>
			setWeekStartDay((weekStartDayValue as WeekStartDayOption).value),
		[],
	);

	return (
		<Box>
			<Box paddingBlock="space.150">
				<Heading size="large">Options</Heading>
				<Label htmlFor="locale">Locale</Label>
				<LocaleSelect
					id="locale"
					onLocaleChange={handleLocaleChange}
					defaultLocale={{ value: 'ja-JP', label: '日本語 (日本)' }}
				/>

				<Label htmlFor="week-start-day">Start day of the week</Label>
				<Select<WeekStartDayOption>
					inputId="week-start-day"
					styles={{
						container: (css: {}) => ({ ...css, width: 300, margin: '0.5em 0' }),
						dropdownIndicator: (css: {}) => ({ ...css, paddingLeft: 0 }),
						menu: (css: {}) => ({ ...css, width: 300 }),
					}}
					options={[
						{ label: 'Sunday', value: 0 },
						{ label: 'Monday', value: 1 },
						{ label: 'Tuesday', value: 2 },
						{ label: 'Wednesday', value: 3 },
						{ label: 'Thursday', value: 4 },
						{ label: 'Friday', value: 5 },
						{ label: 'Saturday', value: 6 },
					]}
					placeholder="Choose start day of the week"
					onChange={handleWeekStartDayChange}
				/>
			</Box>
			<Box paddingBlock="space.150">
				<Heading size="large">Date picker</Heading>
				<Label id="default" htmlFor="react-select-datepicker-1--input">
					Select date (default)
				</Label>
				<DatePicker
					id="react-select-datepicker-1--input"
					clearControlLabel="Clear select date (default)"
					onChange={onChange}
					locale={locale}
					testId={'date-picker'}
					weekStartDay={weekStartDay}
					defaultValue="2021-01-01"
					shouldShowCalendarButton
					inputLabelId="default"
					openCalendarLabel="open calendar"
				/>
			</Box>
			<Box paddingBlock="space.150">
				<Heading size="large">Time picker</Heading>
				<Label htmlFor="react-select-timepicker-1--input">Select time (default)</Label>
				<TimePicker
					clearControlLabel="Clear select time (default)"
					id="react-select-timepicker-1--input"
					onChange={onChange}
					locale={locale}
					testId={'time-picker'}
					timeIsEditable
				/>
			</Box>
			<Box paddingBlock="space.150">
				<Heading size="large">Date / time picker</Heading>
				<Label htmlFor="datetimepicker-1">Date / time picker (default)</Label>
				<DateTimePicker
					id="datetimepicker-1"
					onChange={onChange}
					locale={locale}
					testId={'datetime-picker'}
					defaultValue="2021-01-01"
					datePickerProps={{
						weekStartDay,
						label: 'Date / time picker (default), date',
						shouldShowCalendarButton: true,
						openCalendarLabel: 'open calendar',
					}}
					timePickerProps={{
						label: 'Date / time picker (default), time',
					}}
					clearControlLabel="Clear date / time picker (default)"
				/>
			</Box>
		</Box>
	);
};
