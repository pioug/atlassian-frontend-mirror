import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	type DispatchAnalyticsEvent,
} from '@atlaskit/editor-common/analytics';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

export const selectionAnalyticsPluginKey = new PluginKey('selectionAnalyticsPluginKey');

interface SelectionAnalyticsState {
	lastCmdAPress: number;
	trackingCmdA: boolean;
}

export const createSelectionAnalyticsPlugin = (dispatchAnalyticsEvent: DispatchAnalyticsEvent) => {
	const keyActions = new Map<string, string>([
		['c', 'copy'],
		['x', 'cut'],
		['z', 'undo'],
		['Escape', 'escape'],
		['Backspace', 'delete'],
	]);

	const isFollowUpKey = (event: KeyboardEvent) =>
		(['c', 'x', 'z'].includes(event.key) && (event.metaKey || event.ctrlKey)) ||
		['Escape', 'Backspace'].includes(event.key);

	const dispatchEvent = (fromDepth: number, followedBy?: string) => {
		dispatchAnalyticsEvent({
			action: ACTION.SELECT_ALL,
			actionSubject: ACTION_SUBJECT.DOCUMENT,
			actionSubjectId: ACTION_SUBJECT_ID.ALL,
			eventType: EVENT_TYPE.TRACK,
			attributes: { followedBy, fromDepth },
		});
	};

	return new SafePlugin({
		key: selectionAnalyticsPluginKey,
		state: {
			init: (): SelectionAnalyticsState => ({
				lastCmdAPress: 0,
				trackingCmdA: false,
			}),
			apply(tr, state: SelectionAnalyticsState): SelectionAnalyticsState {
				const meta = tr.getMeta(selectionAnalyticsPluginKey);
				return meta ? { ...state, ...meta } : state;
			},
		},
		props: {
			handleDOMEvents: {
				keydown(view, event) {
					const { lastCmdAPress, trackingCmdA } = selectionAnalyticsPluginKey.getState(view.state);
					const tr = view.state.tr;
					const depth = view.state.selection.$from.depth;
					const metaKey = event.metaKey || event.ctrlKey;

					if (event.key === 'a' && metaKey) {
						tr.setMeta(selectionAnalyticsPluginKey, {
							lastCmdAPress: Date.now(),
							trackingCmdA: true,
						});
						dispatchEvent(depth);
						view.dispatch(tr);
					} else if (trackingCmdA && Date.now() - lastCmdAPress < 5000 && isFollowUpKey(event)) {
						tr.setMeta(selectionAnalyticsPluginKey, { trackingCmdA: false });
						dispatchEvent(depth, keyActions.get(event.key));
						view.dispatch(tr);
					}

					return false;
				},
			},
		},
	});
};
