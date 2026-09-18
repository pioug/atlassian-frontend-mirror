import React, { Fragment } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/default/button';
import { Checkbox } from '@atlaskit/checkbox/checkbox';
import { CheckboxField } from '@atlaskit/form/checkbox-field';
import { ErrorMessage } from '@atlaskit/form/error-message';
import Field from '@atlaskit/form/field';
import Form from '@atlaskit/form/form';
import { FormFooter } from '@atlaskit/form/form-footer';
import { FormHeader } from '@atlaskit/form/form-header';
import { HelperMessage } from '@atlaskit/form/helper-message';
import { MessageWrapper } from '@atlaskit/form/message-wrapper';
import { RequiredAsterisk } from '@atlaskit/form/required-asterisk';
import { ValidMessage } from '@atlaskit/form/valid-message';
import { Flex, Text } from '@atlaskit/primitives/compiled';
import TextField from '@atlaskit/textfield/text-field';

const TOO_SHORT = `Please enter a username that's longer than 4 characters.`;

export default (): React.JSX.Element => {
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
			return TOO_SHORT;
		}
		return undefined;
	};

	const validatePassword = simpleMemoize((value: string = '') => {
		if (value.length < 8) {
			return new Promise((resolve) => setTimeout(resolve, 300)).then(() => TOO_SHORT);
		}
		return undefined;
	});

	return (
		<Flex direction="column">
			<Form<{ username: string; password: string; remember: boolean }>
				onSubmit={(data) => {
					console.log('form data', data);
					return new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
						data.username === 'error'
							? { username: 'This username is already in use, try another one.' }
							: undefined,
					);
				}}
			>
				{({ formProps, submitting }) => (
					<form {...formProps}>
						<FormHeader title="Sign in">
							<Text as="p" aria-hidden="true">
								Required fields are marked with an asterisk <RequiredAsterisk />
							</Text>
						</FormHeader>
						<Field
							name="username"
							label="Username"
							isRequired
							defaultValue="hello"
							helperMessage="You can use letters, numbers, and periods."
							validate={validateUsername}
							component={({ fieldProps }) => <TextField autoComplete="username" {...fieldProps} />}
						/>
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
										{error && <ErrorMessage>{error}</ErrorMessage>}
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
		</Flex>
	);
};
