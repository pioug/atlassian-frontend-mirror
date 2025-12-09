import React from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import Form, { Field, FormFooter, FormHeader, FormSection } from '@atlaskit/form';
import { Flex, Text } from '@atlaskit/primitives/compiled';
import TextField from '@atlaskit/textfield';

const FormFieldExample = (): React.JSX.Element => (
	<Flex direction="column">
		<Form onSubmit={(data) => console.log('form data', data)}>
			{({ formProps, submitting }) => (
				<form {...formProps}>
					<FormHeader title="Archive page"></FormHeader>
					<Text as="p">Add an optional note to say why this page was archived.</Text>
					<FormSection>
						<Field name="note" defaultValue="" label="Note">
							{({ fieldProps }) => (
								<>
									<TextField {...fieldProps} />
								</>
							)}
						</Field>
					</FormSection>

					<FormFooter>
						<ButtonGroup label="Form submit options">
							<Button appearance="subtle">Cancel</Button>
							<Button type="submit" appearance="primary" isLoading={submitting}>
								Archive
							</Button>
						</ButtonGroup>
					</FormFooter>
				</form>
			)}
		</Form>
	</Flex>
);

export default FormFieldExample;
