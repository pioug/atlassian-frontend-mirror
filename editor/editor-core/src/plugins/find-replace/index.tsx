import React from 'react';
import { createPlugin } from './plugin';
import keymapPlugin from './keymap';
import { EditorPlugin } from '../../types';
import FindReplaceToolbarButtonWithState from './FindReplaceToolbarButtonWithState';

export const findReplacePlugin = (props: {
  takeFullWidth: boolean;
  twoLineEditorToolbar: boolean;
}): EditorPlugin => {
  return {
    name: 'findReplace',

    pmPlugins() {
      return [
        {
          name: 'findReplace',
          plugin: ({ dispatch }) => createPlugin(dispatch),
        },
        {
          name: 'findReplaceKeymap',
          plugin: () => keymapPlugin(),
        },
      ];
    },

    primaryToolbarComponent({
      popupsBoundariesElement,
      popupsMountPoint,
      popupsScrollableElement,
      isToolbarReducedSpacing,
      editorView,
      containerElement,
      dispatchAnalyticsEvent,
    }) {
      if (props.twoLineEditorToolbar) {
        return null;
      } else {
        return (
          <FindReplaceToolbarButtonWithState
            popupsBoundariesElement={popupsBoundariesElement}
            popupsMountPoint={popupsMountPoint}
            popupsScrollableElement={popupsScrollableElement}
            isToolbarReducedSpacing={isToolbarReducedSpacing}
            editorView={editorView}
            containerElement={containerElement}
            dispatchAnalyticsEvent={dispatchAnalyticsEvent}
            takeFullWidth={props.takeFullWidth}
          />
        );
      }
    },
  };
};
export default findReplacePlugin;
