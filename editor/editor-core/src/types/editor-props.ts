import { ReactElement } from 'react';
import { Node, Schema } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import EditorActions from '../actions';

import {
  ContextIdentifierProvider,
  ErrorReportingHandler,
  ExtensionHandlers,
  ExtensionProvider,
  Providers,
  Transformer,
} from '@atlaskit/editor-common';

import { ActivityProvider } from '@atlaskit/activity';
import { MentionProvider } from '@atlaskit/mention/resource';
import { TaskDecisionProvider } from '@atlaskit/task-decision';

import { PluginConfig as TablesPluginConfig } from '../plugins/table/types';
import { TextColorPluginConfig } from '../plugins/text-color/pm-plugins/main';
import { MediaOptions, MediaState } from '../plugins/media/types';
import { AnalyticsHandler } from '../analytics/handler';
import { CollabEditOptions } from '../plugins/collab-edit/types';
import { CardOptions } from '../plugins/card/types';
import { QuickInsertOptions } from '../plugins/quick-insert/types';
import { AnnotationProvider } from '../plugins/annotation/types';
import { TextFormattingOptions } from '../plugins/text-formatting/types';
import { PlaceholderTextOptions } from '../plugins/placeholder-text/types';
import { BlockTypePluginOptions } from '../plugins/block-type/types';
import { LayoutsConfig } from '../plugins/layout/types';
import { ExtensionConfig } from './extension-config';
import { EditorAppearance } from './editor-appearance';
import { MenuItem } from '../ui/DropdownMenu/types';
import { EditorOnChangeHandler } from './editor-onchange';
import {
  TransactionTracking,
  UITracking,
  NodeViewTracking,
} from './performance-tracking';

export type ReactComponents = ReactElement<any> | ReactElement<any>[];

export type FeedbackInfo = {
  product?: string;
  packageVersion?: string;
  packageName?: string;
  labels?: Array<string>;
};

export interface EditorProps {
  /*
  Configure the display mode of the editor. Different modes may have different feature sets supported.

  - `comment` - should be used for things like comments where you have a field input but require a toolbar & save/cancel buttons
  - `full-page` - should be used for a full page editor where it is the user focus of the page
  - `chromeless` - is essentially the `comment` editor but without the editor chrome, like toolbar & save/cancel buttons
  - `mobile` - should be used for the mobile web view. It is a full page editor version for mobile.
  */
  appearance?: EditorAppearance;

  // Legacy analytics support handler, which will be removed soon. **Do not use**.
  analyticsHandler?: AnalyticsHandler;

  contentComponents?: ReactComponents;
  primaryToolbarComponents?: ReactComponents;
  secondaryToolbarComponents?: ReactComponents;
  allowAnalyticsGASV3?: boolean;
  // Configure allowed blocks in the editor, currently only supports `heading`, `blockquote`, `hardBreak` and `codeBlock`.
  allowBlockType?: BlockTypePluginOptions['allowBlockType'];

  // Whether or not you want to allow Action and Decision elements in the editor. You can currently only enable both or disable both.
  // To enable, you need to also provide a `taskDecisionProvider`. You will most likely need backend ADF storage for this feature.
  allowTasksAndDecisions?: boolean;

  // Enables new breakout mark.
  // This mark is being used for making code-blocks breakout.
  allowBreakout?: boolean;

  // Enables horizontal rules.
  allowRule?: boolean;

  // Enables text colour. Ew are you sure you want to enable this?
  allowTextColor?: boolean | TextColorPluginConfig;

  // Enables tables. You can enable individual table features like table header rows and cell background colour.
  // You will most likely need backend ADF storage for the advanced table features.
  allowTables?: boolean | TablesPluginConfig;

  // Enable the editor help dialog.
  allowHelpDialog?: boolean;

  // Information required for editor to display the feedback modal.
  // This is also required to enable quick insert plugin for feedback modal.
  feedbackInfo?: FeedbackInfo;

