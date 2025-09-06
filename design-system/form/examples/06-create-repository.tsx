import React from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import Form, {
	ErrorMessage,
	Field,
	FormFooter,
	FormHeader,
	FormSection,
	MessageWrapper,
	RequiredAsterisk,
} from '@atlaskit/form';
import { Flex } from '@atlaskit/primitives/compiled';
import { RadioGroup } from '@atlaskit/radio';
import Select, { type OptionType, type ValueType } from '@atlaskit/select';
import Textfield from '@atlaskit/textfield';

export default () => {
	return (
		<Flex direction="column" alignItems="center">
			<Form onSubmit={console.log}>
				{({ formProps }) => (
					<form
						{...formProps}
						action="//httpbin.org/get"
						method="GET"
						target="submitFrame"
						name="create-repo"
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
								validate={async (value) => {
									if (value) {
										return undefined;
									}

									return new Promise((resolve) => setTimeout(resolve, 300)).then(
										() => 'Please select a project',
									);
								}}
							>
								{({ fieldProps: { id, ...rest }, error }) => (
									<>
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
										<MessageWrapper>{error && <ErrorMessage>{error}</ErrorMessage>}</MessageWrapper>
									</>
								)}
							</Field>

							<Field name="repo-name" label="Repository name" defaultValue="">
								{({ fieldProps }) => <Textfield {...fieldProps} />}
							</Field>

							<Field name="access-level">
								{({ fieldProps: { value, ...others } }) => (
									<Checkbox label="This is a private repository" isChecked={!!value} {...others} />
								)}
							</Field>
							<Field name="color" label="Pick a color">
								{({ fieldProps: { value, ...others } }) => (
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
							</Field>
							<Field<ValueType<OptionType>>
								name="include-readme"
								id="include-readme"
								label="Include a readme file?"
								defaultValue={{ label: 'No', value: 'no' }}
							>
								{({ fieldProps: { id, ...rest } }) => (
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
							</Field>
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
					</form>
				)}
			</Form>
		</Flex>
	);
};
