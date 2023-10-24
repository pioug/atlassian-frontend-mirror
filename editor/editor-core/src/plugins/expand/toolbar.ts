import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';

import commonMessages from '../../messages';
import type {
  FloatingToolbarHandler,
  ExtractInjectionAPI,
} from '@atlaskit/editor-common/types';
import { deleteExpand } from './commands';
import { getPluginState } from './pm-plugins/plugin-factory';
import type { ExpandPlugin } from '.';

export const getToolbarConfig =
  (
    api: ExtractInjectionAPI<ExpandPlugin> | undefined,
  ): FloatingToolbarHandler =>
  (state, { formatMessage }) => {
    const { hoverDecoration } = api?.decorations?.actions ?? {};
    const editorAnalyticsAPI = api?.analytics?.actions;
    const { expandRef } = getPluginState(state);
    if (expandRef) {
      const { nestedExpand, expand } = state.schema.nodes;
      return {
        title: 'Expand toolbar',
        getDomRef: () => expandRef,
        nodeType: [nestedExpand, expand],
        offset: [0, 6],
        items: [
          {
            type: 'copy-button',
            items: [
              {
                state,
                formatMessage,
                nodeType: [nestedExpand, expand],
              },
              {
                type: 'separator',
              },
            ],
          },
          {
            id: 'editor.expand.delete',
            type: 'button',
            appearance: 'danger',
            focusEditoronEnter: true,
            icon: RemoveIcon,
            onClick: deleteExpand(editorAnalyticsAPI),
            onMouseEnter: hoverDecoration?.([nestedExpand, expand], true),
            onMouseLeave: hoverDecoration?.([nestedExpand, expand], false),
            onFocus: hoverDecoration?.([nestedExpand, expand], true),
            onBlur: hoverDecoration?.([nestedExpand, expand], false),
            title: formatMessage(commonMessages.remove),
            tabIndex: null,
          },
        ],
      };
    }
    return;
  };
