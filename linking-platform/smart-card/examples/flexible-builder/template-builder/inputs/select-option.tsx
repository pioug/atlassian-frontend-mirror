/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { useCallback, useMemo } from 'react';
import Select from '@atlaskit/select/Select';
import { Field } from '@atlaskit/form';
import { type ValueType as Value } from '@atlaskit/select';
import { type ChangeParams, excludeStyles, handleOnChange } from '../../utils';

type Props<T> = {
	defaultValue: T[keyof T];
	exclude?: boolean;
	label?: string;
	name: string;
	onChange: (template: T) => void;
	propName: keyof T;
	options: { label: string; value: T[keyof T] }[];
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
	const styles = useMemo(() => (exclude ? [excludeStyles] : []), [exclude]);
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
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		<span css={styles}>
			<Field<Value<{ label: string; value: string }>> name={name} label={label}>
				{({ fieldProps: { id, ...rest } }) => (
					<Select
						{...rest}
						onChange={handleOnSelectChange(onChange, template, propName, defaultValue)}
						options={options}
						value={value}
					/>
				)}
			</Field>
		</span>
	);
};

export default SelectOption;
