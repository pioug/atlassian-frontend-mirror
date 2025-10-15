import React from 'react';

import Button from '@atlaskit/button/new';
import { DateTimePicker } from '@atlaskit/datetime-picker';
import Form, { ErrorMessage, Field, FormFooter, ValidMessage } from '@atlaskit/form';

const validateField = (value?: string) => {
	if (!value) {
		return 'REQUIRED';
	} else if (new Date(value) < new Date()) {
		return 'EXPIRED';
	}
};

const DateTimePickerFormExample = () => (
	<Form onSubmit={(formState) => console.log('form submitted', formState)}>
		<Field name="datetime-picker" label="Scheduled run time" validate={validateField} isRequired>
			{({ fieldProps, error, meta: { valid } }) => (
				<>
					<DateTimePicker
						{...fieldProps}
						clearControlLabel="Clear scheduled run time"
						datePickerProps={{
							shouldShowCalendarButton: true,
							label: 'Scheduled run time, date',
						}}
						timePickerProps={{ label: 'Scheduled run time, time' }}
					/>
					{valid && <ValidMessage>You have entered a valid datetime</ValidMessage>}
					{error === 'REQUIRED' && <ErrorMessage>This field is required</ErrorMessage>}
					{error === 'EXPIRED' && (
						<ErrorMessage>You may not enter a datetime that is in the past</ErrorMessage>
					)}
				</>
			)}
		</Field>
		<FormFooter>
			<Button type="submit" appearance="primary">
				Submit
			</Button>
		</FormFooter>
	</Form>
);

export default DateTimePickerFormExample;
