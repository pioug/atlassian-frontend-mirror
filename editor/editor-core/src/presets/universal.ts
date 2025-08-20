import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import type { EditorAppearance, FeatureFlags } from '@atlaskit/editor-common/types';
import { shouldForceTracking } from '@atlaskit/editor-common/utils';
import { accessibilityUtilsPlugin } from '@atlaskit/editor-plugins/accessibility-utils';
import { alignmentPlugin } from '@atlaskit/editor-plugins/alignment';
import { annotationPlugin } from '@atlaskit/editor-plugins/annotation';
import { avatarGroupPlugin } from '@atlaskit/editor-plugins/avatar-group';
import { batchAttributeUpdatesPlugin } from '@atlaskit/editor-plugins/batch-attribute-updates';
import { beforePrimaryToolbarPlugin } from '@atlaskit/editor-plugins/before-primary-toolbar';
import { borderPlugin } from '@atlaskit/editor-plugins/border';
import { breakoutPlugin } from '@atlaskit/editor-plugins/breakout';
import { captionPlugin } from '@atlaskit/editor-plugins/caption';
import { cardPlugin } from '@atlaskit/editor-plugins/card';
import { codeBidiWarningPlugin } from '@atlaskit/editor-plugins/code-bidi-warning';
import { collabEditPlugin } from '@atlaskit/editor-plugins/collab-edit';
import { contentInsertionPlugin } from '@atlaskit/editor-plugins/content-insertion';
import { contextPanelPlugin } from '@atlaskit/editor-plugins/context-panel';
import { customAutoformatPlugin } from '@atlaskit/editor-plugins/custom-autoformat';
import { dataConsumerPlugin } from '@atlaskit/editor-plugins/data-consumer';
import { datePlugin } from '@atlaskit/editor-plugins/date';
import { emojiPlugin } from '@atlaskit/editor-plugins/emoji';
import { expandPlugin } from '@atlaskit/editor-plugins/expand';
import { extensionPlugin, type ExtensionPluginOptions } from '@atlaskit/editor-plugins/extension';
import { feedbackDialogPlugin } from '@atlaskit/editor-plugins/feedback-dialog';
import { findReplacePlugin } from '@atlaskit/editor-plugins/find-replace';
import { fragmentPlugin } from '@atlaskit/editor-plugins/fragment';
import { gridPlugin } from '@atlaskit/editor-plugins/grid';
import { guidelinePlugin } from '@atlaskit/editor-plugins/guideline';
import { helpDialogPlugin } from '@atlaskit/editor-plugins/help-dialog';
import { imageUploadPlugin } from '@atlaskit/editor-plugins/image-upload';
import { indentationPlugin } from '@atlaskit/editor-plugins/indentation';
import { insertBlockPlugin } from '@atlaskit/editor-plugins/insert-block';
import { layoutPlugin } from '@atlaskit/editor-plugins/layout';
import { listPlugin } from '@atlaskit/editor-plugins/list';
import { maxContentSizePlugin } from '@atlaskit/editor-plugins/max-content-size';
import { mediaPlugin } from '@atlaskit/editor-plugins/media';
import { mediaInsertPlugin } from '@atlaskit/editor-plugins/media-insert';
import { mentionsPlugin } from '@atlaskit/editor-plugins/mentions';
import { panelPlugin } from '@atlaskit/editor-plugins/panel';
import { pasteOptionsToolbarPlugin } from '@atlaskit/editor-plugins/paste-options-toolbar';
import { placeholderTextPlugin } from '@atlaskit/editor-plugins/placeholder-text';
import { rulePlugin } from '@atlaskit/editor-plugins/rule';
import { saveOnEnterPlugin } from '@atlaskit/editor-plugins/save-on-enter';
import { scrollIntoViewPlugin } from '@atlaskit/editor-plugins/scroll-into-view';
import { statusPlugin } from '@atlaskit/editor-plugins/status';
import { tablesPlugin } from '@atlaskit/editor-plugins/table';
import { tasksAndDecisionsPlugin } from '@atlaskit/editor-plugins/tasks-and-decisions';
import { textColorPlugin } from '@atlaskit/editor-plugins/text-color';
import { toolbarListsIndentationPlugin } from '@atlaskit/editor-plugins/toolbar-lists-indentation';
import { ufoPlugin } from '@atlaskit/editor-plugins/ufo';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { EditorProps } from '../types';
import type {
	BeforeAndAfterToolbarComponents,
	EditorPluginFeatureProps,
	EditorProviderProps,
	EditorSharedPropsWithPlugins,
	PrimaryToolbarComponents,
} from '../types/editor-props';
import { isFullPage as fullPageCheck } from '../utils/is-full-page';
import { version as coreVersion } from '../version-wrapper';

