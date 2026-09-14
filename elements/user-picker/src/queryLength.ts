import { type UserPickerState } from './types';

export function queryLength(state: UserPickerState): any {
	return state.inputValue.length;
}
