import React from 'react';

import Form, { Field, useFormState } from '@atlaskit/form';
import { RadioGroup } from '@atlaskit/radio';
import TextField from '@atlaskit/textfield';

const LoginForm = () => (
	<>
		<Field
			name="email"
			label="Email"
			defaultValue=""
			isRequired
			component={({ fieldProps }) => <TextField {...fieldProps} />}
		/>
		<Field
			name="password"
			label="Password"
			defaultValue=""
			isRequired
			component={({ fieldProps }) => <TextField {...fieldProps} />}
		/>
	</>
);

const SignUpForm = () => (
	<>
		<Field
			name="name"
			label="Name"
			defaultValue=""
			isRequired
			component={({ fieldProps }) => <TextField {...fieldProps} />}
		/>
		<Field
			name="email"
			label="Email"
			defaultValue=""
			isRequired
			component={({ fieldProps }) => <TextField {...fieldProps} />}
		/>
		<Field
			name="password"
			label="Password"
			defaultValue=""
			isRequired
			component={({ fieldProps }) => <TextField {...fieldProps} />}
		/>
		<Field
			name="confirmPassword"
			label="Confirm password"
			defaultValue=""
			isRequired
			component={({ fieldProps }) => <TextField {...fieldProps} />}
		/>
	</>
);

function ConditionalFieldsExample(): React.JSX.Element {
	const formState = useFormState({ values: true });

	return (
		<>
			<Field
				label="Do you have an existing account?"
				name="existingAccount"
				defaultValue=""
				isRequired
				component={({ fieldProps }) => (
					<RadioGroup
						{...fieldProps}
						options={[
							{ name: 'existingAccount', value: 'yes', label: 'Yes' },
							{ name: 'existingAccount', value: 'no', label: 'No' },
						]}
					/>
				)}
			/>
			{formState?.values.existingAccount === 'yes' ? <LoginForm /> : <SignUpForm />}
		</>
	);
}

export default (): React.JSX.Element => {
	return (
		<Form onSubmit={(data) => console.log('form data', data)}>
			<ConditionalFieldsExample />
		</Form>
	);
};
