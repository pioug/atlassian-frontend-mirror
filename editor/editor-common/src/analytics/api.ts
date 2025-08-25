import type { Transaction, Selection } from '@atlaskit/editor-prosemirror/state';

import type { AnalyticsEventPayload } from './types/events';

export type FireAnalyticsEventOptions = {
	context?: {
		selection: Selection;
	};
	immediate?: boolean;
};

export type EditorAnalyticsAPI = {
	/**
	 * attachAnalyticsEvent is used to attach an analytics payloads to a transaction
	 *
	 * @param {AnalyticsEventPayload} payload - analytics payload
	 * @param {string} [channel="editor"] - optional channel identifier
	 * @param {Transaction} tr - a transaction
	 * @returns {boolean} true if submitted successful, false if not submitted
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
	 * @param {object} [options] - optional options object
	 * @param {boolean} [options.immediate] - if true, fire the event immediately
	 * @param {object} [options.context] - optional context object will include the selection data.
	 */
	fireAnalyticsEvent: (
		payload: AnalyticsEventPayload,
		channel?: string,
		options?: FireAnalyticsEventOptions,
	) => void | undefined;
};
