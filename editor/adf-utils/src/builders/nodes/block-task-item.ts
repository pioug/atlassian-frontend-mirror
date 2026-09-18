import type { ExtensionDefinition } from '@atlaskit/adf-schema/extension';
import type { ParagraphDefinition } from '@atlaskit/adf-schema/paragraph';
import type { BlockTaskItemDefinition } from '@atlaskit/adf-schema/task-item';

export const blockTaskItem =
	(attrs: BlockTaskItemDefinition['attrs']) =>
	(...content: Array<ParagraphDefinition | ExtensionDefinition>): BlockTaskItemDefinition => ({
		type: 'blockTaskItem',
		attrs,
		content,
	});
