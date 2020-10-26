import { Dispatch } from '../../../event-dispatcher';
import { GeneralEventPayload } from './general-events';
import { FormatEventPayload } from './format-events';
import { SubstituteEventPayload } from './substitute-events';
import { InsertEventPayload } from './insert-events';
import { NodeEventPayload } from './node-events';
import { MediaEventPayload } from './media-events';
import { TableEventPayload } from './table-events';
import { PasteEventPayload } from './paste-events';
import { CutCopyEventPayload } from './cut-copy-events';
import { HistoryEventPayload } from './history-events';
import { ListEventPayload } from './list-events';
import { ExperimentalEventPayload } from './experimental-events';
import { FindReplaceEventPayload } from './find-replace-events';
import { ConfigPanelEventPayload } from './config-panel-events';
import { ElementBrowserEventPayload } from './element-browser-events';
import { OperationalAEP } from './utils';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';
import { SimplifiedNode } from '../../../utils/document-logger';
import { DateEventPayload } from './date-events';
import { SelectionEventPayload } from './selection-events';
import { CreateLinkInlineDialogEventPayload } from './link-tool-bar-events';
import { UnsupportedContentPayload } from '@atlaskit/editor-common';

export type AnalyticsEventPayload =
  | GeneralEventPayload
  | FormatEventPayload
  | SubstituteEventPayload
  | InsertEventPayload
  | NodeEventPayload
  | MediaEventPayload
  | TableEventPayload
  | PasteEventPayload
  | CutCopyEventPayload
  | ErrorEventPayload
  | HistoryEventPayload
  | ExperimentalEventPayload // Used for A/B testing
  | FindReplaceEventPayload
  | DateEventPayload
  | SelectionEventPayload
  | ListEventPayload
  | ConfigPanelEventPayload
  | ElementBrowserEventPayload
  | CreateLinkInlineDialogEventPayload
  | UnsupportedContentPayload;

export type AnalyticsEventPayloadWithChannel = {
  channel: string;
  payload: AnalyticsEventPayload;
};

export type AnalyticsDispatch = Dispatch<{
  payload: AnalyticsEventPayload;
  channel?: string;
}>;

type InvalidTransactionErrorAEP = OperationalAEP<
  ACTION.DISPATCHED_INVALID_TRANSACTION,
  ACTION_SUBJECT.EDITOR,
  undefined,
  {
    analyticsEventPayloads: AnalyticsEventPayloadWithChannel[];
    invalidNodes: (SimplifiedNode | string)[];
  },
  undefined
>;

type InvalidTransactionStepErrorAEP = OperationalAEP<
  ACTION.DISCARDED_INVALID_STEPS_FROM_TRANSACTION,
  ACTION_SUBJECT.EDITOR,
  undefined,
  {
    analyticsEventPayloads: AnalyticsEventPayloadWithChannel[];
  },
  undefined
>;

type FailedToUnmountErrorAEP = OperationalAEP<
  ACTION.FAILED_TO_UNMOUNT,
  ACTION_SUBJECT.EDITOR,
  ACTION_SUBJECT_ID.REACT_NODE_VIEW,
  {
    error: Error;
    domNodes: {
      container?: string;
      child?: string;
    };
  },
  undefined
>;

type SynchronyErrorAEP = OperationalAEP<
  ACTION.SYNCHRONY_ERROR,
  ACTION_SUBJECT.EDITOR,
  undefined,
  {
    error: Error;
  },
  undefined
>;

type SynchronyEntityErrorAEP = OperationalAEP<
  ACTION.SYNCHRONY_ENTITY_ERROR | ACTION.SYNCHRONY_DISCONNECTED,
  ACTION_SUBJECT.EDITOR,
  undefined,
  {
    onLine: boolean;
    visibilityState: string;
  },
  undefined
>;

export type ErrorEventPayload =
  | InvalidTransactionErrorAEP
  | InvalidTransactionStepErrorAEP
  | FailedToUnmountErrorAEP
  | SynchronyErrorAEP
  | SynchronyEntityErrorAEP;
