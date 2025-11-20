import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { traverse } from '../traverse/traverse';
import { type ADFEntity } from '../types';

export const syncBlockFallbackTransform = (
	schema: Schema,
	adf: ADFEntity,
): {
	transformedAdf: false | ADFEntity;
	isTransformed: boolean;
} => {
	let isTransformed: boolean = false;

	const { syncBlock, bodiedSyncBlock, unsupportedBlock } = schema.nodes;

	if (!unsupportedBlock) {
		return {
			isTransformed,
			transformedAdf: adf,
		};
	}

	const transformedAdf = traverse(adf, {
		syncBlock: (node) => {
			if (syncBlock) {
				return node;
			}

			isTransformed = true;
			const unsupportedBlockNode = unsupportedBlock.createChecked({ originalValue: node });
			return unsupportedBlockNode.toJSON();
		},
		bodiedSyncBlock: (node) => {
			if (bodiedSyncBlock) {
				return node;
			}

			isTransformed = true;
			const unsupportedBlockNode = unsupportedBlock.createChecked({ originalValue: node });
			return unsupportedBlockNode.toJSON();
		},
		unsupportedBlock: (node) => {
			if (!node.attrs?.originalValue) {
				return node;
			}

			if (node.attrs.originalValue.type === 'syncBlock' && syncBlock) {
				isTransformed = true;
				return node.attrs.originalValue as ADFEntity;
			} else if (node.attrs.originalValue.type === 'bodiedSyncBlock' && bodiedSyncBlock) {
				isTransformed = true;
				return node.attrs.originalValue as ADFEntity;
			}

			return node;
		},
	});

	return {
		transformedAdf,
		isTransformed,
	};
};
