import type { ACTION, ACTION_SUBJECT, EVENT_TYPE } from './enums';

type AEP<
	Action,
	ActionSubject,
	ActionSubjectID,
	Attributes,
	NonPrivacySafeAttributes,
	EventType,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type,
	ImplicitAttributes extends Object = {},
	ContainerId extends string | undefined = undefined,
	ObjectId extends string | undefined = undefined,
	ChildObjectId extends string | undefined = undefined,
> = {
	action: Action;
	actionSubject: ActionSubject;
	actionSubjectId?: ActionSubjectID;
	attributes?: Attributes & {
		[key in keyof ImplicitAttributes]?: ImplicitAttributes[key];
	};
	childObjectId?: ChildObjectId;
	containerId?: ContainerId;
	objectId?: ObjectId;
} & (
	| {
			eventType: Exclude<EventType, EVENT_TYPE.OPERATIONAL>;
			nonPrivacySafeAttributes?: NonPrivacySafeAttributes;
	  }
	| { eventType: EVENT_TYPE.OPERATIONAL }
);

export type UIAEP<
	Action,
	ActionSubject,
	ActionSubjectID,
	Attributes,
	NonPrivacySafeAttributes = undefined,
	ContainerId extends string | undefined = undefined,
	ObjectId extends string | undefined = undefined,
	ChildObjectId extends string | undefined = undefined,
> = AEP<
	Action,
	ActionSubject,
	ActionSubjectID,
	Attributes,
	NonPrivacySafeAttributes,
	EVENT_TYPE.UI,
	Object,
	ContainerId,
	ObjectId,
	ChildObjectId
>;

export type TrackAEP<
	Action,
	ActionSubject,
	ActionSubjectID,
	Attributes,
	NonPrivacySafeAttributes,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type,
	ImplicitAttributes extends Object = {},
> = AEP<
	Action,
	ActionSubject,
	ActionSubjectID,
	Attributes,
	NonPrivacySafeAttributes,
	EVENT_TYPE.TRACK,
	ImplicitAttributes
>;

export type OperationalAEP<Action, ActionSubject, ActionSubjectID, Attributes> = AEP<
	Action,
	ActionSubject,
	ActionSubjectID,
	Attributes,
	undefined,
	EVENT_TYPE.OPERATIONAL
>;

export type OperationalExposureAEP<Action, ActionSubject, ActionSubjectID, Attributes> =
	OperationalAEP<Action, ActionSubject, ActionSubjectID, Attributes> & {
		source?: string;
		tags?: string[];
	};

export type OperationalAEPWithObjectId<Action, ActionSubject, ActionSubjectID, Attributes> =
	OperationalAEP<Action, ActionSubject, ActionSubjectID, Attributes & { objectId?: string }>;

export type ScreenAEP<
	Action,
	ActionSubject,
	ActionSubjectID,
	Attributes,
	NonPrivacySafeAttributes,
> = AEP<
	Action,
	ActionSubject,
	ActionSubjectID,
	Attributes,
	NonPrivacySafeAttributes,
	EVENT_TYPE.SCREEN
>;

export type TableAEP<Action, Attributes, NonPrivacySafeAttributes> = TrackAEP<
	Action,
	ACTION_SUBJECT.TABLE,
	null,
	Attributes,
	NonPrivacySafeAttributes
>;

export enum SELECTION_TYPE {
	CURSOR = 'cursor',
	RANGED = 'ranged',
	TEXT = 'text',
	NODE = 'node',
	CELL = 'cell',
	GAP_CURSOR = 'gapCursor',
}

export enum SELECTION_POSITION {
	START = 'start',
	MIDDLE = 'middle',
	END = 'end',
	LEFT = 'left',
	RIGHT = 'right',
}

export interface NonRequiredAttributes {
	changeFromLocation?: string;
	insertedLocation?: string;
	insertLocation?: string;
	isInsideSyncedBlock?: boolean;
	nodeLocation?: string;
	selectionPosition?: SELECTION_POSITION;
	selectionType?: SELECTION_TYPE;
}

export type InsertAEP<ActionSubjectID, Attributes, NonPrivacySafeAttributes> = TrackAEP<
	ACTION.INSERTED,
	ACTION_SUBJECT.DOCUMENT,
	ActionSubjectID,
	Attributes,
	NonPrivacySafeAttributes,
	NonRequiredAttributes
>;

export type ChangeTypeAEP<ActionSubject, ActionSubjectID, Attributes, NonPrivacySafeAttributes> =
	TrackAEP<
		ACTION.CHANGED_TYPE,
		ActionSubject,
		ActionSubjectID,
		Attributes,
		NonPrivacySafeAttributes,
		NonRequiredAttributes
	>;
