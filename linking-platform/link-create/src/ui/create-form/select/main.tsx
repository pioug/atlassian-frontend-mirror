/** @jsx jsx */

import { jsx } from '@emotion/react';

import AkSelect, { type OptionType } from '@atlaskit/select';

import { CreateField } from '../../../controllers/create-field';

import { type SelectProps } from './types';

export const TEST_ID = 'link-create-select';
/**
 * A select component utilising the Atlaskit Select and CreateField.
 * Validation is handled by the form on form submission. Any
 * errors returned by the handleSubmit function passed to the form <Form> that
 * have a key matching the `name` of this field are shown below the field.
 */
export function Select<T = OptionType>({
	id,
	name,
	label,
	isRequired,
	validators,
	validationHelpText,
	testId = TEST_ID,
	...restProps
}: SelectProps<T>) {
	return (
		<CreateField
			id={id}
			name={name}
			label={label}
			isRequired={isRequired}
			validators={validators}
			validationHelpText={validationHelpText}
			testId={testId}
		>
			{({ fieldId, ...fieldProps }) => {
				return <AkSelect inputId={fieldId} {...fieldProps} {...restProps} />;
			}}
		</CreateField>
	);
}
