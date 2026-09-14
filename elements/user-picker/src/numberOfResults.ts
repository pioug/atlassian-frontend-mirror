import { type UserPickerState } from './types';

export function numberOfResults(state: UserPickerState): any {
	return (state.options || []).length;
}
