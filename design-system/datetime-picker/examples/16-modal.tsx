import React, { useCallback, useState } from 'react';

import Button, { type ButtonProps, IconButton } from '@atlaskit/button/new';
import { DatePicker, DateTimePicker, TimePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/form';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { Box, Flex, Grid, xcss } from '@atlaskit/primitives';

const gridStyles = xcss({
	width: '100%',
});

const closeContainerStyles = xcss({
	gridArea: 'close',
});

const titleContainerStyles = xcss({
	gridArea: 'title',
});

interface ModalTitleWithCloseProps {
	/**
	 * Children of modal dialog footer.
	 */
	children: React.ReactNode;

	onClose: ButtonProps['onClick'];
}

const ModalTitleWithClose = (props: ModalTitleWithCloseProps) => {
	const { children, onClose } = props;

	return (
		<Grid gap="space.200" templateAreas={['title close']} xcss={gridStyles}>
			<Flex xcss={closeContainerStyles} justifyContent="end">
				<IconButton
					testId="modal-close"
					appearance="subtle"
					icon={CrossIcon}
					label="Close Modal"
					onClick={onClose}
				/>
			</Flex>
			<Flex xcss={titleContainerStyles} justifyContent="start">
				{children}
			</Flex>
		</Grid>
	);
};

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
						<ModalHeader>
							<ModalTitleWithClose onClose={close}>
								<ModalTitle>Modal Title</ModalTitle>
							</ModalTitleWithClose>
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
