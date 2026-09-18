import React from 'react';

import Button from '@atlaskit/button/default/button';
import { Checkbox } from '@atlaskit/checkbox/checkbox';
import { CheckboxField } from '@atlaskit/form/checkbox-field';
import Field from '@atlaskit/form/field';
import { Fieldset } from '@atlaskit/form/fieldset';
import Form from '@atlaskit/form/form';
import { FormFooter } from '@atlaskit/form/form-footer';
import { Flex } from '@atlaskit/primitives/compiled';
import RadioGroup from '@atlaskit/radio/radio-group';

export default (): React.JSX.Element => (
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

			<Field
				name="permission"
				defaultValue=""
				label="Permissions"
				component={({ fieldProps }) => (
					<RadioGroup
						options={[
							{ name: 'permission', value: 'user', label: 'End user' },
							{
								name: 'permission',
								value: 'project-admin',
								label: 'Project admin',
							},
							{
								name: 'permission',
								value: 'admin',
								label: 'Admin',
							},
						]}
						{...fieldProps}
					/>
				)}
			/>

			<CheckboxField name="remember" defaultIsChecked>
				{({ fieldProps }) => <Checkbox {...fieldProps} label="Remember me" />}
			</CheckboxField>

			<FormFooter>
				<Button type="submit" appearance="primary">
					Submit
				</Button>
			</FormFooter>
		</Form>
	</Flex>
);
