import React from 'react';
import { PureComponent } from 'react';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import MentionIcon from '@atlaskit/icon/glyph/editor/mention';
import ToolbarButton, { TOOLBAR_BUTTON } from '../../../../ui/ToolbarButton';
import { INPUT_METHOD } from '../../../analytics';
import { createTypeAheadTools } from '../../../type-ahead/api';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';
import { messages } from '../../messages';

interface Props {
  editorView?: EditorView;
  isDisabled?: boolean;
  testId?: string;
}

class ToolbarMention extends PureComponent<Props & WrappedComponentProps> {
  render() {
    const mentionStringTranslated = this.props.intl.formatMessage(
      messages.mentionsIconLabel,
    );

    return (
      <ToolbarButton
        testId={this.props.testId}
        buttonId={TOOLBAR_BUTTON.MENTION}
        spacing="none"
        onClick={this.handleInsertMention}
        disabled={this.props.isDisabled}
        title={mentionStringTranslated + '@'}
        iconBefore={<MentionIcon label={mentionStringTranslated} />}
      />
    );
  }

  private handleInsertMention = (): boolean => {
    if (!this.props.editorView) {
      return false;
    }

    createTypeAheadTools(this.props.editorView).openMention(
      INPUT_METHOD.INSERT_MENU,
    );
    return true;
  };
}

export default injectIntl(ToolbarMention);
