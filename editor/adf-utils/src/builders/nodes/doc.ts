import type { BlockContent } from '@atlaskit/adf-schema/block-content';
import type { BodiedSyncBlockDefinition } from '@atlaskit/adf-schema/bodied-sync-block';
import type { DocNode } from '@atlaskit/adf-schema/doc';
import type { LayoutSectionDefinition } from '@atlaskit/adf-schema/layout-section';
import type { MultiBodiedExtensionDefinition } from '@atlaskit/adf-schema/multi-bodied-extension';
import type { SyncBlockDefinition } from '@atlaskit/adf-schema/sync-block';

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
