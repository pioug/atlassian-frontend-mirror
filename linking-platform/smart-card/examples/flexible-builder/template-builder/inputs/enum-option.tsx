import React, { useMemo } from 'react';
import SelectOption from './select-option';

type Props<T> = {
	defaultValue: T[keyof T];
	label?: string;
	name: string;
	onChange: (template: T) => void;
	propName: keyof T;
	source: { [key: string]: T[keyof T] };
	template: T;
	value?: T[keyof T];
};
const EnumOption = <TemplateType extends object>(props: Props<TemplateType>) => {
	const { defaultValue, source } = props;
	const options = useMemo(
		() =>
			Object.values(source).map((value) => ({
				label: `${value}${value === defaultValue ? ' (default)' : ''}`,
				value,
			})),
		[defaultValue, source],
	);

	return <SelectOption {...props} options={options} />;
};

export default EnumOption;
