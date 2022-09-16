import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';
import type { TrackAEP, UIAEP } from './utils';

type MediaLinkActionType =
  | ACTION.ADDED
  | ACTION.EDITED
  | ACTION.DELETED
  | ACTION.VISITED
  | ACTION.ERRORED;

export type MediaLinkAEP = TrackAEP<
  MediaLinkActionType,
  ACTION_SUBJECT.MEDIA,
  ACTION_SUBJECT_ID.LINK,
  any,
  undefined
>;

type MediaCaptionActionType = ACTION.DELETED | ACTION.EDITED | ACTION.ADDED;

export type CaptionTrackAction = TrackAEP<
  MediaCaptionActionType,
  ACTION_SUBJECT.MEDIA_SINGLE,
  ACTION_SUBJECT_ID.CAPTION,
  any,
  undefined
>;

type MediaAltTextAction = TrackAEP<
  ACTION.ADDED | ACTION.CLOSED | ACTION.EDITED | ACTION.CLEARED | ACTION.OPENED,
  ACTION_SUBJECT.MEDIA,
  ACTION_SUBJECT_ID.ALT_TEXT,
  undefined,
  undefined
>;

type MediaUIAction = UIAEP<
  ACTION.EDITED,
  ACTION_SUBJECT.MEDIA_SINGLE | ACTION_SUBJECT.EMBEDS,
  ACTION_SUBJECT_ID.RESIZED,
  any,
  undefined
>;

type MediaSwitchType =
  | ACTION_SUBJECT_ID.MEDIA_INLINE
  | ACTION_SUBJECT_ID.MEDIA_GROUP;

type ChangeMediaAEP = TrackAEP<
  ACTION.CHANGED_TYPE,
  ACTION_SUBJECT.MEDIA,
  undefined,
  { newType: MediaSwitchType; previousType: MediaSwitchType },
  undefined
>;

export type MediaAltTextActionType =
  | ACTION.ADDED
  | ACTION.CLOSED
  | ACTION.EDITED
  | ACTION.CLEARED
  | ACTION.OPENED;

export type MediaEventPayload =
  | MediaLinkAEP
  | MediaAltTextAction
  | MediaUIAction
  | CaptionTrackAction
  | ChangeMediaAEP;