  // This is a temporary setting for Confluence until we ship smart cards. **Please do not use.**
  allowJiraIssue?: boolean;

  // Deprecated. Defaults to true.
  // Anything it doesn’t understand it will wrap in an unsupported block or inline node.
  // It will render a gray non editable box.
  allowUnsupportedContent?: boolean;

  // Enable panel blocks, the thing that displays a coloured box with icons aka info, warning macros.
  // You will most likely need backend ADF storage for this feature.
  allowPanel?: boolean;

  // Enable extensions. Extensions let products and the ecosystem extend ADF and render their own things.
  // Similar to macros in Confluence. You will most likely need backend ADF storage for this feature.
  allowExtension?: boolean | ExtensionConfig;

  allowConfluenceInlineComment?: boolean;

  // Enable placeholder text which is handy for things like a template editor.
  // Placeholder text is an inline text element that is removed when a user clicks on it.
  // You can also disable the inserts for this feature so users can never insert such placeholder
  // elements in the editor but you could load the initial content in the editor with them.
  allowTemplatePlaceholders?: boolean | PlaceholderTextOptions;

  // Enable dates. You will most likely need backend ADF storage for this feature.
  allowDate?: boolean;

  // Temporary flag to enable layouts while it's under development
  // Use object form to enable breakout for layouts, and to enable the newer layouts - left sidebar & right sidebar
  allowLayouts?: boolean | LayoutsConfig;

  // Enable status, if menuDisabled is passed then plugin is enabled by default
  allowStatus?:
    | boolean
    | {
        menuDisabled: boolean;
      };

  allowDynamicTextSizing?: boolean;

  // Enable text alignment support inside `heading` and `paragraph`
  allowTextAlignment?: boolean;

  // Enable indentation support for `heading` and `paragraph`
  allowIndentation?: boolean;

  /**
   * This enables new insertion behaviour only for horizontal rule and media single in certain conditions.
   * The idea of this new behaviour is to have a consistent outcome regardless of the insertion method.
   **/
  allowNewInsertionBehaviour?: boolean;

  /**
   * Set this to false to opt out of the default behaviour of auto scrolling into view
   * whenever the document is changed
   */
  autoScrollIntoView?: boolean;

  // Enable find/replace functionality within the editor
  allowFindReplace?: boolean;

  // Set to enable the quick insert menu i.e. '/' key trigger.
  // You can also provide your own insert menu options that will be shown in addition to the enabled
  // editor features e.g. Confluence uses this to provide its macros.
  quickInsert?: QuickInsertOptions;

  UNSAFE_cards?: CardOptions;

  allowExpand?:
    | boolean
    | { allowInsertion?: boolean; allowInteractiveExpand?: boolean };

  // Submits on the enter key. Probably useful for an inline comment editor use case.
  saveOnEnter?: boolean;

  // Set if the editor should be focused.
  shouldFocus?: boolean;

  // Set if the editor should be disabled.
  disabled?: boolean;

  // Content to appear in the context panel. Displays as a right sidebar in the full-page appearance.
  // You'll want to pass it a `ContextPanel` component from this package, and your content as its children.
  contextPanel?: ReactComponents;

  errorReporterHandler?: ErrorReportingHandler;
  uploadErrorHandler?: (state: MediaState) => void;

  activityProvider?: Promise<ActivityProvider>;

  annotationProvider?: AnnotationProvider;

  collabEditProvider?: Providers['collabEditProvider'];
  presenceProvider?: Promise<any>;
  emojiProvider?: Providers['emojiProvider'];
  taskDecisionProvider?: Promise<TaskDecisionProvider>;
  allowNestedTasks?: boolean;
  contextIdentifierProvider?: Promise<ContextIdentifierProvider>;

  legacyImageUploadProvider?: Providers['imageUploadProvider'];
  mentionProvider?: Promise<MentionProvider>;

