import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics/api';
import { ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics/types/enums';

import type { InteractivitySnapshot, SnapshotReason } from './interactivity-snapshot';

/** The reasons that mean the page may not be around long enough to deliver a queued event. */
const REASONS_THE_PAGE_MAY_NOT_OUTLIVE: SnapshotReason[] = ['hidden', 'pagehide', 'unmount'];

/**
 * The `editor interactivity` operational event.
 *
 * `editorSessionId` arrives without being set here: `@atlaskit/analytics-listeners` merges
 * the editor analytics context into the attributes of every event on the editor channel.
 * `objectId` comes both from that context and from the snapshot, which carries the value
 * the session was collected against.
 */
type InteractivityEventPayload = {
	action: 'interactivity';
	actionSubject: ACTION_SUBJECT.EDITOR;
	attributes: InteractivitySnapshot;
	eventType: EVENT_TYPE.OPERATIONAL;
};

/**
 * Sends a snapshot as the `editor interactivity` event.
 *
 * Does nothing without the analytics plugin: an editor without it has nowhere to send events,
 * and the collector keeps measuring either way.
 */
export function fireInteractivityEvent(
	analytics: EditorAnalyticsAPI | undefined,
	snapshot: InteractivitySnapshot,
): void {
	analytics?.fireAnalyticsEvent<InteractivityEventPayload, 'customEventType'>(
		{
			action: 'interactivity',
			actionSubject: ACTION_SUBJECT.EDITOR,
			eventType: EVENT_TYPE.OPERATIONAL,
			attributes: snapshot,
		},
		undefined,
		// Events are queued into an idle callback by default, which a page being unloaded never
		// runs and a backgrounded tab throttles. The snapshots taken because the page is going
		// away go immediately; the rest can wait their turn.
		{ immediate: REASONS_THE_PAGE_MAY_NOT_OUTLIVE.includes(snapshot.reason) },
	);
}
