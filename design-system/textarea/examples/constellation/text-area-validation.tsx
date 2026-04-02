import React from 'react';

import Button from '@atlaskit/button/new';
import Form, { Field, FormFooter } from '@atlaskit/form';
import TextArea from '@atlaskit/textarea';

function validate(value: unknown) {
	if (value !== 'open sesame') {
		return 'This field is required. Try entering text in this field.';
	}
	return undefined;
}

export default function TextAreaFormValidationExample(): React.JSX.Element {
	const handleSubmit = (formState: { command: string }) => {
		console.log('form state', formState);
	};

	return (
		<Form onSubmit={handleSubmit} name="validation-example">
			{' '}
			<Field
				label="Description"
				isRequired
				name="command"
				validate={validate}
				defaultValue=""
				helperMessage="Your description will be added to the board."
				component={({ fieldProps }: any) => <TextArea {...fieldProps} />}
			/>
			<FormFooter>
				<Button type="submit" appearance="primary">
					Submit
				</Button>
			</FormFooter>
		</Form>
	);
}
