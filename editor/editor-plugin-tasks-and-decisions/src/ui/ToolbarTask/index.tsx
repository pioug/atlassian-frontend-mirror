import React from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { TOOLBAR_BUTTON, ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import TaskIcon from '@atlaskit/icon/glyph/editor/task';

import { insertTaskDecisionCommand } from '../../commands';
import type { TasksAndDecisionsPlugin } from '../../types';

export interface Props {
  editorView?: EditorView;
  isDisabled?: boolean;
  isReducedSpacing?: boolean;
  editorAPI: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined;
}

export interface State {
  disabled: boolean;
}

const ToolbarTask = ({
  isDisabled,
  isReducedSpacing,
  intl: { formatMessage },
  editorAPI,
  editorView,
}: Props & WrappedComponentProps) => {
  const label = formatMessage(messages.action);

  const handleInsertTask = () => {
    if (!editorView) {
      return false;
    }
    insertTaskDecisionCommand(editorAPI?.analytics?.actions)('taskList')(
      editorView.state,
      editorView.dispatch,
    );
    return true;
  };

  return (
    <ToolbarButton
      buttonId={TOOLBAR_BUTTON.TASK_LIST}
      onClick={handleInsertTask}
      disabled={isDisabled}
      spacing={isReducedSpacing ? 'none' : 'default'}
      title={`${label} []`}
      iconBefore={<TaskIcon label={label} />}
    />
  );
};

export default injectIntl(ToolbarTask);
