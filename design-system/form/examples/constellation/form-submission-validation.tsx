import React from 'react';

import Button from '@atlaskit/button/new';
import Form, { Field, FormFooter, FormHeader, RequiredAsterisk } from '@atlaskit/form';
import { Flex } from '@atlaskit/primitives/compiled';
import TextField from '@atlaskit/textfield';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createUser = async (data: { username: string; email: string }) => {
	await sleep(500);
	const errors = {
		username: ['jsmith', 'mchan'].includes(data.username)
			? 'This username is already taken, try entering a different username'
			: undefined,
		email: !data.email.includes('@')
			? 'Enter your email in a valid format, like: name@example.com'
			: undefined,
	};
	if (!errors.username && !errors.email) {
		console.log(data);
	}
	return errors;
};

const FormSubmissionValidationExample = (): React.JSX.Element => {
	const handleSubmit = (data: { username: string; email: string }) => {
		return createUser(data);
	};

	return (
		<Flex direction="column">
			<Form onSubmit={handleSubmit}>
				{({ formProps, submitting }) => (
					<form noValidate {...formProps}>
						<FormHeader title="Log In">
							<p aria-hidden="true">
								Required fields are marked with an asterisk <RequiredAsterisk />
							</p>
						</FormHeader>
						<Field
							name="username"
							label="Username"
							defaultValue=""
							isRequired
							helperMessage="Try 'jsmith' or 'mchan'."
							component={({ fieldProps }) => <TextField {...fieldProps} />}
						/>
						<Field
							name="email"
							label="Email"
							defaultValue=""
							isRequired
							helperMessage="Must contain @ symbol"
							component={({ fieldProps }) => <TextField {...fieldProps} />}
						/>
						<FormFooter>
							<Button appearance="primary" type="submit" isLoading={submitting}>
								Create account
							</Button>
						</FormFooter>
					</form>
				)}
			</Form>
		</Flex>
	);
};

export default FormSubmissionValidationExample;
