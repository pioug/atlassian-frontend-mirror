import React, { PureComponent } from 'react';

import { EditorView } from 'prosemirror-view';
import { InjectedIntlProps, injectIntl } from 'react-intl';

import BoldIcon from '@atlaskit/icon/glyph/editor/bold';
import ItalicIcon from '@atlaskit/icon/glyph/editor/italic';

import { toggleBold, toggleItalic, ToolTipContent } from '../../../../keymaps';
import { ButtonGroup } from '../../../../ui/styles';
import ToolbarButton from '../../../../ui/ToolbarButton';
import { INPUT_METHOD } from '../../../analytics';
import {
  toggleEmWithAnalytics,
  toggleStrongWithAnalytics,
} from '../../commands/text-formatting';
import { TextFormattingState } from '../../pm-plugins/main';
import { toolbarMessages } from './toolbar-messages';

export interface Props {
  editorView: EditorView;
  textFormattingState: TextFormattingState;
  disabled?: boolean;
  isReducedSpacing?: boolean;
}

class ToolbarTextFormatting extends PureComponent<Props & InjectedIntlProps> {
  render() {
    const {
      disabled,
      isReducedSpacing,
      textFormattingState,
      intl: { formatMessage },
    } = this.props;
    const {
      strongHidden,
      strongActive,
      strongDisabled,
      emHidden,
      emActive,
      emDisabled,
    } = textFormattingState;

    const labelBold = formatMessage(toolbarMessages.bold);
    const labelItalic = formatMessage(toolbarMessages.italic);
    return (
      <ButtonGroup width={isReducedSpacing ? 'small' : 'large'}>
        {strongHidden ? null : (
          <ToolbarButton
            spacing={isReducedSpacing ? 'none' : 'default'}
            onClick={this.handleBoldClick}
            selected={strongActive}
            disabled={disabled || strongDisabled}
            title={
              <ToolTipContent description={labelBold} keymap={toggleBold} />
            }
            iconBefore={<BoldIcon label={labelBold} />}
          />
        )}

        {emHidden ? null : (
          <ToolbarButton
            spacing={isReducedSpacing ? 'none' : 'default'}
            onClick={this.handleItalicClick}
            selected={emActive}
            disabled={disabled || emDisabled}
            title={
              <ToolTipContent description={labelItalic} keymap={toggleItalic} />
            }
            iconBefore={<ItalicIcon label={labelItalic} />}
          />
        )}
      </ButtonGroup>
    );
  }

  private handleBoldClick = () => {
    const { strongDisabled } = this.props.textFormattingState;
    if (!strongDisabled) {
      const { state, dispatch } = this.props.editorView;
      return toggleStrongWithAnalytics({ inputMethod: INPUT_METHOD.TOOLBAR })(
        state,
        dispatch,
      );
    }
    return false;
  };

  private handleItalicClick = (): boolean => {
    const { emDisabled } = this.props.textFormattingState;
    if (!emDisabled) {
      const { state, dispatch } = this.props.editorView;
      return toggleEmWithAnalytics({ inputMethod: INPUT_METHOD.TOOLBAR })(
        state,
        dispatch,
      );
    }
    return false;
  };
}

export default injectIntl(ToolbarTextFormatting);
