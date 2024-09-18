import { monitorForExternal } from '@atlaskit/pragmatic-drag-and-drop/external/adapter';
import { type CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/types';

import { makeFixForAdapter } from './make-fix-for-adapter';

function watchForInteractionStart({ start }: { start: () => void }): CleanupFn {
	return monitorForExternal({
		onDragStart() {
			start();
		},
	});
}

function watchForInteractionEnd({ stop }: { stop: () => void }): CleanupFn {
	return monitorForExternal({
		onDrop() {
			stop();
		},
	});
}

const api = makeFixForAdapter({
	watchForInteractionStart,
	watchForInteractionEnd,
});

export function disableDraggingToCrossOriginIFramesForExternal() {
	return api.registerUsage();
}
