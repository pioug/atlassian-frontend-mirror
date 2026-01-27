import type { ReactElement } from 'react';

import type { ActivityProvider } from '@atlaskit/activity-provider';
import type { CardOptions } from '@atlaskit/editor-common/card';
import type { CollabEditOptions } from '@atlaskit/editor-common/collab';
import type { ErrorReportingHandler } from '@atlaskit/editor-common/error-reporter';
import type { ExtensionHandlers, ExtensionProvider } from '@atlaskit/editor-common/extensions';
import type {
	AllEditorPresetPluginTypes,
	AllPluginNames,
	EditorPresetBuilder,
} from '@atlaskit/editor-common/preset';
import type {
	ContextIdentifierProvider,
	Providers,
	SearchProvider,
} from '@atlaskit/editor-common/provider-factory';
import type {
	EditorAppearance,
	EmptyStateHandler,
	FeedbackInfo,
	LinkingOptions,
	PerformanceTracking,
	QuickInsertOptions,
	PasteWarningOptions,
	Transformer,
} from '@atlaskit/editor-common/types';
import type { UseStickyToolbarType } from '@atlaskit/editor-common/ui';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import type { AnnotationProviders } from '@atlaskit/editor-plugins/annotation';
import type { BlockTypePluginOptions } from '@atlaskit/editor-plugins/block-type';
import type { CodeBlockPluginOptions } from '@atlaskit/editor-plugins/code-block';
import type { DatePluginOptions } from '@atlaskit/editor-plugins/date';
import type { FindReplaceOptions } from '@atlaskit/editor-plugins/find-replace';
import type { LayoutPluginOptions } from '@atlaskit/editor-plugins/layout';
import type { MediaPluginOptions, MediaState } from '@atlaskit/editor-plugins/media/types';
import type { MentionPluginConfig } from '@atlaskit/editor-plugins/mentions';
import type { PanelPluginConfig } from '@atlaskit/editor-plugins/panel';
import type { PlaceholderTextPluginOptions } from '@atlaskit/editor-plugins/placeholder-text';
import type { SyncedBlockPluginOptions } from '@atlaskit/editor-plugins/synced-block';
import type { PluginConfig as TablesPluginConfig } from '@atlaskit/editor-plugins/table/types';
import type { TextColorPluginConfig } from '@atlaskit/editor-plugins/text-color';
import type { TextFormattingPluginOptions } from '@atlaskit/editor-plugins/text-formatting';
import type { Node, Schema } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { SyncedBlockProvider } from '@atlaskit/editor-synced-block-provider';
import type { MentionProvider } from '@atlaskit/mention/resource';
import type { TaskDecisionProvider } from '@atlaskit/task-decision';

import type EditorActions from '../actions';

import type { EditorOnChangeHandler } from './editor-onchange';
import type { ExtensionConfig } from './extension-config';

export type ReactComponents = ReactElement | ReactElement[];

type ExtensionProviders = (ExtensionProvider | Promise<ExtensionProvider>)[];
type ExtensionProvidersWithEditorAction = (editorActions?: EditorActions) => ExtensionProviders;

export type ExtensionProvidersProp = ExtensionProviders | ExtensionProvidersWithEditorAction;

export type BeforeAndAfterToolbarComponents = {
	// After contains components that are on the right of avatar and find and replace button (eg. publish button)
	after: ReactComponents;
	// Before contains components that are on the left of avatar and find and replace button (eg. save indicator)
	before: ReactComponents;
};

export type PrimaryToolbarComponents = BeforeAndAfterToolbarComponents | ReactComponents;

export type BeforeAndAfterContentComponents = {
	// After contains components that are below the editor (eg. blank page quick actions)
	after: ReactComponents;
	// Note: BeforeAndAfterContentComponents type is currently only supported in full page editor
	// Before contains components that are above the editor (eg. title, cover image)
	before: ReactComponents;
};

export type ContentComponents = BeforeAndAfterContentComponents | ReactComponents;

