import React from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import Form, {
	CheckboxField,
	Field,
	FormFooter,
	FormHeader,
	FormSection,
	RequiredAsterisk,
} from '@atlaskit/form';
import { Flex } from '@atlaskit/primitives/compiled';
import { RadioGroup } from '@atlaskit/radio';
import Select, { type OptionType, type ValueType } from '@atlaskit/select';
import Textfield from '@atlaskit/textfield';

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
					>
						{({ fieldProps: { id, ...rest } }) => (
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
					</Field>
					<Field<ValueType<OptionType>>
						name="project"
						id="project"
						label="Project"
						isRequired
						component={({ fieldProps: { id, ...rest } }) => (
							<Select
								id={`${id}-select`}
								options={[
									{ label: 'Atlaskit', value: 'atlaskit' },
									{ label: 'Bitbucket', value: 'bitbucket' },
									{ label: 'Confluence', value: 'confluence' },
									{ label: 'Jira', value: 'jira' },
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
					<CheckboxField name="access-level" label="Access level">
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
						label="Include a README?"
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

export default FormLayoutExample;
