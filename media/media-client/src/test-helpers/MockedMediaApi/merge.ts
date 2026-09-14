import { type PartialResponseFileItem } from './types';

/**
 * Adds/overrides the attributes from fileItemB into the fileItemA
 * */
export const merge = (
	fileItemA?: PartialResponseFileItem,
	fileItemB?: PartialResponseFileItem,
): PartialResponseFileItem => ({
	...fileItemA,
	...fileItemB,
	details: {
		...fileItemA?.details,
		...fileItemB?.details,
		artifacts: {
			...fileItemA?.details?.artifacts,
			...fileItemB?.details?.artifacts,
		},
	},
});
