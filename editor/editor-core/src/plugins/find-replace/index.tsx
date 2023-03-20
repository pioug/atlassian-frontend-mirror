import React from 'react';
import { createPlugin } from './plugin';
import keymapPlugin from './keymap';
import { NextEditorPlugin } from '@atlaskit/editor-common/types';
import FindReplaceToolbarButtonWithState from './FindReplaceToolbarButtonWithState';

type Config = {
  takeFullWidth: boolean;
  twoLineEditorToolbar: boolean;
};
export const findReplacePlugin: NextEditorPlugin<
  'findReplace',
  {
    pluginConfiguration: Config;
  }
> = (props) => {
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
