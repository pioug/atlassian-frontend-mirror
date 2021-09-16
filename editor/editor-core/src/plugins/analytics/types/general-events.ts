import {
  UIAEP,
  TrackAEP,
  OperationalAEP,
  OperationalAEPWithObjectId,
} from './utils';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  INPUT_METHOD,
} from './enums';
import { PluginPerformanceReportData } from '../../../utils/performance/plugin-performance-report';
import {
  ShallowPropsDifference,
  PropsDifference,
} from '../../../utils/compare';
import { FeatureFlagKey } from '../../../types/feature-flags';
import { AnnotationAEP } from './inline-comment-events';
import { RichMediaLayout } from '@atlaskit/adf-schema';
import { SEVERITY } from '@atlaskit/editor-common';

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
    platform: PLATFORMS.NATIVE | PLATFORMS.HYBRID | PLATFORMS.WEB;
    featureFlags: FeatureFlagKey[];
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
    duration: number;
    startTime: number;
    nodes?: Record<string, number>;
    ttfb?: number;
    severity?: SEVERITY;
  },
  undefined
>;

type EditorTTIAEP = OperationalAEP<
  ACTION.EDITOR_TTI,
  ACTION_SUBJECT.EDITOR,
  undefined,
  {
    tti: number;
    ttiFromInvocation: number;
    canceled: boolean;
    ttiSeverity?: SEVERITY;
    ttiFromInvocationSeverity?: SEVERITY;
  },
  undefined
>;

type EditorContentRetrievalPerformedAEP = OperationalAEP<
  ACTION.EDITOR_CONTENT_RETRIEVAL_PERFORMED,
  ACTION_SUBJECT.EDITOR,
  undefined,
  {
    success: boolean;
    errorInfo?: string;
    errorStack?: string;
  },
  undefined
>;

type EditorRenderedAEP<T> = OperationalAEP<
  ACTION.RE_RENDERED,
  ACTION_SUBJECT.EDITOR | ACTION_SUBJECT.REACT_EDITOR_VIEW,
  undefined,
  {
    propsDifference: PropsDifference<T> | ShallowPropsDifference<T>;
    count: number;
  },
  undefined
>;

type BrowserFreezePayload = OperationalAEPWithObjectId<
  ACTION.BROWSER_FREEZE,
  ACTION_SUBJECT.EDITOR,
  undefined,
  {
    freezeTime: number;
    nodeSize: number;
    participants: number;
    nodeCount?: Record<string, number>;
    interactionType?: BROWSER_FREEZE_INTERACTION_TYPE;
    severity?: SEVERITY;
  },
  undefined
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
    time: number;
    nodeSize: number;
    participants: number;
    nodeCount?: Record<string, number>;
  },
  undefined
>;

type InputPerfSamlingAEP = OperationalAEPWithObjectId<
  ACTION.INPUT_PERF_SAMPLING,
  ACTION_SUBJECT.EDITOR,
  undefined,
  {
    time: number;
    nodeSize: number;
    participants: number;
    nodeCount?: Record<string, number>;
    severity?: SEVERITY;
  },
  undefined
>;

type DispatchedTransactionAEP = OperationalAEP<
  ACTION.TRANSACTION_DISPATCHED,
  ACTION_SUBJECT.EDITOR,
  undefined,
  {
    report: PluginPerformanceReportData;
    participants: number;
  },
  undefined
>;

type WithPluginStateCalledAEP = OperationalAEP<
  ACTION.WITH_PLUGIN_STATE_CALLED,
  ACTION_SUBJECT.EDITOR,
  undefined,
  {
    plugin: string;
    duration: number;
    participants: number;
  },
  undefined
>;

type ReactNodeViewRenderedAEP = OperationalAEP<
  ACTION.REACT_NODEVIEW_RENDERED,
  ACTION_SUBJECT.EDITOR,
  undefined,
  {
    node: string;
    duration: number;
    participants: number;
  },
  undefined
>;

type UploadExternalFailedAEP = OperationalAEP<
  ACTION.UPLOAD_EXTERNAL_FAIL,
  ACTION_SUBJECT.EDITOR,
  undefined,
  undefined,
  undefined
>;

type EditorStopAEP = UIAEP<
  ACTION.STOPPED,
  ACTION_SUBJECT.EDITOR,
  ACTION_SUBJECT_ID.SAVE | ACTION_SUBJECT_ID.CANCEL,
  {
    inputMethod: INPUT_METHOD.TOOLBAR | INPUT_METHOD.SHORTCUT;
    documentSize: number;
    nodeCount?: {
      tables: number;
      headings: number;
      lists: number;
      mediaSingles: number;
      mediaGroups: number;
      panels: number;
      extensions: number;
      decisions: number;
      actions: number;
      codeBlocks: number;
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

type ButtonFeedbackAEP = ButtonAEP<
  ACTION_SUBJECT_ID.BUTTON_FEEDBACK,
  undefined
>;

type PickerEmojiAEP = PickerAEP<
  ACTION_SUBJECT_ID.PICKER_EMOJI,
  {
    inputMethod:
      | INPUT_METHOD.TOOLBAR
      | INPUT_METHOD.INSERT_MENU
      | INPUT_METHOD.KEYBOARD;
  }
>;

type PickerImageAEP = PickerAEP<
  ACTION_SUBJECT_ID.PICKER_CLOUD,
  {
    inputMethod:
      | INPUT_METHOD.TOOLBAR
      | INPUT_METHOD.QUICK_INSERT
      | INPUT_METHOD.INSERT_MENU;
  }
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
    previousMode: FULL_WIDTH_MODE;
    newMode: FULL_WIDTH_MODE;
  },
  undefined
>;

// TODO: https://product-fabric.atlassian.net/browse/AFP-1418
type ExpandToggleAEP = TrackAEP<
  ACTION.TOGGLE_EXPAND,
  ACTION_SUBJECT.EXPAND | ACTION_SUBJECT.NESTED_EXPAND,
  undefined,
  {
    platform: PLATFORMS;
    mode: MODE;
    expanded: boolean;
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
    previousLayoutType: RichMediaLayout;
    currentLayoutType: RichMediaLayout;
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

export type GeneralEventPayload<T = void> =
  | AnnotateButtonAEP
  | AnnotationAEP
  | BrowserFreezePayload
  | ButtonFeedbackAEP
  | ButtonHelpAEP
  | ColorPickerAEP
  | DispatchedTransactionAEP
  | EditorPerfAEP
  | EditorRenderedAEP<T>
  | EditorStartAEP
  | EditorStopAEP
  | EditorTTIAEP
  | ExpandToggleAEP
  | FeedbackAEP
  | FullWidthModeAEP
  | HelpQuickInsertAEP
  | InputPerfSamlingAEP
  | PickerEmojiAEP
  | PickerImageAEP
  | ReactNodeViewRenderedAEP
  | RichMediaLayoutAEP
  | SelectionAEP
  | SlowInputAEP
  | UploadExternalFailedAEP
  | WithPluginStateCalledAEP
  | CodeBlockLanguageSelectedAEP
  | EditorContentRetrievalPerformedAEP;
