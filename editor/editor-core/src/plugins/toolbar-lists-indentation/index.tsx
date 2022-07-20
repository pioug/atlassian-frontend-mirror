import React from 'react';
import { EditorPlugin } from '../../types';
import ToolbarListsIndentation from './ui';
import WithPluginState from '../../ui/WithPluginState';
import { ToolbarSize } from '../../ui/Toolbar/types';
import { pluginKey as listPluginKey } from '../list/pm-plugins/main';

const toolbarListsIndentationPlugin = ({
  showIndentationButtons,
}: {
  showIndentationButtons: boolean;
}): EditorPlugin => ({
  name: 'toolbarListsIndentation',

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
        }}
        render={({ listState: listState }) => {
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
            />
          );
        }}
      />
    );
  },
});

export default toolbarListsIndentationPlugin;
