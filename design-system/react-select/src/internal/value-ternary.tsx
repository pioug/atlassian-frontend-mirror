import type { MultiValue, OnChangeValue, SingleValue } from '../types';

export function valueTernary<Option, IsMulti extends boolean>(
	isMulti: IsMulti | undefined,
	multiValue: MultiValue<Option>,
	singleValue: SingleValue<Option>,
): OnChangeValue<Option, IsMulti> {
	return (isMulti ? multiValue : singleValue) as OnChangeValue<Option, IsMulti>;
}