  // Allows you to define custom autoformatting rules.
  autoformattingProvider?: Providers['autoformattingProvider'];

  // This is temporary for Confluence. **Please do not use**.
  macroProvider?: Providers['macroProvider'];

  // Set if you want to wait for media file uploads before save.
  waitForMediaUpload?: boolean;
  contentTransformerProvider?: (schema: Schema) => Transformer<string>;

  // Set to configure media features. Media single refers to the embedded version of media,
  // which is probably what you want. Media group refers to a filmstrip, thumbnail view of media files which was used in Stride.
  media?: MediaOptions;
  collabEdit?: CollabEditOptions;

  // Set to disable text formatting styles. If not specified, they will be all enabled by default. Code here refers to inline code.
  // Smart text completion refers to the auto replacement of characters like arrows, quotes and correct casing of Atlassian product names.
  // This should only be disabled if the user has an OS setting that disables this.
  textFormatting?: TextFormattingOptions;

  // Set to configure the maximum editor height in pixels for `comment`, `chromeless` and `mobile` editor modes.
  maxHeight?: number;

  // Set to configure the maximum ADF node document size.
  // Understandably this isn’t the best logical max parameter for content, but its the cheapest for now.
  maxContentSize?: number;

  // Default placeholder text to be displayed if the document content is empty. e.g. 'Add a comment...'
  placeholder?: string;

  // Default placeholder text to be displayed if line is empty but the document content is not. e.g. 'Type / to insert content'
  placeholderHints?: string[];

  // Default placeholder text to be displayed when a bracket '{' is typed and the line is empty e.g. 'Did you mean to use '/' to insert content?'
  placeholderBracketHint?: string;

  // Feature flag to enable date picker which has a textbox for internationalised keyboard date input
  allowKeyboardAccessibleDatepicker?: boolean;

  // Set the default editor content.
  defaultValue?: Node | string | Object;

  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;

  // Set to add custom menu items to the insert (plus) menu dropdown.
  insertMenuItems?: MenuItem[];
  editorActions?: EditorActions;

  // Set a callback for the editor when users are able to interact.
  // Also provides access to `EditorActions` for controlling editor.
  onEditorReady?: (editorActions: EditorActions) => void;

  // Called when editor is being unmounted
  onDestroy?: () => void;

  // Set for an on change callback.
  // `meta.source === 'remote'` means that a change is coming from remote source, e.g. collab editing session.
  onChange?: EditorOnChangeHandler;

  // Set for an on save callback.
  onSave?: (editorView: EditorView) => void;

  // Set for an on cancel callback.
  onCancel?: (editorView: EditorView) => void;

  // Set to provide your extensions handlers.
  extensionHandlers?: ExtensionHandlers;

  // Flag to remove private content such as mention names
  sanitizePrivateContent?: boolean;

  // flag to indicate display name instead of nick name should be inserted for mentions
  // default: false, which inserts the nick name
  mentionInsertDisplayName?: boolean;

  // The nth keystroke after which an input time taken event is sent, 0 to disable it
  // default: 100
  inputSamplingLimit?: number;

  // New extension API
  // This eventually is going to replace `quickInsert.provider`, `extensionHandlers`, `macroProvider`.
  extensionProviders?: Array<ExtensionProvider | Promise<ExtensionProvider>>;

  // ⚠️ This API will be deprecated in the future
  transactionTracking?: TransactionTracking;

  performanceTracking?: {
    // Control transaction tracking
    // default:
    // {
    //   enabled: false,
    //   countNodes: true,
    //   samplingRate: 100,
    //   slowThreshold: 300,
    //   slowOutlierThreshold: 3,
    //   pluginMethodThreshold: 1,
    //   outlierFactor: 3
    // }
    transactionTracking?: TransactionTracking;
    uiTracking?: UITracking;
    nodeViewTracking?: NodeViewTracking;
  };
}
