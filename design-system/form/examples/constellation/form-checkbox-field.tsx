import React from 'react';

import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import { RadioGroup } from '@atlaskit/radio';

import Form, { CheckboxField, Field, Fieldset, FormFooter } from '../../src';

const FormCheckboxExample = () => {
	return (
		<div
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				display: 'flex',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				width: '400px',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				margin: '0 auto',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				flexDirection: 'column',
			}}
		>
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
		</div>
	);
};

export default FormCheckboxExample;
