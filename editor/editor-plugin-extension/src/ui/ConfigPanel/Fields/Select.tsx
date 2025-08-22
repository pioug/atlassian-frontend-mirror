import React, { Fragment } from 'react';

import type { EnumSelectField, Option } from '@atlaskit/editor-common/extensions';
import { Field } from '@atlaskit/form';
import type { ValueType } from '@atlaskit/select';
import Select from '@atlaskit/select';

import FieldMessages from '../FieldMessages';
import type { OnFieldChange } from '../types';
import { getOptionFromValue, validate } from '../utils';

import { formatOptionLabel } from './SelectItem';

export default function SelectField({
	name,
	field,
	onFieldChange,
	autoFocus,
	placeholder,
	fieldDefaultValue,
}: {
	autoFocus?: boolean;
	field: EnumSelectField;
	fieldDefaultValue?: string | string[];
	name: string;
	onFieldChange: OnFieldChange;
	placeholder?: string;
}) {
	//ignore arrays as mutli-value select fields are always clearable
	const hasValidSingleDefaultValue =
		!Array.isArray(fieldDefaultValue) && fieldDefaultValue !== undefined;

	const isClearable = !hasValidSingleDefaultValue || field.isMultiple;

	return (
		<Field<ValueType<Option>>
			name={name}
			label={field.label}
			defaultValue={getOptionFromValue(field.items, field.defaultValue) as ValueType<Option, false>}
			testId={`config-panel-select-${name}`}
			isRequired={field.isRequired}
			validate={(value: ValueType<Option> | null | undefined) => {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				return validate<ValueType<Option>>(field, value!);
			}}
			isDisabled={field.isDisabled}
		>
			{({ fieldProps, error }) => (
				<Fragment>
					<Select
						// Ignored via go/ees005
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...{
							...fieldProps,
							// Pass `id` as `inputId` so that the input gets the correct id, and make sure there are no duplicate ids
							inputId: fieldProps.id,
							id: undefined,
						}}
						onChange={(value) => {
							fieldProps.onChange(value);
							onFieldChange(name, true);
						}}
						// add type cast to avoid adding a "IsMulti" generic prop (TODO: ED-12072)
						isMulti={(field.isMultiple || false) as false}
						options={field.items || []}
						isClearable={isClearable}
						validationState={error ? 'error' : 'default'}
						formatOptionLabel={formatOptionLabel}
						autoFocus={autoFocus}
						menuPlacement="auto"
						placeholder={placeholder}
					/>
					<FieldMessages error={error} description={field.description} />
				</Fragment>
			)}
		</Field>
	);
}
