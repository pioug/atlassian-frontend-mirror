import { type SelectOption } from '../../../common/modal/popup-select/types';

export function isNonNullSelectOption(edge: SelectOption | null): edge is SelectOption {
	return edge !== null;
}
