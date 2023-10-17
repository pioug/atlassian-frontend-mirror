import React, { PureComponent } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { TOOLBAR_BUTTON, ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import MentionIcon from '@atlaskit/icon/glyph/editor/mention';

import { messages } from '../../messages';

interface Props {
  onInsertMention: () => void;
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

    this.props.onInsertMention();
    return true;
  };
}

export default injectIntl(ToolbarMention);
