export type AEP<Action, ActionSubject, ActionSubjectID, Attributes, EventType> =
  {
    action: Action;
    actionSubject: ActionSubject;
    actionSubjectId?: ActionSubjectID;
    attributes?: Attributes;
    eventType: EventType;
  };
