import React, { Component } from 'react';

import { Label } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';

import { DatePicker, DateTimePicker, TimePicker } from '../src';

interface State {
	datePickerValue: string;
	datePickerInput: string;
	timePickerValue: string;
	timePickerInput: string;
	dateTimePickerValue: string;
	dateTimePickerInput: string;
}

const dateId = 'datepicker-input';
const timeId = 'timepicker-input';
const datetimeId = 'datetimepicker-input';

export default class MyComponent extends Component<{}, State> {
	state = {
		datePickerValue: '2018-01-02',
		datePickerInput: '2018-01-02',
		timePickerValue: '14:30',
		timePickerInput: '14:30',
		dateTimePickerValue: '2018-01-02T14:30+11:00',
		dateTimePickerInput: '2018-01-02T14:30+11:00',
	};

	onBlur = () => {
		this.setState({
			datePickerValue: this.state.datePickerInput,
			timePickerValue: this.state.timePickerInput,
			dateTimePickerValue: this.state.dateTimePickerInput,
		});
	};

	onDatePickerChange = (e: any) => {
		this.setState({
			datePickerInput: e.target.value,
		});
	};

	onTimePickerChange = (e: any) => {
		this.setState({
			timePickerInput: e.target.value,
		});
	};

	onDateTimePickerChange = (e: any) => {
		this.setState({
			dateTimePickerInput: e.target.value,
		});
	};

	render() {
		const {
			datePickerValue,
			datePickerInput,
			timePickerValue,
			timePickerInput,
			dateTimePickerValue,
			dateTimePickerInput,
		} = this.state;

		return (
			<div>
				<p>This demonstrates updating each pickers value via an external source.</p>
				<h3>Date picker</h3>
				<Label htmlFor="date-picker-override">Datepicker textfield input</Label>
				<TextField
					id="date-picker-override"
					value={datePickerInput}
					onBlur={this.onBlur}
					onChange={this.onDatePickerChange}
				/>

				<Label htmlFor={dateId}>Date</Label>
				<DatePicker value={datePickerValue} isDisabled onChange={console.log} id={dateId} />

				<h3>Time picker</h3>
				<Label htmlFor="time-picker-override">Timepicker textfield input</Label>
				<TextField
					id="time-picker-override"
					value={timePickerInput}
					onBlur={this.onBlur}
					onChange={this.onTimePickerChange}
				/>

				<Label htmlFor={timeId}>Time</Label>
				<TimePicker value={timePickerValue} isDisabled onChange={console.log} id={timeId} />

				<h3>Datetime picker</h3>
				<Label htmlFor="datetime-picker-override">Datetime picker textfield input</Label>
				<TextField
					id="datetime-picker-override"
					value={dateTimePickerInput}
					onBlur={this.onBlur}
					onChange={this.onDateTimePickerChange}
				/>

				<Label htmlFor={datetimeId}>Date / time</Label>
				<DateTimePicker
					value={dateTimePickerValue}
					isDisabled
					onChange={console.log}
					id={datetimeId}
				/>
			</div>
		);
	}
}
