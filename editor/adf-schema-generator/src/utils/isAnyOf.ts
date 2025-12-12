import type { ADFAttributes, ADFAttributesAnyOf } from '../types/ADFAttribute';

export function isAnyOf(adfAttributes: ADFAttributes): adfAttributes is ADFAttributesAnyOf {
	return adfAttributes && Boolean(adfAttributes.anyOf);
}
