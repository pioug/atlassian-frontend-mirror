import type { Transaction, Selection } from '@atlaskit/editor-prosemirror/state';

import type { AnalyticsEventPayload } from './types/events';

export type FireAnalyticsEventOptions = {
	context?: {
		selection: Selection;
	};
	immediate?: boolean;
};

// A base type for analytics event payloads
export type BaseEventPayload = {
	action: string;
	actionSubject: string;
	actionSubjectId?: string | null;
	// Attributes can be any key-value pairs
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	attributes?: { [key: string]: any };
	eventType: string;
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
	 *
	 * @example
	 * You can also pass custom events using a special type signature:
	 * ```ts
	 * editorAnalyticsAPI.fireAnalyticsEvent<CustomEventType, 'customEventType'>(...);
	 * ```
	 */
	fireAnalyticsEvent: (<
		Payload extends BaseEventPayload,
		CustomEventType extends 'customEventType' | false = false,
	>(
		payload: CustomEventType extends 'customEventType' ? Payload : never,
		channel?: string,
		options?: FireAnalyticsEventOptions,
	) => void | undefined) &
		((
			payload: AnalyticsEventPayload,
			channel?: string,
			options?: FireAnalyticsEventOptions,
		) => void | undefined);
};
