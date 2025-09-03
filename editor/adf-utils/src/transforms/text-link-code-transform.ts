import { traverse } from '../traverse/traverse';
import { type ADFEntity } from '../types';

const hasLinkAndCodeMarks = (node: ADFEntity) => {
	const marks = node.marks?.map((mark) => mark.type);
	return marks?.includes('link') && marks?.includes('code');
};

const removeCodeMarks = (node: ADFEntity) => {
	if (node.marks) {
		return {
			...node,
			marks: node.marks.filter((mark) => mark.type !== 'code'),
		};
	}
	return node;
};

// See: HOT-97965 https://product-fabric.atlassian.net/browse/ED-14400
// We declared in code mark spec that links and marks should not co-exist on
// text nodes. This util strips code marks from bad text nodes and preserves links.
export const transformTextLinkCodeMarks = (adf: ADFEntity) => {
	let isTransformed: boolean = false;
	const transformedAdf = traverse(adf, {
		text: (node) => {
			if (hasLinkAndCodeMarks(node)) {
				isTransformed = true;
				return removeCodeMarks(node);
			}
			return;
		},
	});

	return {
		transformedAdf,
		isTransformed,
	};
};
