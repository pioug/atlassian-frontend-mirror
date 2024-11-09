import React, { useState } from 'react';

import { DatePicker, DateTimePicker, TimePicker } from '@atlaskit/datetime-picker';
import Heading from '@atlaskit/heading';
import InlineEdit from '@atlaskit/inline-edit';
import { Box, Stack } from '@atlaskit/primitives';

const ReadView = ({ data, placeholder }: { data: string; placeholder: string }) => (
	<Box padding="space.100" testId="readview">
		{data || placeholder}
	</Box>
);

export default function InlineEditWithDatepicker() {
	const [isEditingDp, setIsEditingDp] = useState(false);
	const [isEditingTp, setIsEditingTp] = useState(false);
	const [isEditingDtp, setIsEditingDtp] = useState(false);
	const [dpData, setDpData] = useState('');
	const [tpData, setTpData] = useState('');
	const [dtpData, setDtpData] = useState('');

	const DPEditView = () => (
		<DatePicker
			value={dpData}
			onChange={(e: string) => {
				setDpData(e);
				setIsEditingDp(false);
			}}
			testId="timepicker"
			shouldShowCalendarButton
		/>
	);

	const TPEditView = () => (
		<TimePicker
			value={tpData}
			onChange={(e: string) => {
				setTpData(e);
				setIsEditingTp(false);
			}}
			testId="timepicker"
		/>
	);

	const DTPEditView = () => (
		<DateTimePicker
			value={dtpData}
			onChange={(e: string) => {
				setDtpData(e);
				setIsEditingDtp(false);
			}}
			testId="datetimepicker"
			datePickerProps={{ shouldShowCalendarButton: true }}
		/>
	);

	return (
		<Stack>
			<Box paddingInlineStart="space.100" paddingInlineEnd="space.600">
				<Heading size="large" as="h2">
					Date Picker
				</Heading>
				<InlineEdit
					defaultValue={() => <ReadView data={dpData} placeholder="Select date" />}
					readView={() => <ReadView data={dpData} placeholder="Select date" />}
					editView={DPEditView}
					label="Inline edit date picker"
					editButtonLabel={dpData || 'Select date'}
					onConfirm={() => setIsEditingDp(false)}
					onEdit={() => setIsEditingDp(true)}
					isEditing={isEditingDp}
					hideActionButtons
					readViewFitContainerWidth
					testId="dp-inline-edit"
				/>
			</Box>
			<Box paddingInlineStart="space.100" paddingInlineEnd="space.600">
				<Heading size="large" as="h2">
					Time Picker
				</Heading>
				<InlineEdit
					defaultValue={() => <ReadView data={tpData} placeholder="Select time" />}
					readView={() => <ReadView data={tpData} placeholder="Select time" />}
					editView={TPEditView}
					label="Inline edit time picker"
					editButtonLabel={tpData || 'Select time'}
					onConfirm={() => setIsEditingTp(false)}
					onEdit={() => setIsEditingTp(true)}
					isEditing={isEditingTp}
					hideActionButtons
					readViewFitContainerWidth
					testId="tp-inline-edit"
				/>
			</Box>
			<Box paddingInlineStart="space.100" paddingInlineEnd="space.600">
				<Heading size="large" as="h2">
					Datetime Picker
				</Heading>
				<InlineEdit
					defaultValue={() => <ReadView data={dtpData} placeholder="Select date and time" />}
					readView={() => <ReadView data={dtpData} placeholder="Select date and time" />}
					editView={DTPEditView}
					label="Inline edit datetime picker"
					editButtonLabel={dtpData || 'Select date and time'}
					onConfirm={() => setIsEditingDtp(false)}
					onEdit={() => setIsEditingDtp(true)}
					isEditing={isEditingDtp}
					hideActionButtons
					readViewFitContainerWidth
					testId="dtp-inline-edit"
				/>
			</Box>
		</Stack>
	);
}
