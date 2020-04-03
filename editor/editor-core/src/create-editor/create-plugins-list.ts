import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { EditorPlugin, EditorProps } from '../types';
import {
  basePlugin,
  breakoutPlugin,
  blockTypePlugin,
  clearMarksOnChangeToEmptyDocumentPlugin,
  codeBlockPlugin,
  collabEditPlugin,
  datePlugin,
  emojiPlugin,
  extensionPlugin,
  fakeTextCursorPlugin,
  helpDialogPlugin,
  hyperlinkPlugin,
  imageUploadPlugin,
  insertBlockPlugin,
  jiraIssuePlugin,
  layoutPlugin,
  listsPlugin,
  macroPlugin,
  maxContentSizePlugin,
  mediaPlugin,
  mentionsPlugin,
  panelPlugin,
  pastePlugin,
  placeholderPlugin,
  placeholderTextPlugin,
  rulePlugin,
  saveOnEnterPlugin,
  submitEditorPlugin,
  tablesPlugin,
  tasksAndDecisionsPlugin,
  textColorPlugin,
  textFormattingPlugin,
  unsupportedContentPlugin,
  widthPlugin,
  typeAheadPlugin,
  quickInsertPlugin,
  gapCursorPlugin,
  cardPlugin,
  floatingToolbarPlugin,
  gridPlugin,
  statusPlugin,
  alignmentPlugin,
  editorDisabledPlugin,
  indentationPlugin,
  annotationPlugin,
  analyticsPlugin,
  customAutoformatPlugin,
  feedbackDialogPlugin,
  historyPlugin,
  featureFlagsContextPlugin,
  expandPlugin,
  isExpandInsertionEnabled,
  scrollIntoViewPlugin,
  mobileScrollPlugin,
  contextPanelPlugin,
} from '../plugins';
import { isFullPage as fullPageCheck } from '../utils/is-full-page';
import { ScrollGutterPluginOptions } from '../plugins/base/pm-plugins/scroll-gutter';
import { createFeatureFlagsFromProps } from '../plugins/feature-flags-context/feature-flags-from-props';
import { PrivateCollabEditOptions } from '../plugins/collab-edit/types';

/**
 * Returns list of plugins that are absolutely necessary for editor to work
 */
export function getDefaultPluginsList(props: EditorProps): EditorPlugin[] {
  const {
    appearance,
    textFormatting,
    placeholder,
    placeholderHints,
    placeholderBracketHint,
  } = props;
  const isFullPage = fullPageCheck(appearance);

  return [
    pastePlugin({
      cardOptions: props.UNSAFE_cards,
      sanitizePrivateContent: props.sanitizePrivateContent,
    }),
    basePlugin({
      allowInlineCursorTarget: appearance !== 'mobile',
      allowScrollGutter: getScrollGutterOptions(props),
      addRunTimePerformanceCheck: isFullPage,
      inputSamplingLimit: props.inputSamplingLimit,
    }),
    blockTypePlugin({
      lastNodeMustBeParagraph:
        appearance === 'comment' || appearance === 'chromeless',
      allowBlockType: props.allowBlockType,
    }),
    placeholderPlugin({
      placeholder,
      placeholderHints,
      placeholderBracketHint,
    }),
    clearMarksOnChangeToEmptyDocumentPlugin(),
    hyperlinkPlugin(),
    textFormattingPlugin(textFormatting || {}),
    widthPlugin(),
    typeAheadPlugin(),
    unsupportedContentPlugin(),
    editorDisabledPlugin(),
    gapCursorPlugin(),
    gridPlugin({ shouldCalcBreakoutGridLines: isFullPage }),
    submitEditorPlugin(props.onSave),
    fakeTextCursorPlugin(),
    floatingToolbarPlugin(),
    featureFlagsContextPlugin(createFeatureFlagsFromProps(props)),
    codeBlockPlugin(),
    contextPanelPlugin(),
  ];
}

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

/**
 * Maps EditorProps to EditorPlugins
 */
