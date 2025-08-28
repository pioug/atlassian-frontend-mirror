import React, { Fragment, useRef, useState } from 'react';

import { cssMap } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { DatePicker, DateTimePicker } from '@atlaskit/datetime-picker';
import Form, {
	ErrorMessage,
	Field,
	FormFooter,
	FormHeader,
	MessageWrapper,
	RequiredAsterisk,
} from '@atlaskit/form';
import { Flex } from '@atlaskit/primitives/compiled';

interface FormData {
	[key: string]: string;
	DOB: string;
	preference: string;
}

const styles = cssMap({
	flex: {
		width: '400px',
		maxWidth: '100%',
		margin: '0 auto',
	},
});

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
		<Flex xcss={styles.flex} direction="column">
			<Form<FormData>
				onSubmit={(data) => {
					console.log('form data', data);
				}}
			>
				{({ formProps }) => (
					<form {...formProps}>
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
						>
							{({ fieldProps: { id, ['aria-invalid']: ariaInvalid, ...rest }, error }) => {
								return (
									<Fragment>
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
										<MessageWrapper>{error && <ErrorMessage>{error}</ErrorMessage>}</MessageWrapper>
									</Fragment>
								);
							}}
						</Field>
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
						>
							{({ fieldProps: { id, ['aria-invalid']: ariaInvalid, ...rest }, error }) => {
								return (
									<Fragment>
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
										<MessageWrapper>{error && <ErrorMessage>{error}</ErrorMessage>}</MessageWrapper>
									</Fragment>
								);
							}}
						</Field>
						<FormFooter>
							<Button type="submit" appearance="primary" onClick={setFocusOnFirstInvalidField}>
								Submit
							</Button>
						</FormFooter>
					</form>
				)}
			</Form>
		</Flex>
	);
};
