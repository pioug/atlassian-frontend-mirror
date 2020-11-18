import { EVENT_TYPE, ACTION_SUBJECT, ACTION } from './enums';

type AEP<
  Action,
  ActionSubject,
  ActionSubjectID,
  Attributes,
  NonPrivacySafeAttributes,
  EventType,
  ImplicitAttributes extends {} = {}
> = {
  action: Action;
  actionSubject: ActionSubject;
  actionSubjectId?: ActionSubjectID;
  attributes?: Attributes &
    { [key in keyof ImplicitAttributes]?: ImplicitAttributes[key] };
  eventType: EventType;
  nonPrivacySafeAttributes?: NonPrivacySafeAttributes;
};

export type UIAEP<
  Action,
  ActionSubject,
  ActionSubjectID,
  Attributes,
  NonPrivacySafeAttributes
> = AEP<
  Action,
  ActionSubject,
  ActionSubjectID,
  Attributes,
  NonPrivacySafeAttributes,
  EVENT_TYPE.UI
>;

export type TrackAEP<
  Action,
  ActionSubject,
  ActionSubjectID,
  Attributes,
  NonPrivacySafeAttributes,
  ImplicitAttributes extends {} = {}
> = AEP<
  Action,
  ActionSubject,
  ActionSubjectID,
  Attributes,
  NonPrivacySafeAttributes,
  EVENT_TYPE.TRACK,
  ImplicitAttributes
>;

export type OperationalAEP<
  Action,
  ActionSubject,
  ActionSubjectID,
  Attributes,
  NonPrivacySafeAttributes
> = AEP<
  Action,
  ActionSubject,
  ActionSubjectID,
  Attributes,
  NonPrivacySafeAttributes,
  EVENT_TYPE.OPERATIONAL
>;

export type OperationalAEPWithObjectId<
  Action,
  ActionSubject,
  ActionSubjectID,
  Attributes,
  NonPrivacySafeAttributes
> = OperationalAEP<
  Action,
  ActionSubject,
  ActionSubjectID,
  Attributes & { objectId?: string },
  NonPrivacySafeAttributes
>;

export type ScreenAEP<
  Action,
  ActionSubject,
  ActionSubjectID,
  Attributes,
  NonPrivacySafeAttributes
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
  GAP_CURSOR = 'gapCursor',
  NODE = 'node',
  CELL = 'cell',
}

export enum SELECTION_POSITION {
  START = 'start',
  MIDDLE = 'middle',
  END = 'end',
  LEFT = 'left',
  RIGHT = 'right',
}

interface NonRequiredAttributes {
  insertLocation?: string;
  nodeLocation?: string;
  selectionType?: SELECTION_TYPE;
  selectionPosition?: SELECTION_POSITION;
}

export type InsertAEP<
  ActionSubjectID,
  Attributes,
  NonPrivacySafeAttributes
> = TrackAEP<
  ACTION.INSERTED,
  ACTION_SUBJECT.DOCUMENT,
  ActionSubjectID,
  Attributes,
  NonPrivacySafeAttributes,
  NonRequiredAttributes
>;
