import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { EditorPlugin } from '../../../types';
import {
  breakoutPlugin,
  collabEditPlugin,
  dataConsumerMarkPlugin,
  datePlugin,
  emojiPlugin,
  extensionPlugin,
  fragmentMarkPlugin,
  helpDialogPlugin,
  imageUploadPlugin,
  insertBlockPlugin,
  jiraIssuePlugin,
  layoutPlugin,
  listPlugin,
  toolbarListsIndentationPlugin,
  macroPlugin,
  maxContentSizePlugin,
  mediaPlugin,
  mentionsPlugin,
  panelPlugin,
  placeholderTextPlugin,
  rulePlugin,
  saveOnEnterPlugin,
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
  beforePrimaryToolbarPlugin,
  codeBidiWarningPlugin,
  copyButtonPlugin,
} from '../../../plugins';
import { tablesPlugin } from '@atlaskit/editor-plugin-table';
import type {
  EditorAppearance,
  GetEditorContainerWidth,
} from '@atlaskit/editor-common/types';

import { isFullPage as fullPageCheck } from '../../../utils/is-full-page';
import { PrivateCollabEditOptions } from '../../../plugins/collab-edit/types';
import { getMediaFeatureFlag } from '@atlaskit/media-common';
import { createDefaultPreset, DefaultPresetPluginOptions } from './default';
import { EditorPresetProps } from './types';
import { shouldForceTracking } from '@atlaskit/editor-common/utils';
import {
  BeforeAndAfterToolbarComponents,
  PrimaryToolbarComponents,
} from '../../../types/editor-props';
import type { InsertNodeAPI } from '../../../insert-api/types';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { EditorSelectionAPI } from '@atlaskit/editor-common/selection';
import { Preset } from './preset';
import { FeatureFlags } from '../../../types/feature-flags';
import {
  EditorPluginFeatureProps,
  EditorProviderProps,
} from '../../../types/editor-props';

type UniversalPresetProps = EditorPresetProps &
  DefaultPresetPluginOptions &
  EditorPluginFeatureProps &
  EditorProviderProps;

/**
 * Creates a preset with all of the available plugins.
 * Basis for create-plugins-list and can be used to migrate from Editor -> EditorNext (Presets project)
 * with minimal friction.
 *
 * @param appearance
 * @param props A subset of full EditorProps for the full feature preset
 * @param featureFlags
 * @param prevAppearance The appearance of the editor in the previous render
 * @param createAnalyticsEvent
 * @param insertNodeAPI
 * @param editorAnalyticsAPI
 * @param editorSelectionAPI
 * @param getEditorContainerWidth
 * @returns a full featured preset configured according to the provided props - basis for create-plugins-list
 */
