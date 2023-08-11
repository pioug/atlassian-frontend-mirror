import CopyIcon from '@atlaskit/icon/glyph/copy';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { Command } from '../../../src/types';
import commonMessages from '../../messages';
import type {
  FloatingToolbarButton,
  FloatingToolbarItem,
  FloatingToolbarSeparator,
  MarkOptions,
  NodeOptions,
} from '@atlaskit/editor-common/types';
import {
  createToolbarCopyCommandForNode,
  createToolbarCopyCommandForMark,
  resetCopiedState,
  getProvideMarkVisualFeedbackForCopyButtonCommand,
  removeMarkVisualFeedbackForCopyButtonCommand,
} from './commands';
import { copyButtonPluginKey } from './pm-plugins/plugin-key';
import type { HoverDecorationHandler } from '@atlaskit/editor-plugin-decorations';

function isSeparator(item: any): item is FloatingToolbarSeparator {
  return item?.type === 'separator';
}

function isNodeOptions(
  options: MarkOptions | NodeOptions,
): options is NodeOptions {
  return 'nodeType' in options && options.nodeType !== undefined;
}

export function getCopyButtonConfig(
  options: MarkOptions | NodeOptions,
  hoverDecoration: HoverDecorationHandler | undefined,
): FloatingToolbarButton<Command> {
  const { state, formatMessage, onMouseEnter, onMouseLeave, onFocus, onBlur } =
    options;
  const copyButtonState = copyButtonPluginKey.getState(state);

  let buttonActionHandlers;

  if (isNodeOptions(options)) {
    buttonActionHandlers = {
      onClick: createToolbarCopyCommandForNode(options.nodeType),

      // Note for future changes: these two handlers should perform
      // the same action.
      onMouseEnter:
        onMouseEnter ||
        hoverDecoration?.(options.nodeType, true, 'ak-editor-selected-node'),
      onFocus:
        onFocus ||
        hoverDecoration?.(options.nodeType, true, 'ak-editor-selected-node'),

      // Note for future changes: these two handlers should perform
      // the same action.
      onMouseLeave: resetCopiedState(
        options.nodeType,
        hoverDecoration,
        onMouseLeave,
      ),
      onBlur: resetCopiedState(options.nodeType, hoverDecoration, onBlur),
    };
  } else {
    buttonActionHandlers = {
      onClick: createToolbarCopyCommandForMark(options.markType),

      onMouseEnter: getProvideMarkVisualFeedbackForCopyButtonCommand(
        options.markType,
      ),
      onFocus: getProvideMarkVisualFeedbackForCopyButtonCommand(
        options.markType,
      ),

      onMouseLeave: removeMarkVisualFeedbackForCopyButtonCommand,
      onBlur: removeMarkVisualFeedbackForCopyButtonCommand,
    };
  }

  return {
    id: 'editor.floatingToolbar.copy',
    type: 'button',
    appearance: 'subtle',
    icon: CopyIcon,
    title: formatMessage(
      copyButtonState?.copied
        ? commonMessages.copiedToClipboard
        : commonMessages.copyToClipboard,
    ),

    ...buttonActionHandlers,

    hideTooltipOnClick: false,
    tabIndex: null,
    // TODO select and delete styling needs to be removed when keyboard cursor moves away
    // problem already exist with delete as well
  };
}

export const showCopyButton = (state?: EditorState) => {
  return (
    state &&
    // Check if the Copy button plugin is enabled
    // @ts-ignore copyButtonPluginKey.key
    state.plugins.find((p: any) => p.key === copyButtonPluginKey.key)
  );
};

/**
 * Process floatingToolbar items for copyButton
 *
 * If copy button plugin not enabled, remove copy button item from toolbar items
 * else process copy button to standard floatingtoobarbutton
 */
export function processCopyButtonItems(state: EditorState) {
  return (
    items: Array<FloatingToolbarItem<Command>>,
    hoverDecoration: HoverDecorationHandler | undefined,
  ): Array<FloatingToolbarItem<Command>> =>
    items.flatMap((item) => {
      switch (item.type) {
        case 'copy-button':
          if (item?.hidden || !showCopyButton(state)) {
            return [];
          }
          return item?.items.map((copyButtonItem) =>
            isSeparator(copyButtonItem)
              ? copyButtonItem
              : getCopyButtonConfig(copyButtonItem, hoverDecoration),
          );
        default:
          return [item];
      }
    });
}
