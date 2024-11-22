import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { DatePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';
import Popup from '@atlaskit/popup';
import { Box, xcss } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';

const boxContainerStyle = xcss({
	height: '500px',
	width: '500px',
});

export default () => {
	const [isOpen, setIsOpen] = useState(false);

	const PopupContent = () => {
		const [date, setDate] = useState('');
		return (
			<Box id="popup-content" xcss={boxContainerStyle}>
				<Label htmlFor="text3">First popup field</Label>
				<Textfield id="text3" />
				<Box>
					<Label htmlFor="react-select-value1-input">Picker popup field</Label>
					<DatePicker
						autoFocus={false}
						id="react-select-value1-input"
						clearControlLabel="Clear picker popup field"
						onChange={(date: string) => {
							setDate(date);
						}}
						value={date}
						spacing="compact"
						testId="jql-builder-basic-datetime.ui.between-dates.value-1"
					/>
				</Box>
				<Label htmlFor="text4">Last popup field</Label>
				<Textfield id="text4" />
			</Box>
		);
	};

	return (
		<Box>
			<Label htmlFor="text1">First field</Label>
			<Textfield id="text1" />

			<Label htmlFor="react-select-custom-input">Custom date format</Label>
			<DatePicker
				id="react-select-custom-input"
				clearControlLabel="Clear custom date format"
				dateFormat="DD/MMM/YY"
				placeholder="e.g. 31/Dec/18"
				onChange={console.log}
				testId="datepicker-1"
			/>
			<Label htmlFor="text2">Third field</Label>
			<Textfield id="text2" />
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
		</Box>
	);
};
