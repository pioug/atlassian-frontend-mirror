import { ReactElement, RefObject } from 'react';
import { Node, Schema } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import EditorActions from '../actions';

import {
  ContextIdentifierProvider,
  ErrorReportingHandler,
  ExtensionHandlers,
  ExtensionProvider,
  SearchProvider,
  Providers,
  Transformer,
} from '@atlaskit/editor-common';

import { ActivityProvider } from '@atlaskit/activity-provider';
import { MentionProvider } from '@atlaskit/mention/resource';
import { TaskDecisionProvider } from '@atlaskit/task-decision';

import { PluginConfig as TablesPluginConfig } from '../plugins/table/types';
import { TextColorPluginConfig } from '../plugins/text-color/pm-plugins/main';
import { MediaOptions, MediaState } from '../plugins/media/types';
import { CollabEditOptions } from '../plugins/collab-edit/types';
import { CardOptions } from '@atlaskit/editor-common';
import { QuickInsertOptions } from '../plugins/quick-insert/types';
import { AnnotationProviders } from '../plugins/annotation/types';
import { TextFormattingOptions } from '../plugins/text-formatting/types';
import { PlaceholderTextOptions } from '../plugins/placeholder-text/types';
import { BlockTypePluginOptions } from '../plugins/block-type/types';
import { CodeBlockOptions } from '../plugins/code-block/types';
import { LayoutPluginOptions } from '../plugins/layout/types';
import { FindReplaceOptions } from '../plugins/find-replace/types';
import { ExtensionConfig } from './extension-config';
import { EditorAppearance } from './editor-appearance';
import { MenuItem } from '../ui/DropdownMenu/types';
import { EditorOnChangeHandler } from './editor-onchange';
import { PerformanceTracking } from './performance-tracking';
import { PanelPluginConfig } from './../plugins/panel/types';
import { EditorPlugin } from './editor-plugin';
import { MentionPluginConfig } from './../plugins/mentions/types';
import { EmptyStateHandler } from './empty-state-handler';

export type ReactComponents = ReactElement<any> | ReactElement<any>[];

type ExtensionProviders = (ExtensionProvider | Promise<ExtensionProvider>)[];
type ExtensionProvidersWithEditorAction = (
  editorActions?: EditorActions,
) => ExtensionProviders;

export type ExtensionProvidersProp =
  | ExtensionProviders
  | ExtensionProvidersWithEditorAction;

