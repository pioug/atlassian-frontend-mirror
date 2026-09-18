import React from 'react';

import Button from '@atlaskit/button/default/button';
import Field from '@atlaskit/form/field';
import Form from '@atlaskit/form/form';
import { FormFooter } from '@atlaskit/form/form-footer';
import TextArea from '@atlaskit/textarea/text-area';

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
