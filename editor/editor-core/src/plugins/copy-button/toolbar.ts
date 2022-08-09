import CopyIcon from '@atlaskit/icon/glyph/copy';
import { NodeType } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { IntlShape } from 'react-intl-next';
import { Command } from '../../../src/types';
import commonMessages from '../../messages';
import { hoverDecoration } from '../base/pm-plugins/decoration';
import { FloatingToolbarItem } from '../floating-toolbar/types';
import { createToolbarCopyCommand, resetCopiedState } from './commands';
import { pluginKey } from './pm-plugins/plugin-key';

export const getCopyButtonConfig = (
  state: EditorState,
  formatMessage: IntlShape['formatMessage'],
  nodeType: NodeType | Array<NodeType>,
  onMouseEnter?: Command,
  onMouseLeave?: Command,
): FloatingToolbarItem<Command> => {
  const copyButtonState = pluginKey.getState(state);

  return {
    id: 'editor.floatingToolbar.copy',
    type: 'button',
    appearance: 'subtle',
    icon: CopyIcon,
    onClick: createToolbarCopyCommand(nodeType),
    title: formatMessage(
      copyButtonState?.copied
        ? commonMessages.copiedToClipboard
        : commonMessages.copyToClipboard,
    ),
    onMouseEnter:
      onMouseEnter ||
      hoverDecoration(nodeType, true, 'ak-editor-selected-node'),
    onMouseLeave: resetCopiedState(nodeType, onMouseLeave),
    onFocus: hoverDecoration(nodeType, true, 'ak-editor-selected-node'),
    onBlur: hoverDecoration(nodeType, false),
    hideTooltipOnClick: false,
    tabIndex: null,
    // TODO select and delete styling needs to be removed when keyboard cursor moves away
    // problem already exist with delete as well
  };
};

export const showCopyButton = (state?: EditorState) => {
  return (
    state &&
    // Check if the Copy button plugin is enabled
    // @ts-ignore pluginKey.key
    state.plugins.find((p: any) => p.key === pluginKey.key)
  );
};
