import React from 'react';

import Form, { Field, useFormState } from '@atlaskit/form';
import { Box, xcss } from '@atlaskit/primitives';
import { RadioGroup } from '@atlaskit/radio';
import { type OptionsPropType } from '@atlaskit/radio/types';
import TextField from '@atlaskit/textfield';

const formContainerStyles = xcss({
	maxWidth: '400px',
	margin: '0 auto',
});

const radioItems: OptionsPropType = [
	{ name: 'existingAccount', value: 'yes', label: 'Yes' },
	{ name: 'existingAccount', value: 'no', label: 'No' },
];

type LoginOrSignUpForm = {
	existingAccount?: 'yes' | 'no';
	name?: string;
	email?: string;
	password?: string;
	confirmPassword?: string;
};

const LoginForm = () => {
	return (
		<>
			<Field name="email" label="Email" defaultValue="" isRequired>
				{({ fieldProps }) => <TextField {...fieldProps} />}
			</Field>
			<Field name="password" label="Password" defaultValue="" isRequired>
				{({ fieldProps }) => <TextField {...fieldProps} />}
			</Field>
		</>
	);
};

const SignUpForm = () => {
	return (
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
};

const AccountLoginOrSignUpConditionalFields = () => {
	const formState = useFormState<LoginOrSignUpForm>({ values: true });
	return (
		<>
			{formState?.values.existingAccount === 'yes' && <LoginForm />}
			{formState?.values.existingAccount === 'no' && <SignUpForm />}
		</>
	);
};

export default function ConditionalFieldsExample() {
	return (
		<Box xcss={formContainerStyles}>
			<Form
				onSubmit={(data) => {
					console.log('form data', data);
				}}
			>
				{({ formProps }) => (
					<form {...formProps}>
						<Field
							label="Do you have an existing account?"
							name="existingAccount"
							defaultValue=""
							isRequired
						>
							{({ fieldProps }) => <RadioGroup {...fieldProps} options={radioItems} />}
						</Field>
						<AccountLoginOrSignUpConditionalFields />
					</form>
				)}
			</Form>
		</Box>
	);
}
