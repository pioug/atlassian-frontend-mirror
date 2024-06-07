import { type EventType } from './constants';

type PrimitiveAttribute = string | number | boolean;
type AnalyticsValue =
	| PrimitiveAttribute
	| PrimitiveAttribute[]
	| Record<string, PrimitiveAttribute | PrimitiveAttribute[]>;
export type AnalyticsAttributes = Record<string, AnalyticsValue>;

export type JqlAnalyticsEvent<Action, ActionSubject, ActionSubjectId> = {
	action: Action;
	actionSubject: ActionSubject;
	actionSubjectId?: ActionSubjectId;
	attributes?: AnalyticsAttributes;
	eventType: EventType;
};
