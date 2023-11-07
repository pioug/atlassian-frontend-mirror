import type { ReactElement } from 'react';

import type { Node, Schema } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { ActivityProvider } from '@atlaskit/activity-provider';
import type { CardOptions } from '@atlaskit/editor-common/card';
import type {
  ExtensionHandlers,
  ExtensionProvider,
} from '@atlaskit/editor-common/extensions';
import type { EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import type {
  ContextIdentifierProvider,
  Providers,
  SearchProvider,
} from '@atlaskit/editor-common/provider-factory';
import type {
  AllEditorPresetPluginTypes,
  Transformer,
  LinkingOptions,
  TextFormattingOptions,
  QuickInsertOptions,
} from '@atlaskit/editor-common/types';
import type { ErrorReportingHandler } from '@atlaskit/editor-common/utils';
import type { PluginConfig as TablesPluginConfig } from '@atlaskit/editor-plugin-table/types';
import type { MentionProvider } from '@atlaskit/mention/resource';
import type { TaskDecisionProvider } from '@atlaskit/task-decision';

import type EditorActions from '../actions';
import type { AnnotationProviders } from '../plugins/annotation/types';
import type { BlockTypePluginOptions } from '@atlaskit/editor-plugin-block-type';
import type { CodeBlockOptions } from '@atlaskit/editor-plugin-code-block';
import type { CollabEditOptions } from '@atlaskit/editor-common/collab';
import type { DatePluginConfig } from '@atlaskit/editor-plugin-date';
import type { FindReplaceOptions } from '../plugins/find-replace/types';
import type { LayoutPluginOptions } from '@atlaskit/editor-plugin-layout';
import type {
  MediaOptions,
  MediaState,
} from '@atlaskit/editor-plugin-media/types';
import type { MentionPluginConfig } from '@atlaskit/editor-plugin-mentions';
import type { PanelPluginConfig } from '@atlaskit/editor-plugin-panel';
import type { PlaceholderTextOptions } from '@atlaskit/editor-plugin-placeholder-text';
import type { TextColorPluginConfig } from '@atlaskit/editor-plugin-text-color';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';

import type { EditorAppearance } from './editor-appearance';
import type { EditorOnChangeHandler } from './editor-onchange';
import type { EditorPlugin } from './editor-plugin';
import type { EmptyStateHandler } from './empty-state-handler';
import type { ExtensionConfig } from './extension-config';
import type { PerformanceTracking } from './performance-tracking';
import type { UseStickyToolbarType } from '@atlaskit/editor-common/ui';

export type { UseStickyToolbarType };

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

export type BeforeAndAfterToolbarComponents = {
  // Before contains components that are on the left of avatar and find and replace button (eg. save indicator)
  before: ReactComponents;
  // After contains components that are on the right of avatar and find and replace button (eg. publish button)
  after: ReactComponents;
};

export type PrimaryToolbarComponents =
  | BeforeAndAfterToolbarComponents
  | ReactComponents;

interface EditorBaseProps {
  // Note: this comment is replicated in packages/editor/renderer/src/ui/Renderer/types.ts
  // any changes should be made in both locations
  /*
  Configure the display mode of the editor. Different modes may have different feature sets supported.

  - `comment` - should be used for things like comments where you have a field input but require a toolbar & save/cancel buttons
  - `full-page` - should be used for a full page editor where it is the user focus of the page
  - `chromeless` - is essentially the `comment` editor but without the editor chrome, like toolbar & save/cancel buttons
  - `mobile` - is used when consumed in a mobile web view (by mobile bridge).
  */
  appearance?: EditorAppearance;

  contentComponents?: ReactComponents;

  // Optionally adds an element (eg: an icon) at the start of the editor's primary toolbar. If not specified, the primary toolbar spans the entire width.
  primaryToolbarIconBefore?: ReactElement;
  secondaryToolbarComponents?: ReactComponents;

  persistScrollGutter?: boolean;

  // Set to enable the quick insert menu i.e. '/' key trigger.
  // You can also provide your own insert menu options that will be shown in addition to the enabled
  // editor features e.g. Confluence uses this to provide its macros.
  quickInsert?: QuickInsertOptions;

  // Set if the editor should be focused.
  shouldFocus?: boolean;

  // Set if the editor should be disabled.
  disabled?: boolean;

  // Content to appear in the context panel. Displays as a right sidebar in the full-page appearance.
  // You'll want to pass it a `ContextPanel` component from this package, and your content as its children.
  contextPanel?: ReactComponents;

  errorReporterHandler?: ErrorReportingHandler;

  contentTransformerProvider?: (schema: Schema) => Transformer<string>;

  // Set to configure the maximum editor height in pixels for `comment`, `chromeless` and `mobile` editor modes.
  maxHeight?: number;

  // Set to configure the minimum editor height in pixels for `comment`, `chromeless` editor modes.
  minHeight?: number;

  // Default placeholder text to be displayed if the document content is empty. e.g. 'Add a comment...'
  placeholder?: string;

  // Default placeholder text to be displayed when a bracket '{' is typed and the line is empty e.g. 'Did you mean to use '/' to insert content?'
  placeholderBracketHint?: string;

  // Set the default editor content.
  defaultValue?: Node | string | Object;

  // Editor assitive label. Assistive label is hard coded to "Main content area, start typing to enter text.",
  //  defined in "packages/editor/editor-core/src/create-editor/messages.ts"
  // When this prop is set, it will override default one.
  assistiveLabel?: string;

  // Set the DOM element for attaching popup menus
  popupsMountPoint?: HTMLElement;
  // DOM element used to help calculate correct positioning of popup menus to make sure they dont go offscreen.
  popupsBoundariesElement?: HTMLElement;
  // Specify when mount point is different from scrollable element so popup menus can be positioned according the scrollable element.
  popupsScrollableElement?: HTMLElement;

  editorActions?: EditorActions;

  // Set a callback for the editor when users are able to interact.
  // Also provides access to `EditorActions` for controlling editor.
  onEditorReady?: (editorActions: EditorActions) => void;

  // Called when editor is being unmounted
  onDestroy?: () => void;

  // Set for an on change callback.
  // `meta.source === 'remote'` means that a change is coming from remote source, e.g. collab editing session.
  onChange?: EditorOnChangeHandler;

  // Set for an on cancel callback.
  onCancel?: (editorView: EditorView) => void;

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
   * if {offsetTop: number} is passed in, the toolbar is sticky and the toolbar's 'top' will be set to the offsetTop
   * so the toolbar will sticks to `{offsetTop}` below the scroll parent.
   */
  useStickyToolbar?: UseStickyToolbarType;

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
}

// These are props that are shared between the editor and the plugin components.
// TODO: We should refactor this to ensure these are not shared
export interface EditorSharedPropsWithPlugins {
  // Set for an on save callback.
  onSave?: (editorView: EditorView) => void;

  /**
   * @description Control performance metric measurements and tracking
   */
  performanceTracking?: PerformanceTracking;

  // Flag to remove private content such as mention names
  sanitizePrivateContent?: boolean;

  // Set to configure media features. Media single refers to the embedded version of media,
  // which is probably what you want. Media group refers to a filmstrip, thumbnail view of media files which was used in Stride.
  media?: MediaOptions;

  collabEdit?: CollabEditOptions;

  primaryToolbarComponents?: PrimaryToolbarComponents;

  // Enable undo/redo buttons within the editor.
  allowUndoRedoButtons?: boolean;

  /**
   *  Configure and extend editor linking behaviour
   */
  linking?: LinkingOptions;

  // Hide avatar group in editor toolbar
  hideAvatarGroup?: boolean;
}

export interface EditorProps
  extends EditorBaseProps,
    EditorPluginFeatureProps,
    EditorSharedPropsWithPlugins,
    EditorProviderProps {
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

export interface EditorNextProps
  extends EditorBaseProps,
    EditorSharedPropsWithPlugins,
    EditorProviderProps {
  preset: EditorPresetBuilder<string[], AllEditorPresetPluginTypes[]>;
}

export interface EditorProviderProps {
  activityProvider?: Promise<ActivityProvider>;
  searchProvider?: Promise<SearchProvider>;

  annotationProviders?: AnnotationProviders;

  collabEditProvider?: Providers['collabEditProvider'];
  presenceProvider?: Promise<any>;
  emojiProvider?: Providers['emojiProvider'];
  taskDecisionProvider?: Promise<TaskDecisionProvider>;

  legacyImageUploadProvider?: Providers['imageUploadProvider'];
  mentionProvider?: Promise<MentionProvider>;

  // Allows you to define custom autoformatting rules.
  autoformattingProvider?: Providers['autoformattingProvider'];

  // This is temporary for Confluence. **Please do not use**.
  macroProvider?: Providers['macroProvider'];

  contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
}

export interface EditorPluginFeatureProps {
  allowExpand?:
    | boolean
    | { allowInsertion?: boolean; allowInteractiveExpand?: boolean };

  allowNestedTasks?: boolean;

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

  // Enable the editor help dialog.
  allowHelpDialog?: boolean;

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
  // Can use true/false to enable/disable default or can pass in DatePluginConfig object to configure weekStartDay
  allowDate?: boolean | DatePluginConfig;

  // Temporary flag to enable layouts while it's under development
  // Use object form to enable breakout for layouts, and to enable the newer layouts - left sidebar & right sidebar
  allowLayouts?: boolean | LayoutPluginOptions;

  // Enable status, if menuDisabled is passed then plugin is enabled by default
  allowStatus?:
    | boolean
    | {
        menuDisabled: boolean;
      };

  // Enable text alignment support inside `heading` and `paragraph`
  allowTextAlignment?: boolean;

  // Enable indentation support for `heading` and `paragraph`
  allowIndentation?: boolean;

  // Enable showing of indentaion buttons in editor toolbar
  showIndentationButtons?: boolean;

  /**
   * This enables new insertion behaviour only for horizontal rule and media single in certain conditions.
   * The idea of this new behaviour is to have a consistent outcome regardless of the insertion method.
   **/
  allowNewInsertionBehaviour?: boolean;

  // Enable find/replace functionality within the editor.
  // You can use the object form to enable additional individual features e.g. case-matching toggle.
  allowFindReplace?: boolean | FindReplaceOptions;

  /**
   * Enable experimental support for the "border" mark.
   * Refer to ADF Change proposal #65 for more details.
   * @deprecated Use allowBorderMark instead.
   */
  UNSAFE_allowBorderMark?: boolean;

  /**
   * Enable support for the "border" mark.
   * Refer to ADF Change proposal #65 for more details.
   */
  allowBorderMark?: boolean;

  /**
   * Enable support for the "fragment" mark.
   * Refer to ADF Change proposal #60 for more details.
   */
  allowFragmentMark?: boolean;

  /**
   * Set this to false to opt out of the default behaviour of auto scrolling into view
   * whenever the document is changed
   */
  autoScrollIntoView?: boolean;

  elementBrowser?: {
    showModal?: boolean;
    replacePlusMenu?: boolean;
    helpUrl?: string;
    emptyStateHandler?: EmptyStateHandler;
  };

  // Set to configure the maximum ADF node document size.
  // Understandably this isn’t the best logical max parameter for content, but its the cheapest for now.
  maxContentSize?: number;

  // Submits on the enter key. Probably useful for an inline comment editor use case.
  saveOnEnter?: boolean;

  // Information required for editor to display the feedback modal.
  // This is also required to enable quick insert plugin for feedback modal.
  feedbackInfo?: FeedbackInfo;

  mention?: MentionPluginConfig;
  /**
   * flag to indicate display name instead of nick name should be inserted for mentions
   * default: false, which inserts the nick name
   * @deprecated Use mention.mentionInsertDisplayName instead
   */
  mentionInsertDisplayName?: boolean;

  uploadErrorHandler?: (state: MediaState) => void;

  // Set if you want to wait for media file uploads before save.
  waitForMediaUpload?: boolean;

  // Set to provide your extensions handlers.
  extensionHandlers?: ExtensionHandlers;

  // Enables text colour. Ew are you sure you want to enable this?
  allowTextColor?: boolean | TextColorPluginConfig;

  // Enables tables. You can enable individual table features like table header rows and cell background colour.
  // You will most likely need backend ADF storage for the advanced table features.
  allowTables?: boolean | TablesPluginConfig;

  // Set to add custom menu items to the insert (plus) menu dropdown.
  insertMenuItems?: MenuItem[];

  /** @deprecated Use linking.smartLinks prop instead. */
  UNSAFE_cards?: CardOptions;

  /** @deprecated Use linking.smartLinks prop instead. */
  smartLinks?: CardOptions;

  allowAnalyticsGASV3?: boolean;

  codeBlock?: CodeBlockOptions;

  // Set to disable text formatting styles. If not specified, they will be all enabled by default. Code here refers to inline code.
  // Smart text completion refers to the auto replacement of characters like arrows, quotes and correct casing of Atlassian product names.
  // This should only be disabled if the user has an OS setting that disables this.
  textFormatting?: TextFormattingOptions;
}
