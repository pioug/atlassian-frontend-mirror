import { PanelPluginConfig } from './../plugins/panel/types';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { EditorPlugin, EditorProps } from '../types';
import {
  breakoutPlugin,
  collabEditPlugin,
  datePlugin,
  emojiPlugin,
  extensionPlugin,
  helpDialogPlugin,
  imageUploadPlugin,
  insertBlockPlugin,
  jiraIssuePlugin,
  layoutPlugin,
  listsPlugin,
  listsPredictablePlugin,
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
  mobileScrollPlugin,
  findReplacePlugin,
  contextPanelPlugin,
  mobileSelectionPlugin,
  annotationPlugin,
} from '../plugins';
import { isFullPage as fullPageCheck } from '../utils/is-full-page';
import { ScrollGutterPluginOptions } from '../plugins/base/pm-plugins/scroll-gutter';
import { createFeatureFlagsFromProps } from '../plugins/feature-flags-context/feature-flags-from-props';
import { PrivateCollabEditOptions } from '../plugins/collab-edit/types';
import { BlockTypePluginOptions } from '../plugins/block-type/types';
import {
  NORMAL_SEVERITY_THRESHOLD,
  DEGRADED_SEVERITY_THRESHOLD,
} from '../plugins/base/pm-plugins/frozen-editor';
import {
  createDefaultPreset,
  DefaultPresetPluginOptions,
} from '../labs/next/presets/default';
import { EditorPresetProps } from '../labs/next/presets/types';
import { shouldForceTracking } from '@atlaskit/editor-common';

const isCodeBlockAllowed = (
  options?: Pick<BlockTypePluginOptions, 'allowBlockType'>,
) => {
  const exclude =
    options && options.allowBlockType && options.allowBlockType.exclude
      ? options.allowBlockType.exclude
      : [];

  return exclude.indexOf('codeBlock') === -1;
};

function getScrollGutterOptions(
  props: EditorProps,
): ScrollGutterPluginOptions | undefined {
  const { appearance } = props;
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
    };
  }
  return undefined;
}

export function getDefaultPresetOptionsFromEditorProps(
  props: EditorProps,
): EditorPresetProps & DefaultPresetPluginOptions {
  const appearance = props.appearance;
  const isMobile = appearance === 'mobile';
  const isFullPage = fullPageCheck(appearance);

  // TODO: https://product-fabric.atlassian.net/browse/ED-10260
  const inputTracking =
    props.performanceTracking && props.performanceTracking.inputTracking
      ? props.performanceTracking.inputTracking
      : {
          enabled:
            isFullPage ||
            (typeof props.inputSamplingLimit !== 'undefined' &&
              props.inputSamplingLimit > 0),
          samplingRate: props.inputSamplingLimit,
        };

  // If the feature prop is not explicitly defined AND we are on a product-fabric branch deploy we force-enable node counting
  // START: temporary code https://product-fabric.atlassian.net/browse/ED-10260
  const hasInputTracking =
    typeof props.performanceTracking?.inputTracking !== 'undefined';
  inputTracking.countNodes =
    !hasInputTracking && shouldForceTracking()
      ? true
      : inputTracking.countNodes;

  const forceBFreezeTracking =
    typeof props.performanceTracking?.bFreezeTracking === 'undefined' &&
    shouldForceTracking();

  const bFreezeTracking = {
    trackInteractionType:
      !!forceBFreezeTracking ||
      !!props.performanceTracking?.bFreezeTracking?.trackInteractionType,
    trackSeverity:
      !!forceBFreezeTracking ||
      !!props.performanceTracking?.bFreezeTracking?.trackSeverity,
    severityNormalThreshold:
      props.performanceTracking?.bFreezeTracking?.severityNormalThreshold ??
      NORMAL_SEVERITY_THRESHOLD,
    severityDegradedThreshold:
      props.performanceTracking?.bFreezeTracking?.severityDegradedThreshold ??
      DEGRADED_SEVERITY_THRESHOLD,
  };
  // END:  temporary code  https://product-fabric.atlassian.net/browse/ED-10260

  return {
    featureFlags: createFeatureFlagsFromProps(props),
    paste: {
      cardOptions: props.UNSAFE_cards,
      sanitizePrivateContent: props.sanitizePrivateContent,
      predictableLists: props.UNSAFE_predictableLists,
    },
    base: {
      allowInlineCursorTarget: !isMobile,
      allowScrollGutter: getScrollGutterOptions(props),
      inputTracking,
      bFreezeTracking,
    },
    blockType: {
      lastNodeMustBeParagraph:
        appearance === 'comment' || appearance === 'chromeless',
      allowBlockType: props.allowBlockType,
    },
    placeholder: {
      placeholder: props.placeholder,
      placeholderHints: props.placeholderHints,
      placeholderBracketHint: props.placeholderBracketHint,
    },
    textFormatting: props.textFormatting,
    annotationProviders: props.annotationProviders,
    submitEditor: props.onSave,
    quickInsert: {
      enableElementBrowser:
        props.elementBrowser && props.elementBrowser.showModal,
      disableDefaultItems: isMobile,
      headless: isMobile,
    },
    selection: { useLongPressSelection: false },
    cardOptions: props.UNSAFE_cards,
    codeBlock: { ...props.codeBlock, useLongPressSelection: false },
  };
}

/**
 * Maps EditorProps to EditorPlugins
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
    getDefaultPresetOptionsFromEditorProps(props),
  );

  if (props.allowAnalyticsGASV3) {
    const { performanceTracking, transactionTracking } = props;

    preset.add([
      analyticsPlugin,
      {
        createAnalyticsEvent,
        // TODO: https://product-fabric.atlassian.net/browse/ED-8985
        ...(performanceTracking || transactionTracking
          ? {
              performanceTracking: {
                ...(performanceTracking || {}),
                ...(transactionTracking ? { transactionTracking } : {}),
              },
            }
          : {}),
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

  if (props.allowTextColor) {
    preset.add([textColorPlugin, props.allowTextColor]);
  }

  // Needs to be after allowTextColor as order of buttons in toolbar depends on it
  if (props.UNSAFE_predictableLists) {
    preset.add(listsPredictablePlugin);
  } else {
    preset.add(listsPlugin);
  }

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
  }

  if (props.mentionProvider) {
    preset.add([
      mentionsPlugin,
      {
        createAnalyticsEvent,
        sanitizePrivateContent: props.sanitizePrivateContent,
        mentionInsertDisplayName: props.mentionInsertDisplayName,
        useInlineWrapper: isMobile,
        allowZeroWidthSpaceAfter: !isMobile,
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
        allowLocalIdGeneration: extensionConfig.allowLocalIdGeneration,
        extensionHandlers: props.extensionHandlers,
        useLongPressSelection: false,
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
      },
    ]);
  }

  if (props.UNSAFE_cards) {
    const fullWidthMode = props.appearance === 'full-width';
    preset.add([
      cardPlugin,
      {
        ...props.UNSAFE_cards,
        platform: isMobile ? 'mobile' : 'web',
        fullWidthMode,
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

  if (isMobile) {
    preset.add(historyPlugin);
    preset.add(mobileScrollPlugin);
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

  if (props.allowFindReplace) {
    preset.add(findReplacePlugin);
  }

  const excludes = new Set<string>();

  if (!isCodeBlockAllowed({ allowBlockType: props.allowBlockType })) {
    excludes.add('codeBlock');
  }

  return preset.getEditorPlugins(excludes);
}
