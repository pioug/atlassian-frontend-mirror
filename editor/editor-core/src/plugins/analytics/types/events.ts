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
import { ListEventPayload } from './list-events';
import { ExperimentalEventPayload } from './experimental-events';
import { FindReplaceEventPayload } from './find-replace-events';
import { ConfigPanelEventPayload } from './config-panel-events';
import { ElementBrowserEventPayload } from './element-browser-events';
import { TypeAheadPayload } from './type-ahead';
import { OperationalAEP, TrackAEP } from './utils';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  CONTENT_COMPONENT,
  FLOATING_CONTROLS_TITLE,
} from './enums';
import { SimplifiedNode } from '../../../utils/document-logger';
import { DateEventPayload } from './date-events';
import { SelectionEventPayload } from './selection-events';
import {
  CreateLinkInlineDialogEventPayload,
  UnlinkToolbarAEP,
  EditLinkToolbarAEP,
} from './link-tool-bar-events';
import { ExtensionEventPayload } from './extension-events';
import {
  UnsupportedContentPayload,
  UserBrowserExtensionResults,
} from '@atlaskit/editor-common';
import { AvatarEventPayload } from './avatar';

export type AnalyticsEventPayload<T = void> =
  | AvatarEventPayload
  | GeneralEventPayload<T>
  | FormatEventPayload
  | SubstituteEventPayload
  | InsertEventPayload
  | NodeEventPayload
  | MediaEventPayload
  | TableEventPayload
  | PasteEventPayload
  | CutCopyEventPayload
  | ErrorEventPayload
  | ExperimentalEventPayload // Used for A/B testing
  | FindReplaceEventPayload
  | DateEventPayload
  | SelectionEventPayload
  | ListEventPayload
  | ConfigPanelEventPayload
  | ElementBrowserEventPayload
  | CreateLinkInlineDialogEventPayload
  | UnsupportedContentPayload
  | ExtensionEventPayload
  | TransactionEventPayload
  | TypeAheadPayload
  | UnlinkToolbarAEP
  | EditLinkToolbarAEP
  | CustomPanelEventPayload;

type CustomPanelEventPayload = TrackAEP<
  ACTION.CHANGED_BACKGROUND_COLOR | ACTION.CHANGED_ICON | ACTION.REMOVE_ICON,
  ACTION_SUBJECT.PANEL,
  ACTION_SUBJECT_ID.PANEL,
  | { previousColor: string; newColor: string }
  | { previousIcon: string; newIcon: string }
  | { icon: string },
  undefined
>;

export type AnalyticsEventPayloadWithChannel = {
  channel: string;
  payload: AnalyticsEventPayload;
};

export type AnalyticsDispatch = Dispatch<{
  payload: AnalyticsEventPayload;
  channel?: string;
}>;

// Error events need to be in this file as they reference AnalyticsEventPayloadWithChannel
// and so there would be a circular dependency if they were in their own file

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

type DispatchedValidTransactionAEP = OperationalAEP<
  ACTION.DISPATCHED_VALID_TRANSACTION,
  ACTION_SUBJECT.EDITOR,
  undefined,
  undefined,
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

export type TransactionEventPayload = DispatchedValidTransactionAEP;

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
    docStructure?: string | SimplifiedNode;
    browserExtensions?: UserBrowserExtensionResults;
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

type ContentComponentErrorAEP = OperationalAEP<
  ACTION.ERRORED,
  ACTION_SUBJECT.CONTENT_COMPONENT,
  undefined,
  {
    component: CONTENT_COMPONENT;
    error: string;
    errorStack?: string;
    selection: { [key: string]: string };
    position: number;
    docSize: number;
  },
  undefined
>;

type ComponentCrashErrorAEP = OperationalAEP<
  ACTION.EDITOR_CRASHED,
  | ACTION_SUBJECT.FLOATING_CONTEXTUAL_BUTTON
  | ACTION_SUBJECT.PLUGIN_SLOT
  | ACTION_SUBJECT.REACT_NODE_VIEW
  | ACTION_SUBJECT.TABLES_PLUGIN
  | ACTION_SUBJECT.FLOATING_TOOLBAR_PLUGIN
  | ACTION_SUBJECT.EDITOR,
  ACTION_SUBJECT_ID | FLOATING_CONTROLS_TITLE,
  {
    error: Error;
    errorInfo: React.ErrorInfo;
    product?: string;
    browserInfo?: string;
    errorId?: string;
    docStructure?: string | SimplifiedNode;
    browserExtensions?: UserBrowserExtensionResults;
  },
  undefined
>;

export type ErrorEventPayload =
  | InvalidTransactionErrorAEP
  | InvalidTransactionStepErrorAEP
  | FailedToUnmountErrorAEP
  | SynchronyErrorAEP
  | SynchronyEntityErrorAEP
  | ContentComponentErrorAEP
  | ComponentCrashErrorAEP;
