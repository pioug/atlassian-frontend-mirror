/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generates Typescript types for analytics events from analytics.spec.yaml
 *
 * @codegen <<SignedSource::44f56f27cbbaa6afed5bf9e40ede9ad3>>
 * @codegenCommand afm workspace @atlassian/analytics-tooling analytics:codegen link-datasource
 */
import type { AnalyticsEventAttributes, EventKey } from './analytics.types';

type OptionalIfUndefined<T> = undefined extends T ? [param?: T] : [param: T];

export type EventPayloadAttributes<K extends EventKey> = OptionalIfUndefined<
	AnalyticsEventAttributes[K]
>;

type EventTypes = 'ui' | 'track' | 'operational' | 'screen';

type ScreenEventPayload<K extends EventKey> = {
	eventType: 'screen';
	name: string;
	action: 'viewed';
	attributes?: AnalyticsEventAttributes[K];
};

type EventPayload<K extends EventKey> = {
	eventType: Omit<EventTypes, 'screen'>;
	actionSubject: string;
	action: string;
	actionSubjectId?: string;
	attributes?: AnalyticsEventAttributes[K];
};

const createEventPayload = <K extends EventKey>(
	eventKey: K,
	...[attributes]: EventPayloadAttributes<K>
): ScreenEventPayload<K> | EventPayload<K> => {
	const [eventType, actionSubject, action, actionSubjectId] = eventKey.split('.') as [
		string,
		string,
		string,
		string | undefined,
	];
	if (eventType === 'screen') {
		return {
			eventType: eventType,
			name: actionSubject,
			action: 'viewed',
			attributes: attributes,
		};
	}
	return {
		eventType: eventType,
		actionSubject: actionSubject,
		action: action,
		actionSubjectId: actionSubjectId,
		attributes: attributes,
	};
};

export default createEventPayload;