import type { DefaultPresetPluginOptions } from './default';
import { createDefaultPreset } from './default';

export type UniversalPresetProps = DefaultPresetPluginOptions &
	EditorSharedPropsWithPlugins &
	// Omit placeholder since it's an existing prop in `DefaultPresetPluginOptions` and will get overridden there
	Omit<EditorPluginFeatureProps, 'placeholder'> &
	EditorProviderProps;

/**
 * Mechanism to configuring plugins as the universal preset blocks direct access
 * to configuring plugins.
 *
 * Note: not all plugins are configurable via this mechanism, and for plugins configured -- it is only doing a subset of the configuration.
 */
export type InitialPluginConfiguration = {
	mentionsPlugin?: {
		handleMentionsChanged?: (
			mentionChanges: {
				type: 'added' | 'deleted';
				localId: string;
				id: string;
				taskLocalId?: string;
			}[],
		) => void;
	};
	tasksAndDecisionsPlugin?: {
		hasEditPermission?: boolean;
		quickInsertActionDescription?: string;
		requestEditPermission?: () => void;
		taskPlaceholder?: string;
		allowBlockTaskItem?: boolean;
	};
	extensionPlugin?: {
		__rendererExtensionOptions?: ExtensionPluginOptions['__rendererExtensionOptions'];
	};
	trackChangesPlugin?: {
		showOnToolbar?: boolean;
	};
	toolbarPlugin?: {
		disableSelectionToolbar?: boolean;
	};
	insertBlockPlugin?: {
		toolbarShowPlusInsertOnly?: boolean;
	};
};

/**
 * Creates a preset with all of the available plugins.
 * Basis for create-plugins-list and can be used to migrate from Editor -> EditorNext (Presets project)
 * with minimal friction.
 *
 * @param appearance
 * @param props A subset of full EditorProps for the full feature preset
 * @param featureFlags
 * @param prevAppearance The appearance of the editor in the previous render
 * @returns a full featured preset configured according to the provided props - basis for create-plugins-list
 */
