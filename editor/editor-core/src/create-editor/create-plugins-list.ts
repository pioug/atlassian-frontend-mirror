import { PanelPluginConfig } from './../plugins/panel/types';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { EditorPlugin, EditorProps } from '../types';
import {
  breakoutPlugin,
  collabEditPlugin,
  dataConsumerMarkPlugin,
  datePlugin,
  emojiPlugin,
  extensionPlugin,
  helpDialogPlugin,
  imageUploadPlugin,
  insertBlockPlugin,
  jiraIssuePlugin,
  layoutPlugin,
  listPlugin,
  macroPlugin,
  maxContentSizePlugin,
  mediaPlugin,
  mentionsPlugin,
  panelPlugin,
  placeholderTextPlugin,
  rulePlugin,
  saveOnEnterPlugin,
  tablesPlugin,
  tasksAndDecisionsPlugin,
  textColorPlugin,
  cardPlugin,
  gridPlugin,
  statusPlugin,
  alignmentPlugin,
  indentationPlugin,
  analyticsPlugin,
  customAutoformatPlugin,
  feedbackDialogPlugin,
  historyPlugin,
  expandPlugin,
  isExpandInsertionEnabled,
  scrollIntoViewPlugin,
  mobileDimensionsPlugin,
  findReplacePlugin,
  contextPanelPlugin,
  mobileSelectionPlugin,
  annotationPlugin,
  captionPlugin,
  avatarGroupPlugin,
  viewUpdateSubscriptionPlugin,
} from '../plugins';
import { isFullPage as fullPageCheck } from '../utils/is-full-page';
import {
  GUTTER_SIZE_MOBILE_IN_PX,
  ScrollGutterPluginOptions,
} from '../plugins/base/pm-plugins/scroll-gutter';
import { createFeatureFlagsFromProps } from '../plugins/feature-flags-context/feature-flags-from-props';
import { PrivateCollabEditOptions } from '../plugins/collab-edit/types';
import { BlockTypePluginOptions } from '../plugins/block-type/types';
import { getMediaFeatureFlag } from '@atlaskit/media-common';
import {
  createDefaultPreset,
  DefaultPresetPluginOptions,
} from '../labs/next/presets/default';
import { EditorPresetProps } from '../labs/next/presets/types';
import { shouldForceTracking } from '@atlaskit/editor-common';
import { LayoutPluginOptions } from '../plugins/layout/types';

const isCodeBlockAllowed = (
  options?: Pick<BlockTypePluginOptions, 'allowBlockType'>,
) => {
  const exclude =
    options && options.allowBlockType && options.allowBlockType.exclude
      ? options.allowBlockType.exclude
      : [];

  return exclude.indexOf('codeBlock') === -1;
};

export function getScrollGutterOptions(
  props: EditorProps,
): ScrollGutterPluginOptions | undefined {
  const { appearance, persistScrollGutter } = props;

  if (fullPageCheck(appearance)) {
    // Full Page appearance uses a scrollable div wrapper
    return {
      getScrollElement: () =>
        document.querySelector('.fabric-editor-popup-scroll-parent'),
    };
  }
  if (appearance === 'mobile') {
    // Mobile appearance uses body scrolling for improved performance on low powered devices.
    return {
      getScrollElement: () => document.body,
      allowCustomScrollHandler: false,
      persistScrollGutter,
      gutterSize: GUTTER_SIZE_MOBILE_IN_PX,
    };
  }
  return undefined;
}

