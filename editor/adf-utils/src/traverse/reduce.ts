import { type ADFEntity } from '../types';
import { traverse } from './traverse';

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function reduce<T = any>(
	adf: ADFEntity,
	callback: (accunulator: T, node: ADFEntity) => T,
	initial: T,
): T {
	let result = initial;

	traverse(adf, {
		any: (node) => {
			result = callback(result, node);
		},
	});

	return result;
}
