import React, { useRef, useState } from 'react';

import Button from '@atlaskit/button/new';
import { DatePicker, DateTimePicker } from '@atlaskit/datetime-picker';
import Form, { Field, FormFooter, FormHeader, RequiredAsterisk } from '@atlaskit/form';
import { Flex } from '@atlaskit/primitives/compiled';

interface FormData {
	[key: string]: string;
	DOB: string;
	preference: string;
}

export default () => {
	const [DOBfieldError, setDOBfieldError] = useState(false);
	const [preferenceFieldError, setPreferenceFieldError] = useState(false);

	const DOBfieldRef = useRef<HTMLInputElement>(null);
	const preferenceFieldRef = useRef<HTMLInputElement>(null);

	const setFocusOnFirstInvalidField = () => {
		if (DOBfieldError) {
			DOBfieldRef.current?.focus();
		}
		if (preferenceFieldError && !DOBfieldError) {
			preferenceFieldRef.current?.focus();
		}
	};

	return (
		<Flex direction="column">
			<Form<FormData>
				onSubmit={(data) => {
					console.log('form data', data);
				}}
			>
				<FormHeader title="Book an appointment">
					<p aria-hidden="true">
						Required fields are marked with an asterisk
						<RequiredAsterisk />
					</p>
				</FormHeader>
				<Field
					name="DOB"
					label="Date of birth"
					defaultValue={''}
					isRequired
					validate={(value) => {
						if (value) {
							setDOBfieldError(false);
							return undefined;
						}
						if (!value) {
							setDOBfieldError(true);
						}

						return 'Please select a date to continue';
					}}
					component={({ fieldProps: { id, ['aria-invalid']: ariaInvalid, ...rest } }) => (
						<DatePicker
							selectProps={{
								ref: DOBfieldRef,
								'aria-invalid': ariaInvalid,
								clearControlLabel: 'Clear date of birth',
							}}
							{...rest}
							id={id}
							shouldShowCalendarButton
						/>
					)}
				/>
				<Field
					name="preference"
					label="Preferred appointment date & time"
					defaultValue=""
					isRequired
					validate={(value) => {
						if (value) {
							setPreferenceFieldError(false);
							return undefined;
						}
						if (!value) {
							setPreferenceFieldError(true);
						}

						return 'Please select a date to continue';
					}}
					component={({ fieldProps: { id, ['aria-invalid']: ariaInvalid, ...rest } }) => (
						<DateTimePicker
							{...rest}
							clearControlLabel="Clear preferred appointment date & time"
							datePickerProps={{
								shouldShowCalendarButton: true,
								selectProps: {
									'aria-invalid': ariaInvalid,
									ref: preferenceFieldRef,
								},
							}}
							timePickerProps={{
								selectProps: {
									'aria-invalid': ariaInvalid,
								},
							}}
						/>
					)}
				/>
				<FormFooter>
					<Button type="submit" appearance="primary" onClick={setFocusOnFirstInvalidField}>
						Submit
					</Button>
				</FormFooter>
			</Form>
		</Flex>
	);
};
