import React from 'react';

import type { WithIntlProps, WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { TOOLBAR_ACTION_SUBJECT_ID as TOOLBAR_BUTTON } from '@atlaskit/editor-common/analytics/types/toolbar-button';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages/insert-block';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import ToolbarButton from '@atlaskit/editor-common/ui-menu/ToolbarButton';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import TaskIcon from '@atlaskit/icon/core/checkbox-checked';

import { insertTaskDecisionCommand } from '../../pm-plugins/insert-commands';
import type { TasksAndDecisionsPlugin } from '../../tasksAndDecisionsPluginType';

export interface Props {
	editorAPI: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined;
	editorView?: EditorView;
	isDisabled?: boolean;
	isReducedSpacing?: boolean;
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
		const getContextIdentifier = () =>
			editorAPI?.contextIdentifier?.sharedState.currentState()?.contextIdentifierProvider;
		insertTaskDecisionCommand(editorAPI?.analytics?.actions, getContextIdentifier)('taskList')(
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

// eslint-disable-next-line @typescript-eslint/no-restricted-types
const _default_1: React.FC<WithIntlProps<Props & WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<Props & WrappedComponentProps>;
} = injectIntl(ToolbarTask);
export default _default_1;
