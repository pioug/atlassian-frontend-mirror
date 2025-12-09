import React, { Fragment } from 'react';

import Button from '@atlaskit/button/new';
import { DatePicker, DateTimePicker } from '@atlaskit/datetime-picker';
import Form, { ErrorMessage, Field, FormFooter, MessageWrapper } from '@atlaskit/form';
import { Flex } from '@atlaskit/primitives/compiled';

interface FormData {
	DOB: string;
	preference: string;
}

const validateOnSubmit = (data: FormData) => {
	let errors: Record<string, string> = {};
	errors = dobValidator(data, errors);
	errors = preferenceValidator(data, errors);
	return errors;
};

const dobValidator = (data: FormData, errors: Record<string, string>) => {
	if (!data.DOB) {
		return {
			...errors,
			DOB: `Select a date of birth.`,
		};
	}

	return errors;
};

const preferenceValidator = (data: FormData, errors: Record<string, string>) => {
	if (!data.preference) {
		return {
			...errors,
			preference: `Select an appointment date and time.`,
		};
	}

	return errors;
};

const FormDateTimePickerExample = (): React.JSX.Element => {
	return (
		<Flex direction="column">
			<Form<FormData>
				onSubmit={(data) => {
					console.log('form data', data);
					return Promise.resolve(validateOnSubmit(data));
				}}
			>
				<Field
					name="DOB"
					label="Date of birth"
					defaultValue=""
					isRequired
					component={({ fieldProps }) => <DatePicker shouldShowCalendarButton {...fieldProps} />}
				/>
				<Field
					name="preference"
					label="Preferred appointment date and time"
					defaultValue="2025-11-01"
					isRequired
				>
					{({ fieldProps: { id, ...rest }, error }) => {
						const validationState = error ? 'error' : 'none';
						return (
							<Fragment>
								<DateTimePicker
									{...rest}
									datePickerProps={{
										shouldShowCalendarButton: true,
										selectProps: { validationState },
										label: 'Date, Preferred appointment date and time',
										id,
									}}
									timePickerProps={{
										selectProps: { validationState },
										label: 'Time, Preferred appointment date and time',
									}}
								/>
								<MessageWrapper>{error && <ErrorMessage>{error}</ErrorMessage>}</MessageWrapper>
							</Fragment>
						);
					}}
				</Field>
				<FormFooter align="start">
					<Button type="submit" appearance="primary">
						Submit
					</Button>
				</FormFooter>
			</Form>
		</Flex>
	);
};

export default FormDateTimePickerExample;
