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

export const getAnalyticsEventSeverity = (
  duration: number,
  normalThreshold: number,
  degradedThreshold: number,
) => {
  if (duration > normalThreshold && duration <= degradedThreshold) {
    return SEVERITY.DEGRADED;
  }
  if (duration > degradedThreshold) {
    return SEVERITY.BLOCKING;
  }

  return SEVERITY.NORMAL;
};

export enum SEVERITY {
  NORMAL = 'normal',
  DEGRADED = 'degraded',
  BLOCKING = 'blocking',
}

export {
  UNSUPPORTED_CONTENT_LEVEL_SEVERITY,
  getUnsupportedContentLevelData,
  UNSUPPORTED_CONTENT_LEVEL_SEVERITY_THRESHOLD_DEFAULTS,
} from './unsupportedContent/get-unsupported-content-level-data';

export type { UnsupportedContentLevelsTracking } from './unsupportedContent/get-unsupported-content-level-data';

export enum EVENT_TYPE {
  TRACK = 'track',
  UI = 'ui',
}

export enum ACTION {
  UNSUPPORTED_CONTENT_ENCOUNTERED = 'unsupportedContentEncountered',
  UNSUPPORTED_TOOLTIP_VIEWED = 'viewed',
}

export enum ACTION_SUBJECT {
  DOCUMENT = 'document',
  TOOLTIP = 'tooltip',
}

export enum ACTION_SUBJECT_ID {
  UNSUPPORTED_BLOCK = 'unsupportedBlock',
  UNSUPPORTED_INLINE = 'unsupportedInline',
  UNSUPPORTED_MARK = 'unsupportedMark',
  UNSUPPORTED_ERROR = 'unsupportedUnhandled',
  UNSUPPORTED_NODE_ATTRIBUTE = 'unsupportedNodeAttribute',
  ON_UNSUPPORTED_INLINE = 'onUnsupportedInline',
  ON_UNSUPPORTED_BLOCK = 'onUnsupportedBlock',
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

export type UnsupportedContentTooltipPayload = AEP<
  ACTION.UNSUPPORTED_TOOLTIP_VIEWED,
  ACTION_SUBJECT.TOOLTIP,
  | ACTION_SUBJECT_ID.ON_UNSUPPORTED_BLOCK
  | ACTION_SUBJECT_ID.ON_UNSUPPORTED_INLINE,
  {
    unsupportedNodeType: string | undefined;
  },
  EVENT_TYPE.UI
>;

export const analyticsEventKey = 'EDITOR_ANALYTICS_EVENT';