interface EditorBaseProps {
	/**
	 * This is required for accessing whether a page is a live page or not when rendering the appearance component.
	 *
	 * All other consumers should use the editorViewModePlugin to access live page and content mode status.
	 *
	 * @default false
	 */
	__livePage?: boolean;

	// Note: this comment is replicated in packages/editor/renderer/src/ui/renderer-props.ts
	// any changes should be made in both locations
	/*
  Configure the display mode of the editor. Different modes may have different feature sets supported.

  - `comment` - should be used for things like comments where you have a field input but require a toolbar & save/cancel buttons
  - `full-page` - should be used for a full page editor where it is the user focus of the page
  - `chromeless` - is essentially the `comment` editor but without the editor chrome, like toolbar & save/cancel buttons
  */
	appearance?: EditorAppearance;

	// Editor assitive label. Assistive label is hard coded to "Main content area, start typing to enter text.",
	//  defined in "packages/editor/editor-core/src/create-editor/messages.ts"
	// When this prop is set, it will override default one.
	assistiveLabel?: string;

	// React components declared in this prop will be inserted into the editor content area
	contentComponents?: ContentComponents;

	// Note: this comment is replicated in packages/editor/renderer/src/ui/renderer-props.ts
	// any changes should be made in both locations
	/**
	 * **WARNING** this attribute is not supported outside of Confluence Full Page editors
	 *
	 * Configures the content mode of the editor.
	 *
	 * - `"standard"` | `undefined` - normal content mode <- Default
	 * - `"compact"` - content in editor has reduced size
	 *
	 * @private
	 * @deprecated this attribute is not supported outside of Confluence Full Page editors
	 */
	contentMode?: 'standard' | 'compact' | undefined;

	contentTransformerProvider?: (schema: Schema) => Transformer<string>;

	// Content to appear in the context panel. Displays as a right sidebar in the full-page appearance.
	// You'll want to pass it a `ContextPanel` component from this package, and your content as its children.
	contextPanel?: ReactComponents;

	// Set the default editor content.
	defaultValue?: Node | string | Object;

	// Set if the editor should be disabled.
	disabled?: boolean;

	editorActions?: EditorActions;

	errorReporterHandler?: ErrorReportingHandler;

	// New extension API
	// This eventually is going to replace `quickInsert.provider`, `extensionHandlers`, `macroProvider`.
	extensionProviders?: ExtensionProvidersProp;

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

	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/**
	 * @deprecated do not use, value is hardcoded. Can be mocked for tests. Config exists here: platform/packages/editor/editor-plugin-base/src/pm-plugins/utils/inputTrackingConfig.ts
	 * @description The nth keystroke after which an input time taken event is sent, 0 to disable it
	 * @default 100
	 */
	inputSamplingLimit?: number;

	// Set to configure the maximum editor height in pixels for `comment` and `chromeless` editor modes.
	maxHeight?: number;

	// Set to configure the minimum editor height in pixels for `comment`, `chromeless` editor modes.
	minHeight?: number;

	// Set for an on cancel callback.
	onCancel?: (editorView: EditorView) => void;
	// Set for an on change callback.
	// `meta.source === 'remote'` means that a change is coming from remote source, e.g. collab editing session.
	onChange?: EditorOnChangeHandler;
	// Called when editor is being unmounted
	onDestroy?: () => void;

	// Set a callback for the editor when users are able to interact.
	// Also provides access to `EditorActions` for controlling editor.
	onEditorReady?: (editorActions: EditorActions) => void;

	persistScrollGutter?: boolean;

	// DOM element used to help calculate correct positioning of popup menus to make sure they dont go offscreen.
	popupsBoundariesElement?: HTMLElement;

	// Set the DOM element for attaching popup menus
	popupsMountPoint?: HTMLElement;

	// Specify when mount point is different from scrollable element so popup menus can be positioned according the scrollable element.
	popupsScrollableElement?: HTMLElement;

