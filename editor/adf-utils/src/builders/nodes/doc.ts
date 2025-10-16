import type {
	DocNode,
	BlockContent,
	LayoutSectionDefinition,
	MultiBodiedExtensionDefinition,
	SyncBlockDefinition,
	BodiedSyncBlockDefinition,
} from '@atlaskit/adf-schema';

export const doc = (
	...content: Array<
		| BlockContent
		| LayoutSectionDefinition
		| MultiBodiedExtensionDefinition
		| SyncBlockDefinition
		| BodiedSyncBlockDefinition
	>
): DocNode => ({
	type: 'doc',
	version: 1,
	content,
});
