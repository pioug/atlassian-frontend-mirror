import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  breakoutPlugin,
  collabEditPlugin,
  dataConsumerMarkPlugin,
  extensionPlugin,
  insertBlockPlugin,
  jiraIssuePlugin,
  toolbarListsIndentationPlugin,
  tasksAndDecisionsPlugin,
  alignmentPlugin,
  customAutoformatPlugin,
  feedbackDialogPlugin,
  mobileDimensionsPlugin,
  findReplacePlugin,
  mobileSelectionPlugin,
  annotationPlugin,
  avatarGroupPlugin,
  viewUpdateSubscriptionPlugin,
  beforePrimaryToolbarPlugin,
  codeBidiWarningPlugin,
} from '../plugins';
import { panelPlugin } from '@atlaskit/editor-plugin-panel';
import { textColorPlugin } from '@atlaskit/editor-plugin-text-color';
import { historyPlugin } from '@atlaskit/editor-plugin-history';
import { indentationPlugin } from '@atlaskit/editor-plugin-indentation';
import { statusPlugin } from '@atlaskit/editor-plugin-status';
import { datePlugin } from '@atlaskit/editor-plugin-date';
import { maxContentSizePlugin } from '@atlaskit/editor-plugin-max-content-size';
import { captionPlugin } from '@atlaskit/editor-plugin-caption';
import { borderPlugin } from '@atlaskit/editor-plugin-border';
import { helpDialogPlugin } from '@atlaskit/editor-plugin-help-dialog';
import { mediaPlugin } from '@atlaskit/editor-plugin-media';
import { rulePlugin } from '@atlaskit/editor-plugin-rule';
import { fragmentPlugin } from '@atlaskit/editor-plugin-fragment';
import { emojiPlugin } from '@atlaskit/editor-plugin-emoji';
import { pasteOptionsToolbarPlugin } from '@atlaskit/editor-plugin-paste-options-toolbar';
import { listPlugin } from '@atlaskit/editor-plugin-list';
import { imageUploadPlugin } from '@atlaskit/editor-plugin-image-upload';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { contextPanelPlugin } from '@atlaskit/editor-plugin-context-panel';
import { gridPlugin } from '@atlaskit/editor-plugin-grid';
import { cardPlugin } from '@atlaskit/editor-plugin-card';
import { layoutPlugin } from '@atlaskit/editor-plugin-layout';
import { tablesPlugin } from '@atlaskit/editor-plugin-table';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { saveOnEnterPlugin } from '@atlaskit/editor-plugin-save-on-enter';
import { scrollIntoViewPlugin } from '@atlaskit/editor-plugin-scroll-into-view';
import { mentionsPlugin } from '@atlaskit/editor-plugin-mentions';
import { placeholderTextPlugin } from '@atlaskit/editor-plugin-placeholder-text';
import { expandPlugin } from '@atlaskit/editor-plugin-expand';
import type { EditorAppearance } from '@atlaskit/editor-common/types';

import type { EditorProps } from '../types';
import { isFullPage as fullPageCheck } from '../utils/is-full-page';
import type { PrivateCollabEditOptions } from '../plugins/collab-edit/types';
import type { DefaultPresetPluginOptions } from './default';
import { createDefaultPreset } from './default';
import type { EditorPresetProps } from './types';
import { shouldForceTracking } from '@atlaskit/editor-common/utils';
import type {
  BeforeAndAfterToolbarComponents,
  EditorSharedPropsWithPlugins,
  PrimaryToolbarComponents,
  EditorPluginFeatureProps,
  EditorProviderProps,
} from '../types/editor-props';
import type { FeatureFlags } from '../types/feature-flags';
import type { EditorPresetBuilder } from '@atlaskit/editor-common/preset';

type UniversalPresetProps = EditorPresetProps &
  DefaultPresetPluginOptions &
  EditorSharedPropsWithPlugins &
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
 * @returns a full featured preset configured according to the provided props - basis for create-plugins-list
 */
