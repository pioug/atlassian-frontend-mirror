import type {
	DocNode,
	BlockContent,
	LayoutSectionDefinition,
	MultiBodiedExtensionDefinition,
	SyncBlockDefinition,
} from '@atlaskit/adf-schema';

export const doc = (
	...content: Array<
		BlockContent | LayoutSectionDefinition | MultiBodiedExtensionDefinition | SyncBlockDefinition
	>
): DocNode => ({
	type: 'doc',
	version: 1,
	content,
});
