import React from 'react';

import Button from '@atlaskit/button/new';
import Form, { Field, FormFooter } from '@atlaskit/form';
import TextArea from '@atlaskit/textarea';

interface FormData {
	[key: string]: string;
	'textarea-validation': string;
}

const validateOnSubmit = (data: FormData) => {
	let errors;
	errors = requiredValidator(data, 'textarea-validation');
	return errors;
};

const requiredValidator = (data: FormData, key: string) => {
	if (data[key] !== 'open sesame') {
		return {
			[key]: 'Incorrect, try ‘open sesame’',
		};
	}
};

export default (): React.JSX.Element => {
	return (
		<Form
			onSubmit={(formData: { 'textarea-validation': string }) => {
				console.log('form data', formData);
				return Promise.resolve(validateOnSubmit(formData));
			}}
		>
			<Field
				label="Only validates on submit = open sesame"
				isRequired
				name="textarea-validation"
				defaultValue=""
				component={({ fieldProps }: any) => <TextArea {...fieldProps} />}
			/>
			<FormFooter>
				<Button type="submit">Submit</Button>
			</FormFooter>
		</Form>
	);
};
