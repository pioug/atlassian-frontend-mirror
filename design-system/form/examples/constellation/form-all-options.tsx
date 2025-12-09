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
				<form noValidate {...formProps}>
					<FormHeader title="Form header">
						<p aria-hidden="true">
							Required fields are marked with an asterisk <RequiredAsterisk />
						</p>
					</FormHeader>

					<FormSection>
						<Field
							name="textfield-name"
							label="Text field label"
							isRequired
							defaultValue=""
							helperMessage="This is helper text."
							component={({ fieldProps }) => <TextField autoComplete="off" {...fieldProps} />}
						/>

						<Field
							name="textarea-field-name"
							label="Text area field label"
							isRequired
							component={({ fieldProps }: any) => <TextArea {...fieldProps} />}
						/>

						<Fieldset legend="Checkbox fieldset label">
							<CheckboxField name="box" value="option1">
								{({ fieldProps }) => <Checkbox {...fieldProps} label="Option 1" />}
							</CheckboxField>
							<CheckboxField name="box" value="option2">
								{({ fieldProps }) => <Checkbox {...fieldProps} label="Option 2" />}
							</CheckboxField>
							<CheckboxField name="box" value="option3">
								{({ fieldProps }) => <Checkbox {...fieldProps} label="Option 3" />}
							</CheckboxField>
						</Fieldset>

						<Fieldset legend="Date time picker label">
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
							component={({ fieldProps }) => (
								<Select
									isSearchable={false}
									inputId={fieldProps.id}
									options={[
										{ label: 'Option 1', value: 'option1' },
										{ label: 'Option 2', value: 'option2' },
										{ label: 'Option 3', value: 'option3' },
										{ label: 'Option 4', value: 'option4' },
									]}
									{...fieldProps}
								/>
							)}
						/>

						<Fieldset legend="Radio group label">
							<Field
								name="color-selection"
								component={({ fieldProps: { value, ...rest } }) => (
									<RadioGroup
										options={[
											{ name: 'radio', value: 'option1', label: 'Option 1' },
											{
												name: 'radio',
												value: 'option2',
												label: 'Option 2',
											},
											{ name: 'radio', value: 'option3', label: 'Option 3' },
											{ name: 'radio', value: 'option4', label: 'Option 4' },
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

					<FormFooter align="start">
						<ButtonGroup label="Form submit options">
							<Button type="submit" appearance="primary" isLoading={submitting}>
								Submit
							</Button>
							<Button appearance="subtle">Cancel</Button>
						</ButtonGroup>
					</FormFooter>
				</form>
			)}
		</Form>
	</Flex>
);

export default FormAllOptionsExample;