	// Optionally adds an element (eg: an icon) at the start of the editor's primary toolbar. If not specified, the primary toolbar spans the entire width.
	primaryToolbarIconBefore?: ReactElement;

	// Set to enable the quick insert menu i.e. '/' key trigger.
	// You can also provide your own insert menu options that will be shown in addition to the enabled
	// editor features e.g. Confluence uses this to provide its macros.
	quickInsert?: QuickInsertOptions;

	// React components declared in this prop will be inserted into the secondary toolbar area
	secondaryToolbarComponents?: ReactComponents;

	// Set if the editor should be focused.
	shouldFocus?: boolean;

	skipValidation?: boolean;

	// Experimental support for modern React Context for @atlaskit/analytics-next.
	// Enables re-providing of AnalyticsContext for all ReactNodeViews.
	UNSAFE_useAnalyticsContext?: boolean;

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
}

// These are props that are shared between the editor and the plugin components.
// Ignored via go/ees007
// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
// TODO: We should refactor this to ensure these are not shared
export interface EditorSharedPropsWithPlugins {
	// Enable undo/redo buttons within the editor.
	allowUndoRedoButtons?: boolean;

	collabEdit?: CollabEditOptions;

	// Set for an on save callback.
	onSave?: (editorView: EditorView) => void;

	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/**
	 * @deprecated do not use, value is hardcoded. Can be mocked for tests. Config exists here: platform/packages/editor/editor-plugin-base/src/pm-plugins/utils/inputTrackingConfig.ts
	 * @description Control performance metric measurements and tracking
	 */
	performanceTracking?: PerformanceTracking;

	primaryToolbarComponents?: PrimaryToolbarComponents;

	// Flag to remove private content such as mention names
	sanitizePrivateContent?: boolean;
}

export interface EditorProps
	extends EditorBaseProps,
	EditorPluginFeatureProps,
	EditorSharedPropsWithPlugins,
	EditorProviderProps {
	// Editor assitive describedby. Set aria-describedby to make the editor announcement to include the information
	// the associated component's content
	assistiveDescribedBy?: string;
}

export interface EditorNextProps
	extends EditorBaseProps,
	EditorSharedPropsWithPlugins,
	EditorProviderProps {
	// Editor assitive describedby. Set aria-describedby to make the editor announcement to include the information
	// the associated component's content
	assistiveDescribedBy?: string;
	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	// @deprecated - pass autoformattingProvider directly to customAutoformatPlugin via the preset
	autoformattingProvider?: Providers['autoformattingProvider'];

	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	// @deprecated - pass provider directly to emojiPlugin via the preset
	emojiProvider?: Providers['emojiProvider'];

	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/**
	 * @deprecated
	 * This prop does nothing and will be removed soon.
	 * Configuration of this parameter should be done via `editor-plugin-card` or the `universal` preset.
	 *
	 * Example:
	 * // In preset creation you can pass the props passed to the editor like this:
	 * preset.add([cardPlugin, { ...linking.smartLinks, linkPicker: linking.linkPicker }])
	 */
	linking?: LinkingOptions;

	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/**
	 * @deprecated
	 * This prop is no longer required and will be removed soon.
	 * Configuration of this parameter should be done via `editor-plugin-media` or the `universal` preset.
	 *
	 * Example:
	 * ```ts
	 * // In preset creation you can pass the props passed to the editor like this:
	 * preset.add([mediaPlugin, MediaPluginOptions])
	 * ```
	 *
	 * Note: Props you pass to the media plugin via the preset do not re-render like in React.
	 * Therefore if you need to update the media provider later you will need to explicitly update it like so:
	 *
	 * ```ts
	 * const { preset, editorApi } = usePreset(createPreset)
	 * ...
	 * // If we need to update the media provider later on
	 * editorApi?.media.actions.setProvider(mediaProvider);
	 * ```
	 */
	media?: MediaPluginOptions;
	preset: EditorPresetBuilder<AllPluginNames[], AllEditorPresetPluginTypes[]>;
	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	// @deprecated - pass taskDecisionProvider directly to taskDecisionPlugin via the preset
	taskDecisionProvider?: Promise<TaskDecisionProvider>;
}

