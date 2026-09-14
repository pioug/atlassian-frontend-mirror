import { type AtlaskitSelectValue, type OptionData } from '../types';

export const extractOptionValue = (
	value: AtlaskitSelectValue,
): OptionData | OptionData[] | undefined => {
	if (!value) {
		return undefined;
	}
	if (Array.isArray(value)) {
		return value.map(({ data: option }) => option);
	}
	return value.data;
};
