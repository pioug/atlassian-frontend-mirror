import { type ADFEntity } from '../types';
import { traverse } from './traverse';

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function map<T = any>(adf: ADFEntity, callback: (node: ADFEntity) => T): Array<T> {
	const result: Array<T> = [];

	traverse(adf, {
		any: (node) => {
			result.push(callback(node));
		},
	});

	return result;
}