export type FeedbackInfo = {
  product?: string;
  packageVersion?: string;
  packageName?: string;
  labels?: Array<string>;
  sessionId?: string;
  contentId?: string;
  tabId?: string;
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

  contentComponents?: ReactComponents;
  primaryToolbarComponents?: ReactComponents;

  // Optionally adds an element (eg: an icon) at the start of the editor's primary toolbar. If not specified, the primary toolbar spans the entire width.
  primaryToolbarIconBefore?: ReactElement;
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

  // Enable panel blocks, the thing that displays a coloured box with icons aka info, warning macros.
  // You will most likely need backend ADF storage for this feature.
  allowPanel?: boolean | PanelPluginConfig;

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
  allowLayouts?: boolean | LayoutPluginOptions;

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

  // Enable find/replace functionality within the editor.
  // You can use the object form to enable additional individual features e.g. case-matching toggle.
  allowFindReplace?: boolean | FindReplaceOptions;

  persistScrollGutter?: boolean;

  // Set to enable the quick insert menu i.e. '/' key trigger.
  // You can also provide your own insert menu options that will be shown in addition to the enabled
  // editor features e.g. Confluence uses this to provide its macros.
  quickInsert?: QuickInsertOptions;

  /** @deprecated Use smartLinks instead. */
  UNSAFE_cards?: CardOptions;

  smartLinks?: CardOptions;

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
  searchProvider?: Promise<SearchProvider>;

  annotationProviders?: AnnotationProviders;

  collabEditProvider?: Providers['collabEditProvider'];
  presenceProvider?: Promise<any>;
  emojiProvider?: Providers['emojiProvider'];
  taskDecisionProvider?: Promise<TaskDecisionProvider>;
  allowNestedTasks?: boolean;
  contextIdentifierProvider?: Promise<ContextIdentifierProvider>;

  legacyImageUploadProvider?: Providers['imageUploadProvider'];
  mentionProvider?: Promise<MentionProvider>;
  mention?: MentionPluginConfig;

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

  // Set the DOM element for attaching popup menus
  popupsMountPoint?: HTMLElement;
  // DOM element used to help calculate correct positioning of popup menus to make sure they dont go offscreen.
  popupsBoundariesElement?: HTMLElement;
  // Specify when mount point is different from scrollable element so popup menus can be positioned according the scrollable element.
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

  /**
   * flag to indicate display name instead of nick name should be inserted for mentions
   * default: false, which inserts the nick name
   * @deprecated Use mention.mentionInsertDisplayName instead
   */
  mentionInsertDisplayName?: boolean;

  /**
   * @description The nth keystroke after which an input time taken event is sent, 0 to disable it
   * @default 100
   * @deprecated Use performanceTracking.inputSampling instead https://product-fabric.atlassian.net/browse/ED-10260
   */
  inputSamplingLimit?: number;

  // New extension API
  // This eventually is going to replace `quickInsert.provider`, `extensionHandlers`, `macroProvider`.
  extensionProviders?: ExtensionProvidersProp;

  // Experimental support for modern React Context for @atlaskit/analytics-next.
  // Enables re-providing of AnalyticsContext for all ReactNodeViews.
  UNSAFE_useAnalyticsContext?: boolean;

  /**
   * @description Control performance metric measurements and tracking
   */
  performanceTracking?: PerformanceTracking;

  elementBrowser?: {
    showModal?: boolean;
    replacePlusMenu?: boolean;
    helpUrl?: string;
    emptyStateHandler?: EmptyStateHandler;
  };

  codeBlock?: CodeBlockOptions;

  // Enable undo/redo buttons within the editor.
  UNSAFE_allowUndoRedoButtons?: boolean;

  /**
   * @default undefined
   * @description Enables valid transaction events to be tracked in analytics (at a sampled rate)
   */
  trackValidTransactions?:
    | {
        samplingRate: number;
      }
    | boolean;

  /**
   * @default undefined
   * @description
   * Enables the sticky toolbar in the comment/standard editor.
   * If a boolean is specified and it's `true`, the sticky toolbar will be enabled, sticking to the top of the scroll parent.
   * Instead a reference can be specified to an existing sticky toolbar on the page that the editor toolbar should stay below (experimental).
   */
  useStickyToolbar?: boolean | RefObject<HTMLElement>;

  /**
   * @default undefined
   * @description
   * Short lived feature flags for experiments and gradual rollouts
   * Flags are expected to follow these rules or they are filtered out
   *
   * 1. cased in kebab-case (match [a-z-])
   * 2. have boolean values
   *
   * @example
   * ```tsx
   * (<Editor featureFlags={{ 'my-feature': true }} />);
   * getFeatureFlags()?.myFeature === true;
   * ```
   *
   * @example
   * ```tsx
   * (<Editor featureFlags={{ 'my-feature': 'thing' }} />);
   * getFeatureFlags()?.myFeature === undefined;
   * ```
   *
   * @example
   * ```tsx
   * (<Editor featureFlags={{ 'product.my-feature': false }} />);
   * getFeatureFlags()?.myFeature === undefined;
   * getFeatureFlags()?.productMyFeature === undefined;
   * ```
   */
  featureFlags?: { [featureFlag: string]: string | boolean };

  /**
   * @deprecated Do not use outside of Editor team.
   * This has subtle side effects - you __WILL__ break functionality without implementer knowledge of editor-core internals
   */
  dangerouslyAppendPlugins?: {
    /**
     * @deprecated Do not use outside of Editor team.
     */
    __plugins: EditorPlugin[];
  };
}
