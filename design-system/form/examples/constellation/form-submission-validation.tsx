import React, { Fragment } from 'react';

import Button from '@atlaskit/button/new';
import Form, {
	ErrorMessage,
	Field,
	FormFooter,
	FormHeader,
	HelperMessage,
	MessageWrapper,
	RequiredAsterisk,
} from '@atlaskit/form';
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

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
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
						<Field name="username" label="Username" defaultValue="" isRequired>
							{({ fieldProps, error }) => (
								<Fragment>
									<TextField {...fieldProps} />
									<MessageWrapper>
										{!error && <HelperMessage>Try 'jsmith' or 'mchan'</HelperMessage>}
										{error && <ErrorMessage testId="userSubmissionError">{error}</ErrorMessage>}
									</MessageWrapper>
								</Fragment>
							)}
						</Field>
						<Field name="email" label="Email" defaultValue="" isRequired>
							{({ fieldProps, error }) => (
								<Fragment>
									<TextField {...fieldProps} />
									<MessageWrapper>
										{!error && <HelperMessage>Must contain @ symbol</HelperMessage>}
										{error && <ErrorMessage>{error}</ErrorMessage>}
									</MessageWrapper>
								</Fragment>
							)}
						</Field>
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
