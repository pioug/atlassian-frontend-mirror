import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { EditorState, PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { NewCollabSyncUpErrorAttributes } from '../../collab';
import type {
	UnsupportedContentPayload,
	UnsupportedContentTooltipPayload,
	UserBrowserExtensionResults,
} from '../../utils';

import type { AvatarEventPayload } from './avatar';
import type { ConfigPanelEventPayload } from './config-panel-events';
import type { ContextMenuEventPayload } from './context-menu-events';
import type { CutCopyEventPayload } from './cut-copy-events';
import type { DatasourceClickedPayload } from './datasource-clicked-events';
import type { DateEventPayload } from './date-events';
import type { ElementBrowserEventPayload } from './element-browser-events';
import type { ElementEventPayload } from './element-events';
import type {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	CONTENT_COMPONENT,
	FLOATING_CONTROLS_TITLE,
} from './enums';
import type { ExperimentalEventPayload } from './experimental-events';
import type { ExtensionEventPayload } from './extension-events';
import type { FindReplaceEventPayload } from './find-replace-events';
import type { FormatEventPayload } from './format-events';
import type { GeneralEventPayload } from './general-events';
import type { HighlightActionsEventPayload } from './highlight-actions-menu-events';
import type { HighlightEventPayload } from './highlight-events';
import type { InsertEventPayload } from './insert-events';
import type { VisitedLinkAEP } from './link-events';
import type {
	CreateLinkInlineDialogEventPayload,
	EditLinkToolbarAEP,
	OpenSettingsToolbarAEP,
	UnlinkToolbarAEP,
} from './link-tool-bar-events';
import type { ListEventPayload } from './list-events';
import type { LoomEventPayload } from './loom-events';
import type { MediaEventPayload } from './media-events';
import type { MoveContentEventPayload } from './move-content-events';
import type { NodeEventPayload } from './node-events';
import type { PasteEventPayload } from './paste-events';
import type { ReferentialityEventPayload } from './referentiality-events';
import type { SelectionEventPayload } from './selection-events';
import type { SubstituteEventPayload } from './substitute-events';
import type { TableEventPayload } from './table-events';
import type { TypeAheadPayload } from './type-ahead';
import type { MediaUploadEventPayload } from './upload-media-events';
import type { OperationalAEP, OperationalExposureAEP, TrackAEP } from './utils';
import type { ViewEventPayload } from './view-events';

type Dispatch<T = any> = (eventName: PluginKey | string, data: T) => void;

export type SimplifiedNode = {
	type: string;
	pos: number;
	nodeSize: number;
	marks?: string[];
	content?: SimplifiedNode[];
};

export type AnalyticsEventPayload<T = void> =
	| AvatarEventPayload
	| GeneralEventPayload<T>
	| FormatEventPayload
	| SubstituteEventPayload
	| InsertEventPayload
	| NodeEventPayload
	| MoveContentEventPayload
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
	| HighlightActionsEventPayload
	| UnsupportedContentPayload
	| ExtensionEventPayload
	| TransactionEventPayload
	| TypeAheadPayload
	| UnlinkToolbarAEP
	| EditLinkToolbarAEP
	| OpenSettingsToolbarAEP
	| CustomPanelEventPayload
	| FeatureExposureAEP
	| NewCollabSyncUpErrorAEP
	| UnsupportedContentTooltipPayload
	| ReferentialityEventPayload
	| LoomEventPayload
	| MBEEventPayload
	| HighlightEventPayload
	| DatasourceClickedPayload
	| ElementEventPayload
	| ContextMenuEventPayload
	| VisitedLinkAEP
	| ViewEventPayload
	| MediaUploadEventPayload;

type CustomPanelEventPayload = TrackAEP<
	ACTION.CHANGED_BACKGROUND_COLOR | ACTION.CHANGED_ICON | ACTION.REMOVE_ICON,
	ACTION_SUBJECT.PANEL,
	ACTION_SUBJECT_ID.PANEL,
	| { previousColor: string; newColor: string }
	| { previousIcon: string; newIcon: string }
	| { icon: string },
	undefined
>;

type MBEEventPayload = TrackAEP<
	| ACTION.ADD_CHILD
	| ACTION.CHANGE_ACTIVE
	| ACTION.DELETED
	| ACTION.REMOVE_CHILD
	| ACTION.UPDATE_PARAMETERS
	| ACTION.GET_CHILDERN,
	ACTION_SUBJECT.MULTI_BODIED_EXTENSION,
	undefined,
	{
		extensionType: string;
		extensionKey: string;
		localId: string;
		currentFramesCount: number;
	},
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

export type FeatureExposureAEP = OperationalExposureAEP<
	ACTION.EXPOSED,
	ACTION_SUBJECT.FEATURE,
	undefined,
	{ flagKey: string; value: string | boolean }
>;

// Error events need to be in this file as they reference AnalyticsEventPayloadWithChannel
// and so there would be a circular dependency if they were in their own file

type InvalidTransactionErrorAEP = OperationalAEP<
	ACTION.DISPATCHED_INVALID_TRANSACTION,
	ACTION_SUBJECT.EDITOR,
	undefined,
	{
		analyticsEventPayloads: AnalyticsEventPayloadWithChannel[];
		invalidNodes: (SimplifiedNode | string)[];
	}
>;

type DispatchedValidTransactionAEP = OperationalAEP<
	ACTION.DISPATCHED_VALID_TRANSACTION,
	ACTION_SUBJECT.EDITOR,
	undefined,
	undefined
>;

type InvalidTransactionStepErrorAEP = OperationalAEP<
	ACTION.DISCARDED_INVALID_STEPS_FROM_TRANSACTION,
	ACTION_SUBJECT.EDITOR,
	undefined,
	{
		analyticsEventPayloads: AnalyticsEventPayloadWithChannel[];
	}
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
	}
