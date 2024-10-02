import React, { useEffect, useState } from 'react';

import { Code } from '@atlaskit/code';
import { Label } from '@atlaskit/form';
import Heading from '@atlaskit/heading';
import { Box } from '@atlaskit/primitives';

import { DatePicker, DateTimePicker, TimePicker } from '../src';

interface ControlledProps {
	initialValue?: string;
	isInitialOpen?: boolean;
	children: (value: {
		value: string;
		onValueChange: (value: string) => void;
		isOpen: boolean;
		onBlur: () => void;
	}) => React.ReactNode;
}

const Controlled = (props: ControlledProps) => {
	const [value, setValue] = useState<string>(props.initialValue || '');
	const [isOpen, setIsOpen] = useState<boolean>(props.isInitialOpen || false);
	const [recentlySelected, setRecentlySelected] = useState<boolean>(false);
	const [recSelTimeoutId, setRecSelTimeoutId] = useState<number | null>(null);

	useEffect(() => {
		if (recSelTimeoutId != null) {
			clearTimeout(recSelTimeoutId);
			setRecSelTimeoutId(null);
		}
	}, [recSelTimeoutId]);

	const handleClick = () => {
		if (!recentlySelected) {
			setIsOpen(true);
		}
	};

	const onValueChange = (value: string) => {
		console.log(value);
		setRecentlySelected(true);
		setValue(value);
		setIsOpen(false);
		setRecSelTimeoutId(
			window.setTimeout(() => {
				setRecSelTimeoutId(null);
				setRecentlySelected(false);
			}, 200),
		);
	};

	const onBlur = () => {
		setIsOpen(false);
	};

	return (
		/**
		 * It is not normally acceptable to add click handlers to non-interactivce elements
		 * as this is an accessibility anti-pattern. However, because this instance is
		 * for "React" reasons and not creating an inaccessible custom element, we can
		 */
		<Box onClick={handleClick}>
			{props.children({
				value: value,
				onValueChange: onValueChange,
				isOpen: isOpen,
				onBlur: onBlur,
			})}
		</Box>
	);
};

const onChange = (value: unknown) => {
	console.log(value);
};

