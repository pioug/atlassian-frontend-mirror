import React from 'react';

import Button from '@atlaskit/button/default/button';
import DateTimePicker from '@atlaskit/datetime-picker/date-time-picker';
import Form from '@atlaskit/form/form';
import Field from '@atlaskit/form/field';
import { FormFooter } from '@atlaskit/form/form-footer';

const validateField = (value?: string) => {
	if (!value) {
		return 'This field is required.';
	} else if (new Date(value) < new Date()) {
		return 'You may not enter a datetime that is in the past.';
	}
};

const DateTimePickerFormExample = (): React.JSX.Element => (
	<Form onSubmit={(formState) => console.log('form submitted', formState)}>
		<Field
			name="datetime-picker"
			label="Scheduled run time"
			validate={validateField}
			isRequired
			helperMessage="You have entered a valid datetime."
			component={({ fieldProps }) => (
				<DateTimePicker
					{...fieldProps}
					clearControlLabel="Clear scheduled run time"
					datePickerProps={{
						shouldShowCalendarButton: true,
						label: 'Scheduled run time, date',
					}}
					timePickerProps={{ label: 'Scheduled run time, time' }}
				/>
			)}
		/>
		<FormFooter>
			<Button type="submit" appearance="primary">
				Submit
			</Button>
		</FormFooter>
	</Form>
);

export default DateTimePickerFormExample;