>;

type SynchronyErrorAEP = OperationalAEP<
	ACTION.SYNCHRONY_ERROR,
	ACTION_SUBJECT.EDITOR,
	undefined,
	{
		error: Error;
		docStructure?: string | SimplifiedNode;
		browserExtensions?: UserBrowserExtensionResults;
	}
>;

type NewCollabSyncUpErrorAEP = OperationalAEP<
	ACTION.NEW_COLLAB_SYNC_UP_ERROR_NO_STEPS,
	ACTION_SUBJECT.EDITOR,
	undefined,
	NewCollabSyncUpErrorAttributes
>;

type InvalidDocumentEncounteredAEP = OperationalAEP<
	ACTION.INVALID_DOCUMENT_ENCOUNTERED,
	ACTION_SUBJECT.EDITOR,
	undefined,
	{
		nodeType: string;
		reason: string;
		tableLocalId: string;
		spanValue: number;
	}
>;

type SynchronyEntityErrorAEP = OperationalAEP<
	ACTION.SYNCHRONY_ENTITY_ERROR | ACTION.SYNCHRONY_DISCONNECTED,
	ACTION_SUBJECT.EDITOR,
	undefined,
	{
		onLine: boolean;
		visibilityState: string;
	}
>;

type ContentComponentErrorAEP = OperationalAEP<
	ACTION.ERRORED,
	ACTION_SUBJECT.CONTENT_COMPONENT,
	undefined,
	{
		component: CONTENT_COMPONENT;
		error: string;
		selection: { [key: string]: string };
		position: number;
		docSize: number;
	}
>;

export type ErrorEventAttributes = {
	error: Error;
	errorInfo: React.ErrorInfo;
	errorRethrown?: boolean;
	product?: string;
	browserInfo?: string;
	errorId?: string;
	docStructure?: string | SimplifiedNode;
	browserExtensions?: UserBrowserExtensionResults;
	outdatedBrowser?: boolean;
};

type ComponentCrashErrorAEP = OperationalAEP<
	ACTION.EDITOR_CRASHED,
	| ACTION_SUBJECT.FLOATING_CONTEXTUAL_BUTTON
	| ACTION_SUBJECT.PLUGIN_SLOT
	| ACTION_SUBJECT.REACT_NODE_VIEW
	| ACTION_SUBJECT.TABLES_PLUGIN
	| ACTION_SUBJECT.FLOATING_TOOLBAR_PLUGIN
	| ACTION_SUBJECT.EDITOR,
	ACTION_SUBJECT_ID | FLOATING_CONTROLS_TITLE,
	ErrorEventAttributes
>;

type ComponentCrashAdditionalInfoErrorAEP = OperationalAEP<
	ACTION.EDITOR_CRASHED_ADDITIONAL_INFORMATION,
	ACTION_SUBJECT.EDITOR,
	undefined,
	{
		errorId: string;
	}
>;

type SmartLinkErrorAEP = OperationalAEP<
	ACTION.ERRORED,
	ACTION_SUBJECT.SMART_LINK,
	undefined,
	{
		error: string;
		errorStack?: string;
	}
>;

export type ErrorEventPayload =
	| InvalidTransactionErrorAEP
	| InvalidTransactionStepErrorAEP
	| FailedToUnmountErrorAEP
	| SynchronyErrorAEP
	| InvalidDocumentEncounteredAEP
	| SynchronyEntityErrorAEP
	| ContentComponentErrorAEP
	| ComponentCrashErrorAEP
	| ComponentCrashAdditionalInfoErrorAEP
	| SmartLinkErrorAEP;

export type AnalyticsEventPayloadCallback = (
	state: EditorState,
) => AnalyticsEventPayload | undefined;

export type FireAnalyticsCallback = <T>(payload: FireAnalyticsEventPayload<T>) => void | undefined;

export type FireAnalyticsEvent = (
	createAnalyticsEvent?: CreateUIAnalyticsEvent,
) => FireAnalyticsCallback;

export type FireAnalyticsEventPayload<T = void> = {
	payload: AnalyticsEventPayload<T>;
	channel?: string;
};
