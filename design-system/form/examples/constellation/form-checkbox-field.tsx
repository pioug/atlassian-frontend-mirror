import React from 'react';

import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import Form, { CheckboxField, Field, Fieldset, FormFooter } from '@atlaskit/form';
import { Flex } from '@atlaskit/primitives/compiled';
import { RadioGroup } from '@atlaskit/radio';

const FormCheckboxExample = () => {
	return (
		<Flex direction="column">
			<Form onSubmit={(data) => console.log(data)}>
				{({ formProps }) => (
					<form {...formProps}>
						<Fieldset legend="Products">
							<CheckboxField name="product" value="jira">
								{({ fieldProps }) => <Checkbox {...fieldProps} label="Jira" />}
							</CheckboxField>
							<CheckboxField name="product" value="confluence">
								{({ fieldProps }) => <Checkbox {...fieldProps} label="Confluence" />}
							</CheckboxField>
							<CheckboxField name="product" value="bitbucket">
								{({ fieldProps }) => <Checkbox {...fieldProps} label="Bitbucket" />}
							</CheckboxField>
						</Fieldset>

						<Field name="permission" defaultValue="" label="Permissions">
							{({ fieldProps }) => (
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
						</Field>

						<CheckboxField name="remember" defaultIsChecked>
							{({ fieldProps }) => <Checkbox {...fieldProps} label="Remember me" />}
						</CheckboxField>

						<FormFooter>
							<Button type="submit" appearance="primary">
								Submit
							</Button>
						</FormFooter>
					</form>
				)}
			</Form>
		</Flex>
	);
};

export default FormCheckboxExample;
