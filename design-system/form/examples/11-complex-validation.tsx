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
	ValidMessage,
} from '@atlaskit/form';
import { Box, Text } from '@atlaskit/primitives/compiled';
import TextField from '@atlaskit/textfield';

interface FormData {
	username: string;
	email: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createUser = async (data: FormData) => {
	await sleep(500);
	const errors = {
		username: ['jsmith', 'mchan'].includes(data.username) ? 'IN_USE' : undefined,
		email: ['jsmith@atlassian.com', 'mchan@atlassian.com'].includes(data.email)
			? 'IN_USE'
			: undefined,
	};
	if (!errors.username && !errors.email) {
		console.log(data);
	}
	return errors;
};

const formContainerStyle = cssMap({
	root: {
		display: 'flex',
		width: '400px',
		maxWidth: '100%',
		margin: '0 auto',
		flexDirection: 'column',
	},
});

// eslint-disable-next-line import/no-anonymous-default-export, @repo/internal/react/no-class-components
export default class extends Component<{}> {
	handleSubmit = (data: FormData) => {
		return createUser(data);
	};

	validateUsername = (value: string = '') => {
		if (value.length < 5) {
			return 'TOO_SHORT';
		}
		return undefined;
	};

	validateEmail = (value: string = '') => {
		if (!value.includes('@')) {
			return 'INVALID_EMAIL';
		}
		return undefined;
	};

	render() {
		return (
			<Box xcss={formContainerStyle.root}>
				<Form<FormData> onSubmit={this.handleSubmit}>
					{({ formProps, submitting }) => (
						<form {...formProps}>
							<FormHeader title="Create an account">
								<Text as="p" aria-hidden={true}>
									Required fields are marked with an asterisk <RequiredAsterisk />
								</Text>
							</FormHeader>
							<Field
								name="username"
								label="Username"
								defaultValue=""
								isRequired
								validate={this.validateUsername}
							>
								{({ fieldProps, error, valid }) => (
									<Fragment>
										<TextField autoComplete="username" {...fieldProps} />
										<MessageWrapper>
											{!error && !valid && (
												<HelperMessage>Should be more than 4 characters</HelperMessage>
											)}
											{!error && valid && (
												<ValidMessage>Nice one, this username is available</ValidMessage>
											)}
											{error === 'TOO_SHORT' && (
												<ErrorMessage>
													Please enter a username that's longer than 4 characters.
												</ErrorMessage>
											)}
											{error === 'IN_USE' && (
												<ErrorMessage>
													This username is already in use, please enter a different username.
												</ErrorMessage>
											)}
										</MessageWrapper>
									</Fragment>
								)}
							</Field>
							<Field
								name="email"
								label="Email"
								defaultValue=""
								isRequired
								validate={this.validateEmail}
							>
								{({ fieldProps, error, valid }) => (
									<Fragment>
										<TextField autoComplete="email" {...fieldProps} />
										<MessageWrapper>
											{!error && !valid && <HelperMessage>Must contain @ symbol</HelperMessage>}
											{!error && valid && <ValidMessage>Nice email!</ValidMessage>}
											{error === 'INVALID_EMAIL' && (
												<ErrorMessage>
													Please enter your email in a valid format, like: name@example.com.
												</ErrorMessage>
											)}
											{error === 'IN_USE' && (
												<ErrorMessage>
													This email is already in use, please enter a different email.
												</ErrorMessage>
											)}
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
			</Box>
		);
	}
}
