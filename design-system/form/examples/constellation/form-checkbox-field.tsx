import React from 'react';

import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import Form, { CheckboxField, Fieldset, FormFooter } from '@atlaskit/form';
import { Flex } from '@atlaskit/primitives/compiled';

const FormCheckboxExample = (): React.JSX.Element => {
	return (
		<Flex direction="column">
			<Form onSubmit={(data) => console.log(data)}>
				<Fieldset legend="Apps">
					<CheckboxField name="app" value="jira">
						{({ fieldProps }) => <Checkbox {...fieldProps} label="Jira" />}
					</CheckboxField>
					<CheckboxField name="app" value="confluence">
						{({ fieldProps }) => <Checkbox {...fieldProps} label="Confluence" />}
					</CheckboxField>
					<CheckboxField name="app" value="bitbucket">
						{({ fieldProps }) => <Checkbox {...fieldProps} label="Bitbucket" />}
					</CheckboxField>
				</Fieldset>

				<FormFooter align="start">
					<Button type="submit" appearance="primary">
						Submit
					</Button>
				</FormFooter>
			</Form>
		</Flex>
	);
};

export default FormCheckboxExample;
