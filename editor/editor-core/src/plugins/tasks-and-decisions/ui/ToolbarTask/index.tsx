import React from 'react';
import { PureComponent } from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { EditorView } from 'prosemirror-view';
import TaskIcon from '@atlaskit/icon/glyph/editor/task';
import { withAnalytics } from '../../../../analytics';
import ToolbarButton from '../../../../ui/ToolbarButton';
import { insertTaskDecision } from '../../commands';
import { messages } from '../../../insert-block/ui/ToolbarInsertBlock/messages';

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
        onClick={this.handleInsertTask}
        disabled={disabled || isDisabled}
        spacing={isReducedSpacing ? 'none' : 'default'}
        title={`${label} []`}
        iconBefore={<TaskIcon label={label} />}
      />
    );
  }

  private handleInsertTask = withAnalytics(
    'atlassian.fabric.action.trigger.button',
    (): boolean => {
      const { editorView } = this.props;
      if (!editorView) {
        return false;
      }
      insertTaskDecision(editorView, 'taskList')(
        editorView.state,
        editorView.dispatch,
      );
      return true;
    },
  );
}

export default injectIntl(ToolbarTask);
