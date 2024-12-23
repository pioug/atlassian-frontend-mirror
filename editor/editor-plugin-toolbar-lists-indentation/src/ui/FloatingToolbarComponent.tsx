import React from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI, FeatureFlags } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { getIndentationButtonsState } from '../pm-plugins/indentation-buttons';
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
}: FloatingToolbarComponentProps) {
	const { listState, indentationState, taskDecisionState } = useSharedPluginState(
		pluginInjectionApi,
		['list', 'indentation', 'taskDecision'],
	);

	const toolbarListsIndentationState = getIndentationButtonsState(
		editorView.state,
		allowHeadingAndParagraphIndentation,
		taskDecisionState,
		indentationState,
		pluginInjectionApi?.list?.actions.isInsideListItem,
	);

	if (!listState) {
		return null;
	}
	return (
		<ToolbarListsIndentation
			featureFlags={featureFlags}
			isSmall={FloatingToolbarSettings.isSmall}
			isReducedSpacing={FloatingToolbarSettings.isToolbarReducedSpacing}
			disabled={FloatingToolbarSettings.disabled}
			editorView={editorView}
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			bulletListActive={listState!.bulletListActive}
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			bulletListDisabled={listState!.bulletListDisabled}
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			orderedListActive={listState!.orderedListActive}
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			orderedListDisabled={listState!.orderedListDisabled}
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
