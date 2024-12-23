import React from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { ToolbarSize } from '@atlaskit/editor-common/types';
import type {
	Command,
	ExtractInjectionAPI,
	FeatureFlags,
	FloatingToolbarCustom,
	ToolbarUIComponentFactory,
	ToolbarUiComponentFactoryParams,
} from '@atlaskit/editor-common/types';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { getIndentationButtonsState } from './pm-plugins/indentation-buttons';
import type { ToolbarListsIndentationPlugin } from './toolbarListsIndentationPluginType';
import { ToolbarType } from './types';
import ToolbarListsIndentation from './ui';
import { FloatingToolbarComponent } from './ui/FloatingToolbarComponent';

export const toolbarListsIndentationPlugin: ToolbarListsIndentationPlugin = ({ config, api }) => {
	const { showIndentationButtons = false, allowHeadingAndParagraphIndentation = false } =
		config ?? {};
	const featureFlags = api?.featureFlags?.sharedState.currentState() || {};
	const primaryToolbarComponent: ToolbarUIComponentFactory = ({
		editorView,
		popupsMountPoint,
		popupsBoundariesElement,
		popupsScrollableElement,
		toolbarSize,
		disabled,
		isToolbarReducedSpacing,
	}) => {
		const isSmall = toolbarSize < ToolbarSize.L;

		return (
			<PrimaryToolbarComponent
				featureFlags={featureFlags}
				popupsMountPoint={popupsMountPoint}
				popupsBoundariesElement={popupsBoundariesElement}
				popupsScrollableElement={popupsScrollableElement}
				isSmall={isSmall}
				isToolbarReducedSpacing={isToolbarReducedSpacing}
				disabled={disabled}
				editorView={editorView}
				showIndentationButtons={showIndentationButtons}
				pluginInjectionApi={api}
				allowHeadingAndParagraphIndentation={allowHeadingAndParagraphIndentation}
			/>
		);
	};
	api?.primaryToolbar?.actions.registerComponent({
		name: 'toolbarListsIndentation',
		component: primaryToolbarComponent,
	});

	return {
		name: 'toolbarListsIndentation',

		pluginsOptions: {
			selectionToolbar() {
				if (editorExperiment('contextual_formatting_toolbar', true, { exposure: true })) {
					const toolbarCustom: FloatingToolbarCustom<Command> = {
						type: 'custom',
						render: (view) => {
							if (!view) {
								return;
							}

							return (
								<FloatingToolbarComponent
									editorView={view}
									featureFlags={featureFlags}
									pluginInjectionApi={api}
									showIndentationButtons={showIndentationButtons}
									allowHeadingAndParagraphIndentation={allowHeadingAndParagraphIndentation}
								/>
							);
						},
						fallback: [],
					};

					return {
						rank: 3,
						isToolbarAbove: true,
						items: [toolbarCustom],
						pluginName: 'toolbarListsIndentation',
					};
				} else {
					return undefined;
				}
			},
		},

		primaryToolbarComponent: !api?.primaryToolbar ? primaryToolbarComponent : undefined,
	};
};

type PrimaryToolbarComponentProps = Pick<
	ToolbarUiComponentFactoryParams,
	| 'editorView'
	| 'popupsMountPoint'
	| 'popupsBoundariesElement'
	| 'popupsScrollableElement'
	| 'disabled'
	| 'isToolbarReducedSpacing'
> & {
	featureFlags: FeatureFlags;
	isSmall: boolean;
	showIndentationButtons?: boolean;
	pluginInjectionApi: ExtractInjectionAPI<typeof toolbarListsIndentationPlugin> | undefined;
	allowHeadingAndParagraphIndentation: boolean;
};

export function PrimaryToolbarComponent({
	featureFlags,
	popupsMountPoint,
	popupsBoundariesElement,
	popupsScrollableElement,
	isSmall,
	isToolbarReducedSpacing,
	disabled,
	editorView,
	showIndentationButtons,
	pluginInjectionApi,
	allowHeadingAndParagraphIndentation,
}: PrimaryToolbarComponentProps) {
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
			isSmall={isSmall}
			isReducedSpacing={isToolbarReducedSpacing}
			disabled={disabled}
			editorView={editorView}
			popupsMountPoint={popupsMountPoint}
			popupsBoundariesElement={popupsBoundariesElement}
			popupsScrollableElement={popupsScrollableElement}
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
			toolbarType={ToolbarType.PRIMARY}
		/>
	);
}
