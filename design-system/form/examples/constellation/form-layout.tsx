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
