import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import type { AnalyticsEventPayload, EditorAnalyticsAPI } from '../analytics';
import type { HigherOrderCommand } from '../types';

/**
 * Meta information that can be passed to the analytics payload callback
 *
 * @param currentDoc - Current document node after the transaction
 */
interface Meta {
	currentDoc: Node;
}

/**
 * Callback accepts EditorState
 *
 * @remarks
 * The plugin using the Analytics may using an Optional<Analytics> dependency
 * It can be undefined during testing, we may not have included analytics
 * Also in cases where Analytics fails to load, the editor doesn't crash.
 *
 * @param state - EditorState, passed to the callback
 * @param meta - Meta, passed to the callback
 */
type AnalyticsEventPayloadCallback = (
	state: EditorState,
	meta: Meta,
) => AnalyticsEventPayload | undefined;

/**
 * Analytics API
 * @example
 * ```
 * withAnalytics({
 * eventType: EVENT_TYPE.TRACK,
 * action: ACTION.REPLACED_ONE,
 *  actionSubject: ACTION_SUBJECT.TEXT,
 *   attributes: {
 *    triggerMethod,
 *  },
 * })(replace(replaceText))
 * ```
 *
 * @param analyticsApi - EditorAnalyticsAPI, undefined in tests or if analytics fails to load
 * @param payload - AnalyticsEventPayload | AnalyticsEventPayloadCallback - payload to be attached to the transaction
 * @param channel - string - channel to be used for analytics
 */
export function withAnalytics(
	analyticsApi: EditorAnalyticsAPI | undefined,
	payload: AnalyticsEventPayload | AnalyticsEventPayloadCallback,
	channel?: string,
): HigherOrderCommand {
	return (command) => (state, dispatch, view) =>
		command(
			state,
			(tr) => {
				if (dispatch) {
					if (payload instanceof Function) {
						const dynamicPayload = payload(state, { currentDoc: tr.doc });
						if (dynamicPayload) {
							analyticsApi?.attachAnalyticsEvent(dynamicPayload, channel)(tr);
							dispatch(tr);
						}
					} else {
						analyticsApi?.attachAnalyticsEvent(payload, channel)(tr);
						dispatch(tr);
					}
				}
			},
			view,
		);
}
