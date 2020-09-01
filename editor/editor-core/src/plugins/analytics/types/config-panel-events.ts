import { UIAEP } from './utils';
import { ACTION, ACTION_SUBJECT } from './enums';

type OpenAEP = UIAEP<
  ACTION.OPENED,
  ACTION_SUBJECT.CONFIG_PANEL,
  undefined,
  {},
  undefined
>;

type CloseAEP = UIAEP<
  ACTION.CLOSED,
  ACTION_SUBJECT.CONFIG_PANEL,
  undefined,
  {},
  undefined
>;

export type ConfigPanelEventPayload = OpenAEP | CloseAEP;