export function getDefaultPresetOptionsFromEditorProps(
  props: EditorProps,
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
): EditorPresetProps & DefaultPresetPluginOptions {
  const appearance = props.appearance;
  const isMobile = appearance === 'mobile';

  const inputTracking = props.performanceTracking?.inputTracking;

  return {
    createAnalyticsEvent,
    typeAhead: {
      createAnalyticsEvent,
      isMobile,
    },
    featureFlags: createFeatureFlagsFromProps(props),
    paste: {
      cardOptions: props.smartLinks || props.UNSAFE_cards,
      sanitizePrivateContent: props.sanitizePrivateContent,
    },
    base: {
      allowInlineCursorTarget: !isMobile,
      allowScrollGutter: getScrollGutterOptions(props),
      inputTracking,
      browserFreezeTracking: props.performanceTracking?.bFreezeTracking,
    },
    blockType: {
      lastNodeMustBeParagraph:
        appearance === 'comment' || appearance === 'chromeless',
      allowBlockType: props.allowBlockType,
      isUndoRedoButtonsEnabled: props.UNSAFE_allowUndoRedoButtons,
    },
    placeholder: {
      placeholder: props.placeholder,
      placeholderHints: props.placeholderHints,
      placeholderBracketHint: props.placeholderBracketHint,
    },
    textFormatting: {
      ...(props.textFormatting || {}),
      responsiveToolbarMenu:
        props.textFormatting?.responsiveToolbarMenu != null
          ? props.textFormatting.responsiveToolbarMenu
          : props.UNSAFE_allowUndoRedoButtons,
    },
    annotationProviders: props.annotationProviders,
    submitEditor: props.onSave,
    quickInsert: {
      enableElementBrowser:
        props.elementBrowser && props.elementBrowser.showModal,
      elementBrowserHelpUrl:
        props.elementBrowser && props.elementBrowser.helpUrl,
      disableDefaultItems: isMobile,
      headless: isMobile,
      emptyStateHandler:
        props.elementBrowser && props.elementBrowser.emptyStateHandler,
    },
    selection: { useLongPressSelection: false },
    cardOptions: props.smartLinks || props.UNSAFE_cards,
    codeBlock: { ...props.codeBlock, useLongPressSelection: false },
  };
}

/**
 * Maps EditorProps to EditorPlugins
 *
 * Note: The order that presets are added determines
 * their placement in the editor toolbar
 */