export default function createPluginsList(
  props: EditorProps,
  prevProps?: EditorProps,
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
): EditorPlugin[] {
  const isMobile = props.appearance === 'mobile';
  const isFullPage = fullPageCheck(props.appearance);
  const plugins = getDefaultPluginsList(props);

  if (props.allowAnalyticsGASV3) {
    plugins.push(analyticsPlugin(createAnalyticsEvent));
  }

  if (props.allowBreakout && isFullPage) {
    plugins.push(
      breakoutPlugin({ allowBreakoutButton: props.appearance === 'full-page' }),
    );
  }

  if (props.allowTextAlignment) {
    plugins.push(alignmentPlugin());
  }

  if (props.allowTextColor) {
    plugins.push(textColorPlugin(props.allowTextColor));
  }

  // Needs to be after allowTextColor as order of buttons in toolbar depends on it
  plugins.push(listsPlugin());

  if (props.allowRule) {
    plugins.push(rulePlugin());
  }

  if (props.allowExpand) {
    plugins.push(
      expandPlugin({ allowInsertion: isExpandInsertionEnabled(props) }),
    );
  }

  if (props.media) {
    plugins.push(
      mediaPlugin({
        ...props.media,
        allowLazyLoading: !isMobile,
        allowBreakoutSnapPoints: isFullPage,
        allowAdvancedToolBarOptions: isFullPage,
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
      }),
    );
  }

  if (props.mentionProvider) {
    plugins.push(
      mentionsPlugin({
        createAnalyticsEvent,
        sanitizePrivateContent: props.sanitizePrivateContent,
        mentionInsertDisplayName: props.mentionInsertDisplayName,
        useInlineWrapper: isMobile,
        allowZeroWidthSpaceAfter: !isMobile,
      }),
    );
  }

  if (props.emojiProvider) {
    plugins.push(
      emojiPlugin({
        createAnalyticsEvent,
        useInlineWrapper: isMobile,
        allowZeroWidthSpaceAfter: !isMobile,
      }),
    );
  }

  if (props.allowTables) {
    const tableOptions =
      !props.allowTables || typeof props.allowTables === 'boolean'
        ? {}
        : props.allowTables;
    plugins.push(
      tablesPlugin({
        tableOptions,
        breakoutEnabled: props.appearance === 'full-page',
        allowContextualMenu: !isMobile,
        fullWidthEnabled: props.appearance === 'full-width',
        wasFullWidthEnabled: prevProps && prevProps.appearance === 'full-width',
        dynamicSizingEnabled: props.allowDynamicTextSizing,
      }),
    );
  }

  if (props.allowTasksAndDecisions || props.taskDecisionProvider) {
    plugins.push(tasksAndDecisionsPlugin(props.allowNestedTasks, isFullPage));
  }

  if (props.feedbackInfo) {
    plugins.push(feedbackDialogPlugin(props.feedbackInfo));
  }

  if (props.allowHelpDialog) {
    plugins.push(helpDialogPlugin(props.legacyImageUploadProvider));
  }

  if (props.saveOnEnter) {
    plugins.push(saveOnEnterPlugin(props.onSave));
  }

  if (props.legacyImageUploadProvider) {
    plugins.push(imageUploadPlugin());

    if (!props.media) {
      plugins.push(
        mediaPlugin({
          allowMediaSingle: { disableLayout: true },
          allowMediaGroup: false,
          isCopyPasteEnabled: !isMobile,
        }),
      );
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
    plugins.push(collabEditPlugin(collabEditOptions));
  }

  if (props.maxContentSize) {
    plugins.push(maxContentSizePlugin(props.maxContentSize));
  }

  if (props.allowJiraIssue) {
    plugins.push(jiraIssuePlugin());
  }

  if (props.allowPanel) {
    plugins.push(panelPlugin());
  }

  if (props.allowExtension) {
    const extensionConfig =
      typeof props.allowExtension === 'object' ? props.allowExtension : {};
    plugins.push(
      extensionPlugin({
        breakoutEnabled:
          props.appearance === 'full-page' &&
          extensionConfig.allowBreakout !== false,
        stickToolbarToBottom: extensionConfig.stickToolbarToBottom,
        allowNewConfigPanel: extensionConfig.allowNewConfigPanel,
        extensionHandlers: props.extensionHandlers,
      }),
    );
  }

  if (props.macroProvider) {
    plugins.push(macroPlugin());
  }

  if (props.annotationProvider || props.allowConfluenceInlineComment) {
    plugins.push(annotationPlugin(props.annotationProvider));
  }

  if (props.allowDate) {
    plugins.push(datePlugin());
  }

  if (props.allowTemplatePlaceholders) {
    const options =
      props.allowTemplatePlaceholders !== true
        ? props.allowTemplatePlaceholders
        : {};
    plugins.push(placeholderTextPlugin(options));
  }

  if (props.allowLayouts) {
    plugins.push(
      layoutPlugin(
        typeof props.allowLayouts === 'boolean'
          ? undefined
          : props.allowLayouts,
      ),
    );
  }

  if (props.UNSAFE_cards) {
    plugins.push(cardPlugin(props.UNSAFE_cards));
  }

  if (props.autoformattingProvider) {
    plugins.push(customAutoformatPlugin());
  }

  let statusMenuDisabled = true;
  if (props.allowStatus) {
    statusMenuDisabled =
      typeof props.allowStatus === 'object'
        ? props.allowStatus.menuDisabled
        : false;
    plugins.push(
      statusPlugin({
        menuDisabled: statusMenuDisabled,
        useInlineWrapper: isMobile,
        allowZeroWidthSpaceAfter: !isMobile,
      }),
    );
  }

  if (props.allowIndentation) {
    plugins.push(indentationPlugin());
  }

  // UI only plugins
  plugins.push(
    insertBlockPlugin({
      allowTables: !!props.allowTables,
      allowExpand: isExpandInsertionEnabled(props),
      insertMenuItems: props.insertMenuItems,
      horizontalRuleEnabled: props.allowRule,
      nativeStatusSupported: !statusMenuDisabled,
    }),
  );

  if (!isMobile) {
    plugins.push(quickInsertPlugin());
  }

  if (isMobile) {
    plugins.push(historyPlugin());
    plugins.push(mobileScrollPlugin());
  }

  if (props.autoScrollIntoView !== false) {
    plugins.push(scrollIntoViewPlugin());
  }

  return plugins;
}