export default () => {
	const [value, setValue] = React.useState('');
	return (
		<Box>
			<Box paddingBlock="space.150">
				<Heading size="large">Date picker</Heading>
				<Label htmlFor="react-select-datepicker-1-input">Select date (default)</Label>
				<DatePicker id="react-select-datepicker-1-input" onChange={onChange} />

				<Label htmlFor="react-select-datepicker-2--input">Select date (controlled value)</Label>
				<Controlled initialValue="2018-01-02">
					{({ value, onValueChange, onBlur }) => (
						<DatePicker
							id="react-select-datepicker-2--input"
							value={value}
							onChange={onValueChange}
							onBlur={onBlur}
						/>
					)}
				</Controlled>

				<Label htmlFor="react-select-datepicker-3--input">
					Select date (uncontrolled, defaultValue)
				</Label>
				<DatePicker
					id="react-select-datepicker-3--input"
					defaultValue="2018-01-02"
					onChange={onChange}
				/>
			</Box>
			<Box paddingBlock="space.150">
				<Heading size="large">Time picker</Heading>
				<Label htmlFor="react-select-timepicker-input">Select time (default)</Label>
				<TimePicker
					id="react-select-timepicker-input"
					testId="timepicker-1"
					onChange={onChange}
					selectProps={{
						classNamePrefix: 'timepicker-select',
					}}
				/>

				<Label htmlFor="react-select-timepicker-2--input">Select time (value, isOpen)</Label>
				<Controlled initialValue="14:30">
					{({ value, onValueChange, isOpen, onBlur }) => (
						<TimePicker
							id="react-select-timepicker-2--input"
							selectProps={{
								classNamePrefix: 'timepicker-select',
							}}
							value={value}
							onChange={onValueChange}
							onBlur={onBlur}
							isOpen={isOpen}
						/>
					)}
				</Controlled>

				<Label htmlFor="react-select-timepicker-3--input">
					Select time (uncontrolled, defaultValue)
				</Label>
				<TimePicker
					selectProps={{
						classNamePrefix: 'timepicker-select',
					}}
					id="react-select-timepicker-3--input"
					defaultValue="14:30"
					onChange={onChange}
				/>

				<Label htmlFor="react-select-timepicker-4--input">Select time (editable)</Label>
				<TimePicker
					selectProps={{
						classNamePrefix: 'timepicker-select',
					}}
					id="react-select-timepicker-4--input"
					defaultValue="14:30"
					onChange={onChange}
					timeFormat="HH:mm:ss A"
					timeIsEditable
				/>
			</Box>
			<Box paddingBlock="space.150">
				<Heading size="large">Date / time picker</Heading>
				<Label htmlFor="react-select-datetimepicker-1--input">Date / time picker (default)</Label>
				<DateTimePicker
					clearControlLabel="Clear date / time picker (default)"
					onChange={onChange}
					testId={'dateTimePicker'}
					datePickerProps={{ label: 'Date, Date / time picker (default)' }}
					timePickerProps={{ label: 'Time, Date / time picker (default)' }}
					id="react-select-datetimepicker-1--input"
				/>

				<Label htmlFor="react-select-datetimepicker-2--input">
					Date / time picker (controlled (UTC-08:00))
				</Label>
				<Controlled initialValue="2018-01-02T14:30-08:00">
					{({ value, onValueChange }) => (
						<DateTimePicker
							clearControlLabel="Clear date / time picker (controlled (UTC-08:00))"
							value={value}
							onChange={onValueChange}
							id="react-select-datetimepicker-2--input"
							datePickerProps={{ label: 'Date, Date / time picker (controlled (UTC-08:00))' }}
							timePickerProps={{ label: 'Time, Date / time picker (controlled (UTC-08:00))' }}
						/>
					)}
				</Controlled>

				<Label htmlFor="react-select-datetimepicker-3--input">
					Date / time picker (uncontrolled (UTC+10:00))
				</Label>
				<DateTimePicker
					clearControlLabel="Clear date / time picker (uncontrolled (UTC+10:00))"
					id="react-select-datetimepicker-3--input"
					defaultValue="2018-01-02T14:30+10:00"
					onChange={onChange}
					datePickerProps={{ label: 'Date, Date / time picker (uncontrolled (UTC+10:00))' }}
					timePickerProps={{ label: 'Time, Date / time picker (uncontrolled (UTC+10:00))' }}
				/>

				<Label htmlFor="react-select-datetimepicker-4--input">
					Date / time picker (editable times (UTC+10:00))
				</Label>
				<DateTimePicker
					clearControlLabel="Clear date / time picker (editable times (UTC+10:00))"
					id="react-select-datetimepicker-4--input"
					defaultValue="2018-01-02T14:30+10:00"
					onChange={onChange}
					timePickerProps={{
						timeIsEditable: true,
						label: 'Time, Date / time picker (editable times (UTC+10:00))',
					}}
					datePickerProps={{ label: 'Date, Date / time picker (editable times (UTC+10:00))' }}
				/>
				<Label htmlFor="react-select-datetimepicker-input">
					Date / time picker (editable times with value (UTC+10:00))
				</Label>
				<DateTimePicker
					clearControlLabel="Clear date / time picker (editable times with value (UTC+10:00))"
					onChange={(v) => setValue(v)}
					id="react-select-datetimepicker-input"
					datePickerProps={{
						label: 'Date, Date / time picker (editable times with value (UTC+10:00))',
					}}
					timePickerProps={{
						label: 'Time, Date / time picker (editable times with value (UTC+10:00))',
					}}
				/>
				<Code>{value}</Code>
			</Box>
		</Box>
	);
};
