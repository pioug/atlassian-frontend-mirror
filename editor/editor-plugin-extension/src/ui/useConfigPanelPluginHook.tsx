import React, { useEffect } from 'react';

import {
	type ExtensionProvider,
	getExtensionKeyAndNodeKey,
} from '@atlaskit/editor-common/extensions';
import {
	sharedPluginStateHookMigratorFactory,
	useSharedPluginState,
	useSharedPluginStateWithSelector,
	type NamedPluginStatesFromInjectionAPI,
} from '@atlaskit/editor-common/hooks';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { type ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { Box } from '@atlaskit/primitives/compiled';

import { clearEditingContext, forceAutoSave } from '../editor-commands/commands';
import { type ExtensionPlugin } from '../extensionPluginType';
import { getPluginState } from '../pm-plugins/plugin-factory';
import { getSelectedExtension } from '../pm-plugins/utils';

import ConfigPanelLoader from './ConfigPanel/ConfigPanelLoader';
import { CONFIG_PANEL_WIDTH } from './ConfigPanel/constants';
import HeaderAfterIconElement from './ConfigPanel/Header/HeaderAfterIconElement';
import HeaderIcon from './ConfigPanel/Header/HeaderIcon';
import { onChangeAction } from './context-panel';
import { SaveIndicator } from './SaveIndicator/SaveIndicator';

const selector = (
	states: NamedPluginStatesFromInjectionAPI<ExtractInjectionAPI<ExtensionPlugin>, 'extension'>,
) => {
	return {
		showContextPanel: states.extensionState?.showContextPanel,
		extensionProvider: states.extensionState?.extensionProvider,
		processParametersAfter: states.extensionState?.processParametersAfter,
	};
};

const useSharedState = sharedPluginStateHookMigratorFactory(
	(api: ExtractInjectionAPI<ExtensionPlugin> | undefined) => {
		return useSharedPluginStateWithSelector(api, ['extension'], selector);
	},
	(api: ExtractInjectionAPI<ExtensionPlugin> | undefined) => {
		const { extensionState } = useSharedPluginState(api, ['extension']);
		return {
			showContextPanel: extensionState?.showContextPanel,
			extensionProvider: extensionState?.extensionProvider,
			processParametersAfter: extensionState?.processParametersAfter,
		};
	},
);

export function useConfigPanelPluginHook({
	editorView,
	configPanelId,
	api,
}: {
	editorView: EditorView;
	configPanelId: string;
	api?: ExtractInjectionAPI<ExtensionPlugin>;
}) {
	const editorState = editorView.state;
	const { showContextPanel, extensionProvider, processParametersAfter } = useSharedState(api);

	useEffect(() => {
		const nodeWithPos = getSelectedExtension(editorState, true);
		// Adding checks to bail out early
		if (!nodeWithPos) {
			hideConfigPanel(configPanelId, api);
			return;
		}

		if (showContextPanel && extensionProvider && processParametersAfter) {
			showConfigPanel({
				api,
				configPanelId,
				editorView,
				extensionProvider,
				nodeWithPos,
			});
		} else {
			hideConfigPanel(configPanelId, api);
		}
	}, [
		api,
		configPanelId,
		editorState,
		editorView,
		showContextPanel,
		extensionProvider,
		processParametersAfter,
	]);

	useEffect(() => {
		return () => {
			hideConfigPanel(configPanelId, api);
		};
	}, [api, configPanelId]);
}

export function hideConfigPanel(
	configPanelId: string,
	api: ExtractInjectionAPI<ExtensionPlugin> | undefined,
) {
	const closePanelById = api?.contextPanel?.actions?.closePanelById;
	if (closePanelById) {
		closePanelById(configPanelId);
	}
}

export function showConfigPanel({
	api,
	configPanelId,
	editorView,
	extensionProvider,
	nodeWithPos,
}: {
	api: ExtractInjectionAPI<ExtensionPlugin> | undefined;
	configPanelId: string;
	editorView: EditorView;
	extensionProvider: ExtensionProvider;
	nodeWithPos: ContentNodeWithPos;
}) {
	const showContextPanel = api?.contextPanel?.actions?.showPanel;
	if (showContextPanel) {
		const nodeAttrs = nodeWithPos?.node.attrs;
		const extensionType = nodeAttrs?.extensionType;
		const extensionKey = nodeAttrs?.extensionKey;

		/**
		 * Loading extension manifest fails when using
		 * 	extensionKey directly from nodeAttrs.
		 * Always get extensionKey from getExtensionKeyAndNodeKey to load
		 * 	extension manifest successfully.
		 */
		const [extKey, _] = getExtensionKeyAndNodeKey(extensionKey, extensionType);

		const HeadeIconWrapper = () => {
			return (
				<HeaderIcon
					extensionProvider={extensionProvider}
					extensionKey={extKey}
					extensionType={extensionType}
				/>
			);
		};
		const HeaderAfterIconElementWrapper = () => {
			return (
				<HeaderAfterIconElement
					extensionProvider={extensionProvider}
					extensionKey={extKey}
					extensionType={extensionType}
				/>
			);
		};
		const BodyComponent = getContextPanelBodyComponent({
			api,
			editorView,
			extensionProvider,
			nodeWithPos,
		});
		showContextPanel(
			{
				id: configPanelId,
				headerComponentElements: {
					HeaderIcon: HeadeIconWrapper,
					HeaderAfterIconElement: HeaderAfterIconElementWrapper,
				},
				BodyComponent,
				closeOptions: {
					canClosePanel: async () => {
						// When navigating away from the editor, the editorView is destroyed.
						if (editorView.isDestroyed) {
							return true;
						}

						const extensionState = getPluginState(editorView.state);
						/**
						 * 	If context panel is open, then first update extension plugin state.
						 * 	Updating extension plugin state will trigger useEffect in useConfigPanelPluginHook,
						 * 		which will call hideConfigPanel.
						 */
						if (extensionState?.showContextPanel) {
							await startClosingConfigPanel({ api, editorView });
							return false;
						}

						// Return true if extension plugin state has been updated and hideConfigPanel has been called.
						return true;
					},
				},
			},
			'push',
			CONFIG_PANEL_WIDTH,
		);
	}
}

export async function startClosingConfigPanel({
	api,
	editorView,
}: {
	api: ExtractInjectionAPI<ExtensionPlugin> | undefined;
	editorView: EditorView;
}) {
	const applyChange = api?.contextPanel?.actions.applyChange;
	// Even if the save failed, we should proceed with closing the panel
	clearEditingContext(applyChange)(editorView.state, editorView.dispatch);
	try {
		await new Promise<void>((resolve, reject) => {
			forceAutoSave(applyChange)(resolve, reject)(editorView.state, editorView.dispatch);
		});
	} catch (e) {
		// Even if the save failed, we should proceed with closing the panel
		// eslint-disable-next-line no-console
		console.error(`Autosave failed with error`, e);
	}
}

export const getContextPanelBodyComponent = ({
	api,
	editorView,
	extensionProvider,
	nodeWithPos,
}: {
	api: ExtractInjectionAPI<ExtensionPlugin> | undefined;
	editorView: EditorView;
	extensionProvider: ExtensionProvider;
	nodeWithPos: ContentNodeWithPos;
}) => {
	const featureFlags = api?.featureFlags?.sharedState.currentState() || {};

	const editorState = editorView.state;

	const extensionState = getPluginState(editorState);
	const { autoSaveResolve, autoSaveReject, processParametersBefore } = extensionState;

	const { extensionType, extensionKey, parameters } = nodeWithPos.node.attrs;
	const [extKey, nodeKey] = getExtensionKeyAndNodeKey(extensionKey, extensionType);

	const configParams = processParametersBefore
		? processParametersBefore(parameters || {})
		: parameters;

	return () => (
		<Box padding="space.200">
			<SaveIndicator duration={5000} visible={true}>
				{({ onSaveStarted, onSaveEnded }) => {
					return (
						<ConfigPanelLoader
							api={api}
							showHeader
							closeOnEsc
							extensionType={extensionType}
							extensionKey={extKey}
							nodeKey={nodeKey}
							extensionParameters={parameters}
							parameters={configParams}
							extensionProvider={extensionProvider}
							autoSaveTrigger={autoSaveResolve}
							autoSaveReject={autoSaveReject}
							onChange={async (updatedParameters) => {
								await onChangeAction(
									editorView,
									updatedParameters,
									parameters,
									nodeWithPos,
									onSaveStarted,
								);
								onSaveEnded();

								if (autoSaveResolve) {
									autoSaveResolve();
								}
							}}
							onCancel={() => startClosingConfigPanel({ api, editorView })}
							featureFlags={featureFlags}
							// Remove below prop when cleaning platform_editor_ai_object_sidebar_injection FG
							// Becuase it will always be true
							usingObjectSidebarPanel={true}
						/>
					);
				}}
			</SaveIndicator>
		</Box>
	);
};
