import React from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import Form, { Field, FormFooter } from '@atlaskit/form';
import { Flex } from '@atlaskit/primitives/compiled';
import TextField from '@atlaskit/textfield';

const FormFieldExample = () => (
	<Flex direction="column">
		<Form onSubmit={(data) => console.log('form data', data)}>
			{({ formProps, submitting }) => (
				<form {...formProps}>
					<Field name="username" defaultValue="" label="Username" isRequired>
						{({ fieldProps }) => <TextField {...fieldProps} />}
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
