import { TrackAEP, UIAEP } from './utils';
import { ACTION_SUBJECT, ACTION, ACTION_SUBJECT_ID } from './enums';

type MediaLinkAEP<Action> = TrackAEP<
  Action,
  ACTION_SUBJECT.MEDIA_SINGLE,
  ACTION_SUBJECT_ID.MEDIA_LINK,
  undefined,
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

export type MediaAltTextActionType =
  | ACTION.ADDED
  | ACTION.CLOSED
  | ACTION.EDITED
  | ACTION.CLEARED
  | ACTION.OPENED;

export type MediaEventPayload =
  | MediaLinkAEP<ACTION.CHANGED_URL>
  | MediaLinkAEP<ACTION.UNLINK>
  | MediaLinkAEP<ACTION.VISITED>
  | MediaAltTextAction
  | MediaUIAction;
