import { type UserPickerState } from './types';

export function spaceInQuery(state: UserPickerState): any {
	return state.inputValue.indexOf(' ') !== -1;
}
