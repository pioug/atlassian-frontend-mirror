import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';
import type { TrackAEP, UIAEP } from './utils';

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

type OpenPlusMenuCategory = UIAEP<
  ACTION.OPENED,
  ACTION_SUBJECT.PLUS_MENU,
  undefined,
  undefined,
  undefined
>;

type ClosePlusMenuCategory = UIAEP<
  ACTION.CLOSED,
  ACTION_SUBJECT.PLUS_MENU,
  undefined,
  undefined,
  undefined
>;

export type ElementBrowserEventPayload =
  | OpenAEP
  | CloseAEP
  | ClickedElementBrowserCategory
  | OpenPlusMenuCategory
  | ClosePlusMenuCategory;
