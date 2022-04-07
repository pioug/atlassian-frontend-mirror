import React, { PureComponent } from 'react';

import { EditorView } from 'prosemirror-view';
import { WrappedComponentProps, injectIntl } from 'react-intl-next';

import DecisionIcon from '@atlaskit/icon/glyph/editor/decision';

import ToolbarButton, { TOOLBAR_BUTTON } from '../../../../ui/ToolbarButton';
import { messages } from '../../../insert-block/ui/ToolbarInsertBlock/messages';
import { insertTaskDecisionCommand } from '../../commands';

export interface Props {
  editorView?: EditorView;
  isDisabled?: boolean;
  isReducedSpacing?: boolean;
}

export interface State {
  disabled: boolean;
}

export class ToolbarDecision extends PureComponent<
  Props & WrappedComponentProps,
  State
> {
  state: State = { disabled: false };

  render() {
    const { disabled } = this.state;
    const {
      isDisabled,
      isReducedSpacing,
      intl: { formatMessage },
    } = this.props;

    const label = formatMessage(messages.decision);

    return (
      <ToolbarButton
        buttonId={TOOLBAR_BUTTON.DECISION_LIST}
        onClick={this.handleInsertDecision}
        disabled={disabled || isDisabled}
        spacing={isReducedSpacing ? 'none' : 'default'}
        title={`${label} <>`}
        iconBefore={<DecisionIcon label={label} />}
      />
    );
  }

  private handleInsertDecision = (): boolean => {
    const { editorView } = this.props;
    if (!editorView) {
      return false;
    }
    insertTaskDecisionCommand('decisionList')(
      editorView.state,
      editorView.dispatch,
    );
    return true;
  };
}

export default injectIntl(ToolbarDecision);
