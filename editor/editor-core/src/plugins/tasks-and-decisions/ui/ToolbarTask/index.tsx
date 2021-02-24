import React, { PureComponent } from 'react';

import { EditorView } from 'prosemirror-view';
import { InjectedIntlProps, injectIntl } from 'react-intl';

import TaskIcon from '@atlaskit/icon/glyph/editor/task';

import ToolbarButton, { TOOLBAR_BUTTON } from '../../../../ui/ToolbarButton';
import { messages } from '../../../insert-block/ui/ToolbarInsertBlock/messages';
import { insertTaskDecision } from '../../commands';

export interface Props {
  editorView?: EditorView;
  isDisabled?: boolean;
  isReducedSpacing?: boolean;
}

export interface State {
  disabled: boolean;
}

export class ToolbarTask extends PureComponent<
  Props & InjectedIntlProps,
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

    const label = formatMessage(messages.action);

    return (
      <ToolbarButton
        buttonId={TOOLBAR_BUTTON.TASK_LIST}
        onClick={this.handleInsertTask}
        disabled={disabled || isDisabled}
        spacing={isReducedSpacing ? 'none' : 'default'}
        title={`${label} []`}
        iconBefore={<TaskIcon label={label} />}
      />
    );
  }

  private handleInsertTask = (): boolean => {
    const { editorView } = this.props;
    if (!editorView) {
      return false;
    }
    insertTaskDecision(editorView, 'taskList')(
      editorView.state,
      editorView.dispatch,
    );
    return true;
  };
}

export default injectIntl(ToolbarTask);
