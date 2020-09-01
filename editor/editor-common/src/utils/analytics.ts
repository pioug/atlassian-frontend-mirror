import { EDITOR_APPEARANCE_CONTEXT } from '@atlaskit/analytics-namespaced-context';

export const getAnalyticsAppearance = (
  appearance?: string,
): EDITOR_APPEARANCE_CONTEXT | undefined => {
  switch (appearance) {
    case 'full-page':
      return EDITOR_APPEARANCE_CONTEXT.FIXED_WIDTH;
    case 'full-width':
      return EDITOR_APPEARANCE_CONTEXT.FULL_WIDTH;
    case 'comment':
      return EDITOR_APPEARANCE_CONTEXT.COMMENT;
    case 'chromeless':
      return EDITOR_APPEARANCE_CONTEXT.CHROMELESS;
    case 'mobile':
      return EDITOR_APPEARANCE_CONTEXT.MOBILE;
  }
};

export enum EVENT_TYPE {
  TRACK = 'track',
}

export enum ACTION {
  UNSUPPORTED_CONTENT_ENCOUNTERED = 'unsupportedContentEncountered',
}

export enum ACTION_SUBJECT {
  DOCUMENT = 'document',
}

export enum ACTION_SUBJECT_ID {
  UNSUPPORTED_BLOCK = 'unsupportedBlock',
  UNSUPPORTED_INLINE = 'unsupportedInline',
  UNSUPPORTED_MARK = 'unsupportedMark',
  UNSUPPORTED_ERROR = 'unsupportedUnhandled',
  UNSUPPORTED_NODE_ATTRIBUTE = 'unsupportedNodeAttribute',
}

type AEP<Action, ActionSubject, ActionSubjectID, Attributes, EventType> = {
  action: Action;
  actionSubject: ActionSubject;
  actionSubjectId?: ActionSubjectID;
  attributes?: Attributes;
  eventType: EventType;
};

type TrackAEP<Action, ActionSubject, ActionSubjectID, Attributes> = AEP<
  Action,
  ActionSubject,
  ActionSubjectID,
  Attributes,
  EVENT_TYPE.TRACK
>;

type UnsupportedContentEncounteredAEP = TrackAEP<
  ACTION.UNSUPPORTED_CONTENT_ENCOUNTERED,
  ACTION_SUBJECT.DOCUMENT,
  ACTION_SUBJECT_ID,
  {
    unsupportedNode: Record<string, any>;
    errorCode?: String;
  }
>;

export type UnsupportedContentPayload = UnsupportedContentEncounteredAEP;

export const analyticsEventKey = 'EDITOR_ANALYTICS_EVENT';
