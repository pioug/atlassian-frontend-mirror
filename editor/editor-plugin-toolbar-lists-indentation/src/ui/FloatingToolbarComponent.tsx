import React, { useState } from 'react';

import {
	useSharedPluginState,
	sharedPluginStateHookMigratorFactory,
} from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI, FeatureFlags } from '@atlaskit/editor-common/types';
import { usePluginStateEffect } from '@atlaskit/editor-common/use-plugin-state-effect';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
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

const useSharedState = sharedPluginStateHookMigratorFactory(
	(api: ExtractInjectionAPI<ToolbarListsIndentationPlugin> | undefined) => {
		const bulletListActive = useSharedPluginStateSelector(api, 'list.bulletListActive');
		const bulletListDisabled = useSharedPluginStateSelector(api, 'list.bulletListDisabled');
		const orderedListActive = useSharedPluginStateSelector(api, 'list.orderedListActive');
		const orderedListDisabled = useSharedPluginStateSelector(api, 'list.orderedListDisabled');
		const isIndentationAllowed = useSharedPluginStateSelector(
			api,
			'indentation.isIndentationAllowed',
		);
		const indentDisabled = useSharedPluginStateSelector(api, 'indentation.indentDisabled');
		const outdentDisabled = useSharedPluginStateSelector(api, 'indentation.outdentDisabled');
		return {
			bulletListActive,
			bulletListDisabled,
			orderedListActive,
			orderedListDisabled,
			isIndentationAllowed,
			indentDisabled,
			outdentDisabled,
		};
	},
	(api: ExtractInjectionAPI<ToolbarListsIndentationPlugin> | undefined) => {
		const { listState, indentationState } = useSharedPluginState(api, ['list', 'indentation']);
		return {
			bulletListActive: listState?.bulletListActive,
			bulletListDisabled: listState?.bulletListDisabled,
			orderedListActive: listState?.orderedListActive,
			orderedListDisabled: listState?.orderedListDisabled,
			isIndentationAllowed: indentationState?.isIndentationAllowed,
			indentDisabled: indentationState?.indentDisabled,
			outdentDisabled: indentationState?.outdentDisabled,
		};
	},
);

export function FloatingToolbarComponent({
	featureFlags,
	editorView,
	showIndentationButtons,
	pluginInjectionApi,
	allowHeadingAndParagraphIndentation,
}: FloatingToolbarComponentProps) {
	const {
		bulletListActive,
		bulletListDisabled,
		orderedListActive,
		orderedListDisabled,
		isIndentationAllowed,
		indentDisabled,
		outdentDisabled,
	} = useSharedState(pluginInjectionApi);
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
