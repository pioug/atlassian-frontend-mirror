/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generates Typescript types for analytics events from analytics.spec.yaml
 *
 * @codegen <<SignedSource::268e746266cde1271e40a794eb774cf3>>
 * @codegenCommand yarn workspace @atlassian/analytics-tooling run analytics:codegen smart-card
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
