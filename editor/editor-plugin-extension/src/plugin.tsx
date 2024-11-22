import {
	extension,
	extensionFrame,
	inlineExtension,
	multiBodiedExtension,
} from '@atlaskit/adf-schema';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import {
	createEditSelectedExtensionAction,
	insertOrReplaceBodiedExtension,
	insertOrReplaceExtension,
} from './actions';
import { forceAutoSave } from './commands';
import { getContextPanel } from './context-panel';
import { createExtensionAPI } from './extension-api';
import keymapPlugin from './pm-plugins/keymap';
import { createPlugin as createMacroPlugin } from './pm-plugins/macro';
import { insertMacroFromMacroBrowser, runMacroAutoConvert } from './pm-plugins/macro/actions';
import { createPlugin, pluginKey } from './pm-plugins/main';
import { createPlugin as createUniqueIdPlugin } from './pm-plugins/unique-id';
import { bodiedExtensionSpecWithFixedToDOM } from './toDOM-fixes/bodiedExtension';
import { getToolbarConfig } from './toolbar';
import type { ExtensionPlugin, InsertOrReplaceExtensionType } from './types';

export const extensionPlugin: ExtensionPlugin = ({ config: options = {}, api }) => {
	const featureFlags = api?.featureFlags?.sharedState.currentState() || {};
	//Note: This is a hack to get the editor view reference in the plugin. Copied from table plugin.
	//This is needed to get the current selection in the editor
	const editorViewRef: Record<'current', EditorView | null> = { current: null };

	return {
		name: 'extension',

		nodes() {
			const extensionNodes = [
				{
					name: 'extension',
					node: extension,
				},
				{
					name: 'bodiedExtension',
					node: bodiedExtensionSpecWithFixedToDOM(),
				},
				{
					name: 'inlineExtension',
					node: inlineExtension,
				},
				{
					name: 'extensionFrame',
					node: extensionFrame,
				},
				{
					name: 'multiBodiedExtension',
					node: multiBodiedExtension,
				},
			];

			return extensionNodes;
		},

		getSharedState(state) {
			if (!state) {
				return undefined;
			}

			const pluginState = pluginKey.getState(state);
			return {
				showContextPanel: pluginState?.showContextPanel,
			};
		},

		pmPlugins() {
			return [
				{
					name: 'extension',
					plugin: ({ dispatch, providerFactory, portalProviderAPI, eventDispatcher }) => {
						const extensionHandlers = options.extensionHandlers || {};

						return createPlugin(
							dispatch,
							providerFactory,
							extensionHandlers,
							portalProviderAPI,
							eventDispatcher,
							api,
							options.useLongPressSelection,
							{
								appearance: options.appearance,
							},
							featureFlags,
							options.allowDragAndDrop,
							options?.__livePage,
						);
					},
				},
				{
					name: 'extensionKeymap',
					plugin: () => keymapPlugin(api?.contextPanel?.actions.applyChange),
				},
				{
					name: 'extensionUniqueId',
					plugin: () => createUniqueIdPlugin(),
				},
				{
					name: 'extensionEditorViewRef',
					plugin: () => {
						return new SafePlugin({
							view: (editorView) => {
								// Do not cleanup the editorViewRef on destroy
								// because some functions may point to a stale
								// reference and this means we will return null.
								// EditorView is assumed to be stable so we do not need to
								// cleanup.
								// See: #hot-106316
								editorViewRef.current = editorView;
								return {};
							},
						});
					},
				},
				{
					name: 'macro',
					plugin: ({ dispatch, providerFactory }: PMPluginFactoryParams) =>
						createMacroPlugin(dispatch, providerFactory),
				},
			];
		},

		actions: {
			api: () => {
				return createExtensionAPI({
					editorView: editorViewRef.current!,
					applyChange: api?.contextPanel?.actions.applyChange,
					editorAnalyticsAPI: api?.analytics?.actions,
				});
			},
			insertMacroFromMacroBrowser: insertMacroFromMacroBrowser(api?.analytics?.actions),
			insertOrReplaceExtension: ({
				editorView,
				action,
				attrs,
				content,
				position,
				size,
				tr,
			}: InsertOrReplaceExtensionType) =>
				insertOrReplaceExtension({
					editorView,
					action,
					attrs,
					content,
					position,
					size,
					tr,
				}),
			insertOrReplaceBodiedExtension: ({
				editorView,
				action,
				attrs,
				content,
				position,
				size,
				tr,
			}: InsertOrReplaceExtensionType) =>
				insertOrReplaceBodiedExtension({
					editorView,
					action,
					attrs,
					content,
					position,
					size,
					tr,
				}),
			editSelectedExtension: createEditSelectedExtensionAction({
				editorViewRef,
				editorAnalyticsAPI: api?.analytics?.actions,
				applyChangeToContextPanel: api?.contextPanel?.actions.applyChange,
			}),
			runMacroAutoConvert,
			forceAutoSave,
		},

		pluginsOptions: {
			floatingToolbar: getToolbarConfig({
				breakoutEnabled: options.breakoutEnabled,
				hoverDecoration: api?.decorations?.actions.hoverDecoration,
				applyChangeToContextPanel: api?.contextPanel?.actions.applyChange,
				editorAnalyticsAPI: api?.analytics?.actions,
			}),
			contextPanel: getContextPanel(() => editorViewRef.current ?? undefined)(api, featureFlags),
		},
	};
};
