import type { ADFEntity } from '../types';

import type { ValidatorSpec, Content, CreateSpecReturn } from '../types/validatorTypes';

export function extractAllowedContent(
	validatorSpecs: CreateSpecReturn,
	entity: ADFEntity,
): Content[] {
	// Filter out content type + irrelevant nodes
	const potentialAllowedContent = Object.entries(validatorSpecs).filter((item) => {
		const [node, value] = item;
		if (isValidatorSpec(value)) {
			return node === entity.type;
		}
		const [nodeName, spec] = [value[0], value[1]];
		if (typeof spec === 'string' || typeof spec !== 'object') {
			return false;
		}
		return nodeName === entity.type;
	}) as (ValidatorSpec | Record<string, ValidatorSpec>)[];

	// Keep types such as `mediaSingle_full` which contain additional spec information
	const contentArray: (Content | undefined)[] = potentialAllowedContent.map((allowedContent) => {
		if (isValidatorSpec(allowedContent)) {
			return undefined;
		}
		const value = allowedContent[1];
		return !isValidatorSpec(value) ? ([[value[0], value[1]]] as const) : undefined;
	});
	return contentArray.filter((x): x is Content => !!x);
}

function isValidatorSpec(spec: CreateSpecReturn[string]): spec is ValidatorSpec {
	return (
		spec.props !== undefined ||
		spec.required !== undefined ||
		spec.maxItems !== undefined ||
		spec.minItems !== undefined
	);
}
