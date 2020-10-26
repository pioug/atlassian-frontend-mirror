import {
  ACTION,
  ACTION_SUBJECT,
  AEP,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
} from './enums';
import { SortOrder, UnsupportedContentPayload } from '@atlaskit/editor-common';
import { UnsupportedContentTooltipPayload } from '@atlaskit/editor-common/src/utils/analytics';

export enum PLATFORM {
  NATIVE = 'mobileNative',
  HYBRID = 'mobileHybrid',
  WEB = 'web',
}

export enum MODE {
  RENDERER = 'renderer',
  EDITOR = 'editor',
}

type RendererStartAEP = AEP<
  ACTION.STARTED,
  ACTION_SUBJECT.RENDERER,
  undefined,
  { platform: PLATFORM.WEB },
  EVENT_TYPE.UI
>;

type RendererRenderedAEP = AEP<
  ACTION.RENDERED,
  ACTION_SUBJECT.RENDERER,
  undefined,
  {
    platform: PLATFORM.WEB;
    duration: number;
    ttfb?: number;
    nodes: Record<string, number>;
  },
  EVENT_TYPE.OPERATIONAL
>;

type UIAEP<Action, ActionSubject, ActionSubjectID, Attributes> = AEP<
  Action,
  ActionSubject,
  ActionSubjectID,
  Attributes,
  EVENT_TYPE.UI
>;

type ButtonAEP<ActionSubjectID, Attributes> = UIAEP<
  ACTION.CLICKED,
  ACTION_SUBJECT.BUTTON,
  ActionSubjectID,
  Attributes
>;

type AnchorLinkAEP = UIAEP<
  ACTION.VIEWED,
  ACTION_SUBJECT.ANCHOR_LINK,
  undefined,
  { platform: PLATFORM.WEB; mode: MODE.RENDERER }
>;

type HeadingAnchorLinkButtonAEP = ButtonAEP<
  ACTION_SUBJECT_ID.HEADING_ANCHOR_LINK,
  undefined
>;

type TableSortColumnNotAllowedAEP = AEP<
  ACTION.SORT_COLUMN_NOT_ALLOWED,
  ACTION_SUBJECT.TABLE,
  undefined,
  {
    platform: PLATFORM.WEB;
    mode: MODE.RENDERER;
  },
  EVENT_TYPE.TRACK
>;

type TableSortColumnAEP = AEP<
  ACTION.SORT_COLUMN,
  ACTION_SUBJECT.TABLE,
  undefined,
  {
    platform: PLATFORM.WEB;
    mode: MODE.RENDERER;
    sortOrder: SortOrder;
    columnIndex: number;
  },
  EVENT_TYPE.TRACK
>;

type VisitLinkAEP = AEP<
  ACTION.VISITED,
  ACTION_SUBJECT.LINK,
  undefined,
  {
    platform: PLATFORM.WEB;
    mode: MODE.RENDERER;
  },
  EVENT_TYPE.TRACK
>;

type VisitMediaLinkAEP = AEP<
  ACTION.VISITED,
  ACTION_SUBJECT.MEDIA_SINGLE,
  ACTION_SUBJECT_ID.MEDIA_LINK,
  {
    platform: PLATFORM.WEB;
    mode: MODE.RENDERER;
  },
  EVENT_TYPE.TRACK
>;

type BodiedExtensionOperationalAEP = AEP<
  ACTION.RENDERED,
  ACTION_SUBJECT.BODIED_EXTENSION,
  undefined,
  { [key: string]: any },
  EVENT_TYPE.OPERATIONAL
>;

type ExpandAEP = AEP<
  ACTION.TOGGLE_EXPAND,
  ACTION_SUBJECT.EXPAND | ACTION_SUBJECT.NESTED_EXPAND,
  undefined,
  {
    platform: PLATFORM.WEB;
    mode: MODE.RENDERER;
    expanded: boolean;
  },
  EVENT_TYPE.TRACK
>;

export type AnnotationActionType =
  | ACTION.INSERTED
  | ACTION.CLOSED
  | ACTION.EDITED
  | ACTION.DELETED
  | ACTION.OPENED
  | ACTION.RESOLVED
  | ACTION.VIEWED
  | ACTION.CREATE_NOT_ALLOWED;

export type AnnotationAEPAttributes =
  | AnnotationDraftAEPAttributes
  | AnnotationResolvedAEPAttributes;

export type AnnotationDraftAEPAttributes = {
  //overlap is how many other annotations are within or overlapping with the new selection
  overlap?: number;
};

export type AnnotationResolvedAEPAttributes = {
  method?: RESOLVE_METHOD;
};

export type AnnotationDeleteAEP = AEP<
  AnnotationActionType,
  ACTION_SUBJECT.ANNOTATION,
  ACTION_SUBJECT_ID,
  undefined,
  EVENT_TYPE.TRACK
>;

export enum RESOLVE_METHOD {
  COMPONENT = 'component',
  CONSUMER = 'consumer',
  ORPHANED = 'orphaned',
}

export type AnnotationAEP = AEP<
  AnnotationActionType,
  ACTION_SUBJECT.ANNOTATION,
  ACTION_SUBJECT_ID.INLINE_COMMENT,
  AnnotationAEPAttributes,
  undefined
>;

export type AnalyticsEventPayload =
  | RendererStartAEP
  | RendererRenderedAEP
  | HeadingAnchorLinkButtonAEP
  | AnchorLinkAEP
  | TableSortColumnNotAllowedAEP
  | TableSortColumnAEP
  | VisitLinkAEP
  | VisitMediaLinkAEP
  | ExpandAEP
  | UnsupportedContentPayload
  | UnsupportedContentTooltipPayload
  | AnnotationAEP
  | AnnotationDeleteAEP
  | BodiedExtensionOperationalAEP;
