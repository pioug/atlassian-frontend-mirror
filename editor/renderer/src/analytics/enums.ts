export enum EVENT_TYPE {
  OPERATIONAL = 'operational',
  SCREEN = 'screen',
  TRACK = 'track',
  UI = 'ui',
}

export enum ACTION {
  STARTED = 'started',
  RENDERED = 'rendered',
  CRASHED = 'unhandledErrorCaught',
  SELECT_ALL_CAUGHT = 'selectAllCaught',
  SELECT_ALL_ESCAPED = 'selectAllEscaped',
  CLICKED = 'clicked',
  VIEWED = 'viewed',
  VISITED = 'visited',
  SORT_COLUMN = 'sortedColumn',
  SORT_COLUMN_NOT_ALLOWED = 'sortColumnNotAllowed',
  TOGGLE_EXPAND = 'toggleExpand',
  INSERTED = 'inserted',
  OPENED = 'opened',
  CLOSED = 'closed',
  DELETED = 'deleted',
  EDITED = 'edited',
  RESOLVED = 'resolved',
  CREATE_NOT_ALLOWED = 'createNotAllowed',
  UNSUPPORTED_CONTENT_LEVELS_TRACKING_SUCCEEDED = 'unsupportedContentLevelsTrackingSucceeded',
  UNSUPPORTED_CONTENT_LEVELS_TRACKING_ERRORED = 'unsupportedContentLevelsTrackingErrored',
}

export enum ACTION_SUBJECT {
  RENDERER = 'renderer',
  BUTTON = 'button',
  ANCHOR_LINK = 'anchorLink',
  TABLE = 'table',
  EXPAND = 'expand',
  NESTED_EXPAND = 'nestedExpand',
  MEDIA_SINGLE = 'mediaSingle',
  LINK = 'link',
  ANNOTATION = 'annotation',
  MEDIA = 'media',
}

export enum ACTION_SUBJECT_ID {
  HEADING_ANCHOR_LINK = 'headingAnchorLink',
  LINK = 'link',
  INLINE_COMMENT = 'inlineComment',
}

export type AEP<
  Action,
  ActionSubject,
  ActionSubjectID,
  Attributes,
  EventType
> = {
  action: Action;
  actionSubject: ActionSubject;
  actionSubjectId?: ActionSubjectID;
  attributes?: Attributes;
  eventType: EventType;
};
