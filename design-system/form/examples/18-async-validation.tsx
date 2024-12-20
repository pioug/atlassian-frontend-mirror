import React, { Fragment } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import Form, {
	CheckboxField,
	ErrorMessage,
	Field,
	FormFooter,
	FormHeader,
	HelperMessage,
	MessageWrapper,
	RequiredAsterisk,
	ValidMessage,
} from '@atlaskit/form';
import { Box, Text, xcss } from '@atlaskit/primitives';
import TextField from '@atlaskit/textfield';

const FormContainerStyle = xcss({
	display: 'flex',
	width: '400px',
	maxWidth: '100%',
	margin: '0 auto',
	flexDirection: 'column',
});

export default () => {
	const simpleMemoize = <T, U>(fn: (arg: T) => U): ((arg: T) => U) => {
		let lastArg: T;
		let lastResult: U;
		return (arg: T): U => {
			if (arg !== lastArg) {
				lastArg = arg;
				lastResult = fn(arg);
			}
			return lastResult;
		};
	};

	const validateUsername = (value: string = '') => {
		if (value.length < 5) {
			return 'TOO_SHORT';
		}
		return undefined;
	};

	const validatePassword = simpleMemoize((value: string = '') => {
		if (value.length < 8) {
			return new Promise((resolve) => setTimeout(resolve, 300)).then(() => 'TOO_SHORT');
		}
		return undefined;
	});

	return (
		<Box xcss={FormContainerStyle}>
			<Form<{ username: string; password: string; remember: boolean }>
				onSubmit={(data) => {
					console.log('form data', data);
					return new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
						data.username === 'error' ? { username: 'IN_USE' } : undefined,
					);
				}}
			>
				{({ formProps, submitting }) => (
					<form {...formProps}>
						<FormHeader title="Sign in">
							<Text as="p" aria-hidden={true}>
								Required fields are marked with an asterisk <RequiredAsterisk />
							</Text>
						</FormHeader>
						<Field
							name="username"
							label="Username"
							isRequired
							defaultValue="hello"
							validate={validateUsername}
						>
							{({ fieldProps, error }) => (
								<Fragment>
									<TextField autoComplete="username" {...fieldProps} />
									<MessageWrapper>
										{!error && (
											<HelperMessage>You can use letters, numbers, and periods.</HelperMessage>
										)}
										{error === 'TOO_SHORT' && (
											<ErrorMessage>
												Please enter a username that's longer than 4 characters.
											</ErrorMessage>
										)}
										{error === 'IN_USE' && (
											<ErrorMessage>This username is already in use, try another one.</ErrorMessage>
										)}
									</MessageWrapper>
								</Fragment>
							)}
						</Field>
						<Field
							name="password"
							label="Password"
							defaultValue=""
							isRequired
							validate={validatePassword}
						>
							{({ fieldProps, error, valid, meta }) => (
								<Fragment>
									<TextField type="password" {...fieldProps} />
									<MessageWrapper>
										{error === 'TOO_SHORT' && (
											<ErrorMessage>
												Please enter a password that's longer than 8 characters.
											</ErrorMessage>
										)}
										{meta.validating && meta.dirty ? (
											<HelperMessage>Checking......</HelperMessage>
										) : null}
										{!meta.validating && valid && meta.dirty ? (
											<ValidMessage>Awesome password!</ValidMessage>
										) : null}
									</MessageWrapper>
								</Fragment>
							)}
						</Field>
						<CheckboxField name="remember" defaultIsChecked>
							{({ fieldProps }) => (
								<Checkbox {...fieldProps} label="Always sign in on this device" />
							)}
						</CheckboxField>
						<FormFooter>
							<ButtonGroup label="Form submit options">
								<Button appearance="subtle">Cancel</Button>
								<Button type="submit" appearance="primary" isLoading={submitting}>
									Sign in
								</Button>
							</ButtonGroup>
						</FormFooter>
					</form>
				)}
			</Form>
		</Box>
	);
};
