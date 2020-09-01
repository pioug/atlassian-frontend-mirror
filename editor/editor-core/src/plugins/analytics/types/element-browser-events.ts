import { UIAEP } from './utils';
import { ACTION, ACTION_SUBJECT } from './enums';

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

export type ElementBrowserEventPayload = OpenAEP | CloseAEP;
