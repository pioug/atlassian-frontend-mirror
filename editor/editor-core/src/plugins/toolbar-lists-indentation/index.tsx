import React from 'react';
import { NextEditorPlugin } from '@atlaskit/editor-common/types';
import ToolbarListsIndentation from './ui';
import WithPluginState from '../../ui/WithPluginState';
import { ToolbarSize } from '../../ui/Toolbar/types';
import { pluginKey as listPluginKey } from '../list/pm-plugins/main';
import {
  pluginKey as indentationButtonsPluginKey,
  createPlugin as indentationButtonsPlugin,
} from './pm-plugins/indentation-buttons';

type Config = {
  showIndentationButtons: boolean;
  allowHeadingAndParagraphIndentation: boolean;
};
const toolbarListsIndentationPlugin: NextEditorPlugin<
  'toolbarListsIndentation',
  never,
  Config
> = ({ showIndentationButtons, allowHeadingAndParagraphIndentation }) => ({
  name: 'toolbarListsIndentation',

  pmPlugins() {
    return [
      {
        name: 'indentationButtons',
        plugin: ({ dispatch }) =>
          indentationButtonsPlugin({
            dispatch,
            showIndentationButtons,
            allowHeadingAndParagraphIndentation,
          }),
      },
    ];
  },

  primaryToolbarComponent({
    editorView,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
    toolbarSize,
    disabled,
    isToolbarReducedSpacing,
  }) {
    const isSmall = toolbarSize < ToolbarSize.L;

    return (
      <WithPluginState
        plugins={{
          listState: listPluginKey,
          indentationState: indentationButtonsPluginKey,
        }}
        render={({ listState, indentationState }) => {
          if (!listState) {
            return null;
          }

          return (
            <ToolbarListsIndentation
              isSmall={isSmall}
              isReducedSpacing={isToolbarReducedSpacing}
              disabled={disabled}
              editorView={editorView}
              popupsMountPoint={popupsMountPoint}
              popupsBoundariesElement={popupsBoundariesElement}
              popupsScrollableElement={popupsScrollableElement}
              bulletListActive={listState!.bulletListActive}
              bulletListDisabled={listState!.bulletListDisabled}
              orderedListActive={listState!.orderedListActive}
              orderedListDisabled={listState!.orderedListDisabled}
              showIndentationButtons={!!showIndentationButtons}
              indentDisabled={indentationState!.indentDisabled}
              outdentDisabled={indentationState!.outdentDisabled}
            />
          );
        }}
      />
    );
  },
});

export default toolbarListsIndentationPlugin;
