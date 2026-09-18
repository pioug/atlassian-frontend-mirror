import React from 'react';

import Button from '@atlaskit/button/default/button';
import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker';
import Field from '@atlaskit/form/field';
import Form from '@atlaskit/form/form';
import { FormFooter } from '@atlaskit/form/form-footer';

const DateTimePickerFormAccessibleExample = (): React.JSX.Element => (
	<Form onSubmit={(formState: unknown) => console.log('form submitted', formState)}>
		<Field name="datetime-picker-accessible" label="Scheduled run time" isRequired>
			{({ fieldProps }) => (
				<DateTimePicker
					{...fieldProps}
					datePickerProps={{
						label: 'Scheduled run time, date',
						shouldShowCalendarButton: true,
					}}
					timePickerProps={{ label: 'Scheduled run time, time' }}
					clearControlLabel="Clear scheduled run time"
				/>
			)}
		</Field>
		<FormFooter>
			<Button type="submit" appearance="primary">
				Submit
			</Button>
		</FormFooter>
	</Form>
);

export default DateTimePickerFormAccessibleExample;
