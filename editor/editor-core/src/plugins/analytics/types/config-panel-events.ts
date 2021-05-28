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

type ConfigPanelCrashedAEP = UIAEP<
  ACTION.ERRORED,
  ACTION_SUBJECT.CONFIG_PANEL,
  undefined,
  {
    product: string;
    browserInfo: string;
    extensionKey: string;
    fields: string;
    error: string;
    errorInfo?: {
      componentStack: string;
    };
    errorStack?: string;
  },
  undefined
>;

export type ConfigPanelEventPayload =
  | OpenAEP
  | CloseAEP
  | ConfigPanelCrashedAEP;
