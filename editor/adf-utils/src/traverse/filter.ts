import { traverse } from '../traverse/traverse';
import type { ADFEntity } from '../types';

export function filter(adf: ADFEntity, callback: (node: ADFEntity) => boolean): Array<ADFEntity> {
	const result: Array<ADFEntity> = [];

	traverse(adf, {
		any: (node) => {
			if (callback(node)) {
				result.push(node);
			}
		},
	});

	return result;
}
