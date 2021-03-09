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
import { undoFromToolbar, redoFromToolbar } from '../../commands';

export interface Props {
  undoDisabled?: boolean;
  redoDisabled?: boolean;
  disabled?: boolean;
  isReducedSpacing?: boolean;
  historyState: HistoryPluginState;
  editorView: EditorView;
}

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
      undoFromToolbar(editorView.state, editorView.dispatch);
    };
    const handleRedo = () => {
      redoFromToolbar(editorView.state, editorView.dispatch);
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
