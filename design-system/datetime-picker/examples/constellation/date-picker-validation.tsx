import React from 'react';

import Button from '@atlaskit/button/new';
import { DatePicker } from '@atlaskit/datetime-picker';
import Form, { Field, FormFooter } from '@atlaskit/form';

const validateField = (value?: string) => {
	if (!value) {
		return 'This field is required.';
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
			helperMessage="You have entered a valid date."
			component={({ fieldProps }) => (
				<DatePicker
					{...fieldProps}
					clearControlLabel="Clear start day"
					shouldShowCalendarButton
					inputLabel="Start day"
					openCalendarLabel="open calendar"
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

export default DatePickerValidationExample;