export default function createUniversalPreset(
  appearance: EditorAppearance | undefined,
  props: UniversalPresetProps,
  featureFlags: FeatureFlags,
  prevAppearance?: EditorAppearance,
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
  insertNodeAPI?: InsertNodeAPI,
  editorAnalyticsAPI?: EditorAnalyticsAPI,
  editorSelectionAPI?: EditorSelectionAPI,
  getEditorContainerWidth?: GetEditorContainerWidth,
): Preset<EditorPlugin, []> {
  const isMobile = appearance === 'mobile';
  const isComment = appearance === 'comment';
  const isFullPage = fullPageCheck(appearance);
  const preset = createDefaultPreset(props);
  const getEditorFeatureFlags = () => featureFlags;

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
      { allowBreakoutButton: appearance === 'full-page' },
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
  preset.add([
    listPlugin,
    {
      restartNumberedLists: featureFlags?.restartNumberedLists,
      restartNumberedListsToolbar: featureFlags?.restartNumberedListsToolbar,
      listNumberContinuity: featureFlags?.listNumberContinuity,
    },
  ]);

  if (props.allowRule) {
    preset.add(rulePlugin);
  }

  if (props.allowExpand) {
    preset.add([
      expandPlugin,
      {
        allowInsertion: isExpandInsertionEnabled(props),
        useLongPressSelection: false,
        appearance: appearance,
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
        editorSelectionAPI,
        // This is a wild one. I didnt quite understand what the code was doing
        // so a bit of guess for now.
        allowMarkingUploadsAsIncomplete: isMobile,
        fullWidthEnabled: appearance === 'full-width',
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
        breakoutEnabled: appearance === 'full-page',
        allowContextualMenu: !isMobile,
        fullWidthEnabled: appearance === 'full-width',
        wasFullWidthEnabled: prevAppearance && prevAppearance === 'full-width',
        editorAnalyticsAPI,
        editorSelectionAPI,
        getEditorFeatureFlags,
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
    preset.add([helpDialogPlugin, !!props.legacyImageUploadProvider]);
  }

  if (props.saveOnEnter && props.onSave) {
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
          editorSelectionAPI,
        },
      ]);
    }
  }

  if (props.collabEdit || props.collabEditProvider) {
    let collabEditOptions: PrivateCollabEditOptions = {
      sanitizePrivateContent: props.sanitizePrivateContent,
      createAnalyticsEvent,
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
    const allowPanel =
      typeof props.allowPanel === 'object' ? props.allowPanel : {};
    preset.add([
      panelPlugin,
      {
        useLongPressSelection: false,
        allowCustomPanel: allowPanel.allowCustomPanel,
        allowCustomPanelEdit: allowPanel.allowCustomPanelEdit,
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
          appearance === 'full-page' && extensionConfig.allowBreakout !== false,
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
    preset.add([annotationPlugin, undefined as any]);
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
    const layoutOptions =
      typeof props.allowLayouts === 'object' ? props.allowLayouts : {};
    preset.add([
      layoutPlugin,
      {
        ...layoutOptions,
        useLongPressSelection: false,
        UNSAFE_allowSingleColumnLayout:
          layoutOptions.UNSAFE_allowSingleColumnLayout,
      },
    ]);
  }

  if (props.linking?.smartLinks || props.smartLinks || props.UNSAFE_cards) {
    const fullWidthMode = appearance === 'full-width';
    preset.add([
      cardPlugin,
      {
        ...props.UNSAFE_cards,
        ...props.smartLinks,
        ...props.linking?.smartLinks,
        platform: isMobile ? 'mobile' : 'web',
        fullWidthMode,
        createAnalyticsEvent,
        linkPicker: props.linking?.linkPicker,
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

  if (isMobile || props.allowUndoRedoButtons) {
    preset.add(historyPlugin);
  }

  if (isMobile) {
    preset.add(mobileDimensionsPlugin);
    preset.add(mobileSelectionPlugin);
  }

  // UI only plugins
  preset.add([
    toolbarListsIndentationPlugin,
    {
      showIndentationButtons: !!featureFlags.indentationButtonsInTheToolbar,
      allowHeadingAndParagraphIndentation: !!props.allowIndentation,
    },
  ]);
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
      insertNodeAPI,
    },
  ]);

  const hasBeforePrimaryToolbar = (
    components?: PrimaryToolbarComponents,
  ): components is BeforeAndAfterToolbarComponents => {
    if (components && 'before' in components) {
      return !!components.before;
    }
    return false;
  };

  if (
    hasBeforePrimaryToolbar(props.primaryToolbarComponents) &&
    !featureFlags.twoLineEditorToolbar
  ) {
    preset.add([
      beforePrimaryToolbarPlugin,
      {
        beforePrimaryToolbarComponents: props.primaryToolbarComponents.before,
      },
    ]);
  }

  if (
    featureFlags.showAvatarGroupAsPlugin === true &&
    !featureFlags.twoLineEditorToolbar
  ) {
    preset.add([
      avatarGroupPlugin,
      {
        collabEdit: props.collabEdit,
        takeFullWidth: !hasBeforePrimaryToolbar(props.primaryToolbarComponents),
      },
    ]);
  }

  if (props.allowFindReplace) {
    preset.add([
      findReplacePlugin,
      {
        takeFullWidth:
          !!featureFlags.showAvatarGroupAsPlugin === false &&
          !hasBeforePrimaryToolbar(props.primaryToolbarComponents),
        twoLineEditorToolbar: !!featureFlags.twoLineEditorToolbar,
      },
    ]);
  }

  if (props.allowFragmentMark) {
    preset.add(fragmentMarkPlugin);
  }

  if (featureFlags.enableViewUpdateSubscription) {
    preset.add(viewUpdateSubscriptionPlugin);
  }

  preset.add([
    codeBidiWarningPlugin,
    {
      appearance,
    },
  ]);

  if (featureFlags.floatingToolbarCopyButton) {
    preset.add(copyButtonPlugin);
  }

  return preset;
}
