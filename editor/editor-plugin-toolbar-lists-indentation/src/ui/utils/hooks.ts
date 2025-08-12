import type { EditorState } from 'prosemirror-state';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import { getIndentationButtonsState } from '../../pm-plugins/indentation-buttons';
import type { ToolbarListsIndentationPlugin } from '../../toolbarListsIndentationPluginType';

type UseIndentationStateProps = {
	api?: ExtractInjectionAPI<ToolbarListsIndentationPlugin>;
	allowHeadingAndParagraphIndentation: boolean;
	state?: EditorState;
};

export const useIndentationState = ({
	api,
	allowHeadingAndParagraphIndentation,
	state,
}: UseIndentationStateProps) => {
	const { isIndentationAllowed, indentDisabled, outdentDisabled } =
		useSharedPluginStateWithSelector(api, ['indentation'], (states) => ({
			isIndentationAllowed: states.indentationState?.isIndentationAllowed,
			outdentDisabled: states.indentationState?.outdentDisabled,
			indentDisabled: states.indentationState?.indentDisabled,
		}));
	const {
		isInsideTask,
		indentDisabled: taskIndentDisabled,
		outdentDisabled: taskOutdentDisabled,
	} = useSharedPluginStateWithSelector(api, ['taskDecision'], (states) => ({
		isInsideTask: states.taskDecisionState?.isInsideTask,
		outdentDisabled: states.taskDecisionState?.outdentDisabled,
		indentDisabled: states.taskDecisionState?.indentDisabled,
	}));

	if (!state) {
		return undefined;
	}

	return getIndentationButtonsState(
		state,
		allowHeadingAndParagraphIndentation,
		{
			isInsideTask: isInsideTask ?? false,
			indentDisabled: taskIndentDisabled ?? false,
			outdentDisabled: taskOutdentDisabled ?? false,
		},
		{
			isIndentationAllowed,
			indentDisabled,
			outdentDisabled,
		},
		api?.list.actions.isInsideListItem,
	);
};