export interface EditorProviderProps {
	activityProvider?: Promise<ActivityProvider>;
	annotationProviders?: AnnotationProviders;

	// Allows you to define custom autoformatting rules.
	autoformattingProvider?: Providers['autoformattingProvider'];

	collabEditProvider?: Providers['collabEditProvider'];
	contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
	emojiProvider?: Providers['emojiProvider'];
	legacyImageUploadProvider?: Providers['imageUploadProvider'];

	// This is temporary for Confluence. **Please do not use**.
	macroProvider?: Providers['macroProvider'];

	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	// @deprecated - pass mentionProvider directly to mentionPlugin via the preset
	mentionProvider?: Promise<MentionProvider>;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	presenceProvider?: Promise<any>;

	searchProvider?: Promise<SearchProvider>;

	syncedBlockProvider?: SyncedBlockProvider;

	taskDecisionProvider?: Promise<TaskDecisionProvider>;
}

export interface EditorPluginFeatureProps {
	allowAnalyticsGASV3?: boolean;

	// Configure allowed blocks in the editor, currently only supports `heading`, `blockquote`, `hardBreak` and `codeBlock`.
	allowBlockType?: BlockTypePluginOptions['allowBlockType'];

	/**
	 * Enable support for the "border" mark.
	 * Refer to ADF Change proposal #65 for more details.
	 */
	allowBorderMark?: boolean;

	// Enables new breakout mark.
	// This mark is being used for making code-blocks breakout.
	allowBreakout?: boolean;

	allowConfluenceInlineComment?: boolean;

	// Enable dates. You will most likely need backend ADF storage for this feature.
	// Can use true/false to enable/disable default or can pass in DatePluginOptions object to configure weekStartDay
	allowDate?: boolean | DatePluginOptions;

	allowExpand?: boolean | { allowInsertion?: boolean; allowInteractiveExpand?: boolean };

	// Enable extensions. Extensions let products and the ecosystem extend ADF and render their own things.
	// Similar to macros in Confluence. You will most likely need backend ADF storage for this feature.
	allowExtension?: boolean | ExtensionConfig;

	// Enable find/replace functionality within the editor.
	// You can use the object form to enable additional individual features e.g. case-matching toggle.
	allowFindReplace?: boolean | FindReplaceOptions;

	/**
	 * Enable support for the "fragment" mark.
	 * Refer to ADF Change proposal #60 for more details.
	 */
	allowFragmentMark?: boolean;

	// Enable the editor help dialog.
	allowHelpDialog?: boolean;

	// Enable indentation support for `heading` and `paragraph`
	allowIndentation?: boolean;

	// Temporary flag to enable layouts while it's under development
	// Use object form to enable breakout for layouts, and to enable the newer layouts - left sidebar & right sidebar
	allowLayouts?: boolean | LayoutPluginOptions;

	allowNestedTasks?: boolean;

	// Enable panel blocks, the thing that displays a coloured box with icons aka info, warning macros.
	// You will most likely need backend ADF storage for this feature.
	allowPanel?: boolean | PanelPluginConfig;

	// Enables horizontal rules.
	allowRule?: boolean;

	// Enable status, if menuDisabled is passed then plugin is enabled by default
	allowStatus?:
	| boolean
	| {
		menuDisabled: boolean;
	};

	// Enables tables. You can enable individual table features like table header rows and cell background colour.
	// You will most likely need backend ADF storage for the advanced table features.
	allowTables?: boolean | TablesPluginConfig;

	// Whether or not you want to allow Action and Decision elements in the editor. You can currently only enable both or disable both.
	// To enable, you need to also provide a `taskDecisionProvider`. You will most likely need backend ADF storage for this feature.
	allowTasksAndDecisions?: boolean;

