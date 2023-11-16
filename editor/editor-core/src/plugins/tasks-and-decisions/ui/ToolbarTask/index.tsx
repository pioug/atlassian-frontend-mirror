import React, { PureComponent } from 'react';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import TaskIcon from '@atlaskit/icon/glyph/editor/task';

import { TOOLBAR_BUTTON, ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { insertTaskDecisionCommand } from '../../commands';
import type { TaskAndDecisionsPlugin } from '../../types';

export interface Props {
  editorView?: EditorView;
  isDisabled?: boolean;
  isReducedSpacing?: boolean;
  editorAPI: ExtractInjectionAPI<TaskAndDecisionsPlugin> | undefined;
}

export interface State {
  disabled: boolean;
}

export class ToolbarTask extends PureComponent<
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
    const { editorView, editorAPI } = this.props;
    if (!editorView) {
      return false;
    }
    insertTaskDecisionCommand(editorAPI?.analytics?.actions)('taskList')(
      editorView.state,
      editorView.dispatch,
    );
    return true;
  };
}

export default injectIntl(ToolbarTask);
