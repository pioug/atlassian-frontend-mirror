import {
	type BlockTaskItemDefinition,
	type ParagraphDefinition,
	type ExtensionDefinition,
} from '@atlaskit/adf-schema';

export const blockTaskItem =
	(attrs: BlockTaskItemDefinition['attrs']) =>
	(...content: Array<ParagraphDefinition | ExtensionDefinition>): BlockTaskItemDefinition => ({
		type: 'blockTaskItem',
		attrs,
		content,
	});
