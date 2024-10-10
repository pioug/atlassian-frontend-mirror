import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { Label } from '@atlaskit/form';
import Popup from '@atlaskit/popup';
import { Box } from '@atlaskit/primitives';

import { DatePicker } from '../src';

export default () => {
	const [isOpen, setIsOpen] = useState(false);

	const PopupContent = () => {
		const [date, setDate] = useState('');
		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div id="popup-content" style={{ width: '500px', height: '500px' }}>
				<Label htmlFor="text3">First popup field</Label>
				<input id="text3" type="text" />
				<Box>
					<Label id="popup" htmlFor="react-select-value1-input">
						Picker popup field
					</Label>
					<DatePicker
						autoFocus={false}
						id="react-select-value1-input"
						onChange={(date: string) => {
							setDate(date);
						}}
						value={date}
						spacing="compact"
						testId="jql-builder-basic-datetime.ui.between-dates.value-1"
						shouldShowCalendarButton
						inputLabelId="popup"
						openCalendarLabel="open calendar"
					/>
				</Box>
				<Label htmlFor="text4">Last popup field</Label>
				<input id="text4" type="text" />
			</div>
		);
	};

	return (
		<div>
			<Label htmlFor="text1">First field</Label>
			<input id="text1" type="text" />
			<br />
			<Label id="custom" htmlFor="react-select-custom-input">
				Custom date format
			</Label>
			<DatePicker
				id="react-select-custom-input"
				dateFormat="DD/MMM/YY"
				placeholder="e.g. 31/Dec/18"
				onChange={console.log}
				testId="datepicker-1"
				shouldShowCalendarButton
				inputLabelId="custom"
				openCalendarLabel="open calendar"
			/>
			<Label htmlFor="text2">Third field</Label>
			<input id="text2" type="text" />

			<Popup
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				content={() => <PopupContent />}
				trigger={({ ...triggerProps }) => (
					<Button id="popup-trigger" {...triggerProps} onClick={() => setIsOpen(!isOpen)}>
						{isOpen ? 'Close' : 'Open'} Popup
					</Button>
				)}
				placement="bottom-start"
			/>
		</div>
	);
};