export default function createUniversalPreset(
  appearance: EditorAppearance | undefined,
  props: UniversalPresetProps,
  featureFlags: FeatureFlags,
  prevAppearance?: EditorAppearance,
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
): EditorPresetBuilder<any, any> {
  const isMobile = appearance === 'mobile';
  const isComment = appearance === 'comment';
  const isChromeless = appearance === 'chromeless';
  const isFullPage = fullPageCheck(appearance);

  const getEditorFeatureFlags = () => featureFlags;

  const defaultPreset = createDefaultPreset({ ...props, createAnalyticsEvent });

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
    .add(dataConsumerMarkPlugin)
    .add(contentInsertionPlugin)
    .maybeAdd(breakoutPlugin, (plugin, builder) => {
      if (props.allowBreakout && isFullPage) {
        return builder.add([
          plugin,
          { allowBreakoutButton: appearance === 'full-page' },
        ]);
      }

      return builder;
    })

    .maybeAdd(alignmentPlugin, (plugin, builder) => {
      if (props.allowTextAlignment) {
        return builder.add(plugin);
      }

      return builder;
    })

    .maybeAdd(textColorPlugin, (plugin, builder) => {
      if (props.allowTextColor) {
        return builder.add([plugin, props.allowTextColor]);
      }

      return builder;
    })
    .add([
      listPlugin,
      {
        restartNumberedLists: featureFlags?.restartNumberedLists,
      },
    ])
    .maybeAdd(rulePlugin, (plugin, builder) => {
      if (props.allowRule) {
        return builder.add(plugin);
      }

      return builder;
    })
    .maybeAdd(expandPlugin, (plugin, builder) => {
      if (props.allowExpand) {
        return builder.add([
          plugin,
          {
            allowInsertion: isExpandInsertionEnabled(props),
            useLongPressSelection: false,
            appearance: appearance,
          },
        ]);
      }

      return builder;
    })
    .maybeAdd(guidelinePlugin, (plugin, builder) => {
      if (isMobile || isComment || isChromeless) {
        return builder;
      }

      if (props.media || props.allowTables) {
        return builder.add(plugin);
      }
      return builder;
    })
    .maybeAdd(gridPlugin, (plugin, builder) => {
      if (props.media) {
        return builder.add([
          plugin,
          { shouldCalcBreakoutGridLines: isFullPage },
        ]);
      }
      return builder;
    })
    .maybeAdd(mediaPlugin, (plugin, builder) => {
      if (props.media) {
        const alignLeftOnInsert =
          typeof props.media.alignLeftOnInsert !== 'undefined'
            ? props.media.alignLeftOnInsert
            : isComment;

        const showMediaLayoutOptions =
          typeof props.media.allowAdvancedToolBarOptions !== 'undefined'
            ? props.media.allowAdvancedToolBarOptions
            : isFullPage || isComment;

        return builder.add([
          plugin,
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
            fullWidthEnabled: appearance === 'full-width',
            uploadErrorHandler: props.uploadErrorHandler,
            waitForMediaUpload: props.waitForMediaUpload,
            isCopyPasteEnabled: !isMobile,
            alignLeftOnInsert,
            getEditorFeatureFlags,
          },
        ]);
      }
      return builder;
    })
    .maybeAdd(captionPlugin, (plugin, builder) => {
      // EDM-799: inside caption plugin we do the feature flag in enabling the plugin
      if (props.media?.allowCaptions) {
        return builder.add(plugin);
      }
      return builder;
    })
    .maybeAdd(mentionsPlugin, (plugin, builder) => {
      if (props.mentionProvider) {
        return builder.add([
          plugin,
          {
            sanitizePrivateContent: props.sanitizePrivateContent,
            insertDisplayName:
              props.mention?.insertDisplayName ??
              props.mentionInsertDisplayName,
            allowZeroWidthSpaceAfter: !isMobile,
            HighlightComponent: props.mention?.HighlightComponent,
          },
        ]);
      }

      return builder;
    })
    .maybeAdd(emojiPlugin, (plugin, builder) => {
      if (props.emojiProvider) {
        return builder.add(plugin);
      }

      return builder;
    })
    .maybeAdd(tablesPlugin, (plugin, builder) => {
      if (props.allowTables) {
        const tableOptions =
          !props.allowTables || typeof props.allowTables === 'boolean'
            ? {}
            : props.allowTables;

        return builder.add([
          plugin,
          {
            tableOptions,
            // tableResizingEnabled will replace breakoutEnabled once FF is 100% rolled out,
            // logic below is to help codemod during cleanup
            tableResizingEnabled:
              getBooleanFF('platform.editor.custom-table-width') &&
              ['full-page', 'full-width'].includes(appearance || ''),
            dragAndDropEnabled:
              getBooleanFF('platform.editor.table.drag-and-drop') && isFullPage,
            breakoutEnabled: appearance === 'full-page',
            allowContextualMenu: !isMobile,
            fullWidthEnabled: appearance === 'full-width',
            wasFullWidthEnabled:
              prevAppearance && prevAppearance === 'full-width',
            getEditorFeatureFlags,
          },
        ]);
      }

      return builder;
    })
    .maybeAdd(tasksAndDecisionsPlugin, (plugin, builder) => {
      if (props.allowTasksAndDecisions || props.taskDecisionProvider) {
        return builder.add([
          plugin,
          {
            allowNestedTasks: props.allowNestedTasks,
            consumeTabs: isFullPage,
            useLongPressSelection: false,
          },
        ]);
      }

      return builder;
    })
    .maybeAdd(feedbackDialogPlugin, (plugin, builder) => {
      if (props.feedbackInfo) {
        return builder.add([plugin, props.feedbackInfo]);
      }

      return builder;
    })
    .maybeAdd(helpDialogPlugin, (plugin, builder) => {
      if (props.allowHelpDialog) {
        return builder.add([plugin, !!props.legacyImageUploadProvider]);
      }

      return builder;
    })
    .maybeAdd(saveOnEnterPlugin, (plugin, builder) => {
      if (props.saveOnEnter && props.onSave) {
        return builder.add([plugin, props.onSave]);
      }

      return builder;
    })
    .maybeAdd(imageUploadPlugin, (plugin, builder) => {
      if (props.legacyImageUploadProvider) {
        return builder.add(plugin);
      }
      return builder;
    })
    .maybeAdd(mediaPlugin, (plugin, builder) => {
      if (props.legacyImageUploadProvider && !props.media) {
        return builder.add([
          plugin,
          {
            allowMediaSingle: { disableLayout: true },
            allowMediaGroup: false,
            isCopyPasteEnabled: true,
          },
        ]);
      }

      return builder;
    })
    .maybeAdd(collabEditPlugin, (plugin, builder) => {
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

        return builder.add([
          plugin,
          {
            ...collabEditOptions,
            EXPERIMENTAL_allowInternalErrorAnalytics:
              collabEditOptions.EXPERIMENTAL_allowInternalErrorAnalytics ??
              shouldForceTracking(),
          },
        ]);
      }

      return builder;
    })
    .maybeAdd(maxContentSizePlugin, (plugin, builder) => {
      if (props.maxContentSize) {
        return builder.add([plugin, props.maxContentSize]);
      }

      return builder;
    })
    .maybeAdd(jiraIssuePlugin, (plugin, builder) => {
      if (props.allowJiraIssue) {
        return builder.add(plugin);
      }

      return builder;
    })
    .maybeAdd(panelPlugin, (plugin, builder) => {
      if (props.allowPanel) {
        const allowPanel =
          typeof props.allowPanel === 'object' ? props.allowPanel : {};
        return builder.add([
          plugin,
          {
            useLongPressSelection: false,
            allowCustomPanel: allowPanel.allowCustomPanel,
            allowCustomPanelEdit: allowPanel.allowCustomPanelEdit,
          },
        ]);
      }

      return builder;
    })
    .maybeAdd(contextPanelPlugin, (plugin, builder) => {
      if (isFullPage) {
        return builder.add(contextPanelPlugin);
      }

      return builder;
    })
    .maybeAdd(extensionPlugin, (plugin, builder) => {
      if (props.allowExtension) {
        const extensionConfig =
          typeof props.allowExtension === 'object' ? props.allowExtension : {};
        return builder.add([
          plugin,
          {
            breakoutEnabled:
              appearance === 'full-page' &&
              extensionConfig.allowBreakout !== false,
            allowAutoSave: extensionConfig.allowAutoSave,
            extensionHandlers: props.extensionHandlers,
            useLongPressSelection: false,
            appearance,
          },
        ]);
      }
      return builder;
    })
    .maybeAdd(annotationPlugin, (plugin, builder) => {
      // See default list for when adding annotations with a provider
      if (!props.annotationProviders && props.allowConfluenceInlineComment) {
        return builder.add([plugin, undefined as any]);
      }

      return builder;
    })
    .maybeAdd(datePlugin, (plugin, builder) => {
      if (props.allowDate) {
        const dateConfig =
          typeof props.allowDate === 'object' ? props.allowDate : {};
        return builder.add([
          plugin,
          {
            weekStartDay: dateConfig.weekStartDay,
          },
        ]);
      }

      return builder;
    })
    .maybeAdd(placeholderTextPlugin, (plugin, builder) => {
      if (props.allowTemplatePlaceholders) {
        const options =
          props.allowTemplatePlaceholders !== true
            ? props.allowTemplatePlaceholders
            : {};
        return builder.add([plugin, options]);
      }

      return builder;
    })
    .maybeAdd(layoutPlugin, (plugin, builder) => {
      if (props.allowLayouts) {
        const layoutOptions =
          typeof props.allowLayouts === 'object' ? props.allowLayouts : {};
        return builder.add([
          plugin,
          {
            ...layoutOptions,
            useLongPressSelection: false,
            UNSAFE_allowSingleColumnLayout:
              layoutOptions.UNSAFE_allowSingleColumnLayout,
          },
        ]);
      }

      return builder;
    })
    .maybeAdd(cardPlugin, (plugin, builder) => {
      if (props.linking?.smartLinks || props.smartLinks || props.UNSAFE_cards) {
        const fullWidthMode = appearance === 'full-width';
        return builder.add([
          plugin,
          {
            ...props.UNSAFE_cards,
            ...props.smartLinks,
            ...props.linking?.smartLinks,
            platform: isMobile ? 'mobile' : 'web',
            fullWidthMode,
            linkPicker: props.linking?.linkPicker,
            editorAppearance: appearance,
          },
        ]);
      }

      return builder;
    })
    .maybeAdd(customAutoformatPlugin, (plugin, builder) => {
      if (props.autoformattingProvider) {
        return builder.add(plugin);
      }

      return builder;
    })
    .maybeAdd(statusPlugin, (plugin, builder) => {
      if (props.allowStatus) {
        return builder.add([
          plugin,
          {
            menuDisabled: statusMenuDisabled,
            allowZeroWidthSpaceAfter: !isMobile,
          },
        ]);
      }

      return builder;
    })
    .maybeAdd(indentationPlugin, (plugin, builder) => {
      if (props.allowIndentation) {
        return builder.add(plugin);
      }

      return builder;
    })
    .maybeAdd(scrollIntoViewPlugin, (plugin, builder) => {
      if (props.autoScrollIntoView !== false) {
        return builder.add(scrollIntoViewPlugin);
      }

      return builder;
    })
    .maybeAdd(historyPlugin, (plugin, builder) => {
      if (isMobile || props.allowUndoRedoButtons) {
        return builder.add(historyPlugin);
      }
      return builder;
    })
    .maybeAdd(mobileDimensionsPlugin, (plugin, builder) => {
      if (isMobile) {
        return builder.add(plugin);
      }

      return builder;
    })
    .maybeAdd(mobileSelectionPlugin, (plugin, builder) => {
      if (isMobile) {
        return builder.add(plugin);
      }

      return builder;
    })
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
        nativeStatusSupported: !statusMenuDisabled,
        showElementBrowserLink:
          (props.elementBrowser && props.elementBrowser.showModal) || false,
        replacePlusMenuWithElementBrowser:
          (props.elementBrowser && props.elementBrowser.replacePlusMenu) ||
          false,
      },
    ])
    .maybeAdd(beforePrimaryToolbarPlugin, (plugin, builder) => {
      if (
        hasBeforePrimaryToolbar(props.primaryToolbarComponents) &&
        !featureFlags.twoLineEditorToolbar
      ) {
        return builder.add([
          plugin,
          {
            beforePrimaryToolbarComponents:
              props.primaryToolbarComponents.before,
          },
        ]);
      }

      return builder;
    })
    .maybeAdd(avatarGroupPlugin, (plugin, builder) => {
      if (
        !props.hideAvatarGroup &&
        featureFlags.showAvatarGroupAsPlugin === true &&
        !featureFlags.twoLineEditorToolbar
      ) {
        // Avatars are moved to Confluence codebase for Edit in Context
        // When Edit in Context is enabled primaryToolbarComponents is undefined
        // For more details please check
        // https://hello.atlassian.net/wiki/spaces/PCG/pages/2851572180/Editor+toolbar+for+live+pages+and+edit+in+context+projects
        return builder.add([
          plugin,
          {
            collabEdit: props.collabEdit,
            takeFullWidth: !hasBeforePrimaryToolbar(
              props.primaryToolbarComponents,
            ),
          },
        ]);
      }

      return builder;
    })
    .maybeAdd(findReplacePlugin, (plugin, builder) => {
      if (props.allowFindReplace) {
        return builder.add([
          plugin,
          {
            takeFullWidth:
              !props.hideAvatarGroup &&
              !!featureFlags.showAvatarGroupAsPlugin === false &&
              !hasBeforePrimaryToolbar(props.primaryToolbarComponents),
            twoLineEditorToolbar:
              !!props.primaryToolbarComponents &&
              !!featureFlags.twoLineEditorToolbar,
          },
        ]);
      }
      return builder;
    })
    .maybeAdd(borderPlugin, (plugin, builder) => {
      if (props.allowBorderMark || props.UNSAFE_allowBorderMark) {
        return builder.add(plugin);
      }

      return builder;
    })
    .maybeAdd(fragmentPlugin, (plugin, builder) => {
      if (props.allowFragmentMark) {
        return builder.add(plugin);
      }

      return builder;
    })
    .maybeAdd(viewUpdateSubscriptionPlugin, (plugin, builder) => {
      if (featureFlags.enableViewUpdateSubscription) {
        return builder.add(plugin);
      }

      return builder;
    })
    .maybeAdd(pasteOptionsToolbarPlugin, (plugin, builder) => {
      if (getBooleanFF('platform.editor.paste-options-toolbar')) {
        return builder.add(plugin);
      }

      return builder;
    })
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
