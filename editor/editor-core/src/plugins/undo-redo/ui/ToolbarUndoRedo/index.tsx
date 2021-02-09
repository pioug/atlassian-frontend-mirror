import React, { PureComponent } from 'react';

import { EditorView } from 'prosemirror-view';
import { InjectedIntlProps, injectIntl } from 'react-intl';

import UndoIcon from '@atlaskit/icon/glyph/undo';
import { undo as undoKeymap, ToolTipContent } from '../../../../keymaps';

import { ButtonGroup, Separator } from '../../../../ui/styles';
import ToolbarButton from '../../../../ui/ToolbarButton';
import { messages } from '../../messages';

export interface Props {
  editorView: EditorView;
  undoDisabled?: boolean;
  disabled?: boolean;
  isSmall?: boolean;
  isSeparator?: boolean;
  isReducedSpacing?: boolean;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  handleUndo(): void;
}

class ToolbarUndoRedo extends PureComponent<Props & InjectedIntlProps> {
  render() {
    const {
      disabled,
      isReducedSpacing,
      undoDisabled,
      intl: { formatMessage },
      handleUndo,
    } = this.props;

    const labelUndo = formatMessage(messages.undo);

    return (
      <ButtonGroup width={isReducedSpacing ? 'small' : 'large'}>
        <ToolbarButton
          spacing={isReducedSpacing ? 'none' : 'default'}
          onClick={handleUndo}
          disabled={undoDisabled || disabled}
          title={<ToolTipContent description={labelUndo} keymap={undoKeymap} />}
          iconBefore={<UndoIcon label={labelUndo} />}
        />
        <Separator />
      </ButtonGroup>
    );
  }
}

export default injectIntl(ToolbarUndoRedo);
