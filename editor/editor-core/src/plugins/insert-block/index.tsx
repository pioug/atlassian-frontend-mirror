import React from 'react';
import type {
  NextEditorPlugin,
  OptionalPlugin,
  ToolbarUiComponentFactoryParams,
  ExtractInjectionAPI,
  FeatureFlags,
} from '@atlaskit/editor-common/types';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import type { Providers } from '@atlaskit/editor-common/provider-factory';
import type { BlockTypeState } from '../block-type/pm-plugins/main';
import { pluginKey as blockTypeStateKey } from '../block-type/pm-plugins/main';
import { stateKey as mediaStateKey } from '../media/pm-plugins/plugin-key';
import type { MediaPluginState } from '../media/pm-plugins/types';

import type { ImageUploadPlugin } from '../image-upload';
import { isTypeAheadAllowed } from '../type-ahead/utils';

import { pluginKey as layoutStateKey } from '../layout';
import type { LayoutState } from '../layout/pm-plugins/types';
import type { MacroState } from '../macro';
import { insertMacroFromMacroBrowser } from '../macro';
import { emojiPluginKey } from '../emoji';
import type { EmojiPluginState } from '../emoji/types';
import WithPluginState from '../../ui/WithPluginState';
import ToolbarInsertBlock from './ui/ToolbarInsertBlock';
import { pluginKey as typeAheadPluginKey } from '../type-ahead/pm-plugins/key';
import { insertBlockTypesWithAnalytics } from '../block-type/commands';
import { INPUT_METHOD } from '../analytics';
import type datePlugin from '../date';
import { pluginKey as placeholderTextStateKey } from '../placeholder-text/plugin-key';
import type { PluginState as PlaceholderTextPluginState } from '../placeholder-text/types';
import { pluginKey as macroStateKey } from '../macro/plugin-key';
import { ToolbarSize } from '../../ui/Toolbar/types';
import type { tablesPlugin } from '@atlaskit/editor-plugin-table';
import type { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type mentionsPlugin from '../mentions';

const toolbarSizeToButtons = (toolbarSize: ToolbarSize) => {
  switch (toolbarSize) {
    case ToolbarSize.XXL:
    case ToolbarSize.XL:
    case ToolbarSize.L:
    case ToolbarSize.M:
      return 7;

    case ToolbarSize.S:
      return 2;

    default:
      return 0;
  }
};

export interface InsertBlockOptions {
  allowTables?: boolean;
  allowExpand?: boolean;
  insertMenuItems?: any;
  horizontalRuleEnabled?: boolean;
  nativeStatusSupported?: boolean;
  replacePlusMenuWithElementBrowser?: boolean;
  showElementBrowserLink?: boolean;
}

/**
 * Wrapper over insertBlockTypeWithAnalytics to autobind toolbar input method
 * @param name Block name
 */
function handleInsertBlockType(
  editorAnalyticsApi: EditorAnalyticsAPI | undefined,
) {
  return (name: string) =>
    insertBlockTypesWithAnalytics(
      name,
      INPUT_METHOD.TOOLBAR,
      editorAnalyticsApi,
    );
}

const insertBlockPlugin: NextEditorPlugin<
  'insertBlock',
  {
    pluginConfiguration: InsertBlockOptions | undefined;
    dependencies: [
      typeof featureFlagsPlugin,
      OptionalPlugin<typeof tablesPlugin>,
      OptionalPlugin<typeof hyperlinkPlugin>,
      OptionalPlugin<typeof datePlugin>,
      OptionalPlugin<typeof analyticsPlugin>,
      OptionalPlugin<ImageUploadPlugin>,
      OptionalPlugin<typeof mentionsPlugin>,
    ];
  }
> = (options = {}, api?) => {
  const featureFlags =
    api?.dependencies?.featureFlags?.sharedState.currentState() || {};
  return {
    name: 'insertBlock',

    primaryToolbarComponent({
      editorView,
      editorActions,
      dispatchAnalyticsEvent,
      providerFactory,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      toolbarSize,
      disabled,
      isToolbarReducedSpacing,
      isLastItem,
    }) {
      const renderNode = (providers: Providers) => {
        // We will slowly migrate these to use the new approach inside
        // `ToolbarInsertBlockWithInjectionApi` and remove `WithPluginState`
        return (
          <WithPluginState
            plugins={{
              typeAheadState: typeAheadPluginKey,
              blockTypeState: blockTypeStateKey,
              mediaState: mediaStateKey,
              macroState: macroStateKey,
              emojiState: emojiPluginKey,
              placeholderTextState: placeholderTextStateKey,
              layoutState: layoutStateKey,
            }}
            render={({
              blockTypeState,
              mediaState,
              macroState = {} as MacroState,
              emojiState,
              placeholderTextState,
              layoutState,
            }) => (
              <ToolbarInsertBlockWithInjectionApi
                pluginInjectionApi={api}
                editorView={editorView}
                editorActions={editorActions}
                dispatchAnalyticsEvent={dispatchAnalyticsEvent}
                providerFactory={providerFactory}
                popupsMountPoint={popupsMountPoint}
                popupsBoundariesElement={popupsBoundariesElement}
                popupsScrollableElement={popupsScrollableElement}
                toolbarSize={toolbarSize}
                disabled={disabled}
                isToolbarReducedSpacing={isToolbarReducedSpacing}
                isLastItem={isLastItem}
                featureFlags={featureFlags}
                blockTypeState={blockTypeState}
                mediaState={mediaState}
                macroState={macroState}
                emojiState={emojiState}
                placeholderTextState={placeholderTextState}
                layoutState={layoutState}
                providers={providers}
                options={options}
              />
            )}
          />
        );
      };

      return (
        <WithProviders
          providerFactory={providerFactory}
          providers={['emojiProvider']}
          renderNode={renderNode}
        />
      );
    },
  };
};

interface ToolbarInsertBlockWithInjectionApiProps
  extends Omit<
    ToolbarUiComponentFactoryParams,
    'eventDispatcher' | 'appearance' | 'containerElement' | 'wrapperElement'
  > {
  providers: Providers;
  pluginInjectionApi: ExtractInjectionAPI<typeof insertBlockPlugin> | undefined;
  options: InsertBlockOptions;
  featureFlags: FeatureFlags;
  // As part of Scalability project we are removing plugin keys
  // As we do this these props below will disappear
  blockTypeState: BlockTypeState | undefined;
  mediaState: MediaPluginState | undefined;
  macroState: MacroState;
  emojiState: EmojiPluginState | undefined;
  placeholderTextState: PlaceholderTextPluginState | undefined;
  layoutState: LayoutState | undefined;
}

function ToolbarInsertBlockWithInjectionApi({
  editorView,
  editorActions,
  dispatchAnalyticsEvent,
  providerFactory,
  popupsMountPoint,
  popupsBoundariesElement,
  popupsScrollableElement,
  toolbarSize,
  disabled,
  isToolbarReducedSpacing,
  isLastItem,
  providers,
  pluginInjectionApi,
  options,
  blockTypeState,
  mediaState,
  macroState,
  emojiState,
  placeholderTextState,
  layoutState,
  featureFlags,
}: ToolbarInsertBlockWithInjectionApiProps) {
  const buttons = toolbarSizeToButtons(toolbarSize);
  const { dateState, hyperlinkState, imageUploadState, mentionState } =
    useSharedPluginState(pluginInjectionApi, [
      'hyperlink',
      'date',
      'imageUpload',
      'mention',
    ]);

  return (
    <ToolbarInsertBlock
      pluginInjectionApi={pluginInjectionApi}
      buttons={buttons}
      isReducedSpacing={isToolbarReducedSpacing}
      isDisabled={disabled}
      isTypeAheadAllowed={isTypeAheadAllowed(editorView.state)}
      editorView={editorView}
      tableSupported={!!editorView.state.schema.nodes.table}
      actionSupported={!!editorView.state.schema.nodes.taskItem}
      mentionsSupported={!!(mentionState && mentionState.mentionProvider)}
      mentionsDisabled={!!(mentionState && !mentionState.canInsertMention)}
      decisionSupported={!!editorView.state.schema.nodes.decisionItem}
      dateEnabled={!!dateState}
      placeholderTextEnabled={
        placeholderTextState && placeholderTextState.allowInserting
      }
      layoutSectionEnabled={!!layoutState}
      expandEnabled={!!options.allowExpand}
      mediaUploadsEnabled={mediaState && mediaState.allowsUploads}
      onShowMediaPicker={mediaState && mediaState.showMediaPicker}
      mediaSupported={!!mediaState}
      imageUploadSupported={!!pluginInjectionApi?.dependencies.imageUpload}
      imageUploadEnabled={imageUploadState?.enabled}
      handleImageUpload={
        pluginInjectionApi?.dependencies.imageUpload?.actions.startUpload
      }
      availableWrapperBlockTypes={
        blockTypeState && blockTypeState.availableWrapperBlockTypes
      }
      linkSupported={!!hyperlinkState}
      linkDisabled={
        !hyperlinkState ||
        !hyperlinkState.canInsertLink ||
        !!hyperlinkState.activeLinkMark
      }
      emojiDisabled={!emojiState || !emojiState.emojiProvider}
      emojiProvider={providers.emojiProvider}
      nativeStatusSupported={options.nativeStatusSupported}
      horizontalRuleEnabled={options.horizontalRuleEnabled}
      onInsertBlockType={handleInsertBlockType(
        pluginInjectionApi?.dependencies.analytics?.actions,
      )}
      onInsertMacroFromMacroBrowser={insertMacroFromMacroBrowser}
      macroProvider={macroState.macroProvider}
      popupsMountPoint={popupsMountPoint}
      popupsBoundariesElement={popupsBoundariesElement}
      popupsScrollableElement={popupsScrollableElement}
      insertMenuItems={options.insertMenuItems}
      editorActions={editorActions}
      dispatchAnalyticsEvent={dispatchAnalyticsEvent}
      replacePlusMenuWithElementBrowser={
        options.replacePlusMenuWithElementBrowser
      }
      showElementBrowserLink={options.showElementBrowserLink}
      showSeparator={!isLastItem && toolbarSize <= ToolbarSize.S}
      featureFlags={featureFlags}
    />
  );
}

export default insertBlockPlugin;
