import React, { Fragment } from 'react';

import type { StringField } from '@atlaskit/editor-common/extensions';
import { Field } from '@atlaskit/form';
import TextArea from '@atlaskit/textarea';
import TextField from '@atlaskit/textfield';

import FieldMessages from '../FieldMessages';
import type { OnFieldChange } from '../types';
import { validate } from '../utils';

export default function String({
	name,
	field,
	autoFocus,
	onFieldChange,
	placeholder,
}: {
	autoFocus?: boolean;
	field: StringField;
	name: string;
	onFieldChange: OnFieldChange;
	placeholder?: string;
}): React.JSX.Element {
	const { label, description, defaultValue, isRequired, isDisabled } = field;

	return (
		<Field
			name={name}
			label={label}
			defaultValue={defaultValue || ''}
			isRequired={isRequired}
			// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
			validate={(value?: string) => validate<string>(field, value || '')}
			testId={`config-panel-string-${name}`}
			isDisabled={isDisabled}
		>
			{({ fieldProps, error, meta }) => {
				if (field.style === 'multiline') {
					const { onChange, ...restFieldProps } = fieldProps;
					const { options } = field;

					return (
						<Fragment>
							<TextArea
								// Ignored via go/ees005
								// eslint-disable-next-line react/jsx-props-no-spreading
								{...restFieldProps}
								// Ignored via go/ees005
								// eslint-disable-next-line react/jsx-props-no-spreading
								{...options}
								// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
								onChange={(e) => onChange(e.currentTarget.value)}
								// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
								onBlur={() => {
									fieldProps.onBlur();
									onFieldChange(name, meta.dirty);
								}}
								placeholder={placeholder}
								data-testid={`config-panel-textarea-${name}`}
							/>
							<FieldMessages error={error} description={description} />
						</Fragment>
					);
				}

				return (
					<Fragment>
						<TextField
							// Ignored via go/ees005
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...fieldProps}
							type="text"
							autoFocus={autoFocus}
							// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
							onBlur={() => {
								fieldProps.onBlur();
								onFieldChange(name, meta.dirty);
							}}
							placeholder={placeholder}
						/>
						<FieldMessages error={error} description={description} />
					</Fragment>
				);
			}}
		</Field>
	);
}
