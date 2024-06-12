import React from 'react';

import { Label } from '@atlaskit/form';

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

interface State {
	value: string;
	isOpen: boolean;
}

class Controlled extends React.Component<ControlledProps, State> {
	state: State;

	recentlySelected: boolean = false;
	recSelTimeoutId: number | null = null;

	constructor(props: ControlledProps) {
		super(props);
		this.state = {
			value: props.initialValue || '',
			isOpen: props.isInitialOpen || false,
		};
	}

	componentWillUnmount() {
		if (this.recSelTimeoutId != null) {
			clearTimeout(this.recSelTimeoutId);
			this.recSelTimeoutId = null;
		}
	}

	handleClick = () => {
		if (!this.recentlySelected) {
			this.setState({ isOpen: true });
		}
	};

	onValueChange = (value: string) => {
		console.log(value);
		this.recentlySelected = true;
		this.setState(
			{
				value,
				isOpen: false,
			},
			() => {
				this.recSelTimeoutId = window.setTimeout(() => {
					this.recSelTimeoutId = null;
					this.recentlySelected = false;
				}, 200);
			},
		);
	};

	onBlur = () => {
		this.setState({
			isOpen: false,
		});
	};

	render() {
		return (
			/**
			 * It is not normally acceptable to add click handlers to non-interactivce elements
			 * as this is an accessibility anti-pattern. However, because this instance is
			 * for "React" reasons and not creating an inaccessible custom element, we can
			 * add role="presentation" so that there is no negative impacts to assistive
			 * technologies.
			 */
			<div onClick={this.handleClick} role="presentation">
				{this.props.children({
					value: this.state.value,
					onValueChange: this.onValueChange,
					isOpen: this.state.isOpen,
					onBlur: this.onBlur,
				})}
			</div>
		);
	}
}

const onChange = (value: unknown) => {
	console.log(value);
};

export default () => {
	const [value, setValue] = React.useState('');
	return (
		<div>
			<h3>Date picker</h3>
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

			<h3>Time picker</h3>
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
						selectProps={{
							inputId: 'react-select-timepicker-2--input',
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

			<h3>Date / time picker</h3>
			<Label htmlFor="react-select-datetimepicker-1--input">Date / time picker (default)</Label>
			<DateTimePicker
				onChange={onChange}
				testId={'dateTimePicker'}
				datePickerProps={{ label: 'Arrival date' }}
				timePickerProps={{ label: 'Arrival time' }}
				id="react-select-datetimepicker-1--input"
			/>

			<Label htmlFor="react-select-datetimepicker-2--input">
				Date / time picker (controlled (UTC-08:00))
			</Label>
			<Controlled initialValue="2018-01-02T14:30-08:00">
				{({ value, onValueChange }) => (
					<DateTimePicker
						value={value}
						onChange={onValueChange}
						id="react-select-datetimepicker-2--input"
					/>
				)}
			</Controlled>

			<Label htmlFor="react-select-datetimepicker-3--input">
				Date / time picker (uncontrolled (UTC+10:00))
			</Label>
			<DateTimePicker
				id="react-select-datetimepicker-3--input"
				defaultValue="2018-01-02T14:30+10:00"
				onChange={onChange}
			/>

			<Label htmlFor="react-select-datetimepicker-4--input">
				Date / time picker (editable times (UTC+10:00))
			</Label>
			<DateTimePicker
				id="react-select-datetimepicker-4--input"
				defaultValue="2018-01-02T14:30+10:00"
				onChange={onChange}
				timeIsEditable
			/>
			<Label htmlFor="react-select-datetimepicker-input">
				Date / time picker (editable times with value (UTC+10:00))
			</Label>
			<DateTimePicker onChange={(v) => setValue(v)} id="react-select-datetimepicker-input" />
			<pre>{value}</pre>
		</div>
	);
};
