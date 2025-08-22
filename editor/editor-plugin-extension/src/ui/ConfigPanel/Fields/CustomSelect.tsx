import React, { useEffect, useState } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import type {
	CustomField,
	CustomFieldResolver,
	ExtensionManifest,
	Option,
	Parameters,
} from '@atlaskit/editor-common/extensions';
import {
	getCustomFieldResolver,
	configPanelMessages as messages,
} from '@atlaskit/editor-common/extensions';
import { Field } from '@atlaskit/form';
import { AsyncCreatableSelect } from '@atlaskit/select';
import type { ValueType } from '@atlaskit/select';

import FieldMessages from '../FieldMessages';
import type { OnFieldChange } from '../types';
import { validate } from '../utils';

import { formatOptionLabel } from './SelectItem';
import UnhandledType from './UnhandledType';

function FieldError({ name, field }: { field: CustomField; name: string; }) {
	const { type } = field.options.resolver;
	return (
		<UnhandledType
			key={name}
			field={field}
			errorMessage={`Field "${name}" can't be rendered. Missing resolver for "${type}".`}
		/>
	);
}

function CustomSelect({
	name,
	autoFocus,
	extensionManifest,
	placeholder,
	field,
	onFieldChange,
	parameters,
	intl,
}: {
	autoFocus?: boolean;
	extensionManifest: ExtensionManifest;
	field: CustomField;
	name: string;
	onFieldChange: OnFieldChange;
	parameters?: Parameters;
	placeholder?: string;
} & WrappedComponentProps) {
	const {
		defaultValue: fieldDefaultValue,
		description,
		isMultiple,
		isRequired,
		label,
		options,
		isDisabled,
	} = field;
	const [loading, setLoading] = useState(true);
	const [resolver, setResolver] = useState<CustomFieldResolver | null>(null);
	const [defaultOptions, setDefaultOptions] = useState([] as Option[]);
	const [defaultValue, setDefaultValue] = useState<Option | Option[] | undefined>(undefined);

	useEffect(() => {
		let cancel = false;

		async function fetchResolver() {
			setLoading(true);

			try {
				const resolver = await getCustomFieldResolver(extensionManifest, field.options.resolver);

				if (cancel) {
					return;
				}
				setResolver(() => resolver);

				// fetch the default values
				const options = await resolver(undefined, fieldDefaultValue, parameters);
				setDefaultOptions(options);
				if (cancel) {
					return;
				}

				// filter returned values to match the defaultValue
				if (fieldDefaultValue && isMultiple) {
					setDefaultValue(
						options.filter((option: Option) =>
							(fieldDefaultValue as string[]).includes(option.value),
						),
					);
				}

				if (fieldDefaultValue && !isMultiple) {
					setDefaultValue(
						options.find((option: Option) => (fieldDefaultValue as string) === option.value),
					);
				}
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e);
			}

			setLoading(false);
		}

		fetchResolver();
		return () => {
			cancel = true;
		};
	}, [extensionManifest, field.options.resolver, fieldDefaultValue, isMultiple, parameters]);

	function formatCreateLabel(value: string) {
		if (!value) {
			return null;
		}
		const message = intl.formatMessage(messages.createOption);

		return `${message} "${value}"`;
	}

	const { isCreatable, formatCreateLabel: customFormatCreateLabel } = options;
	return (
		<Field<ValueType<Option>>
			name={name}
			label={label}
			isRequired={isRequired}
			defaultValue={defaultValue as ValueType<Option, false>}
			validate={(value) => validate(field, value)}
			testId={`config-panel-custom-select-${name}`}
			isDisabled={isDisabled}
		>
			{({ fieldProps, error }) => (
				<>
					{resolver && (
						<>
							<AsyncCreatableSelect
								// Ignored via go/ees005
								// eslint-disable-next-line react/jsx-props-no-spreading
								{...fieldProps}
								onChange={(value) => {
									fieldProps.onChange(value);
									// We assume onChange is called whenever values actually changed
									// for isDirty
									onFieldChange(name, true);
								}}
								// add type cast to avoid adding a "IsMulti" generic prop (TODO: ED-12072)
								isMulti={(isMultiple || false) as false}
								isClearable={true}
								isValidNewOption={(value: string) => !!(isCreatable && value)}
								validationState={error ? 'error' : 'default'}
								defaultOptions={defaultOptions}
								formatCreateLabel={(value: string) =>
									customFormatCreateLabel
										? customFormatCreateLabel(value)
										: formatCreateLabel(value)
								}
								formatOptionLabel={formatOptionLabel}
								loadOptions={(searchTerm: string) => {
									return resolver(searchTerm, fieldDefaultValue, parameters);
								}}
								autoFocus={autoFocus}
								placeholder={placeholder}
							/>
							<FieldMessages error={error} description={description} />
						</>
					)}
					{!loading && !resolver && <FieldError name={name} field={field} />}
				</>
			)}
		</Field>
	);
}

export default injectIntl(CustomSelect);
