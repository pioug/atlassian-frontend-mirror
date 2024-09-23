import { Checkbox } from '@atlaskit/checkbox';
import { CheckboxField } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives';
import React, { useCallback } from 'react';
import { type ChangeParams, handleOnChange } from '../../utils';
import Label from './label';

type Props<T extends object> = {
	defaultValue?: boolean;
	exclude?: boolean;
	label?: string;
	name: string;
	onChange: (template: T) => void;
	propName: keyof T;
	template: T;
	tooltipMessage?: string;
};

const CheckboxOption = <T extends object>({
	defaultValue = false,
	exclude,
	label,
	name,
	onChange,
	propName,
	template,
}: Props<T>) => {
	const handleOnCheckboxChange = useCallback(
		<T extends object>(...params: ChangeParams<T>) =>
			(e: React.SyntheticEvent<HTMLInputElement>) => {
				handleOnChange(...params, e.currentTarget.checked);
			},
		[],
	);
	return (
		<Box>
			<CheckboxField name={name}>
				{({ fieldProps }) => (
					<Checkbox
						{...fieldProps}
						isChecked={template[propName] !== undefined ? !!template[propName] : defaultValue}
						label={<Label content={label} exclude={exclude} />}
						onChange={handleOnCheckboxChange(onChange, template, propName, defaultValue)}
					/>
				)}
			</CheckboxField>
		</Box>
	);
};
export default CheckboxOption;
