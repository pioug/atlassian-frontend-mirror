import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';

import commonMessages from '../../messages';
import {
  FloatingToolbarHandler,
  FloatingToolbarItem,
} from '../floating-toolbar/types';
import { deleteExpand } from './commands';
import { hoverDecoration } from '../base/pm-plugins/decoration';
import { getPluginState } from './pm-plugins/plugin-factory';
import { getCopyButtonConfig, showCopyButton } from '../copy-button/toolbar';
import { Command } from '../../types/command';

export const getToolbarConfig: FloatingToolbarHandler = (
  state,
  { formatMessage },
) => {
  const { expandRef } = getPluginState(state);
  if (expandRef) {
    const { nestedExpand, expand } = state.schema.nodes;
    return {
      title: 'Expand toolbar',
      getDomRef: () => expandRef,
      nodeType: [nestedExpand, expand],
      offset: [0, 6],
      items: [
        ...(state && showCopyButton(state)
          ? [
              getCopyButtonConfig(state, formatMessage, [nestedExpand, expand]),
              {
                type: 'separator',
              } as FloatingToolbarItem<Command>,
            ]
          : []),

        {
          id: 'editor.expand.delete',
          type: 'button',
          appearance: 'danger',
          icon: RemoveIcon,
          onClick: deleteExpand(),
          onMouseEnter: hoverDecoration([nestedExpand, expand], true),
          onMouseLeave: hoverDecoration([nestedExpand, expand], false),
          onFocus: hoverDecoration([nestedExpand, expand], true),
          onBlur: hoverDecoration([nestedExpand, expand], false),
          title: formatMessage(commonMessages.remove),
          tabIndex: null,
        },
      ],
    };
  }
  return;
};
