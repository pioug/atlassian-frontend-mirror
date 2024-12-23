import type { Metadata, CollabEvents } from '@atlaskit/editor-common/collab';

import isEqual from 'lodash/isEqual';

export class MetadataService {
	private metadata: Metadata = {};

	constructor(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private providerEmitCallback: (evt: keyof CollabEvents, data: any) => void,
		private broadcastMetadata: (metadata: Metadata) => void,
	) {}

	getMetaData = () => this.metadata;

	getTitle = () => {
		return this.metadata.title?.toString();
	};

	/**
	 * Called when a metadata is changed externally from other clients/backend.
	 */
	onMetadataChanged = (metadata?: Metadata) => {
		if (
			metadata !== undefined &&
			!isEqual(this.metadata, metadata) &&
			Object.keys(metadata).length > 0
		) {
			this.metadata = metadata;
			this.providerEmitCallback('metadata:changed', metadata);
		}
	};

	setTitle(title: string, broadcast?: boolean) {
		if (broadcast) {
			this.broadcastMetadata({ title });
		}
		this.metadata.title = title;
	}

	setEditorWidth(editorWidth: string, broadcast?: boolean) {
		if (broadcast) {
			this.broadcastMetadata({ editorWidth });
		}
		this.metadata.editorWidth = editorWidth;
	}

	/**
	 * Updates the local metadata and broadcasts the metadata to other clients/backend.
	 * @param metadata
	 */
	setMetadata = (metadata: Metadata) => {
		this.broadcastMetadata(metadata);
		this.metadata = metadata;
	};

	/**
	 * Emits a change in document's metadata
	 * @param metadata
	 */
	updateMetadata = (metadata: Metadata | undefined) => {
		if (metadata && Object.keys(metadata).length > 0) {
			this.metadata = metadata;
			this.providerEmitCallback('metadata:changed', metadata);
		}
	};
}
