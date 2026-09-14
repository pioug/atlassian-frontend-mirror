import type {
	NestedExpandDefinition,
	NestedExpandContent,
} from '@atlaskit/adf-schema/nested-expand';

export const nestedExpand =
	(attrs: NestedExpandDefinition['attrs']) =>
	(...content: NestedExpandContent): NestedExpandDefinition => ({
		type: 'nestedExpand',
		attrs,
		content,
	});
