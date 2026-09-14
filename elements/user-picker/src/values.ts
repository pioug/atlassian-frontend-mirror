import { optionData2Analytics } from './optionData2Analytics';
import { type UserPickerState } from './types';

export function values(state: UserPickerState): any {
	return state.value
		? Array.isArray(state.value)
			? state.value.map((option) => optionData2Analytics(option.data))
			: [optionData2Analytics(state.value.data)]
		: [];
}
