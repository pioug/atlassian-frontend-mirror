import type { RichMediaLayout } from '@atlaskit/adf-schema';

import type { FeatureFlagKey } from '../../types/feature-flags';
import type { PropsDifference, ShallowPropsDifference } from '../../utils';
import type { SEVERITY } from '../../utils/analytics';

import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, INPUT_METHOD } from './enums';
import type { AnnotationAEP, AnnotationErrorAEP } from './inline-comment-events';
import type { OperationalAEP, OperationalAEPWithObjectId, TrackAEP, UIAEP } from './utils';

export enum PLATFORMS {
	NATIVE = 'mobileNative',
	HYBRID = 'mobileHybrid',
	WEB = 'web',
}

export enum MODE {
	RENDERER = 'renderer',
	EDITOR = 'editor',
}

export enum FULL_WIDTH_MODE {
	FIXED_WIDTH = 'fixedWidth',
	FULL_WIDTH = 'fullWidth',
}

export enum BROWSER_FREEZE_INTERACTION_TYPE {
	LOADING = 'loading',
	TYPING = 'typing',
	CLICKING = 'clicking',
	PASTING = 'pasting',
}

type ButtonAEP<ActionSubjectID, Attributes> = UIAEP<
	ACTION.CLICKED,
	ACTION_SUBJECT.BUTTON,
	ActionSubjectID,
	Attributes,
	undefined
>;

type PickerAEP<ActionSubjectID, Attributes> = UIAEP<
	ACTION.OPENED,
	ACTION_SUBJECT.PICKER,
	ActionSubjectID,
	Attributes,
	undefined
>;

type PickerClosedAEP<ActionSubjectID, Attributes> = UIAEP<
	ACTION.CLOSED,
	ACTION_SUBJECT.PICKER,
	ActionSubjectID,
	Attributes,
	undefined
>;

type FeedbackAEP = UIAEP<
	ACTION.OPENED,
	ACTION_SUBJECT.FEEDBACK_DIALOG,
	undefined,
	{ inputMethod: INPUT_METHOD.QUICK_INSERT },
	undefined
>;

type EditorStartAEP = UIAEP<
	ACTION.STARTED,
	ACTION_SUBJECT.EDITOR,
	undefined,
	{
		accountLocale?: string;
		browserLocale?: string;
		featureFlags: FeatureFlagKey[];
		platform: PLATFORMS.NATIVE | PLATFORMS.HYBRID | PLATFORMS.WEB;
	},
	undefined
>;

type EditorPerfAEP = OperationalAEPWithObjectId<
	| ACTION.EDITOR_MOUNTED
	| ACTION.PROSEMIRROR_RENDERED
	| ACTION.ON_EDITOR_READY_CALLBACK
	| ACTION.ON_CHANGE_CALLBACK,
	ACTION_SUBJECT.EDITOR,
	undefined,
	{
		distortedDuration?: boolean;
		duration: number;
		nodes?: Record<string, number>;
		nodesInViewport?: Record<string, number>;
		nodeSize?: number;
		nodeSizeBucket?: string;
		severity?: SEVERITY;
		startTime: number;
		totalNodes?: number;
		ttfb?: number;
	}
>;

type EditorContentRetrievalPerformedAEP = OperationalAEP<
	ACTION.EDITOR_CONTENT_RETRIEVAL_PERFORMED,
	ACTION_SUBJECT.EDITOR,
	undefined,
	{
		errorInfo?: string;
		errorStack?: string;
		success: boolean;
	}
>;

type EditorRenderedAEP<T> = OperationalAEP<
	ACTION.RE_RENDERED,
	ACTION_SUBJECT.EDITOR | ACTION_SUBJECT.REACT_EDITOR_VIEW,
	undefined,
	{
		count: number;
		propsDifference: PropsDifference<T> | ShallowPropsDifference<T>;
	}
>;

