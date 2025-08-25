import React, { useCallback, useMemo } from 'react';

import { Field } from '@atlaskit/form';
import { type ValueType as Value } from '@atlaskit/select';
import Select from '@atlaskit/select/Select';

import { type ChangeParams, handleOnChange } from '../../utils';

import Label from './label';

type Props<T> = {
	defaultValue: T[keyof T];
	exclude?: boolean;
	label?: string;
	name: string;
	onChange: (template: T) => void;
	options: { label: string; value: T[keyof T] }[];
	propName: keyof T;
	template: T;
	value?: T[keyof T];
};
const SelectOption = <T extends object>({
	defaultValue,
	exclude,
	label,
	name,
	onChange,
	propName,
	options,
	template,
}: Props<T>) => {
	const handleOnSelectChange = useCallback(
		<T extends object>(...params: ChangeParams<T>) =>
			(option: { label: string; value: T[keyof T] } | null) => {
				handleOnChange(...params, option?.value);
			},
		[],
	);

	const value = useMemo(() => {
		const selectedValue = template[propName];
		const selectedOrDefault = selectedValue || defaultValue;
		return options.find((option) => option.value === selectedOrDefault);
	}, [defaultValue, options, propName, template]);

	return (
		<Field<Value<{ label: string; value: string }>>
			name={name}
			label={<Label content={label} exclude={exclude} />}
		>
			{({ fieldProps: { id, ...rest } }) => (
				<Select
					{...rest}
					onChange={handleOnSelectChange(onChange, template, propName, defaultValue)}
					options={options}
					value={value}
				/>
			)}
		</Field>
	);
};

export default SelectOption;
