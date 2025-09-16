import type { ADFEntity } from '@atlaskit/adf-utils/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { SyncBlockDataProvider } from './types';

// Do this typedef to make it clear that
// this is a local identifier for a resource for local use
type ResourceId = string;

export interface SyncBlock {
	/**
	 * The local content of the block,
	 * this might or might not be synced with the server
	 */
	content?: ADFEntity;
	resourceId: string;

	// the id of the source syncBlock
	sourceLocalId: string;
}

// Represents a SOURCE sync block within the editor.

// A store manager responsible for the lifecycle and state management of sync blocks in an editor instance.
// Supports create, read, update, and delete operations for sync blocks.
// Designed to manage local in-memory state and synchronize with an external data provider.
// Handles caching, debouncing updates, and publish/subscribe for local changes.
// Ensures consistency between local and remote state, and can be used in both editor and renderer contexts.
export class SyncBlockStoreManager {
	private syncBlocks: Map<ResourceId, SyncBlock>;
	private dataProvider?: SyncBlockDataProvider;

	constructor(dataProvider?: SyncBlockDataProvider) {
		this.syncBlocks = new Map();
		this.dataProvider = dataProvider;
	}

	public isSourceBlock(node: PMNode): boolean {
		if (!this.dataProvider || node.type.name !== 'syncBlock') {
			return false;
		}

		const { resourceId, localId } = node.attrs;

		return (
			this.syncBlocks.has(resourceId) && this.syncBlocks.get(resourceId)?.sourceLocalId === localId
		);
	}
}
