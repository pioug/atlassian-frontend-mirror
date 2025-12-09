import React from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import Form, { Field, FormFooter } from '@atlaskit/form';
import { Flex } from '@atlaskit/primitives/compiled';
import TextField from '@atlaskit/textfield';

const FormFieldExample = (): React.JSX.Element => (
	<Flex direction="column">
		<Form onSubmit={(data) => console.log('form data', data)}>
			{({ formProps }) => (
				<form {...formProps}>
					<Field
						name="username"
						defaultValue=""
						label="Username"
						isRequired
						helperMessage="Your username can have up to 16 characters."
						validMessage="Username is valid."
						validate={(value) => {
							if (!value) {
								return 'Username is required.';
							} else if (value && value.length > 16) {
								return 'Username must be 16 characters or less.';
							}
						}}
						component={({ fieldProps }) => <TextField {...fieldProps} />}
					/>
					<FormFooter align="start">
						<ButtonGroup label="Form submit options">
							<Button type="submit" appearance="primary">
								Submit
							</Button>
							<Button appearance="subtle">Cancel</Button>
						</ButtonGroup>
					</FormFooter>
				</form>
			)}
		</Form>
	</Flex>
);

export default FormFieldExample;
