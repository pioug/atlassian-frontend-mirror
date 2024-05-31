import React from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { DatePicker } from '@atlaskit/datetime-picker';
import type { DateField } from '@atlaskit/editor-common/extensions';
import { Field } from '@atlaskit/form';

import FieldMessages from '../FieldMessages';
import type { OnFieldChange } from '../types';
import { validate } from '../utils';

function Date({
	name,
	field,
	autoFocus,
	onFieldChange,
	placeholder,
	intl,
}: {
	name: string;
	field: DateField;
	autoFocus?: boolean;
	onFieldChange: OnFieldChange;
	placeholder?: string;
} & WrappedComponentProps) {
	const { label, description, defaultValue, isRequired } = field;

	return (
		<Field<string>
			name={name}
			label={label}
			defaultValue={defaultValue}
			isRequired={isRequired}
			validate={(value?: string) => validate(field, value)}
			testId={`config-panel-date-picker-${name}`}
		>
			{({ fieldProps, error }) => {
				return (
					<>
						<DatePicker
							{...fieldProps}
							autoFocus={autoFocus}
							onBlur={() => {
								fieldProps.onBlur();
							}}
							onChange={(value: string) => {
								fieldProps.onChange(value);
								onFieldChange(name, true);
							}}
							locale={intl.locale}
							placeholder={placeholder}
						/>
						<FieldMessages error={error} description={description} />
					</>
				);
			}}
		</Field>
	);
}

export default injectIntl(Date);
