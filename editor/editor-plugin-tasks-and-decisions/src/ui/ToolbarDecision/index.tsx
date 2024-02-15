import React from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { TOOLBAR_BUTTON, ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import DecisionIcon from '@atlaskit/icon/glyph/editor/decision';

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

const ToolbarDecision = ({
  isDisabled,
  isReducedSpacing,
  intl: { formatMessage },
  editorView,
  editorAPI,
}: Props & WrappedComponentProps) => {
  const label = formatMessage(messages.decision);

  const handleInsertDecision = () => {
    if (!editorView) {
      return false;
    }
    const getContextIdentifier = () =>
      editorAPI?.contextIdentifier?.sharedState.currentState()
        ?.contextIdentifierProvider;

    insertTaskDecisionCommand(
      editorAPI?.analytics?.actions,
      getContextIdentifier,
    )('decisionList')(editorView.state, editorView.dispatch);
    return true;
  };

  return (
    <ToolbarButton
      buttonId={TOOLBAR_BUTTON.DECISION_LIST}
      onClick={handleInsertDecision}
      disabled={isDisabled}
      spacing={isReducedSpacing ? 'none' : 'default'}
      title={`${label} <>`}
      aria-keyshortcuts="Shift+, Shift+. space"
      iconBefore={<DecisionIcon label={label} />}
    />
  );
};

export default injectIntl(ToolbarDecision);