type BrowserFreezePayload = OperationalAEPWithObjectId<
	ACTION.BROWSER_FREEZE,
	ACTION_SUBJECT.EDITOR,
	undefined,
	{
		freezeTime: number;
		interactionType?: BROWSER_FREEZE_INTERACTION_TYPE;
		nodeCount?: Record<string, number>;
		nodeSize: number;
		severity?: SEVERITY;
	}
>;

type SelectionAEP = TrackAEP<
	ACTION.MATCHED,
	ACTION_SUBJECT.SELECTION,
	undefined,
	undefined,
	undefined
>;

type SlowInputAEP = OperationalAEPWithObjectId<
	ACTION.SLOW_INPUT,
	ACTION_SUBJECT.EDITOR,
	undefined,
	{
		nodeCount?: Record<string, number>;
		nodeSize: number;
		time: number;
	}
>;

type InputPerfSamplingAEP = OperationalAEPWithObjectId<
	ACTION.INPUT_PERF_SAMPLING,
	ACTION_SUBJECT.EDITOR,
	undefined,
	{
		nodeCount?: Record<string, number>;
		nodeSize: number;
		severity?: SEVERITY;
		time: number;
	}
>;

type InputPerfSamplingAvgAEP = OperationalAEPWithObjectId<
	ACTION.INPUT_PERF_SAMPLING_AVG,
	ACTION_SUBJECT.EDITOR,
	undefined,
	{
		mean: number;
		median: number;
		nodeCount?: Record<string, number>;
		nodeSize: number;
		sampleSize: number;
		severity?: SEVERITY;
	}
>;

type TransactionMutatedAEP = OperationalAEP<
	ACTION.TRANSACTION_MUTATED_AFTER_DISPATCH,
	ACTION_SUBJECT.EDITOR,
	undefined,
	{
		pluginKey: string;
	}
>;

type WithPluginStateCalledAEP = OperationalAEP<
	ACTION.WITH_PLUGIN_STATE_CALLED,
	ACTION_SUBJECT.EDITOR,
	undefined,
	{
		duration: number;
		plugin: string;
	}
>;

type ReactNodeViewRenderedAEP = OperationalAEP<
	ACTION.REACT_NODEVIEW_RENDERED,
	ACTION_SUBJECT.EDITOR,
	undefined,
	{
		duration: number;
		node: string;
	}
>;

type UploadExternalFailedAEP = OperationalAEP<
	ACTION.UPLOAD_EXTERNAL_FAIL,
	ACTION_SUBJECT.EDITOR,
	undefined,
	undefined
>;

type InvalidProsemirrorDocumentErrorAEP = OperationalAEP<
	ACTION.INVALID_PROSEMIRROR_DOCUMENT,
	ACTION_SUBJECT.EDITOR,
	undefined,
	undefined
>;

type DocumentProcessingErrorAEP = OperationalAEP<
	ACTION.DOCUMENT_PROCESSING_ERROR,
	ACTION_SUBJECT.EDITOR,
	undefined,
	| {
			errorMessage?: string;
	  }
	| undefined
>;

type EditorStopAEP = UIAEP<
	ACTION.STOPPED,
	ACTION_SUBJECT.EDITOR,
	ACTION_SUBJECT_ID.SAVE | ACTION_SUBJECT_ID.CANCEL,
	{
		documentSize: number;
		inputMethod: INPUT_METHOD.TOOLBAR | INPUT_METHOD.SHORTCUT;
		nodeCount?: {
			actions: number;
			codeBlocks: number;
			decisions: number;
			extensions: number;
			headings: number;
			lists: number;
			mediaGroups: number;
			mediaSingles: number;
			panels: number;
			tables: number;
		};
	},
	undefined
>;

type AnnotateButtonAEP = UIAEP<
	ACTION.CLICKED,
	ACTION_SUBJECT.MEDIA,
	ACTION_SUBJECT_ID.ANNOTATE_BUTTON,
	undefined,
	undefined
>;

