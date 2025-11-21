import React from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import Form, {
	ErrorMessage,
	Field,
	FormFooter,
	HelperMessage,
	MessageWrapper,
	ValidMessage,
} from '@atlaskit/form';
import { Flex } from '@atlaskit/primitives/compiled';
import TextField from '@atlaskit/textfield';

const FormFieldExample = (): React.JSX.Element => (
	<Flex direction="column">
		<Form onSubmit={(data) => console.log('form data', data)}>
			{({ formProps, submitting }) => (
				<form {...formProps}>
					<Field
						name="username"
						defaultValue=""
						label="Username"
						isRequired
						validate={(value) => {
							if (!value) {
								return 'Username is required.';
							} else if (value && value.length > 16) {
								return 'Your new username should be under 16 characters.';
							}
						}}
					>
						{({ fieldProps, error, meta }) => (
							<>
								<TextField {...fieldProps} />
								<MessageWrapper>
									<HelperMessage>
										Please create a new username that is under 16 characters.
									</HelperMessage>
									{error && <ErrorMessage>{error}</ErrorMessage>}
									{meta.valid && <ValidMessage>This is a valid username.</ValidMessage>}
								</MessageWrapper>
							</>
						)}
					</Field>
					<FormFooter>
						<ButtonGroup label="Form submit options">
							<Button appearance="subtle">Cancel</Button>
							<Button type="submit" appearance="primary" isLoading={submitting}>
								Submit
							</Button>
						</ButtonGroup>
					</FormFooter>
				</form>
			)}
		</Form>
	</Flex>
);

export default FormFieldExample;
