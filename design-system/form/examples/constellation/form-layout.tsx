import React from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/default/button';
import { Checkbox } from '@atlaskit/checkbox/checkbox';
import Form from '@atlaskit/form/form';
import { CheckboxField } from '@atlaskit/form/checkbox-field';
import Field from '@atlaskit/form/field';
import { FormFooter } from '@atlaskit/form/form-footer';
import { FormHeader } from '@atlaskit/form/form-header';
import { FormSection } from '@atlaskit/form/form-section';
import { RequiredAsterisk } from '@atlaskit/form/required-asterisk';
import { Flex } from '@atlaskit/primitives/compiled';
import RadioGroup from '@atlaskit/radio/radio-group';
import Select from '@atlaskit/select/default';
import type { OptionType, ValueType } from '@atlaskit/select/types';
import Textfield from '@atlaskit/textfield/text-field';

const FormLayoutExample = (): React.JSX.Element => {
	return (
		<Flex direction="column">
			<Form
				onSubmit={console.log}
				name="create-repo"
				formProps={{
					action: '//httpbin.org/get',
					method: 'GET',
					target: 'submitFrame',
				}}
			>
				<FormHeader title="Create a new repository">
					<p>A repository is the central hub for managing and collaborating on your project.</p>
					<p aria-hidden="true">
						Required fields are marked with an asterisk <RequiredAsterisk />
					</p>
				</FormHeader>

				<FormSection>
					<Field<ValueType<OptionType>> label="Owner" name="owner" id="owner">
						{({ fieldProps: { id, ...rest } }) => (
							<Select
								placeholder=""
								id={`${id}-select`}
								isSearchable={false}
								options={[
									{ label: 'Arni Singh', value: 'asingh' },
									{ label: 'Hermione Walters', value: 'hwalters' },
									{ label: 'Parvi Karan', value: 'pkaran' },
									{ label: 'Charles Li', value: 'cli' },
								]}
								{...rest}
							/>
						)}
					</Field>
					<Field<ValueType<OptionType>>
						name="app"
						id="app"
						label="App"
						isRequired
						component={({ fieldProps: { id, ...rest } }) => (
							<Select
								placeholder=""
								id={`${id}-select`}
								options={[
									{ label: 'Atlaskit', value: 'atlaskit' },
									{ label: 'Bitbucket', value: 'bitbucket' },
									{ label: 'Confluence', value: 'confluence' },
									{ label: 'Jira', value: 'jira' },
								]}
								{...rest}
							/>
						)}
					/>
					<Field
						name="repo-name"
						label="Repository name"
						defaultValue=""
						isRequired
						component={({ fieldProps }) => <Textfield {...fieldProps} />}
					/>
					<CheckboxField name="readme-file" label="README file">
						{({ fieldProps }) => <Checkbox label="Include a README file" {...fieldProps} />}
					</CheckboxField>
					<Field
						name="repository"
						label="Repository type"
						component={({ fieldProps: { value, ...others } }) => (
							<RadioGroup
								options={[
									{ name: 'repository', value: 'public', label: 'Public' },
									{
										name: 'repository',
										value: 'private',
										label: 'Private',
									},
								]}
								value={value}
								{...others}
							/>
						)}
					/>
				</FormSection>
				<FormFooter align="start">
					<ButtonGroup label="Form submit options">
						<Button appearance="primary" id="create-repo-cancel" type="submit">
							Create
						</Button>
						<Button appearance="subtle" id="create-repo-button">
							Cancel
						</Button>
					</ButtonGroup>
				</FormFooter>
			</Form>
		</Flex>
	);
};

export default FormLayoutExample;
