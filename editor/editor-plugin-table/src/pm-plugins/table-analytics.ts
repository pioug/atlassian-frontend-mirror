/**
 * A plugin is created for collecting payload data for tableOverflowChanged analytics event
 */
import {
	ACTION_SUBJECT,
	EVENT_TYPE,
	TABLE_ACTION,
	TABLE_OVERFLOW_CHANGE_TRIGGER,
} from '@atlaskit/editor-common/analytics';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

interface LastTrigger {
	name: TABLE_OVERFLOW_CHANGE_TRIGGER;
}

type TableAnalyticsPluginState = {
	lastTrigger: LastTrigger | undefined;
};

const pluginKey = new PluginKey<TableAnalyticsPluginState>('tableOverflowAnalyticsPlugin');

export const META_KEYS = {
	OVERFLOW_TRIGGER: 'tableOverflowTrigger',
	OVERFLOW_STATE_CHANGED: 'tableOverflowStateChanged',
};

const createPlugin = (
	dispatch: Dispatch,
	dispatchAnalyticsEvent: DispatchAnalyticsEvent,
	tableResizingEnabled: boolean,
) =>
	new SafePlugin({
		key: pluginKey,
		state: {
			init() {
				return {
					lastTrigger: undefined,
				};
			},
			apply(tr, pluginState) {
				const meta = tr.getMeta(META_KEYS.OVERFLOW_TRIGGER);
				const newState = { ...pluginState };
				if (meta) {
					newState.lastTrigger = { ...meta };
					dispatch(pluginKey, newState);
					return newState;
				}

				return pluginState;
			},
		},
		appendTransaction: (transactions, oldState, newState) => {
			const newPluginState = pluginKey.getState(newState);
			let hasAnalyticsBeenDispatched = false;
			const lastTriggerName =
				newPluginState?.lastTrigger?.name ||
				// NOTE: We assume that we know and can correctly differentiate
				// between all triggers of table overflow state change.
				// The only trigger we can't identify is viewport width change.
				// However, since there is still a chance that there are other triggers we didn't think of,
				// all these unknown triggers and viwport width change trigger are captured as EXTERNAL.
				TABLE_OVERFLOW_CHANGE_TRIGGER.EXTERNAL;

			transactions.forEach((tr) => {
				const payload = tr.getMeta(META_KEYS.OVERFLOW_STATE_CHANGED);

				if (payload) {
					dispatchAnalyticsEvent({
						action: TABLE_ACTION.OVERFLOW_CHANGED,
						actionSubject: ACTION_SUBJECT.TABLE,
						actionSubjectId: null,
						eventType: EVENT_TYPE.TRACK,
						attributes: {
							editorWidth: payload.editorWidth,
							parentWidth: payload.parentWidth,
							isOverflowing: payload.isOverflowing,
							wasOverflowing: payload.wasOverflowing,
							width: payload.width,
							tableResizingEnabled,
							trigger: lastTriggerName,
						},
					});

					hasAnalyticsBeenDispatched = true;
				}
			});

			if (hasAnalyticsBeenDispatched) {
				const tr = newState.tr;
				return tr.setMeta(META_KEYS.OVERFLOW_TRIGGER, {});
			}

			return undefined;
		},
	});

export { createPlugin };
