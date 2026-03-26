import type {
	BlockTaskItemDefinition,
	ParagraphDefinition,
	ExtensionDefinition,
} from '@atlaskit/adf-schema';

export const blockTaskItem =
	(attrs: BlockTaskItemDefinition['attrs']) =>
	(...content: Array<ParagraphDefinition | ExtensionDefinition>): BlockTaskItemDefinition => ({
		type: 'blockTaskItem',
		attrs,
		content,
	});
