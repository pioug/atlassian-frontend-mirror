import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import { type LifecycleAction } from '../types';

const getSourceEvent = (payload: Record<string, unknown>): string | null => {
	const base = (
		payload.eventName ? [payload.eventName] : [payload.actionSubject, payload.action]
	).filter(Boolean);

	if (base.length) {
		const baseStr = base.join(' ');

		return payload.actionSubjectId ? `${baseStr} (${payload.actionSubjectId})` : baseStr;
	}

	if (payload['data'] && typeof payload['data'] === 'object') {
		return getSourceEvent({ ...payload['data'] });
	}

	return null;
};

const extractFromEventContext = (propertyNames: string[], event: UIAnalyticsEvent): unknown[] => {
	return event.context.reduce<unknown[]>((acc, contextItem) => {
		propertyNames.forEach((propertyName) => {
			const value: unknown = contextItem[propertyName];

			if (value) {
				acc.push(value);
			}
		});
		return acc;
	}, []);
};

const extractAttributesFromEvent = (event: UIAnalyticsEvent): Record<string, unknown> => {
	const contextAttributes = extractFromEventContext(['attributes'], event).reduce<
		Record<string, unknown>
	>((result, extraAttributes) => {
		if (typeof extraAttributes === 'object' && extraAttributes !== null) {
			return { ...result, ...extraAttributes };
		}
		return result;
	}, {});

	return {
		...contextAttributes,
		...(event.payload.attributes ?? {}),
	};
};

type InputMethodAttributeKey = 'creationMethod' | 'updateMethod' | 'deleteMethod';

const ACTION_INPUT_METHOD_NAME_MAP: Record<LifecycleAction, InputMethodAttributeKey> = {
	created: 'creationMethod',
	updated: 'updateMethod',
	deleted: 'deleteMethod',
};

/**
 * Given an event, derive a set of attributes
 */
export const processAttributesFromBaseEvent = (
	action: LifecycleAction,
	event: UIAnalyticsEvent,
): {
	[x: string]: string | null;
	sourceEvent: string | null;
} => {
	const sourceEvent = getSourceEvent(event.payload);
	const [component] = extractFromEventContext(['component', 'componentName'], event);

	if (typeof component === 'string' && component.toLowerCase() === 'linkpicker') {
		const attribute = ACTION_INPUT_METHOD_NAME_MAP[action];
		const { linkFieldContentInputMethod: inputMethod } = extractAttributesFromEvent(event);

		return {
			sourceEvent,
			[attribute]: `linkpicker_${inputMethod ?? 'none'}`,
		};
	}

	return {
		sourceEvent,
	};
};
