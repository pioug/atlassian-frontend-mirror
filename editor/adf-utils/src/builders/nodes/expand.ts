import type { ExpandDefinition } from '@atlaskit/adf-schema/expand';
import type { NestedExpandDefinition } from '@atlaskit/adf-schema/nested-expand';
import type { NonNestableBlockContent } from '@atlaskit/adf-schema/non-nestable-block-content';

export const expand =
	(attrs: ExpandDefinition['attrs']) =>
	(...content: Array<NonNestableBlockContent | NestedExpandDefinition>): ExpandDefinition => ({
		type: 'expand',
		attrs,
		content,
	});
