import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
import { DatePicker, DateTimePicker, TimePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { Box } from '@atlaskit/primitives';

export default function DefaultModal() {
	const [isOpen, setIsOpen] = useState(false);
	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);

	return (
		<>
			<Button aria-haspopup="dialog" appearance="primary" onClick={open} testId="modal-trigger">
				Open Modal
			</Button>

			<ModalTransition>
				{isOpen && (
					<Modal onClose={close} testId="modal">
						<ModalHeader hasCloseButton>
							<ModalTitle>Modal Title</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<Box>
								<Label id="datepicker-label" htmlFor="datepicker">
									Select date (default)
								</Label>
								<DatePicker
									id="datepicker"
									clearControlLabel="Clear select date (default)"
									shouldShowCalendarButton
									inputLabelId="default"
									openCalendarLabel="open calendar"
									testId="datepicker"
								/>
								<Label htmlFor="timepicker">Select time (default)</Label>
								<TimePicker
									clearControlLabel="Clear select time (default)"
									id="timepicker"
									testId="timepicker"
								/>
								<Label htmlFor="datetime-picker">Date / time picker (default)</Label>
								<DateTimePicker
									clearControlLabel="Clear date / time picker (default)"
									testId="datetime-picker"
									datePickerProps={{
										label: 'Date / time picker (default), date',
										shouldShowCalendarButton: true,
										openCalendarLabel: 'open calendar',
									}}
									timePickerProps={{ label: 'Date / time picker (default), time' }}
									id="datetime-picker"
								/>
							</Box>
						</ModalBody>
						<ModalFooter>
							<Button testId="secondary" appearance="subtle" onClick={close}>
								Secondary Action
							</Button>
							<Button testId="primary" appearance="primary" onClick={close}>
								Close
							</Button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
		</>
	);
}