export default function createPluginsList(
  props: EditorProps,
  prevProps?: EditorProps,
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
): EditorPlugin[] {
  const appearance = props.appearance;
  const isMobile = appearance === 'mobile';
  const isComment = appearance === 'comment';
  const isFullPage = fullPageCheck(appearance);
  const preset = createDefaultPreset(
    getDefaultPresetOptionsFromEditorProps(props, createAnalyticsEvent),
  );
  const featureFlags = createFeatureFlagsFromProps(props);

  if (props.allowAnalyticsGASV3) {
    const { performanceTracking } = props;

    preset.add([
      analyticsPlugin,
      {
        createAnalyticsEvent,
        performanceTracking,
      },
    ]);
  }

  if (props.allowBreakout && isFullPage) {
    preset.add([
      breakoutPlugin,
      { allowBreakoutButton: props.appearance === 'full-page' },
    ]);
  }

  if (props.allowTextAlignment) {
    preset.add(alignmentPlugin);
  }

  preset.add(dataConsumerMarkPlugin);

  if (props.allowTextColor) {
    preset.add([textColorPlugin, props.allowTextColor]);
  }

  // Needs to be after allowTextColor as order of buttons in toolbar depends on it
  preset.add(listPlugin);

  if (props.allowRule) {
    preset.add(rulePlugin);
  }

  if (props.allowExpand) {
    preset.add([
      expandPlugin,
      {
        allowInsertion: isExpandInsertionEnabled(props),
        useLongPressSelection: false,
      },
    ]);
  }

  if (props.media) {
    preset.add([gridPlugin, { shouldCalcBreakoutGridLines: isFullPage }]);
    const alignLeftOnInsert =
      typeof props.media.alignLeftOnInsert !== 'undefined'
        ? props.media.alignLeftOnInsert
        : isComment;

    const showMediaLayoutOptions =
      typeof props.media.allowAdvancedToolBarOptions !== 'undefined'
        ? props.media.allowAdvancedToolBarOptions
        : isFullPage || isComment;

    preset.add([
      mediaPlugin,
      {
        ...props.media,
        allowLazyLoading: !isMobile,
        allowBreakoutSnapPoints: isFullPage,
        allowAdvancedToolBarOptions: showMediaLayoutOptions,
        allowDropzoneDropLine: isFullPage,
        allowMediaSingleEditable: !isMobile,
        allowRemoteDimensionsFetch: !isMobile,
        // This is a wild one. I didnt quite understand what the code was doing
        // so a bit of guess for now.
        allowMarkingUploadsAsIncomplete: isMobile,
        fullWidthEnabled: props.appearance === 'full-width',
        uploadErrorHandler: props.uploadErrorHandler,
        waitForMediaUpload: props.waitForMediaUpload,
        isCopyPasteEnabled: !isMobile,
        alignLeftOnInsert,
      },
    ]);

    // EDM-799: inside caption plugin we do the feature flag in enabling the plugin
    if (getMediaFeatureFlag('captions', props.media.featureFlags)) {
      preset.add(captionPlugin);
    }
  }

  if (props.mentionProvider) {
    preset.add([
      mentionsPlugin,
      {
        createAnalyticsEvent,
        sanitizePrivateContent: props.sanitizePrivateContent,
        insertDisplayName:
          props.mention?.insertDisplayName ?? props.mentionInsertDisplayName,
        useInlineWrapper: isMobile,
        allowZeroWidthSpaceAfter: !isMobile,
        HighlightComponent: props.mention?.HighlightComponent,
      },
    ]);
  }

  if (props.emojiProvider) {
    preset.add([
      emojiPlugin,
      {
        createAnalyticsEvent,
        useInlineWrapper: isMobile,
        allowZeroWidthSpaceAfter: !isMobile,
      },
    ]);
  }

  if (props.allowTables) {
    const tableOptions =
      !props.allowTables || typeof props.allowTables === 'boolean'
        ? {}
        : props.allowTables;
    preset.add([
      tablesPlugin,
      {
        tableOptions,
        breakoutEnabled: props.appearance === 'full-page',
        allowContextualMenu: !isMobile,
        fullWidthEnabled: props.appearance === 'full-width',
        wasFullWidthEnabled: prevProps && prevProps.appearance === 'full-width',
        dynamicSizingEnabled: props.allowDynamicTextSizing,
      },
    ]);
  }

  if (props.allowTasksAndDecisions || props.taskDecisionProvider) {
    preset.add([
      tasksAndDecisionsPlugin,
      {
        allowNestedTasks: props.allowNestedTasks,
        consumeTabs: isFullPage,
        useLongPressSelection: false,
      },
    ]);
  }

  if (props.feedbackInfo) {
    preset.add([feedbackDialogPlugin, props.feedbackInfo]);
  }

  if (props.allowHelpDialog) {
    preset.add([helpDialogPlugin, props.legacyImageUploadProvider]);
  }

  if (props.saveOnEnter) {
    preset.add([saveOnEnterPlugin, props.onSave]);
  }

  if (props.legacyImageUploadProvider) {
    preset.add(imageUploadPlugin);

    if (!props.media) {
      preset.add([
        mediaPlugin,
        {
          allowMediaSingle: { disableLayout: true },
          allowMediaGroup: false,
          isCopyPasteEnabled: true,
        },
      ]);
    }
  }

  if (props.collabEdit || props.collabEditProvider) {
    let collabEditOptions: PrivateCollabEditOptions = {
      sanitizePrivateContent: props.sanitizePrivateContent,
    };

    if (props.collabEdit) {
      collabEditOptions = {
        ...props.collabEdit,
        ...collabEditOptions,
      };
    }

    preset.add([
      collabEditPlugin,
      {
        ...collabEditOptions,
        EXPERIMENTAL_allowInternalErrorAnalytics:
          collabEditOptions.EXPERIMENTAL_allowInternalErrorAnalytics ??
          shouldForceTracking(),
      },
    ]);
  }

  if (props.maxContentSize) {
    preset.add([maxContentSizePlugin, props.maxContentSize]);
  }

  if (props.allowJiraIssue) {
    preset.add(jiraIssuePlugin);
  }

  if (props.allowPanel) {
    preset.add([
      panelPlugin,
      {
        useLongPressSelection: false,
        UNSAFE_allowCustomPanel: (<PanelPluginConfig>props.allowPanel)
          .UNSAFE_allowCustomPanel,
      },
    ]);
  }

  if (props.allowExtension) {
    const extensionConfig =
      typeof props.allowExtension === 'object' ? props.allowExtension : {};
    preset.add([
      extensionPlugin,
      {
        breakoutEnabled:
          props.appearance === 'full-page' &&
          extensionConfig.allowBreakout !== false,
        stickToolbarToBottom: extensionConfig.stickToolbarToBottom,
        allowAutoSave: extensionConfig.allowAutoSave,
        extensionHandlers: props.extensionHandlers,
        useLongPressSelection: false,
        appearance,
      },
    ]);
  }

  if (props.macroProvider) {
    preset.add(macroPlugin);
  }

  // See default list for when adding annotations with a provider
  if (!props.annotationProviders && props.allowConfluenceInlineComment) {
    preset.add(annotationPlugin);
  }

  if (props.allowDate) {
    preset.add(datePlugin);
  }

  if (props.allowTemplatePlaceholders) {
    const options =
      props.allowTemplatePlaceholders !== true
        ? props.allowTemplatePlaceholders
        : {};
    preset.add([placeholderTextPlugin, options]);
  }

  if (props.allowLayouts) {
    preset.add([
      layoutPlugin,
      {
        ...(typeof props.allowLayouts === 'boolean' ? {} : props.allowLayouts),
        useLongPressSelection: false,
        UNSAFE_allowSingleColumnLayout: (<LayoutPluginOptions>(
          props.allowLayouts
        )).UNSAFE_allowSingleColumnLayout,
      },
    ]);
  }

  if (props.smartLinks || props.UNSAFE_cards) {
    const fullWidthMode = props.appearance === 'full-width';
    preset.add([
      cardPlugin,
      {
        ...props.UNSAFE_cards,
        ...props.smartLinks,
        platform: isMobile ? 'mobile' : 'web',
        fullWidthMode,
        createAnalyticsEvent,
      },
    ]);
  }

  if (props.autoformattingProvider) {
    preset.add(customAutoformatPlugin);
  }

  let statusMenuDisabled = true;
  if (props.allowStatus) {
    statusMenuDisabled =
      typeof props.allowStatus === 'object'
        ? props.allowStatus.menuDisabled
        : false;
    preset.add([
      statusPlugin,
      {
        menuDisabled: statusMenuDisabled,
        useInlineWrapper: isMobile,
        allowZeroWidthSpaceAfter: !isMobile,
      },
    ]);
  }

  if (props.allowIndentation) {
    preset.add(indentationPlugin);
  }

  if (isFullPage) {
    preset.add(contextPanelPlugin);
  }

  if (props.autoScrollIntoView !== false) {
    preset.add(scrollIntoViewPlugin);
  }

  if (isMobile || props.UNSAFE_allowUndoRedoButtons) {
    preset.add(historyPlugin);
  }

  if (isMobile) {
    preset.add(mobileDimensionsPlugin);
    preset.add(mobileSelectionPlugin);
  }

  // UI only plugins
  preset.add([
    insertBlockPlugin,
    {
      allowTables: !!props.allowTables,
      allowExpand: isExpandInsertionEnabled(props),
      insertMenuItems: props.insertMenuItems,
      horizontalRuleEnabled: props.allowRule,
      nativeStatusSupported: !statusMenuDisabled,
      showElementBrowserLink:
        (props.elementBrowser && props.elementBrowser.showModal) || false,
      replacePlusMenuWithElementBrowser:
        (props.elementBrowser && props.elementBrowser.replacePlusMenu) || false,
    },
  ]);

  if (props.featureFlags?.showAvatarGroupAsPlugin === true) {
    preset.add([
      avatarGroupPlugin,
      {
        collabEdit: props.collabEdit,
      },
    ]);
  }

  if (props.allowFindReplace) {
    preset.add([
      findReplacePlugin,
      {
        takeFullWidth: !!props.featureFlags?.showAvatarGroupAsPlugin === false,
      },
    ]);
  }

  if (featureFlags.enableViewUpdateSubscription) {
    preset.add([viewUpdateSubscriptionPlugin]);
  }

  const excludes = new Set<string>();

  if (!isCodeBlockAllowed({ allowBlockType: props.allowBlockType })) {
    excludes.add('codeBlock');
  }

  return preset.getEditorPlugins(excludes);
}
