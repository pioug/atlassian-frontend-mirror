import React, { Fragment } from 'react';

import Button from '@atlaskit/button/new';
import { DatePicker, DateTimePicker } from '@atlaskit/datetime-picker';
import Form, { ErrorMessage, Field, FormFooter, MessageWrapper } from '@atlaskit/form';

interface FormData {
	[key: string]: string;
	DOB: string;
	preference: string;
}

const validateOnSubmit = (data: FormData) => {
	let errors;
	errors = requiredValidator(data, 'DOB', errors);
	errors = requiredValidator(data, 'preference', errors);
	return errors;
};

const requiredValidator = (data: FormData, key: string, errors?: Record<string, string>) => {
	if (!data[key]) {
		return {
			...errors,
			[key]: `Please select a date to continue.`,
		};
	}

	return errors;
};

const FormDateTimePickerExample = () => {
	return (
		<div
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				display: 'flex',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				width: '400px',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				margin: '0 auto',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				flexDirection: 'column',
			}}
		>
			<Form<FormData>
				onSubmit={(data) => {
					console.log('form data', data);
					return Promise.resolve(validateOnSubmit(data));
				}}
			>
				{({ formProps }) => (
					<form {...formProps}>
						<Field name="DOB" label="Date of Birth" defaultValue="" isRequired>
							{({ fieldProps: { id, ...rest }, error }) => (
								<Fragment>
									<DatePicker shouldShowCalendarButton {...rest} id={id} />
									<MessageWrapper>
										{error && <ErrorMessage>Please select a date of birth.</ErrorMessage>}
									</MessageWrapper>
								</Fragment>
							)}
						</Field>
						<Field
							name="preference"
							label="Preferred appointment date & time"
							defaultValue=""
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
												selectProps: {
													// @ts-ignore - https://product-fabric.atlassian.net/browse/DSP-21000
													validationState,
												},
												label: 'Date, Preferred appointment date & time',
												id: id,
											}}
											timePickerProps={{
												selectProps: {
													// @ts-ignore - https://product-fabric.atlassian.net/browse/DSP-21000
													validationState,
												},
												label: 'Time, Preferred appointment date & time',
											}}
										/>
										<MessageWrapper>
											{error && (
												<ErrorMessage>
													{`Please select preferred appointment date & time.`}
												</ErrorMessage>
											)}
										</MessageWrapper>
									</Fragment>
								);
							}}
						</Field>
						<FormFooter>
							<Button type="submit" appearance="primary">
								Submit
							</Button>
						</FormFooter>
					</form>
				)}
			</Form>
		</div>
	);
};

export default FormDateTimePickerExample;
