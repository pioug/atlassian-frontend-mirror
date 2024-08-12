import type {
	ExpandDefinition,
	NestedExpandDefinition,
	NonNestableBlockContent,
} from '@atlaskit/adf-schema';

export const expand =
	(attrs: ExpandDefinition['attrs']) =>
	(...content: Array<NonNestableBlockContent | NestedExpandDefinition>): ExpandDefinition => ({
		type: 'expand',
		attrs,
		content,
	});
