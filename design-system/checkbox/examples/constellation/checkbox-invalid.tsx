import React, { Fragment } from 'react';

import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import Form, { CheckboxField, ErrorMessage, FormFooter } from '@atlaskit/form';

interface FormData {
	[key: string]: string;
	'checkbox-invalid': string;
}

const validateOnSubmit = (data: FormData) => {
	let errors;
	errors = requiredValidator(data, 'checkbox-invalid');
	return errors;
};

const requiredValidator = (data: FormData, key: string) => {
	if (!data[key]) {
		return {
			[key]: `Please read and accept the terms and conditions to continue.`,
		};
	}
};

const CheckboxInvalidExample = () => {
	return (
		<Form<FormData>
			onSubmit={(data) => {
				console.log('form data', data);
				return Promise.resolve(validateOnSubmit(data));
			}}
		>
			<CheckboxField name="checkbox-invalid">
				{({ fieldProps, error }) => (
					<Fragment>
						<Checkbox
							{...fieldProps}
							label="By checking this box you agree to the terms and conditions"
							value="By checking this box you agree to the terms and conditions"
							name="checkbox-invalid"
							testId="cb-invalid"
						/>
						{error && <ErrorMessage>{error}</ErrorMessage>}
					</Fragment>
				)}
			</CheckboxField>
			<FormFooter>
				<Button type="submit">Submit</Button>
			</FormFooter>
		</Form>
	);
};

export default CheckboxInvalidExample;
