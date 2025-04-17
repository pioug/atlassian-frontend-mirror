import React, { useMemo } from 'react';

import { CheckboxOption } from './components/input-options';
import Select from './Select';
import { type OptionType, type SelectComponentsConfig, type SelectProps } from './types';

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

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default CheckboxSelect;
