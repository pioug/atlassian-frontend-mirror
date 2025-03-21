import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import type { AnalyticsEventPayload } from './types/events';

export type EditorAnalyticsAPI = {
	/**
	 * attachAnalyticsEvent is used to attach an analytics payloads to a transaction
	 *
	 * @param {AnalyticsEventPayload} payload - analytics payload
	 * @param {string} [channel="editor"] - optional channel identifier
	 * @param {Transaction} tr - a transaction
	 * @return {boolean} true if submitted successful, false if not submitted
	 */
	attachAnalyticsEvent: (
		payload: AnalyticsEventPayload,
		channel?: string,
	) => (tr: Transaction) => boolean;
	/**
	 * fireAnalyticsEvent is used to fire an analytics payloads directly
	 *
	 * @param {AnalyticsEventPayload} payload - analytics payload
	 * @param {string} [channel="editor"] - optional channel identifier
	 * @param {object} [options] - optional options where immediate is true will fire event immediately
	 */
	fireAnalyticsEvent: (
		payload: AnalyticsEventPayload,
		channel?: string,
		options?: { immediate?: boolean },
	) => void | undefined;
};
