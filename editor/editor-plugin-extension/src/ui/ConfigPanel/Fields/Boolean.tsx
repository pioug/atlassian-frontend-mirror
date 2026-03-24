/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { css, jsx } from '@emotion/react';

import { Checkbox as AKCheckbox } from '@atlaskit/checkbox';
import type { BooleanField } from '@atlaskit/editor-common/extensions';
import { Field } from '@atlaskit/form';
import { Text } from '@atlaskit/primitives/compiled';
import AKToggle from '@atlaskit/toggle';
import { token } from '@atlaskit/tokens';

import FieldMessages from '../FieldMessages';
import type { OnFieldChange } from '../types';
import { ValidationError } from '../types';

const toggleFieldWrapperStyles = css({
	display: 'flex',
});

const toggleLabelStyles = css({
	display: 'flex',
	padding: `${token('space.050', '4px')} ${token('space.050', '4px')} ${token(
		'space.050',
		'4px',
	)} ${token('space.0', '0px')}`,
	flexGrow: 1,
});

function validate(value: boolean | string | undefined, isRequired: boolean) {
	if (isRequired && !value) {
		return ValidationError.Required;
	}
}

function parseBoolean(value: boolean | string): boolean {
	if (typeof value === 'boolean') {
		return value;
	}
	return value === 'true';
}

function handleOnChange(
	onChange: (value: boolean) => void,
	onFieldChange: OnFieldChange,
	event: React.ChangeEvent<HTMLInputElement>,
) {
	onChange(event?.target?.checked || false);
	// Note: prior to bumping typescript to version 2.4.2 onFieldChange
	// was being called with a global variable (which had a value of '')
	// While this was not intended, the code still worked as expected.
	// In typescript 2.4.2 accessing the global variable name has been
	// deprecated, so this has been replaced with the value it was
	// previously passing.
	onFieldChange('', true);
}

function Checkbox({
	name,
	field,
	onFieldChange,
}: {
	field: BooleanField;
	name: string;
	onFieldChange: OnFieldChange;
}) {
	const { label, description, isRequired = false, defaultValue = false, isDisabled } = field;

	return (
		<Field<boolean | string>
			name={name}
			isRequired={isRequired}
			// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
			validate={(value) => validate(value, isRequired)}
			defaultValue={defaultValue}
			isDisabled={isDisabled}
		>
			{({ fieldProps, error }) => {
				const { value: isChecked, ...restFieldProps } = fieldProps;
				return (
					<Fragment>
						<AKCheckbox
							// Ignored via go/ees005
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...restFieldProps}
							label={label}
							// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
							onChange={(event) => handleOnChange(fieldProps.onChange, onFieldChange, event)}
							isChecked={parseBoolean(isChecked)}
						/>
						<FieldMessages error={error} description={description} />
					</Fragment>
				);
			}}
		</Field>
	);
}

function Toggle({
	name,
	field,
	onFieldChange,
}: {
	field: BooleanField;
	name: string;
	onFieldChange: OnFieldChange;
}) {
	const { label, description, isRequired = false, defaultValue = false, isDisabled } = field;

	return (
		<Field<boolean | string>
			name={name}
			isRequired={isRequired}
			// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
			validate={(value) => validate(value, isRequired)}
			defaultValue={defaultValue}
			testId={`config-panel-toggle-${name}`}
			isDisabled={isDisabled}
		>
			{({ fieldProps, error }) => {
				const { id, value: isChecked, ...restFieldProps } = fieldProps;
				return (
					<Fragment>
						<div css={toggleFieldWrapperStyles}>
							<label css={toggleLabelStyles} htmlFor={id}>
								{label}
								{isRequired ? (
									// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx
									<Text color="color.text.danger" aria-hidden="true">
										*
									</Text>
								) : null}
							</label>
							<AKToggle
								// Ignored via go/ees005
								// eslint-disable-next-line react/jsx-props-no-spreading
								{...restFieldProps}
								// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
								onChange={(event) => handleOnChange(fieldProps.onChange, onFieldChange, event)}
								isChecked={parseBoolean(isChecked)}
								id={id}
							/>
						</div>
						<FieldMessages error={error} description={description} />
					</Fragment>
				);
			}}
		</Field>
	);
}

export default function Boolean({
	name,
	field,
	onFieldChange,
}: {
	field: BooleanField;
	name: string;
	onFieldChange: OnFieldChange;
}): jsx.JSX.Element {
	if (field.style === 'toggle') {
		return <Toggle name={name} field={field} onFieldChange={onFieldChange} />;
	}
	return <Checkbox name={name} field={field} onFieldChange={onFieldChange} />;
}
