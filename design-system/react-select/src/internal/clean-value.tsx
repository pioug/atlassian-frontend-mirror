import type { Options, PropsValue } from '../types';

export const cleanValue: <Option>(value: PropsValue<Option>) => Options<Option> = <Option,>(
	value: PropsValue<Option>,
): Options<Option> => {
	if (Array.isArray(value)) {
		return value.filter(Boolean);
	}
	if (typeof value === 'object' && value !== null) {
		return [value] as Option[];
	}
	return [];
};
