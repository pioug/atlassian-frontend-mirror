import React from 'react';

import Button from '@atlaskit/button/new';
import Form, { ErrorMessage, Field, FormFooter, ValidMessage } from '@atlaskit/form';

import { DatePicker } from '../../src';

const validateField = (value?: string) => {
	if (!value) {
		return 'REQUIRED';
	}
};

const DatePickerValidationExample = () => (
	<Form onSubmit={(formState) => console.log('form submitted', formState)}>
		{({ formProps }) => (
			<form {...formProps}>
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
			</form>
		)}
	</Form>
);

export default DatePickerValidationExample;
