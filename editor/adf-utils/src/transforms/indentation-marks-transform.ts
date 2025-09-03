import { traverse } from '../traverse/traverse';
import { type ADFEntity } from '../types';

const hasChildHeadingWithIndentation = (node: ADFEntity): boolean =>
	node.content?.some(
		(childNode) =>
			childNode?.type === 'heading' &&
			childNode?.marks?.some((mark) => mark.type === 'indentation'),
	) ?? false;

const removeIndentationFromHeadings = (node: ADFEntity) => {
	return {
		...node,
		content: node.content?.map((childNode) => {
			if (childNode?.type === 'heading') {
				return {
					...childNode,
					marks: childNode.marks?.filter((mark) => mark.type !== 'indentation'),
				};
			}
			return childNode;
		}),
	};
};

interface TransformIndentationMarksResult {
	isTransformed: boolean;
	transformedAdf: ADFEntity;
}

export const transformIndentationMarks = (adf: ADFEntity): TransformIndentationMarksResult => {
	let isTransformed: boolean = false;

	const transformedAdf = traverse(adf, {
		tableCell: (node) => {
			if (hasChildHeadingWithIndentation(node)) {
				isTransformed = true;
				return removeIndentationFromHeadings(node);
			}
			return;
		},
		tableHeader: (node) => {
			if (hasChildHeadingWithIndentation(node)) {
				isTransformed = true;
				return removeIndentationFromHeadings(node);
			}
			return;
		},
	}) as ADFEntity;

	return {
		transformedAdf,
		isTransformed,
	};
};
