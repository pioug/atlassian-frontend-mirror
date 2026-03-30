import type { OnChangeValue, SingleValue } from '../types';

export function singleValueAsValue<Option, IsMulti extends boolean>(
	singleValue: SingleValue<Option>,
): OnChangeValue<Option, IsMulti> {
	return singleValue as OnChangeValue<Option, IsMulti>;
}
