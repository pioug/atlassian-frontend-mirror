import React, { useState } from 'react';

import {
	useSharedPluginState,
	sharedPluginStateHookMigratorFactory,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import type {
	Command,
	ExtractInjectionAPI,
	FeatureFlags,
	FloatingToolbarCustom,
	ToolbarUIComponentFactory,
	ToolbarUiComponentFactoryParams,
} from '@atlaskit/editor-common/types';
import { ToolbarSize } from '@atlaskit/editor-common/types';
import { usePluginStateEffect } from '@atlaskit/editor-common/use-plugin-state-effect';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import {
	getIndentationButtonsState,
	type TaskDecisionState,
} from './pm-plugins/indentation-buttons';
import type { ToolbarListsIndentationPlugin } from './toolbarListsIndentationPluginType';
import { ToolbarType } from './types';
import ToolbarListsIndentation from './ui';
import { FloatingToolbarComponent } from './ui/FloatingToolbarComponent';
import { getToolbarComponents } from './ui/toolbar-components';

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
		return (
			<PrimaryToolbarComponent
				featureFlags={featureFlags}
				popupsMountPoint={popupsMountPoint}
				popupsBoundariesElement={popupsBoundariesElement}
				popupsScrollableElement={popupsScrollableElement}
				isSmall={toolbarSize < ToolbarSize.L}
				isToolbarReducedSpacing={isToolbarReducedSpacing}
				disabled={disabled}
				editorView={editorView}
				showIndentationButtons={showIndentationButtons}
				pluginInjectionApi={api}
				allowHeadingAndParagraphIndentation={allowHeadingAndParagraphIndentation}
			/>
		);
	};

	if (expValEquals('platform_editor_toolbar_aifc', 'isEnabled', true)) {
		api?.toolbar?.actions.registerComponents(
			getToolbarComponents({ api, showIndentationButtons, allowHeadingAndParagraphIndentation }),
		);
	} else {
		api?.primaryToolbar?.actions.registerComponent({
			name: 'toolbarListsIndentation',
			component: primaryToolbarComponent,
		});
	}

	return {
		name: 'toolbarListsIndentation',

		pluginsOptions: {
			...(!expValEquals('platform_editor_toolbar_aifc', 'isEnabled', true) && {
				selectionToolbar() {
					const toolbarDocking = fg('platform_editor_use_preferences_plugin')
						? api?.userPreferences?.sharedState.currentState()?.preferences.toolbarDockingPosition
						: api?.selectionToolbar?.sharedState?.currentState()?.toolbarDocking;
					if (
						toolbarDocking === 'none' &&
						editorExperiment('platform_editor_controls', 'variant1', { exposure: true })
					) {
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
			}),
		},
		primaryToolbarComponent:
			!expValEquals('platform_editor_toolbar_aifc', 'isEnabled', true) && !api?.primaryToolbar
				? primaryToolbarComponent
				: undefined,
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

const useSharedState = sharedPluginStateHookMigratorFactory(
	(api: ExtractInjectionAPI<ToolbarListsIndentationPlugin> | undefined) => {
		const {
			bulletListActive,
			bulletListDisabled,
			orderedListActive,
			orderedListDisabled,
			isIndentationAllowed,
			indentDisabled,
			outdentDisabled,
		} = useSharedPluginStateWithSelector(api, ['list', 'indentation'], (states) => ({
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
			isSmall={isSmall}
			isReducedSpacing={isToolbarReducedSpacing}
			disabled={disabled}
			editorView={editorView}
			popupsMountPoint={popupsMountPoint}
			popupsBoundariesElement={popupsBoundariesElement}
			popupsScrollableElement={popupsScrollableElement}
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
			toolbarType={ToolbarType.PRIMARY}
		/>
	);
}