	// Enable placeholder text which is handy for things like a template editor.
	// Placeholder text is an inline text element that is removed when a user clicks on it.
	// You can also disable the inserts for this feature so users can never insert such placeholder
	// elements in the editor but you could load the initial content in the editor with them.
	allowTemplatePlaceholders?: boolean | PlaceholderTextPluginOptions;

	// Enable text alignment support inside `heading` and `paragraph`
	allowTextAlignment?: boolean;

	// Enables text colour. Ew are you sure you want to enable this?
	allowTextColor?: boolean | TextColorPluginConfig;

	/**
	 * Set this to false to opt out of the default behaviour of auto scrolling into view
	 * whenever the document is changed
	 */
	autoScrollIntoView?: boolean;

	codeBlock?: CodeBlockPluginOptions;

	elementBrowser?: {
		emptyStateHandler?: EmptyStateHandler;
		helpUrl?: string;
		replacePlusMenu?: boolean;
		showModal?: boolean;
	};

	// Set to provide your extensions handlers.
	extensionHandlers?: ExtensionHandlers;
	// Information required for editor to display the feedback modal.
	// This is also required to enable quick insert plugin for feedback modal.
	feedbackInfo?: FeedbackInfo;

	// Set to add custom menu items to the insert (plus) menu dropdown.
	insertMenuItems?: MenuItem[];

	/**
	 *  Configure and extend editor linking behaviour
	 */
	linking?: LinkingOptions;

	// Set to configure the maximum ADF node document size.
	// Understandably this isn’t the best logical max parameter for content, but its the cheapest for now.
	maxContentSize?: number;

	// Set to configure media features. Media single refers to the embedded version of media,
	// which is probably what you want. Media group refers to a filmstrip, thumbnail view of media files which was used in Stride.
	media?: MediaPluginOptions;

	mention?: MentionPluginConfig;

	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/**
	 * flag to indicate display name instead of nick name should be inserted for mentions
	 * default: false, which inserts the nick name
	 * @deprecated Use mention.mentionInsertDisplayName instead
	 */
	mentionInsertDisplayName?: boolean;

	// Set to configure the paste warning options.
	// For example, to configure the synced block paste warning options, pass the following:
	// pasteWarningOptions={
	//   { cannotPasteSyncedBlock: {
	// 	     title: messages.cannotPasteSyncedBlockTitle,
	// 	     description: messages.cannotPasteSyncedBlockDescription,
	// 	     urlText: messages.cannotPasteSyncedBlockAction,
	// 	     urlHref: 'https://hello.atlassian.net/wiki/x/tAtCeAE'
	//   }}
	//}
	pasteWarningOptions?: PasteWarningOptions;

	// Default placeholder text to be displayed if the document content is empty. e.g. 'Add a comment...'
	placeholder?: string;

	// Default placeholder text to be displayed when a bracket '{' is typed and the line is empty e.g. 'Did you mean to use '/' to insert content?'
	placeholderBracketHint?: string;

	// Submits on the enter key. Probably useful for an inline comment editor use case.
	saveOnEnter?: boolean;

	// Enable showing of indentation buttons in editor toolbar
	showIndentationButtons?: boolean;

	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/** @deprecated Use linking.smartLinks prop instead. */
	smartLinks?: CardOptions;

	syncBlock?: SyncedBlockPluginOptions;

	// Set to disable text formatting styles. If not specified, they will be all enabled by default. Code here refers to inline code.
	// Smart text completion refers to the auto replacement of characters like arrows, quotes and correct casing of Atlassian product names.
	// This should only be disabled if the user has an OS setting that disables this.
	textFormatting?: TextFormattingPluginOptions;

	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/** @deprecated Use linking.smartLinks prop instead. */
	UNSAFE_cards?: CardOptions;

	uploadErrorHandler?: (state: MediaState) => void;

	// Set if you want to wait for media file uploads before save.
	waitForMediaUpload?: boolean;
}
