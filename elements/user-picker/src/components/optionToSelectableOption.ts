import { type Option, type OptionData, type OptionIdentifier } from '../types';

const isOptionData = (option: any): option is OptionData =>
	(option as OptionData).name !== undefined;

export const optionToSelectableOption = (option: OptionData | OptionIdentifier): Option => {
	if (isOptionData(option)) {
		return {
			data: option,
			isDisabled: option.isDisabled,
			label: option.name,
			value: option.id,
		};
	} else {
		return {
			data: {
				...option,
				name: option.id,
			},
			isDisabled: option.isDisabled,
			label: option.id,
			value: option.id,
		};
	}
};
