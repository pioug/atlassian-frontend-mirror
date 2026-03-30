import type { MultiValue, OnChangeValue } from '../types';

export function multiValueAsValue<Option, IsMulti extends boolean>(
	multiValue: MultiValue<Option>,
): OnChangeValue<Option, IsMulti> {
	return multiValue as OnChangeValue<Option, IsMulti>;
}
