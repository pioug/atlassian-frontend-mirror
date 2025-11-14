import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { findParentNodeOfTypeClosestToPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { SyncedBlockPlugin } from '../../syncedBlockPluginType';

/**
 *
 * @returns true if should ignore event happens within bodiedSyncBlock node when offline
 */
export const shouldIgnoreDomEvent = (
	view: EditorView,
	event: MouseEvent | PointerEvent,
	api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined,
) => {
	if (api?.connectivity?.sharedState.currentState()?.mode !== 'offline') {
		return;
	}
	const { bodiedSyncBlock } = view.state.schema.nodes;

	const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
	if (pos === undefined) {
		return;
	}
	const $pos = view.state.doc.resolve(pos);
	const maybeNode = findParentNodeOfTypeClosestToPos($pos, bodiedSyncBlock);

	if (maybeNode) {
		return true;
	}
};
