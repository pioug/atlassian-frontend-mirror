import React from 'react';

import { components, type OptionType, type SingleValueProps } from '@atlaskit/select';

/**
 * This creates a functional component that `react-select` will use to make the
 * SingleValue part of the different pickers.
 */
export const makeSingleValue =
	({ lang }: { lang: string }) =>
	({
		children,
		className,
		clearValue,
		cx,
		data,
		getStyles,
		getValue,
		hasValue,
		isDisabled,
		isMulti,
		isRtl,
		options,
		selectOption,
		selectProps,
		setValue,
		...rest
	}: SingleValueProps<OptionType, false>) => {
		return (
			<components.SingleValue
				// We have to have this because `getClassNames` is missing. Can't define
				// it in here, for some reason.
				{...rest}
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides, @atlaskit/ui-styling-standard/no-classname-prop
				className={className}
				clearValue={clearValue}
				cx={cx}
				data={data}
				getStyles={getStyles}
				getValue={getValue}
				hasValue={hasValue}
				innerProps={{ lang }}
				isDisabled={isDisabled}
				isMulti={isMulti}
				isRtl={isRtl}
				options={options}
				selectOption={selectOption}
				selectProps={selectProps}
				setValue={setValue}
			>
				{children}
			</components.SingleValue>
		);
	};
