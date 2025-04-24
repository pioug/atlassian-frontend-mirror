import React, { Fragment } from 'react';

import type { EnumRadioField } from '@atlaskit/editor-common/extensions';
import { Field } from '@atlaskit/form';
import { RadioGroup } from '@atlaskit/radio';

import FieldMessages from '../FieldMessages';
import type { OnFieldChange } from '../types';
import { FieldTypeError } from '../types';
import { validate } from '../utils';

export default function RadioField({
	name,
	field,
	onFieldChange,
}: {
	name: string;
	field: EnumRadioField;
	onFieldChange: OnFieldChange;
}) {
	if (field.isMultiple) {
		return <FieldMessages error={FieldTypeError.isMultipleAndRadio} />;
	}

	return (
		<Field
			name={name}
			label={field.label}
			defaultValue={field.defaultValue}
			isRequired={field.isRequired}
			validate={(value?: string) => validate<string | undefined>(field, value)}
			testId={`config-panel-radio-group-${field.name}`}
			isDisabled={field.isDisabled}
		>
			{({ fieldProps, error }) => (
				<Fragment>
					<RadioGroup
						// Ignored via go/ees005
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...fieldProps}
						options={(field.items || []).map((option) => ({
							...option,
							name: field.name,
						}))}
						onChange={(value) => {
							fieldProps.onChange(value);
							onFieldChange(field.name, true);
						}}
					/>
					<FieldMessages error={error} />
				</Fragment>
			)}
		</Field>
	);
}
