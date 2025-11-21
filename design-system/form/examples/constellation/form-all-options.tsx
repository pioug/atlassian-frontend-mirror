import React from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import { DateTimePicker } from '@atlaskit/datetime-picker';
import noop from '@atlaskit/ds-lib/noop';
import Form, {
	CheckboxField,
	Field,
	Fieldset,
	FormFooter,
	FormHeader,
	FormSection,
	Label,
	RangeField,
	RequiredAsterisk,
} from '@atlaskit/form';
import { Box, Flex } from '@atlaskit/primitives/compiled';
import { RadioGroup } from '@atlaskit/radio';
import Range from '@atlaskit/range';
import Select, { type OptionType, type ValueType } from '@atlaskit/select';
import TextArea from '@atlaskit/textarea';
import TextField from '@atlaskit/textfield';
import Toggle from '@atlaskit/toggle';

const FormAllOptionsExample = (): React.JSX.Element => (
	<Flex direction="column">
		<Form onSubmit={noop}>
			{({ formProps, submitting }) => (
				<form {...formProps}>
					<FormHeader title="Form header">
						<p aria-hidden="true">
							Required fields are marked with an asterisk <RequiredAsterisk />
						</p>
					</FormHeader>

					<FormSection>
						<Field
							name="textfield-name"
							label="Textfield label"
							isRequired
							defaultValue="default value"
							helperMessage="This is a helper message."
							component={({ fieldProps }) => <TextField autoComplete="off" {...fieldProps} />}
						/>

						<Field
							label="Textarea field label"
							isRequired
							name="textarea-field-name"
							component={({ fieldProps }: any) => <TextArea {...fieldProps} />}
						/>

						<Fieldset legend="Checkbox fieldset legend">
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

						<Fieldset legend="Datetime picker legend">
							{/* This label uses a legend because datetime picker has two fields in it. */}
							<Field
								name="datetime-picker-accessible"
								isRequired
								component={({ fieldProps: { id, ...rest } }) => (
									<DateTimePicker
										{...rest}
										datePickerProps={{
											shouldShowCalendarButton: true,
											label: 'Select date',
											id: id,
										}}
										timePickerProps={{
											label: 'Select time',
										}}
									/>
								)}
							/>
						</Fieldset>

						<RangeField name="rangefield-name" defaultValue={50} label="Range field label">
							{({ fieldProps }) => <Range {...fieldProps} min={0} max={100} />}
						</RangeField>

						<Field<ValueType<OptionType>>
							label="Select field label"
							name="select-field-name"
							id="owner"
							defaultValue={{
								label: 'Atlassian',
								value: 'atlassian',
							}}
							component={({ fieldProps }) => (
								<Select
									isSearchable={false}
									inputId={fieldProps.id}
									options={[
										{ label: 'Atlassian', value: 'atlassian' },
										{ label: 'Sean Curtis', value: 'scurtis' },
										{ label: 'Mike Gardiner', value: 'mg' },
										{ label: 'Charles Lee', value: 'clee' },
									]}
									{...fieldProps}
								/>
							)}
						/>

						<Fieldset legend="Radio group legend">
							<Field
								name="color-selection"
								component={({ fieldProps: { value, ...rest } }) => (
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
										{...rest}
									/>
								)}
							/>
						</Fieldset>

						<CheckboxField name="toggle-default">
							{({ fieldProps }) => (
								<Flex alignItems="center">
									<Box>
										<Label htmlFor="toggle-default">Toggle label</Label>
									</Box>
									<Toggle {...fieldProps} id="toggle-default" value="test value" />
								</Flex>
							)}
						</CheckboxField>
					</FormSection>

					<FormFooter>
						<ButtonGroup label="Form submit options">
							<Button appearance="subtle">Cancel</Button>
							<Button type="submit" appearance="primary" isLoading={submitting}>
								Submit
							</Button>
						</ButtonGroup>
					</FormFooter>
				</form>
			)}
		</Form>
	</Flex>
);

export default FormAllOptionsExample;
