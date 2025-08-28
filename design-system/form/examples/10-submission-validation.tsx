import React, { Component, Fragment } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import Form, {
	ErrorMessage,
	Field,
	FormFooter,
	FormHeader,
	HelperMessage,
	MessageWrapper,
	RequiredAsterisk,
} from '@atlaskit/form';
import { Flex, Text } from '@atlaskit/primitives/compiled';
import TextField from '@atlaskit/textfield';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createUser = async (data: { username: string; email: string }) => {
	await sleep(500);
	const errors = {
		username: ['jsmith', 'mchan'].includes(data.username)
			? 'This username is already taken, please enter a different username.'
			: undefined,
		email: !data.email.includes('@')
			? 'Please enter your email in a valid format, like: name@example.com.'
			: undefined,
	};
	if (!errors.username && !errors.email) {
		console.log(data);
	}
	return errors;
};

const formContainerStyle = cssMap({
	root: {
		width: '400px',
		maxWidth: '100%',
		margin: '0 auto',
	},
});

// eslint-disable-next-line import/no-anonymous-default-export, @repo/internal/react/no-class-components
export default class extends Component<{}> {
	handleSubmit = (data: { username: string; email: string }) => {
		return createUser(data);
	};

	render() {
		return (
			<Flex xcss={formContainerStyle.root} direction="column">
				<Form onSubmit={this.handleSubmit}>
					{({ formProps, submitting }) => (
						<form {...formProps}>
							<FormHeader title="Create an account">
								<Text as="p" aria-hidden={true}>
									Required fields are marked with an asterisk <RequiredAsterisk />
								</Text>
							</FormHeader>
							<Field name="username" label="Username" defaultValue="" isRequired>
								{({ fieldProps, error }) => (
									<Fragment>
										<TextField autoComplete="username" {...fieldProps} />
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
										<TextField autoComplete="email" {...fieldProps} />
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
	}
}
