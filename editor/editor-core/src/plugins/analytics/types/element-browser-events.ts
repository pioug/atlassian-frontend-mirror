import { UIAEP, TrackAEP } from './utils';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';

type OpenAEP = UIAEP<
  ACTION.OPENED,
  ACTION_SUBJECT.ELEMENT_BROWSER,
  undefined,
  {
    mode: 'full' | 'inline';
  },
  undefined
>;

type CloseAEP = UIAEP<
  ACTION.CLOSED,
  ACTION_SUBJECT.ELEMENT_BROWSER,
  undefined,
  {
    mode: 'full' | 'inline';
  },
  undefined
>;

type ClickedElementBrowserCategory = TrackAEP<
  ACTION.CLICKED,
  ACTION_SUBJECT.BUTTON,
  ACTION_SUBJECT_ID.BUTTON_CATEGORY,
  any,
  undefined
>;

export type ElementBrowserEventPayload =
  | OpenAEP
  | CloseAEP
  | ClickedElementBrowserCategory;