type ButtonHelpAEP = ButtonAEP<
	ACTION_SUBJECT_ID.BUTTON_HELP,
	{ inputMethod: INPUT_METHOD.SHORTCUT | INPUT_METHOD.TOOLBAR }
>;

type ButtonFeedbackAEP = ButtonAEP<ACTION_SUBJECT_ID.BUTTON_FEEDBACK, undefined>;

type ButtonUploadMediaAEP = ButtonAEP<ACTION_SUBJECT_ID.UPLOAD_MEDIA, undefined>;

type PickerEmojiAEP = PickerAEP<
	ACTION_SUBJECT_ID.PICKER_EMOJI,
	{
		inputMethod: INPUT_METHOD.TOOLBAR | INPUT_METHOD.INSERT_MENU | INPUT_METHOD.KEYBOARD;
	}
>;

type PickerImageAEP = PickerAEP<
	ACTION_SUBJECT_ID.PICKER_CLOUD,
	{
		inputMethod: INPUT_METHOD.TOOLBAR | INPUT_METHOD.QUICK_INSERT | INPUT_METHOD.INSERT_MENU;
	}
>;

type PickerMediaInsertAEP = PickerAEP<
	ACTION_SUBJECT_ID.PICKER_MEDIA,
	{
		inputMethod: INPUT_METHOD.TOOLBAR | INPUT_METHOD.QUICK_INSERT | INPUT_METHOD.INSERT_MENU;
	}
>;

type PickerMediaInsertClosedAEP = PickerClosedAEP<
	ACTION_SUBJECT_ID.PICKER_MEDIA,
	{
		exitMethod: INPUT_METHOD.KEYBOARD | INPUT_METHOD.MOUSE;
	}
>;

type PickerMediaInsertCancelledAEP = UIAEP<
	ACTION.CANCELLED,
	ACTION_SUBJECT.PICKER,
	ACTION_SUBJECT_ID.PICKER_MEDIA,
	undefined,
	undefined
>;

type DockedPrimaryToolbarRenderedAEP = UIAEP<
	ACTION.RENDERED,
	ACTION_SUBJECT.TOOLBAR,
	ACTION_SUBJECT_ID.DOCKED_PRIMARY_TOOLBAR,
	undefined,
	undefined
>;

type HelpQuickInsertAEP = UIAEP<
	ACTION.HELP_OPENED,
	ACTION_SUBJECT.HELP,
	ACTION_SUBJECT_ID.HELP_QUICK_INSERT,
	{ inputMethod: INPUT_METHOD.QUICK_INSERT },
	undefined
>;

type FullWidthModeAEP = TrackAEP<
	ACTION.CHANGED_FULL_WIDTH_MODE,
	ACTION_SUBJECT.EDITOR,
	undefined,
	{
		newMode: FULL_WIDTH_MODE;
		previousMode: FULL_WIDTH_MODE;
	},
	undefined
>;

type ExpandToggleAEP = TrackAEP<
	ACTION.TOGGLE_EXPAND,
	ACTION_SUBJECT.EXPAND | ACTION_SUBJECT.NESTED_EXPAND,
	undefined,
	{
		expanded: boolean;
		mode: MODE;
		platform: PLATFORMS;
	},
	undefined
>;

export type ColorPickerAEP = TrackAEP<
	ACTION.UPDATED,
	ACTION_SUBJECT.PICKER,
	ACTION_SUBJECT_ID.PICKER_COLOR,
	{
		color: string;
		label?: string;
		placement: string;
	},
	undefined
>;

type RichMediaLayoutAEP = TrackAEP<
	ACTION.SELECTED,
	ACTION_SUBJECT.MEDIA_SINGLE | ACTION_SUBJECT.EMBEDS,
	ACTION_SUBJECT_ID.RICH_MEDIA_LAYOUT,
	{
		currentLayoutType: RichMediaLayout;
		previousLayoutType: RichMediaLayout;
	},
	undefined
>;

