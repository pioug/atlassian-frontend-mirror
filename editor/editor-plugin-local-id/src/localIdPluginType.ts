import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { CollabEditPlugin } from '@atlaskit/editor-plugin-collab-edit';
import type { CompositionPlugin } from '@atlaskit/editor-plugin-composition';
import type { LimitedModePlugin } from '@atlaskit/editor-plugin-limited-mode';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { NodeWithPos } from '@atlaskit/editor-prosemirror/utils';

export type ActionProps = {
	localId: string;
};

export type LocalIdStatusCode =
	// Current represents that the localId is active and being used in the latest doc.
	| 'current'

	// When any local transaction updates/replaces a localId then old localId will be marked as being localy replaced.
	| 'localChangeByAttr'
	| 'localChangeBySetAttrs'
	| 'localChangeByBatchAttrs'
	| 'localChangeByReplace'
	| 'localChangeByDelete'
	| 'localChangeByReplaceAround'
	| 'localChangeByUnknown'

	// When any remote transaction updates/replaces a localId then old localId will be marked as being remotely replaced.
	| 'remoteChangeByAttr'
	| 'remoteChangeBySetAttrs'
	| 'remoteChangeByBatchAttrs'
	| 'remoteChangeByReplace'
	| 'remoteChangeByDelete'
	| 'remoteChangeByReplaceAround'
	| 'remoteChangeByUnknown'

	// When an AI transaction updates/replaces a localId then the old localId will be marked as being AI replaced.
	// AI transactions performed remotely cannot be identified so these will simply be marked as being remotely replaced.
	| 'AIChangeByAttr'
	| 'AIChangeBySetAttrs'
	| 'AIChangeByBatchAttrs'
	| 'AIChangeByReplace'
	| 'AIChangeByDelete'
	| 'AIChangeByReplaceAround'
	| 'AIChangeByUnknown'

	// When a whole document replacement occurs the old localIds will be marked as such if they're no longer current.
	| 'docChangeByAttr'
	| 'docChangeBySetAttrs'
	| 'docChangeByBatchAttrs'
	| 'docChangeByReplace'
	| 'docChangeByDelete'
	| 'docChangeByReplaceAround'
	| 'docChangeByUnknown';

export interface LocalIdSharedState {
	localIdStatus: Map<string, LocalIdStatusCode> | undefined;
	localIdWatchmenEnabled: boolean | undefined;
}

export type LocalIdPlugin = NextEditorPlugin<
	'localId',
	{
		actions: {
			/**
			 * Get the node with its position in the document
			 *
			 * @param props.localId Local id of the node in question
			 * @returns { node: ProsemirrorNode, pos: number } Object containing prosemirror node and position in the document
			 */
			getNode: (props: ActionProps) => NodeWithPos | undefined;
			/**
			 * Replace the node in the document by its local id
			 *
			 * @param props.localId Local id of the node in question
			 * @param props.value Prosemirror node to replace the node with
			 * @returns boolean if the replace was successful
			 */
			replaceNode: (props: ActionProps & { value: Node }) => boolean;
		};
		dependencies: [
			CompositionPlugin,
			OptionalPlugin<CollabEditPlugin>,
			OptionalPlugin<LimitedModePlugin>,
		];
		sharedState: LocalIdSharedState | undefined;
	}
>;
