import { traverse } from '../traverse/traverse';
import { type ADFEntity } from '../types';
import { isEmpty } from './helpers';

const getChildrenTypeCounts: (
	nodeContent: (ADFEntity | undefined)[],
	allowedTypes: string[],
) => { [type: string]: number } = (
	nodeContent: (ADFEntity | undefined)[],
	allowedTypes: string[],
) => {
	const childrenTypes: { [key: string]: number } = {};
	nodeContent.forEach((childNode) => {
		if (!childNode?.type || !allowedTypes.includes(childNode.type)) {
			return;
		}

		if (!childrenTypes[childNode.type]) {
			childrenTypes[childNode.type] = 1;
			return;
		}

		childrenTypes[childNode.type]++;
	});

	return childrenTypes;
};

const removeDuplicatedNodes = (
	type: string,
	content: (ADFEntity | undefined)[],
	predicate: (node: ADFEntity | undefined) => boolean,
) => {
	let maxIterations = 10;
	let childrenTypeCounts = getChildrenTypeCounts(content, [type])[type];
	let firstPredicateNodeIndex = content.findIndex(predicate);
	while (childrenTypeCounts > 1 && firstPredicateNodeIndex > -1 && maxIterations-- > 0) {
		content.splice(firstPredicateNodeIndex, 1);
		firstPredicateNodeIndex = content.findIndex(predicate);
		childrenTypeCounts = getChildrenTypeCounts(content, [type])[type];
	}
};

/**
 * @param  {{[type:string]:number}} allowedTypes - array types allowed to deduplicate
 */
const deduplicateMediaSingleChildren = (
	node: ADFEntity,
	allowedTypes: { [type: string]: number },
) => {
	if (!node.content) {
		return;
	}

	const content = [...node.content];

	Object.keys(allowedTypes).forEach((type) => {
		//prioritise removing empty nodes first
		removeDuplicatedNodes(type, content, (node) => node?.type === type && isEmpty(node));
		//remove other remaining dupicates
		removeDuplicatedNodes(type, content, (node) => node?.type === type);
	});
	return {
		...node,
		content,
	};
};

export const transformInvalidMediaContent = (
	adf: ADFEntity,
): {
	transformedAdf: ADFEntity;
	isTransformed: boolean;
} => {
	let isTransformed: boolean = false;
	const transformedAdf = traverse(adf, {
		mediaSingle: (node) => {
			if (!node?.content?.length) {
				return;
			}

			const disallowedDuplicateTypes = ['media', 'caption'];
			const childrenTypes = getChildrenTypeCounts(node.content, disallowedDuplicateTypes);
			if (Object.values(childrenTypes).some((occurences) => occurences > 1)) {
				isTransformed = true;
				return deduplicateMediaSingleChildren(node, childrenTypes);
			}
			return;
		},
	}) as ADFEntity;

	return {
		transformedAdf,
		isTransformed,
	};
};
