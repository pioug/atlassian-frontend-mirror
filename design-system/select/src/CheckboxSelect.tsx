import React, { useMemo } from 'react';

import Select from './Select';
import { type SelectProps, type OptionType, type SelectComponentsConfig } from './types';
import { CheckboxOption } from './components/input-options';

const CheckboxSelectInternal = <OptionT extends OptionType>({
	components,
	...props
}: SelectProps<OptionT, true>) => {
	const mergedComponents: SelectComponentsConfig<OptionT, true> = useMemo(
		() => ({
			...components,
			Option: CheckboxOption,
		}),
		[components],
	);

	return (
		<Select<OptionT, true>
			closeMenuOnSelect={false}
			hideSelectedOptions={false}
			isMulti
			{...props}
			components={mergedComponents}
		/>
	);
};

const CheckboxSelect = React.memo(
	CheckboxSelectInternal,
	// Type casting as `React.memo` does not forward generic types
	// Reference: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/37087#issuecomment-656596623
) as typeof CheckboxSelectInternal;

export default CheckboxSelect;
