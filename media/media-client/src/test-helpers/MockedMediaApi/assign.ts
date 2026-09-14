import { type ResponseFileItem } from '../../client/media-store/types';
import { type PartialResponseFileItem } from './types';

/**
 * Adds/overrides the attributes from fileItemB into the fileItemA
 * */
export const assign = (
	fileItemA: ResponseFileItem,
	fileItemB?: PartialResponseFileItem,
): ResponseFileItem => ({
	...fileItemA,
	...fileItemB,
	details: {
		...fileItemA.details,
		...fileItemB?.details,
		artifacts: {
			...fileItemA.details?.artifacts,
			...fileItemB?.details?.artifacts,
		},
	},
});
