import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { normalizeUrl } from '@atlaskit/linking-common/url';

import {
	type LinkCreatedAttributesType,
	type LinkUpdatedAttributesType,
	type LinkDeletedAttributesType,
} from '../common/utils/analytics/analytics.types';
import { type LifecycleAction, type LinkDetails } from '../types';

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

const DEFAULT_ATTRIBUTES_MAP: {
	created: LinkCreatedAttributesType;
	updated: LinkUpdatedAttributesType;
	deleted: LinkDeletedAttributesType;
} = {
	created: {
		sourceEvent: null,
		creationMethod: 'unknown',
	},
	updated: {
		sourceEvent: null,
		updateMethod: 'unknown',
	},
	deleted: {
		sourceEvent: null,
		deleteMethod: 'unknown',
	},
};

/**
 * Given an event, derive a set of attributes
 */
export const processAttributesFromBaseEvent = (
	action: LifecycleAction,
	event: UIAnalyticsEvent,
) => {
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

export const mergeAttributes = (
	action: LifecycleAction,
	details: LinkDetails,
	event?: UIAnalyticsEvent | null,
	attributes?: Record<string, unknown>,
) => {
	const defaultAttributes = DEFAULT_ATTRIBUTES_MAP[action];
	const derivedAttributes = event ? processAttributesFromBaseEvent(action, event) : {};

	return {
		...defaultAttributes,
		...attributes,
		...derivedAttributes,
		smartLinkId: details.smartLinkId,
	};
};

export const getDomainFromUrl = (url: string): string | null => {
	try {
		const normalizedUrl = normalizeUrl(url);
		if (!normalizedUrl) {
			return null;
		}

		return new URL(normalizedUrl).hostname;
	} catch {
		return null;
	}
};
