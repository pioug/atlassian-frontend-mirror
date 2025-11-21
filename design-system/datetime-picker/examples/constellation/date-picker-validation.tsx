import React from 'react';

import Button from '@atlaskit/button/new';
import { DatePicker } from '@atlaskit/datetime-picker';
import Form, { ErrorMessage, Field, FormFooter, ValidMessage } from '@atlaskit/form';

const validateField = (value?: string) => {
	if (!value) {
		return 'REQUIRED';
	}
};

const DatePickerValidationExample = (): React.JSX.Element => (
	<Form onSubmit={(formState) => console.log('form submitted', formState)}>
		<Field
			name="datepicker-validation"
			label="Start day"
			validate={validateField}
			isRequired
			defaultValue=""
		>
			{({ fieldProps, error, meta: { valid } }) => (
				<>
					<DatePicker
						{...fieldProps}
						clearControlLabel="Clear start day"
						shouldShowCalendarButton
						inputLabel="Start day"
						openCalendarLabel="open calendar"
					/>
					{valid && <ValidMessage>You have entered a valid date</ValidMessage>}
					{error === 'REQUIRED' && <ErrorMessage>This field is required</ErrorMessage>}
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

export default DatePickerValidationExample;
