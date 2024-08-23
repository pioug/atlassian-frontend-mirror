import React, { useState } from 'react';

import { DateTimePicker } from '@atlaskit/datetime-picker';
import { Box } from '@atlaskit/primitives';

import InlineEdit from '../src';

const ReadView = ({ data }: { data: string }) => (
	<Box padding="space.100" testId="readview">
		{data || 'Select date'}
	</Box>
);

export default function InlineEditWithDatepicker() {
	const [isEditing, setIsEditing] = useState(false);
	const [data, setData] = useState('');

	const EditView = () => (
		<DateTimePicker
			value={data}
			onChange={(e: string) => {
				setData(e);
				setIsEditing(false);
			}}
			testId="datepicker"
		/>
	);

	return (
		<Box paddingInlineStart="space.100" paddingInlineEnd="space.600">
			<InlineEdit
				defaultValue={() => <ReadView data={data} />}
				readView={() => <ReadView data={data} />}
				editView={EditView}
				label="Inline edit datepicker"
				editButtonLabel={data || 'Select date'}
				onConfirm={() => setIsEditing(false)}
				onEdit={() => setIsEditing(true)}
				isEditing={isEditing}
				hideActionButtons
				readViewFitContainerWidth
			/>
		</Box>
	);
}
