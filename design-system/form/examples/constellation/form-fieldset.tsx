import React from 'react';

import { Checkbox } from '@atlaskit/checkbox';
import Form, { CheckboxField, Fieldset } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives/compiled';

const FormFieldsetExample = () => (
	<Box>
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
			<Fieldset legend="Teams">
				<CheckboxField name="teams" value="jwm">
					{({ fieldProps }) => <Checkbox {...fieldProps} label="Jira" />}
				</CheckboxField>
				<CheckboxField name="teams" value="design-system">
					{({ fieldProps }) => <Checkbox {...fieldProps} label="Design System" />}
				</CheckboxField>
				<CheckboxField name="teams" value="forge">
					{({ fieldProps }) => <Checkbox {...fieldProps} label="Forge" />}
				</CheckboxField>
			</Fieldset>
		</Form>
	</Box>
);

export default FormFieldsetExample;
