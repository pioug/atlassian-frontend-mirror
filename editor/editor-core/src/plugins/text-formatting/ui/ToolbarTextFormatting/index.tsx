import React, { PureComponent } from 'react';

import { EditorView } from 'prosemirror-view';
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl';

import BoldIcon from '@atlaskit/icon/glyph/editor/bold';
import ItalicIcon from '@atlaskit/icon/glyph/editor/italic';

import { withAnalytics } from '../../../../analytics';
import { toggleBold, toggleItalic, ToolTipContent } from '../../../../keymaps';
import { ButtonGroup } from '../../../../ui/styles';
import ToolbarButton from '../../../../ui/ToolbarButton';
import { INPUT_METHOD } from '../../../analytics';
import {
  toggleEmWithAnalytics,
  toggleStrongWithAnalytics,
} from '../../commands/text-formatting';
import { TextFormattingState } from '../../pm-plugins/main';

export const messages = defineMessages({
  bold: {
    id: 'fabric.editor.bold',
    defaultMessage: 'Bold',
    description:
      'This refers to bold or “strong” formatting, indicates that its contents have strong importance, seriousness, or urgency.',
  },
  italic: {
    id: 'fabric.editor.italic',
    defaultMessage: 'Italic',
    description: 'This refers to italics or emphasized formatting.',
  },
});

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

    const labelBold = formatMessage(messages.bold);
    const labelItalic = formatMessage(messages.italic);
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

  private handleBoldClick = withAnalytics(
    'atlassian.editor.format.strong.button',
    () => {
      const { strongDisabled } = this.props.textFormattingState;
      if (!strongDisabled) {
        const { state, dispatch } = this.props.editorView;
        return toggleStrongWithAnalytics({ inputMethod: INPUT_METHOD.TOOLBAR })(
          state,
          dispatch,
        );
      }
      return false;
    },
  );

  private handleItalicClick = withAnalytics(
    'atlassian.editor.format.em.button',
    (): boolean => {
      const { emDisabled } = this.props.textFormattingState;
      if (!emDisabled) {
        const { state, dispatch } = this.props.editorView;
        return toggleEmWithAnalytics({ inputMethod: INPUT_METHOD.TOOLBAR })(
          state,
          dispatch,
        );
      }
      return false;
    },
  );
}

export default injectIntl(ToolbarTextFormatting);
