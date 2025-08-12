import React, { Component, Fragment } from 'react';

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
export default class extends Component<{}> {
	handleSubmit = (data: { username: string; email: string }) => {
		return createUser(data);
	};

	render() {
		return (
			<div
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					display: 'flex',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					width: '400px',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					maxWidth: '100%',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					margin: '0 auto',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					flexDirection: 'column',
				}}
			>
				<Form onSubmit={this.handleSubmit}>
					{({ formProps, submitting }) => (
						<form noValidate {...formProps}>
							<FormHeader title="Log In">
								<p aria-hidden="true">
									Required fields are marked with an asterisk <RequiredAsterisk />
								</p>
							</FormHeader>
							<Field
								aria-required={true}
								name="username"
								label="Username"
								defaultValue=""
								isRequired
							>
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
			</div>
		);
	}
}
