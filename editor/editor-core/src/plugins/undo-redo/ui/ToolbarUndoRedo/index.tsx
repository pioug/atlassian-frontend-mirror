import React, { PureComponent } from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { EditorView } from 'prosemirror-view';
import UndoIcon from '@atlaskit/icon/glyph/undo';
import RedoIcon from '@atlaskit/icon/glyph/redo';

import {
  undo as undoKeymap,
  redo as redoKeymap,
  ToolTipContent,
} from '../../../../keymaps';
import { ButtonGroup, Separator } from '../../../../ui/styles';
import ToolbarButton, { TOOLBAR_BUTTON } from '../../../../ui/ToolbarButton';
import { messages } from '../../messages';
import { HistoryPluginState } from '../../../history/types';
import { createTypeAheadTools } from '../../../type-ahead/api';
import { undoFromToolbar, redoFromToolbar } from '../../commands';
import { Command } from '../../../../types/command';

export interface Props {
  undoDisabled?: boolean;
  redoDisabled?: boolean;
  disabled?: boolean;
  isReducedSpacing?: boolean;
  historyState: HistoryPluginState;
  editorView: EditorView;
}

const closeTypeAheadAndRunCommand = (editorView?: EditorView) => (
  command: Command,
) => {
  if (!editorView) {
    return;
  }
  const tool = createTypeAheadTools(editorView);

  if (tool.isOpen()) {
    tool.close({
      attachCommand: command,
      insertCurrentQueryAsRawText: false,
    });
  } else {
    command(editorView.state, editorView.dispatch);
  }
};
const forceFocus = (editorView: EditorView) => (command: Command) => {
  closeTypeAheadAndRunCommand(editorView)(command);

  if (!editorView.hasFocus()) {
    editorView.focus();
  }
};
export class ToolbarUndoRedo extends PureComponent<Props & InjectedIntlProps> {
  render() {
    const {
      disabled,
      isReducedSpacing,
      historyState,
      editorView,
      intl: { formatMessage },
    } = this.props;

    const handleUndo = () => {
      forceFocus(editorView)(undoFromToolbar);
    };

    const handleRedo = () => {
      forceFocus(editorView)(redoFromToolbar);
    };
    const labelUndo = formatMessage(messages.undo);
    const labelRedo = formatMessage(messages.redo);

    const { canUndo, canRedo } = historyState;

    return (
      <ButtonGroup width={isReducedSpacing ? 'small' : 'large'}>
        <ToolbarButton
          buttonId={TOOLBAR_BUTTON.UNDO}
          spacing={isReducedSpacing ? 'none' : 'default'}
          onClick={handleUndo}
          disabled={!canUndo || disabled}
          title={<ToolTipContent description={labelUndo} keymap={undoKeymap} />}
          iconBefore={<UndoIcon label={labelUndo} />}
          testId="ak-editor-toolbar-button-undo"
        />
        <ToolbarButton
          spacing={isReducedSpacing ? 'none' : 'default'}
          buttonId={TOOLBAR_BUTTON.REDO}
          onClick={handleRedo}
          disabled={!canRedo || disabled}
          title={<ToolTipContent description={labelRedo} keymap={redoKeymap} />}
          iconBefore={<RedoIcon label={labelRedo} />}
          testId="ak-editor-toolbar-button-redo"
        />
        <Separator />
      </ButtonGroup>
    );
  }
}

export default injectIntl(ToolbarUndoRedo);
