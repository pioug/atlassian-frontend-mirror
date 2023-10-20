/** @jsx jsx */
import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import UndoIcon from '@atlaskit/icon/glyph/undo';
import RedoIcon from '@atlaskit/icon/glyph/redo';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';

import {
  undo as undoKeymap,
  redo as redoKeymap,
  ToolTipContent,
  tooltip,
} from '../../../../keymaps';
import {
  separatorStyles,
  buttonGroupStyle,
} from '@atlaskit/editor-common/styles';
import ToolbarButton, { TOOLBAR_BUTTON } from '../../../../ui/ToolbarButton';
import { undoRedoMessages } from '@atlaskit/editor-common/messages';
import { undoFromToolbar, redoFromToolbar } from '../../commands';
import type { Command } from '../../../../types/command';
import { getAriaKeyshortcuts } from '@atlaskit/editor-common/keymaps';
import type { UndoRedoPlugin } from '../../types';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

export interface Props {
  undoDisabled?: boolean;
  redoDisabled?: boolean;
  disabled?: boolean;
  isReducedSpacing?: boolean;
  editorView: EditorView;
  api: ExtractInjectionAPI<UndoRedoPlugin> | undefined;
}

const closeTypeAheadAndRunCommand =
  (
    editorView: EditorView,
    api: ExtractInjectionAPI<UndoRedoPlugin> | undefined,
  ) =>
  (command: Command) => {
    if (!editorView) {
      return;
    }
    if (api?.typeAhead?.actions?.isOpen(editorView.state)) {
      api?.typeAhead?.actions?.close({
        attachCommand: command,
        insertCurrentQueryAsRawText: false,
      });
    } else {
      command(editorView.state, editorView.dispatch);
    }
  };
const forceFocus =
  (
    editorView: EditorView,
    api: ExtractInjectionAPI<UndoRedoPlugin> | undefined,
  ) =>
  (command: Command) => {
    closeTypeAheadAndRunCommand(editorView, api)(command);

    if (!editorView.hasFocus()) {
      editorView.focus();
    }
  };

export const ToolbarUndoRedo = ({
  disabled,
  isReducedSpacing,
  editorView,
  api,
  intl: { formatMessage },
}: Props & WrappedComponentProps) => {
  const { historyState } = useSharedPluginState(api, ['history']);

  const handleUndo = () => {
    forceFocus(editorView, api)(undoFromToolbar);
  };

  const handleRedo = () => {
    forceFocus(editorView, api)(redoFromToolbar);
  };
  const labelUndo = formatMessage(undoRedoMessages.undo);
  const labelRedo = formatMessage(undoRedoMessages.redo);

  const { canUndo, canRedo } = historyState ?? {};

  return (
    <span css={buttonGroupStyle}>
      <ToolbarButton
        buttonId={TOOLBAR_BUTTON.UNDO}
        spacing={isReducedSpacing ? 'none' : 'default'}
        onClick={handleUndo}
        disabled={!canUndo || disabled}
        aria-label={tooltip(undoKeymap, labelUndo)}
        aria-keyshortcuts={getAriaKeyshortcuts(undoKeymap)}
        title={<ToolTipContent description={labelUndo} keymap={undoKeymap} />}
        iconBefore={<UndoIcon label="" />}
        testId="ak-editor-toolbar-button-undo"
      />
      <ToolbarButton
        spacing={isReducedSpacing ? 'none' : 'default'}
        buttonId={TOOLBAR_BUTTON.REDO}
        onClick={handleRedo}
        disabled={!canRedo || disabled}
        title={<ToolTipContent description={labelRedo} keymap={redoKeymap} />}
        iconBefore={<RedoIcon label="" />}
        testId="ak-editor-toolbar-button-redo"
        aria-label={tooltip(redoKeymap, labelRedo)}
        aria-keyshortcuts={getAriaKeyshortcuts(redoKeymap)}
      />
      <span css={separatorStyles} />
    </span>
  );
};

export default injectIntl(ToolbarUndoRedo);
