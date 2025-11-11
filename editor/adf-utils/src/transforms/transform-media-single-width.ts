import { traverse } from '../traverse/traverse';
import { type ADFEntity } from '../types';

// when media single has a invalid width, we fallback to default width
// this the last resort when revert the pixel width, we couldnt determine the correct width value
export const transformMediaSingleWidth = (adf: ADFEntity) => {
	let isTransformed: boolean = false;
	const transformedAdf = traverse(adf, {
		mediaSingle: (node) => {
			const { width, widthType } = node.attrs || {};

			// if width is not a number or greater than 100, and widthType is not set, we set width to 100
			if (typeof width === 'number' && width > 100 && !widthType) {
				isTransformed = true;
				const newAttrs = { ...node.attrs, width: 100 };
				return {
					...node,
					attrs: newAttrs,
				};
			}

			return node;
		},
	});

	return {
		transformedAdf,
		isTransformed,
	};
};