type CodeBlockLanguageSelectedAEP = TrackAEP<
	ACTION.LANGUAGE_SELECTED,
	ACTION_SUBJECT.CODE_BLOCK,
	undefined,
	{
		language: string;
	},
	undefined
>;

type MediaLinkTransformedAEP = OperationalAEP<
	ACTION.MEDIA_LINK_TRANSFORMED,
	ACTION_SUBJECT.EDITOR,
	undefined,
	undefined
>;

type MediaSingleWidthTransformedAEP = OperationalAEP<
	ACTION.MEDIA_SINGLE_WIDTH_TRANSFORMED,
	ACTION_SUBJECT.EDITOR,
	undefined,
	undefined
>;

type TextLinkCodeMarkTransformedAEP = OperationalAEP<
	ACTION.TEXT_LINK_MARK_TRANSFORMED,
	ACTION_SUBJECT.EDITOR,
	undefined,
	undefined
>;

type DedupeMarksTransformedAEP = OperationalAEP<
	ACTION.DEDUPE_MARKS_TRANSFORMED_V2,
	ACTION_SUBJECT.EDITOR,
	undefined,
	/** UGC WARNING
	 *
	 * DO NOT include `mark` attributes - only the types
	 *
	 */
	{
		discardedMarkTypes: string[];
	}
>;

type IndentationMarksTransformedAEP = OperationalAEP<
	ACTION.INDENTATION_MARKS_TRANSFORMED,
	ACTION_SUBJECT.EDITOR,
	undefined,
	undefined
>;

type NodesMissingContentTransformedAEP = OperationalAEP<
	ACTION.NODES_MISSING_CONTENT_TRANSFORMED,
	ACTION_SUBJECT.EDITOR,
	undefined,
	undefined
>;

type SingleColumLayoutDetectedAEP = OperationalAEP<
	ACTION.SINGLE_COL_LAYOUT_DETECTED,
	ACTION_SUBJECT.EDITOR,
	undefined,
	undefined
>;

type InvalidMediaContentTransformedAEP = OperationalAEP<
	ACTION.INVALID_MEDIA_CONTENT_TRANSFORMED,
	ACTION_SUBJECT.EDITOR,
	undefined,
	undefined
>;

type CollabStepsTrackerPayloadAEP = OperationalAEP<
	ACTION.STEPS_TRACKED | ACTION.STEPS_FILTERED,
	ACTION_SUBJECT.COLLAB,
	undefined,
	{
		steps: unknown[];
	}
>;

type CollabOrganicChangesTrackerPayloadAEP = OperationalAEP<
	ACTION.ORGANIC_CHANGES_TRACKED,
	ACTION_SUBJECT.COLLAB,
	undefined,
	{
		organicChanges: unknown[];
	}
>;

type BlocksDragInitAEP = OperationalAEP<
	ACTION.BLOCKS_DRAG_INIT,
	ACTION_SUBJECT.EDITOR,
	undefined,
	{
		duration: number;
		nodesCount: number | undefined;
		startTime: number;
	}
>;

type HeadingAnchorLinkButtonAEP = ButtonAEP<ACTION_SUBJECT_ID.HEADING_ANCHOR_LINK, undefined>;

type CodeBlockWordWrapToggleAEP = TrackAEP<
	ACTION.TOGGLE_CODE_BLOCK_WRAP,
	ACTION_SUBJECT.CODE_BLOCK,
	undefined,
	{
		codeBlockNodeSize: number;
		mode: MODE;
		platform: PLATFORMS;
		wordWrapEnabled: boolean;
	},
	undefined
>;

export type RequestToEditAEP = UIAEP<
	ACTION.REQUEST_TO_EDIT | ACTION.DISMISSED,
	ACTION_SUBJECT.REQUEST_TO_EDIT_POP_UP,
	undefined,
	{
		mode: MODE;
		platform: PLATFORMS;
	},
	undefined
>;

