import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics/api';
import { ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics/types/enums';
import type { SnapshotSendHints } from '@atlaskit/inp-collector/types';

import type { InteractivityEventAttributes } from './interactivity-event-attributes';

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
	attributes: InteractivityEventAttributes;
	eventType: EVENT_TYPE.OPERATIONAL;
};

/**
 * Sends a snapshot's attributes as the `editor interactivity` event.
 *
 * Does nothing without the analytics plugin: an editor without it has nowhere to send events,
 * and the collector keeps measuring either way.
 */
export function fireInteractivityEvent(
	analytics: EditorAnalyticsAPI | undefined,
	attributes: InteractivityEventAttributes,
	{ immediate }: SnapshotSendHints,
): void {
	analytics?.fireAnalyticsEvent<InteractivityEventPayload, 'customEventType'>(
		{
			action: 'interactivity',
			actionSubject: ACTION_SUBJECT.EDITOR,
			eventType: EVENT_TYPE.OPERATIONAL,
			attributes,
		},
		undefined,
		// Events are queued into an idle callback by default, which a page being unloaded never
		// runs and a backgrounded tab throttles.
		{ immediate },
	);
}
