import React, { Fragment } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import { Code } from '@atlaskit/code';
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
import { Flex, Text } from '@atlaskit/primitives/compiled';
import TextField from '@atlaskit/textfield';

export default () => (
	<Flex direction="column">
		<Text>
			If your form component only requires spreading <Code>formProps</Code> on the HTML{' '}
			<Code>&lt;form&gt;</Code> element and doesn't utilize any of the other render props like{' '}
			<Code>submitting</Code>, you can simplify the output like below. Props can be added to the
			underlying <Code>&lt;form&gt;</Code> element by applying them to the form component directly
			or the <Code>formProps</Code> object if not directly supported.
		</Text>
		<Form<{ username: string; password: string; remember: boolean }>
			onSubmit={(data) => {
				console.log('form data', data);
			}}
			name="sign-in"
			formProps={{ 'data-attribute': 'example' }}
		>
			<FormHeader title="Sign in">
				<p aria-hidden="true">
					Required fields are marked with an asterisk <RequiredAsterisk />
				</p>
			</FormHeader>
			<Field
				name="username"
				label="Username"
				isRequired
				defaultValue="hello"
				component={({ fieldProps }) => <TextField autoComplete="username" {...fieldProps} />}
			/>
			<Field
				name="password"
				label="Password"
				defaultValue=""
				isRequired
				validate={(value) => (value && value.length < 8 ? 'TOO_SHORT' : undefined)}
			>
				{({ fieldProps, error, valid, meta }) => {
					return (
						<Fragment>
							<TextField type="password" {...fieldProps} />
							<MessageWrapper>
								{error && !valid && (
									<HelperMessage>
										Use 8 or more characters with a mix of letters, numbers & symbols.
									</HelperMessage>
								)}
								{error && (
									<ErrorMessage>Enter a password that's longer than 8 characters.</ErrorMessage>
								)}
								{valid && meta.dirty ? <ValidMessage>Awesome password!</ValidMessage> : null}
							</MessageWrapper>
						</Fragment>
					);
				}}
			</Field>
			<CheckboxField name="remember" defaultIsChecked>
				{({ fieldProps }) => <Checkbox {...fieldProps} label="Always sign in on this device" />}
			</CheckboxField>
			<FormFooter>
				<ButtonGroup label="Form submit options">
					<Button appearance="subtle">Cancel</Button>
					<Button type="submit" appearance="primary">
						Sign up
					</Button>
				</ButtonGroup>
			</FormFooter>
		</Form>
	</Flex>
);
