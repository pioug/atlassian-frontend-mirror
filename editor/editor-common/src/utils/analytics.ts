import { EDITOR_APPEARANCE_CONTEXT } from '@atlaskit/analytics-namespaced-context';

import {
  type ACTION,
  type ACTION_SUBJECT,
  type ACTION_SUBJECT_ID,
  type EVENT_TYPE,
} from '../analytics';

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

export const getAnalyticsEditorAppearance = (editorAppearance?: string) =>
  editorAppearance
    ? `editor_${getAnalyticsAppearance(editorAppearance)}`
    : '_unknown';

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