type CopyLinkToAnchorButtonAEP = ButtonAEP<
	ACTION_SUBJECT_ID.COPY_LINK_TO_ANCHOR,
	{
		extensionKey?: string;
		extensionType?: string;
		inputMethod: INPUT_METHOD;
		isLivePage?: boolean;
	}
>;

type RovoMoreOptionsClickedAEP = ButtonAEP<
	ACTION_SUBJECT_ID.AI_MORE_ROVO_OPTIONS,
	{
		inputMethod: INPUT_METHOD.TOOLBAR | INPUT_METHOD.FLOATING_TB;
		opened: boolean;
	}
>;

type AskRovoButtonClickedAEP = ButtonAEP<
	ACTION_SUBJECT_ID.AI_ASK_ROVO_BUTTON,
	{
		inputMethod: INPUT_METHOD.TOOLBAR | INPUT_METHOD.FLOATING_TB;
	}
>;

type ChangeToneMenuItemClickedAEP = UIAEP<
	ACTION.CLICKED,
	ACTION_SUBJECT.TOOLBAR_DROPDOWN_MENU_ITEM,
	ACTION_SUBJECT_ID.AI_CHANGE_TONE,
	{
		inputMethod: INPUT_METHOD.TOOLBAR | INPUT_METHOD.FLOATING_TB;
	}
>;

type TranslateMenuItemClickedAEP = UIAEP<
	ACTION.CLICKED,
	ACTION_SUBJECT.TOOLBAR_DROPDOWN_MENU_ITEM,
	ACTION_SUBJECT_ID.AI_TRANSLATE,
	{
		inputMethod: INPUT_METHOD.TOOLBAR | INPUT_METHOD.FLOATING_TB;
	}
>;

export type GeneralEventPayload<T = void> =
	| AnnotateButtonAEP
	| AnnotationAEP
	| AnnotationErrorAEP
	| BrowserFreezePayload
	| ButtonFeedbackAEP
	| ButtonHelpAEP
	| ButtonUploadMediaAEP
	| ColorPickerAEP
	| EditorPerfAEP
	| EditorRenderedAEP<T>
	| EditorStartAEP
	| EditorStopAEP
	| ExpandToggleAEP
	| FeedbackAEP
	| FullWidthModeAEP
	| HelpQuickInsertAEP
	| InputPerfSamplingAEP
	| InputPerfSamplingAvgAEP
	| PickerEmojiAEP
	| PickerImageAEP
	| PickerMediaInsertAEP
	| PickerMediaInsertClosedAEP
	| PickerMediaInsertCancelledAEP
	| ReactNodeViewRenderedAEP
	| RichMediaLayoutAEP
	| SelectionAEP
	| SlowInputAEP
	| TransactionMutatedAEP
	| UploadExternalFailedAEP
	| WithPluginStateCalledAEP
	| CodeBlockLanguageSelectedAEP
	| EditorContentRetrievalPerformedAEP
	| MediaLinkTransformedAEP
	| TextLinkCodeMarkTransformedAEP
	| DedupeMarksTransformedAEP
	| IndentationMarksTransformedAEP
	| NodesMissingContentTransformedAEP
	| InvalidProsemirrorDocumentErrorAEP
	| DocumentProcessingErrorAEP
	| InvalidMediaContentTransformedAEP
	| HeadingAnchorLinkButtonAEP
	| CollabStepsTrackerPayloadAEP
	| CollabOrganicChangesTrackerPayloadAEP
	| BlocksDragInitAEP
	| CodeBlockWordWrapToggleAEP
	| RequestToEditAEP
	| SingleColumLayoutDetectedAEP
	| CopyLinkToAnchorButtonAEP
	| DockedPrimaryToolbarRenderedAEP
	| RovoMoreOptionsClickedAEP
	| AskRovoButtonClickedAEP
	| ChangeToneMenuItemClickedAEP
	| TranslateMenuItemClickedAEP
	| MediaSingleWidthTransformedAEP;
