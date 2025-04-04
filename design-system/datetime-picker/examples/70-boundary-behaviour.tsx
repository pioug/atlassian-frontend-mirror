import React, { useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import { DateTimePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';
import Modal, { ModalBody, ModalHeader, ModalTitle, ModalTransition } from '@atlaskit/modal-dialog';
import { Box, Text } from '@atlaskit/primitives/compiled';
import Range from '@atlaskit/range';

export default () => {
	const [dateTimePickerValue, setDateTimePickerValue] = useState<string>('2018-01-02T14:30+11:00');
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [textAbove, setTextAbove] = useState<number>(1);
	const [textBelow, setTextBelow] = useState<number>(1);

	const onDateTimePickerChange = (e: any) => {
		setDateTimePickerValue(e.target.value);
	};

	const handleTextAboveChange = (value: number) => {
		setTextAbove(value);
	};

	const handleTextBelowChange = (value: number) => {
		setTextBelow(value);
	};

	return (
		<Box>
			<Text as="p">
				This demonstrates displaying the date time picker display behaviour within a modal. In
				particular, what happens when it overflows the modal body and what happens when it renders
				near the bottom of the viewport.
			</Text>

			<Box paddingBlockStart="space.100">
				<Button onClick={() => setIsModalOpen(true)}>Open modal</Button>
			</Box>
			<ModalTransition>
				{isModalOpen && (
					<Modal onClose={() => setIsModalOpen(false)}>
						<ModalHeader hasCloseButton>
							<ModalTitle>Date picker modal</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<Label htmlFor="paragraphs-above">Paragraphs above: {textAbove}</Label>
							<Range
								id="paragraphs-above"
								value={textAbove}
								min={0}
								max={10}
								step={1}
								onChange={handleTextAboveChange}
							/>
							{textAbove > 0 ? <Lorem count={textAbove} /> : null}
							<Label htmlFor="react-select-above--input">DateTime</Label>
							<DateTimePicker
								id="react-select-above--input"
								defaultValue={dateTimePickerValue}
								onChange={onDateTimePickerChange}
								datePickerProps={{ shouldShowCalendarButton: true, label: 'DateTime, date' }}
								timePickerProps={{ label: 'DateTime, time' }}
								clearControlLabel="Clear DateTime"
							/>
							<Label htmlFor="paragraphs-below">Paragraphs below: {textBelow}</Label>
							<Range
								id="paragraphs-below"
								value={textBelow}
								min={0}
								max={10}
								step={1}
								onChange={handleTextBelowChange}
							/>
							{textBelow > 0 ? <Lorem count={textBelow} /> : null}
						</ModalBody>
					</Modal>
				)}
			</ModalTransition>
		</Box>
	);
};
