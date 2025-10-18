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
	FormSection,
	HelperMessage,
	MessageWrapper,
	RequiredAsterisk,
	ValidMessage,
} from '@atlaskit/form';
import { Flex } from '@atlaskit/primitives/compiled';
import TextField from '@atlaskit/textfield';

const FormDefaultExample = () => (
	<Flex direction="column">
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
			<FormSection>
				<Field name="username" label="Username" isRequired defaultValue="dst12">
					{({ fieldProps }) => <TextField autoComplete="off" {...fieldProps} />}
				</Field>
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
											Use 8 or more characters with a mix of letters, numbers, and symbols
										</HelperMessage>
									)}
									{error && (
										<ErrorMessage>Password needs to be more than 8 characters</ErrorMessage>
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
			</FormSection>

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

export default FormDefaultExample;
