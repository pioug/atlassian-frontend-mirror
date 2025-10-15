import React from 'react';

import Form, { Field, useFormState } from '@atlaskit/form';
import { RadioGroup } from '@atlaskit/radio';
import TextField from '@atlaskit/textfield';

const LoginForm = () => (
	<>
		<Field name="email" label="Email" defaultValue="" isRequired>
			{({ fieldProps }) => <TextField {...fieldProps} />}
		</Field>
		<Field name="password" label="Password" defaultValue="" isRequired>
			{({ fieldProps }) => <TextField {...fieldProps} />}
		</Field>
	</>
);

const SignUpForm = () => (
	<>
		<Field name="name" label="Name" defaultValue="" isRequired>
			{({ fieldProps }) => <TextField {...fieldProps} />}
		</Field>
		<Field name="email" label="Email" defaultValue="" isRequired>
			{({ fieldProps }) => <TextField {...fieldProps} />}
		</Field>
		<Field name="password" label="Password" defaultValue="" isRequired>
			{({ fieldProps }) => <TextField {...fieldProps} />}
		</Field>
		<Field name="confirmPassword" label="Confirm password" defaultValue="" isRequired>
			{({ fieldProps }) => <TextField {...fieldProps} />}
		</Field>
	</>
);

export default function ConditionalFieldsExample() {
	const formState = useFormState({ values: true });

	return (
		<Form onSubmit={(data) => console.log('form data', data)}>
			<Field
				label="Do you have an existing account?"
				name="existingAccount"
				defaultValue=""
				isRequired
			>
				{({ fieldProps }) => (
					<RadioGroup
						{...fieldProps}
						options={[
							{ name: 'existingAccount', value: 'yes', label: 'Yes' },
							{ name: 'existingAccount', value: 'no', label: 'No' },
						]}
					/>
				)}
			</Field>
			{formState?.values.existingAccount === 'yes' ? <LoginForm /> : <SignUpForm />}
		</Form>
	);
}
