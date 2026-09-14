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

export default (): React.JSX.Element => {
	return (
		<Flex direction="column" alignItems="center">
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
					<p aria-hidden="true">
						Required fields are marked with an asterisk <RequiredAsterisk />
					</p>
				</FormHeader>

				<FormSection>
					<Field<ValueType<OptionType>>
						label="Owner"
						name="owner"
						id="owner"
						defaultValue={{
							label: 'Atlassian',
							value: 'atlassian',
						}}
						component={({ fieldProps: { id, ...rest } }) => (
							<Select
								id={`${id}-select`}
								isSearchable={false}
								options={[
									{ label: 'Atlassian', value: 'atlassian' },
									{ label: 'Sean Curtis', value: 'scurtis' },
									{ label: 'Mike Gardiner', value: 'mg' },
									{ label: 'Charles Lee', value: 'clee' },
								]}
								{...rest}
							/>
						)}
					/>

					<Field<ValueType<OptionType>>
						name="project"
						id="project"
						label="Project"
						isRequired
						validate={async (value) => {
							if (value) {
								return undefined;
							}

							return new Promise((resolve) => setTimeout(resolve, 300)).then(
								() => 'Please select a project',
							);
						}}
						component={({ fieldProps: { id, ...rest } }) => (
							<Select
								id={`${id}-select`}
								options={[
									{ label: 'Atlaskit', value: 'brisbane' },
									{ label: 'Bitbucket', value: 'bb' },
									{ label: 'Confluence', value: 'conf' },
									{ label: 'Jira', value: 'jra' },
									{ label: 'Stride', value: 'stride' },
								]}
								placeholder="Choose a project&hellip;"
								{...rest}
							/>
						)}
					/>

					<Field
						name="repo-name"
						label="Repository name"
						defaultValue=""
						component={({ fieldProps }) => <Textfield {...fieldProps} />}
					/>

					<CheckboxField name="access-level">
						{({ fieldProps }) => <Checkbox label="This is a private repository" {...fieldProps} />}
					</CheckboxField>
					<Field
						name="color"
						label="Pick a color"
						component={({ fieldProps: { value, ...others } }) => (
							<RadioGroup
								options={[
									{ name: 'color', value: 'red', label: 'Red' },
									{
										name: 'color',
										value: 'blue',
										label: 'Blue',
									},
									{ name: 'color', value: 'yellow', label: 'Yellow' },
									{ name: 'color', value: 'green', label: 'Green' },
								]}
								value={value}
								{...others}
							/>
						)}
					/>
					<Field<ValueType<OptionType>>
						name="include-readme"
						id="include-readme"
						label="Include a readme file?"
						defaultValue={{ label: 'No', value: 'no' }}
						component={({ fieldProps: { id, ...rest } }) => (
							<Select
								id={`${id}-select`}
								isSearchable={false}
								options={[
									{ label: 'No', value: 'no' },
									{
										label: 'Yes, with a template',
										value: 'yes-with-template',
									},
									{
										label: 'Yes, with a tutorial (for beginners)',
										value: 'yes-with-tutorial',
									},
								]}
								{...rest}
							/>
						)}
					/>
				</FormSection>

				<FormFooter>
					<ButtonGroup label="Form submit options">
						<Button appearance="subtle" id="create-repo-cancel">
							Cancel
						</Button>
						<Button appearance="primary" id="create-repo-button" type="submit">
							Create repository
						</Button>
					</ButtonGroup>
				</FormFooter>
			</Form>
		</Flex>
	);
};
