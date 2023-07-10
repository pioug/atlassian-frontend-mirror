import React from 'react';
import {
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import type { Providers } from '@atlaskit/editor-common/provider-factory';
import { pluginKey as blockTypeStateKey } from '../block-type/pm-plugins/main';
import { stateKey as mediaStateKey } from '../media/pm-plugins/plugin-key';
import { stateKey as hyperlinkPluginKey } from '../hyperlink/pm-plugins/main';

import { isTypeAheadAllowed } from '../type-ahead/utils';
import { mentionPluginKey } from '../mentions/pm-plugins/key';
import { pluginKey as layoutStateKey } from '../layout';
import { MacroState, insertMacroFromMacroBrowser } from '../macro';
import { emojiPluginKey } from '../emoji';
import WithPluginState from '../../ui/WithPluginState';
import ToolbarInsertBlock from './ui/ToolbarInsertBlock';
import { pluginKey as typeAheadPluginKey } from '../type-ahead/pm-plugins/key';
import { insertBlockTypesWithAnalytics } from '../block-type/commands';
import { startImageUpload } from '../image-upload/pm-plugins/commands';
import { INPUT_METHOD } from '../analytics';
import { stateKey as imageUploadStateKey } from '../image-upload/pm-plugins/plugin-key';
import { pluginKey as dateStateKey } from '../date/pm-plugins/plugin-key';
import { pluginKey as placeholderTextStateKey } from '../placeholder-text/plugin-key';
import { pluginKey as macroStateKey } from '../macro/plugin-key';
import { ToolbarSize } from '../../ui/Toolbar/types';
import { tablesPlugin } from '@atlaskit/editor-plugin-table';
import { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';

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
      OptionalPlugin<typeof analyticsPlugin>,
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
      const buttons = toolbarSizeToButtons(toolbarSize);
      const renderNode = (providers: Providers) => {
        return (
          <WithPluginState
            plugins={{
              typeAheadState: typeAheadPluginKey,
              blockTypeState: blockTypeStateKey,
              mediaState: mediaStateKey,
              mentionState: mentionPluginKey,
              macroState: macroStateKey,
              hyperlinkState: hyperlinkPluginKey,
              emojiState: emojiPluginKey,
              dateState: dateStateKey,
              imageUpload: imageUploadStateKey,
              placeholderTextState: placeholderTextStateKey,
              layoutState: layoutStateKey,
            }}
            render={({
              mentionState,
              blockTypeState,
              mediaState,
              macroState = {} as MacroState,
              hyperlinkState,
              emojiState,
              dateState,
              imageUpload,
              placeholderTextState,
              layoutState,
            }) => (
              <ToolbarInsertBlock
                pluginInjectionApi={api}
                buttons={buttons}
                isReducedSpacing={isToolbarReducedSpacing}
                isDisabled={disabled}
                isTypeAheadAllowed={isTypeAheadAllowed(editorView.state)}
                editorView={editorView}
                tableSupported={!!editorView.state.schema.nodes.table}
                actionSupported={!!editorView.state.schema.nodes.taskItem}
                mentionsSupported={
                  !!(mentionState && mentionState.mentionProvider)
                }
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
                imageUploadSupported={!!imageUpload}
                imageUploadEnabled={imageUpload && imageUpload.enabled}
                handleImageUpload={startImageUpload}
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
                  api?.dependencies.analytics?.actions,
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

export default insertBlockPlugin;
