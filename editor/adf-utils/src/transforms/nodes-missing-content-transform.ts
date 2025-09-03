import { traverse } from '../traverse/traverse';
import { type ADFEntity } from '../types';
import { tableRow, tableCell, paragraph, listItem } from '../builders';
import type { TableCellDefinition, TextDefinition } from '@atlaskit/adf-schema';
import { isEmpty } from './helpers';

const getMaxColumnsCountForTable = (tableNode: ADFEntity): number => {
	let colsInRow = 1;
	tableNode.content?.forEach((childNode) => {
		if (
			childNode?.type === 'tableRow' &&
			typeof childNode.content?.length === 'number' &&
			childNode.content.length > colsInRow
		) {
			colsInRow = childNode.content.length;
		}
	});
	return colsInRow;
};

const createValidEmptyContent = (node: ADFEntity): ADFEntity[] => {
	switch (node.type) {
		case 'tableCell':
			return [paragraph()];
		default:
			return [];
	}
};

const fixIfTableCellInvalidEmpty = (reportTransform: ReportTransform) => (node: ADFEntity) => {
	if (isEmpty(node)) {
		reportTransform();
		return {
			...node,
			content: createValidEmptyContent(node),
		};
	}
	return;
};

const hasNonListItemChildren = (node: ADFEntity) =>
	node.content?.some((node) => node?.type !== 'listItem');

const hasEmptyListItemChildren = (node: ADFEntity) =>
	node.content?.some((childNode) => childNode?.type === 'listItem' && !childNode.content?.length);

const tryCreateValidListItemWrappedChildren = (parentListNode: ADFEntity) => {
	return parentListNode.content?.map((childNode) => {
		if (childNode) {
			switch (childNode.type) {
				case 'listItem': {
					if (isEmpty(childNode)) {
						const result = listItem([paragraph()]);
						return result;
					}
					return childNode;
				}
				case 'text':
					return listItem([paragraph(childNode as TextDefinition)]);
				default:
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					return listItem([childNode as any]);
			}
		}
		return childNode;
	});
};

const fixIfListParentWithInvalidListItemChildren =
	(reportTransform: ReportTransform) => (node: ADFEntity) => {
		if (hasNonListItemChildren(node) || hasEmptyListItemChildren(node)) {
			reportTransform();
			return {
				...node,
				content: tryCreateValidListItemWrappedChildren(node),
			};
		}
		return;
	};

const hasNonTableRowChildren = (node: ADFEntity) =>
	node.content?.some((node) => node?.type !== 'tableRow');

const tryCreateValidTableRowWrappedChildren = (parentTableNode: ADFEntity) => {
	const maxColsCount = getMaxColumnsCountForTable(parentTableNode);

	return parentTableNode.content?.map((childNode) => {
		if (childNode) {
			switch (childNode.type) {
				case 'text': {
					return tableRow([
						tableCell({})(paragraph(childNode as TextDefinition)),
						...new Array(maxColsCount - 1).fill(tableCell({})(paragraph())),
					]);
				}
				case 'tableCell': {
					return tableRow([childNode as TableCellDefinition]);
				}
				case 'tableRow': {
					if (isEmpty(childNode)) {
						return tableRow([...new Array(maxColsCount).fill(tableCell({})(paragraph()))]);
					}
					return childNode;
				}
				default:
					return childNode;
			}
		}
		return childNode;
	});
};

const hasEmptyTableRowChildren = (node: ADFEntity) =>
	node?.content?.some((node) => node?.type === 'tableRow' && node?.content?.length === 0) ||
	undefined;

const fixIfTableParentWithInvalidTableRowChildren =
	(reportTransform: ReportTransform) => (node: ADFEntity) => {
		if (hasEmptyTableRowChildren(node) || hasNonTableRowChildren(node)) {
			reportTransform();
			return {
				...node,
				content: tryCreateValidTableRowWrappedChildren(node),
			};
		}
		return;
	};

const removeMediaSingleWithNoContent = (reportTransform: ReportTransform) => (node: ADFEntity) => {
	if (isEmpty(node)) {
		reportTransform();
		return false;
	}
	return;
};

type ReportTransform = () => void;

interface TransformNodesMissingContentResult {
	isTransformed: boolean;
	transformedAdf: ADFEntity;
}

export const transformNodesMissingContent = (
	adf: ADFEntity,
): TransformNodesMissingContentResult => {
	let isTransformed: boolean = false;

	const reportTransform: ReportTransform = () => {
		isTransformed = true;
	};

	let transformedAdf = traverse(adf, {
		tableCell: fixIfTableCellInvalidEmpty(reportTransform),
	});

	// Empty mediaSingle nodes get stripped from the document and so this transform
	// will create an empty listItem if the media node is in a list. Empty listItems
	// are invalid adf, so we need to transform the mediaSingle nodes first.
	transformedAdf = traverse(transformedAdf || adf, {
		mediaSingle: removeMediaSingleWithNoContent(reportTransform),
	});

	transformedAdf = traverse(transformedAdf || adf, {
		bulletList: fixIfListParentWithInvalidListItemChildren(reportTransform),
		orderedList: fixIfListParentWithInvalidListItemChildren(reportTransform),
		table: fixIfTableParentWithInvalidTableRowChildren(reportTransform),
	}) as ADFEntity;

	return {
		transformedAdf,
		isTransformed,
	};
};