export default function createUniversalPresetInternal({
	appearance,
	props,
	featureFlags,
	initialPluginConfiguration,
	prevAppearance,
	createAnalyticsEvent,
}: {
	appearance: EditorAppearance | undefined;
	props: UniversalPresetProps;
	featureFlags: FeatureFlags;
	/**
	 * Allows configuring plugins as the universal preset blocks direct access
	 * to configuring plugins.
	 */
	initialPluginConfiguration?: InitialPluginConfiguration;
	prevAppearance?: EditorAppearance;
	createAnalyticsEvent?: CreateUIAnalyticsEvent;
}) {
	const isComment = appearance === 'comment';
	const isChromeless = appearance === 'chromeless';
	const isFullPage = fullPageCheck(appearance);

	const getEditorFeatureFlags = () => featureFlags;

	const defaultPreset = createDefaultPreset({
		...props,
		appearance,
		createAnalyticsEvent,
		hyperlinkOptions: {
			lpLinkPicker: featureFlags.lpLinkPicker ?? false,
			...props.hyperlinkOptions,
		},
		__livePage: props.__livePage,
		toolbar: initialPluginConfiguration?.toolbarPlugin,
	});

	const statusMenuDisabled = !props.allowStatus
		? true
		: typeof props.allowStatus === 'object'
			? Boolean(props.allowStatus.menuDisabled)
			: false;

	const hasBeforePrimaryToolbar = (
		components?: PrimaryToolbarComponents,
	): components is BeforeAndAfterToolbarComponents => {
		if (components && 'before' in components) {
			return !!components.before;
		}
		return false;
	};

	const finalPreset = defaultPreset
		.add(ufoPlugin)
		.add(dataConsumerPlugin)
		.add(accessibilityUtilsPlugin)
		.add(contentInsertionPlugin)
		.add(batchAttributeUpdatesPlugin)
		.maybeAdd(
			[breakoutPlugin, { allowBreakoutButton: appearance === 'full-page', appearance: appearance }],
			Boolean(props.allowBreakout && isFullPage),
		)
		.maybeAdd(alignmentPlugin, Boolean(props.allowTextAlignment))
		.maybeAdd([textColorPlugin, props.allowTextColor], Boolean(props.allowTextColor))
		.add(listPlugin)
		.maybeAdd(rulePlugin, Boolean(props.allowRule))
		.maybeAdd(
			[
				expandPlugin,
				{
					allowInsertion: isExpandInsertionEnabled(props),
					useLongPressSelection: false,
					appearance: appearance,
					allowInteractiveExpand:
						typeof props.allowExpand === 'boolean'
							? props.allowExpand
							: Boolean(props.allowExpand && props.allowExpand.allowInteractiveExpand !== false),
					__livePage: props.__livePage,
				},
			],
			Boolean(props.allowExpand),
		)
		.maybeAdd(
			guidelinePlugin,
			Boolean(
				(!isComment && !isChromeless && (props.media || props.allowTables)) ||
					(editorExperiment('platform_editor_breakout_resizing', true, { exposure: true }) &&
						(props.allowExpand || props.allowLayouts || props.codeBlock)),
			),
		)
		.maybeAdd([gridPlugin, { shouldCalcBreakoutGridLines: isFullPage }], Boolean(props.media))
		.maybeAdd([annotationPlugin, props.annotationProviders], Boolean(props.annotationProviders))
		.maybeAdd(
			[
				mediaPlugin,
				{
					...props.media,
					allowLazyLoading: true,
					allowBreakoutSnapPoints: isFullPage,
					allowAdvancedToolBarOptions:
						typeof props.media?.allowAdvancedToolBarOptions !== 'undefined'
							? props.media?.allowAdvancedToolBarOptions
							: isFullPage || isComment,
					allowCommentsOnMedia: isFullPage && Boolean(props.annotationProviders),
					allowDropzoneDropLine: isFullPage,
					allowMediaSingleEditable: true,
					allowRemoteDimensionsFetch: true,
					allowMarkingUploadsAsIncomplete: false,
					allowImagePreview:
						typeof props.media?.allowImagePreview !== 'undefined'
							? props.media?.allowImagePreview
							: isFullPage,
					fullWidthEnabled: appearance === 'full-width',
					editorAppearance: appearance,
					uploadErrorHandler: props.uploadErrorHandler,
					waitForMediaUpload: props.waitForMediaUpload,
					isCopyPasteEnabled: true,
					alignLeftOnInsert:
						typeof props.media?.alignLeftOnInsert !== 'undefined'
							? props.media?.alignLeftOnInsert
							: isComment,
					getEditorFeatureFlags,
				},
			],
			Boolean(props.media),
		)
		.maybeAdd(
			mediaInsertPlugin,
			Boolean(props.media && fg('platform_editor_add_media_from_url_rollout')),
		)
		.maybeAdd(captionPlugin, Boolean(props.media?.allowCaptions))
		.maybeAdd(
			[
				mentionsPlugin,
				{
					sanitizePrivateContent: props.sanitizePrivateContent,
					insertDisplayName: props.mention?.insertDisplayName ?? props.mentionInsertDisplayName,
					allowZeroWidthSpaceAfter: true,
					HighlightComponent: props.mention?.HighlightComponent,
					profilecardProvider: props.mention?.profilecardProvider,
					mentionProvider: props.mentionProvider,
					...initialPluginConfiguration?.mentionsPlugin,
				},
			],
			Boolean(props.mentionProvider),
		)
		.maybeAdd(
			[
				emojiPlugin,
				{
					emojiProvider: props.emojiProvider,
				},
			],
			Boolean(props.emojiProvider),
		)
		.maybeAdd(
			[
				tablesPlugin,
				{
					tableOptions:
						!props.allowTables || typeof props.allowTables === 'boolean' ? {} : props.allowTables,
					dragAndDropEnabled:
						(featureFlags?.tableDragAndDrop &&
							(isFullPage ||
								((isComment || isChromeless) &&
									editorExperiment('support_table_in_comment', true, { exposure: true })))) ||
						(isComment &&
							editorExperiment('support_table_in_comment_jira', true, { exposure: true })),
					isTableScalingEnabled:
						isFullPage ||
						(isComment && editorExperiment('support_table_in_comment', true, { exposure: true })) ||
						(isComment &&
							editorExperiment('support_table_in_comment_jira', true, { exposure: true })),
					allowContextualMenu: true,
					fullWidthEnabled: appearance === 'full-width',
					wasFullWidthEnabled: prevAppearance && prevAppearance === 'full-width',
					getEditorFeatureFlags,
					isCommentEditor: isComment,
					isChromelessEditor: isChromeless,
				},
			],
			Boolean(props.allowTables),
		)
		.maybeAdd(
			[
				tasksAndDecisionsPlugin,
				{
					allowNestedTasks: props.allowNestedTasks,
					consumeTabs: isFullPage,
					useLongPressSelection: false,
					taskDecisionProvider: props.taskDecisionProvider,
					...initialPluginConfiguration?.tasksAndDecisionsPlugin,
				},
			],
			Boolean(props.allowTasksAndDecisions || props.taskDecisionProvider),
		)
		.maybeAdd(
			[feedbackDialogPlugin, { coreVersion, ...props.feedbackInfo }],
			Boolean(props.feedbackInfo),
		)
		.maybeAdd([helpDialogPlugin, !!props.legacyImageUploadProvider], Boolean(props.allowHelpDialog))
		.maybeAdd([saveOnEnterPlugin, props.onSave], Boolean(props.saveOnEnter && props.onSave))
		.maybeAdd(imageUploadPlugin, Boolean(props.legacyImageUploadProvider))
		.maybeAdd(
			// duplicate plugin exists because first one if media is enabled
			// second one when “media is disabled, and legacyMediaProvider is enabled
			// @ts-expect-error
			[
				mediaPlugin,
				{
					allowMediaSingle: { disableLayout: true },
					allowMediaGroup: false,
					isCopyPasteEnabled: true,
				},
			],
			Boolean(props.legacyImageUploadProvider && !props.media),
		)
		.maybeAdd(
			[
				collabEditPlugin,
				{
					...props.collabEdit,
					sanitizePrivateContent: props.sanitizePrivateContent,
					EXPERIMENTAL_allowInternalErrorAnalytics:
						props.collabEdit?.EXPERIMENTAL_allowInternalErrorAnalytics ?? shouldForceTracking(),
				},
			],
			Boolean(props.collabEdit || props.collabEditProvider),
		)
		.maybeAdd([maxContentSizePlugin, props.maxContentSize], Boolean(props.maxContentSize))
		.maybeAdd(
			[
				panelPlugin,
				{
					useLongPressSelection: false,
					allowCustomPanel:
						typeof props.allowPanel === 'object' ? props.allowPanel.allowCustomPanel : false,
					allowCustomPanelEdit:
						typeof props.allowPanel === 'object' ? props.allowPanel.allowCustomPanelEdit : false,
				},
			],
			Boolean(props.allowPanel),
		)
		.maybeAdd(contextPanelPlugin, Boolean(isFullPage))
		.maybeAdd(
			[
				extensionPlugin,
				{
					breakoutEnabled:
						appearance === 'full-page' &&
						(typeof props.allowExtension === 'object'
							? props.allowExtension.allowBreakout
							: true) !== false,
					extensionHandlers: props.extensionHandlers,
					useLongPressSelection: false,
					appearance,
					...initialPluginConfiguration?.extensionPlugin,
				},
			],
			Boolean(props.allowExtension),
		)
		.maybeAdd(
			// we are ignoring a duplicate plugin error here
			// this error exists because we have two annotation plugins being added
			// one with annotationProviders and one with allowConfluenceInlineComment
			// long term this and media should be consolidated into adding both only once
			// @ts-expect-error
			[annotationPlugin, undefined],
			Boolean(!props.annotationProviders && props.allowConfluenceInlineComment),
		)
		.maybeAdd(
			[
				datePlugin,
				{
					weekStartDay:
						typeof props.allowDate === 'object' ? props.allowDate.weekStartDay : undefined,
				},
			],
			Boolean(props.allowDate),
		)
		.maybeAdd(
			[
				placeholderTextPlugin,
				// @ts-expect-error 2322: Type 'false | PlaceholderTextOptions | undefined'
				props.allowTemplatePlaceholders !== true ? props.allowTemplatePlaceholders : {},
			],
			Boolean(props.allowTemplatePlaceholders),
		)
		.maybeAdd(
			[
				layoutPlugin,
				{
					...(typeof props.allowLayouts === 'object' ? props.allowLayouts : {}),
					useLongPressSelection: false,
					UNSAFE_allowSingleColumnLayout:
						typeof props.allowLayouts === 'object'
							? props.allowLayouts.UNSAFE_allowSingleColumnLayout
							: undefined,
					editorAppearance: appearance,
				},
			],
			Boolean(props.allowLayouts),
		)
		.maybeAdd(
			[
				cardPlugin,
				{
					...props.UNSAFE_cards,
					...props.smartLinks,
					...props.linking?.smartLinks,
					fullWidthMode: appearance === 'full-width',
					linkPicker: props.linking?.linkPicker,
					lpLinkPicker: featureFlags.lpLinkPicker ?? false,
					editorAppearance: appearance,
					// @ts-ignore Temporary solution to check for Live Page editor.
					__livePage: props.__livePage,
				},
			],
			Boolean(props.linking?.smartLinks || props.smartLinks || props.UNSAFE_cards),
		)
		.maybeAdd(
			[
				customAutoformatPlugin,
				{
					autoformattingProvider: props.autoformattingProvider,
				},
			],
			Boolean(props.autoformattingProvider),
		)
		.maybeAdd(
			[
				statusPlugin,
				{
					menuDisabled: statusMenuDisabled,
					allowZeroWidthSpaceAfter: true,
				},
			],
			Boolean(props.allowStatus),
		)
		.maybeAdd(indentationPlugin, Boolean(props.allowIndentation))
		.maybeAdd(scrollIntoViewPlugin, Boolean(props.autoScrollIntoView !== false))
		.add([
			toolbarListsIndentationPlugin,
			{
				showIndentationButtons: !!props.showIndentationButtons,
				allowHeadingAndParagraphIndentation: !!props.allowIndentation,
			},
		])
		.add([
			insertBlockPlugin,
			{
				allowTables: !!props.allowTables,
				allowExpand: isExpandInsertionEnabled(props),
				insertMenuItems: props.insertMenuItems,
				horizontalRuleEnabled: props.allowRule,
				tableSelectorSupported: featureFlags?.tableSelector && isFullPage,
				nativeStatusSupported: !statusMenuDisabled,
				showElementBrowserLink: (props.elementBrowser && props.elementBrowser.showModal) || false,
				appearance,
				...initialPluginConfiguration?.insertBlockPlugin,
			},
		])
		.maybeAdd(
			[
				beforePrimaryToolbarPlugin,
				{
					beforePrimaryToolbarComponents:
						// @ts-expect-error 2339: Property 'before' does not exist on type 'PrimaryToolbarComponents'.
						props.primaryToolbarComponents?.before,
				},
			],
			Boolean(
				hasBeforePrimaryToolbar(props.primaryToolbarComponents) &&
					!featureFlags.twoLineEditorToolbar,
			),
		)
		.add([
			avatarGroupPlugin,
			{
				// Avatars are moved to Confluence codebase for Edit in Context
				// When Edit in Context is enabled primaryToolbarComponents is undefined
				// For more details please check
				// https://hello.atlassian.net/wiki/spaces/PCG/pages/2851572180/Editor+toolbar+for+live+pages+and+edit+in+context+projects
				collabEdit: props.collabEdit,
				takeFullWidth: !hasBeforePrimaryToolbar(props.primaryToolbarComponents),
				showAvatarGroup:
					featureFlags.showAvatarGroupAsPlugin === true && !featureFlags.twoLineEditorToolbar,
			},
		])
		.maybeAdd(
			[
				findReplacePlugin,
				{
					takeFullWidth:
						!!featureFlags.showAvatarGroupAsPlugin === false &&
						!hasBeforePrimaryToolbar(props.primaryToolbarComponents),
					twoLineEditorToolbar:
						!!props.primaryToolbarComponents && !!featureFlags.twoLineEditorToolbar,
				},
			],
			Boolean(props.allowFindReplace),
		)
		.maybeAdd(borderPlugin, Boolean(props.allowBorderMark))
		.maybeAdd(fragmentPlugin, Boolean(props.allowFragmentMark))
		.add(pasteOptionsToolbarPlugin)
		.add([
			codeBidiWarningPlugin,
			{
				appearance,
			},
		]);

	return finalPreset;
}

interface ExpandEditorProps {
	allowExpand?: EditorProps['allowExpand'];
}

export function isExpandInsertionEnabled({ allowExpand }: ExpandEditorProps) {
	if (allowExpand && typeof allowExpand === 'object') {
		return !!allowExpand.allowInsertion;
	}

	return false;
}
