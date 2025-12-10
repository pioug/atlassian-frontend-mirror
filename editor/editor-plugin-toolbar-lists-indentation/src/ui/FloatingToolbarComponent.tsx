import React, { useState } from 'react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI, FeatureFlags } from '@atlaskit/editor-common/types';
import { usePluginStateEffect } from '@atlaskit/editor-common/use-plugin-state-effect';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import {
	getIndentationButtonsState,
	type TaskDecisionState,
} from '../pm-plugins/indentation-buttons';
import type { ToolbarListsIndentationPlugin } from '../toolbarListsIndentationPluginType';
import { ToolbarType } from '../types';

import ToolbarListsIndentation from './index';

type FloatingToolbarComponentProps = {
	allowHeadingAndParagraphIndentation: boolean;
	editorView: EditorView;
	featureFlags: FeatureFlags;
	pluginInjectionApi?: ExtractInjectionAPI<ToolbarListsIndentationPlugin> | undefined;
	showIndentationButtons?: boolean;
};

const FloatingToolbarSettings = {
	disabled: false,
	isToolbarReducedSpacing: true,
	isSmall: true,
};

export function FloatingToolbarComponent({
	featureFlags,
	editorView,
	showIndentationButtons,
	pluginInjectionApi,
	allowHeadingAndParagraphIndentation,
}: FloatingToolbarComponentProps): React.JSX.Element | null {
	const {
		bulletListActive,
		bulletListDisabled,
		orderedListActive,
		orderedListDisabled,
		isIndentationAllowed,
		indentDisabled,
		outdentDisabled,
	} = useSharedPluginStateWithSelector(pluginInjectionApi, ['list', 'indentation'], (states) => ({
		bulletListActive: states.listState?.bulletListActive,
		bulletListDisabled: states.listState?.bulletListDisabled,
		orderedListActive: states.listState?.orderedListActive,
		orderedListDisabled: states.listState?.orderedListDisabled,
		isIndentationAllowed: states.indentationState?.isIndentationAllowed,
		indentDisabled: states.indentationState?.indentDisabled,
		outdentDisabled: states.indentationState?.outdentDisabled,
		// decorationSet is required to re-render PrimaryToolbarComponent component, so that the toolbar states updates regularly
		decorationSet: states.listState?.decorationSet,
	}));
	const [taskDecisionState, setTaskDecisionState] = useState<TaskDecisionState | undefined>();
	usePluginStateEffect(
		pluginInjectionApi,
		['taskDecision'],
		({ taskDecisionState: newTaskDecisionState }) => {
			if (
				newTaskDecisionState?.outdentDisabled !== taskDecisionState?.outdentDisabled ||
				newTaskDecisionState?.indentDisabled !== taskDecisionState?.indentDisabled ||
				newTaskDecisionState?.isInsideTask !== taskDecisionState?.isInsideTask
			) {
				setTaskDecisionState({
					isInsideTask: Boolean(newTaskDecisionState?.isInsideTask),
					indentDisabled: Boolean(newTaskDecisionState?.indentDisabled),
					outdentDisabled: Boolean(newTaskDecisionState?.outdentDisabled),
				});
			}
		},
	);

	const toolbarListsIndentationState = getIndentationButtonsState(
		editorView.state,
		allowHeadingAndParagraphIndentation,
		taskDecisionState,
		{
			isIndentationAllowed,
			indentDisabled,
			outdentDisabled,
		},
		pluginInjectionApi?.list?.actions.isInsideListItem,
	);

	if (
		bulletListActive === undefined ||
		bulletListDisabled === undefined ||
		orderedListActive === undefined ||
		orderedListDisabled === undefined
	) {
		return null;
	}

	return (
		<ToolbarListsIndentation
			featureFlags={featureFlags}
			isSmall={FloatingToolbarSettings.isSmall}
			isReducedSpacing={
				editorExperiment('platform_editor_controls', 'variant1')
					? false
					: FloatingToolbarSettings.isToolbarReducedSpacing
			}
			disabled={FloatingToolbarSettings.disabled}
			editorView={editorView}
			bulletListActive={bulletListActive}
			bulletListDisabled={bulletListDisabled}
			orderedListActive={orderedListActive}
			orderedListDisabled={orderedListDisabled}
			showIndentationButtons={!!showIndentationButtons}
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			indentDisabled={toolbarListsIndentationState!.indentDisabled}
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			outdentDisabled={toolbarListsIndentationState!.outdentDisabled}
			indentationStateNode={toolbarListsIndentationState?.node}
			pluginInjectionApi={pluginInjectionApi}
			toolbarType={ToolbarType.FLOATING}
		/>
	);
}
