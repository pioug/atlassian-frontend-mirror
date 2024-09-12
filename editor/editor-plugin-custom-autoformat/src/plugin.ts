import type { AutoformattingProvider, Providers } from '@atlaskit/editor-common/provider-factory';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI, PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import { keydownHandler } from '@atlaskit/editor-prosemirror/keymap';
import type {
	EditorState,
	ReadonlyTransaction,
	Transaction,
} from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import { buildHandler, completeReplacements } from './doc';
import type { InputRule } from './input-rules';
import { triggerInputRule } from './input-rules';
import reducers from './reducers';
import type {
	CustomAutoformatAction,
	CustomAutoformatPlugin,
	CustomAutoformatPluginOptions,
	CustomAutoformatState,
} from './types';
import { autoformatAction, getPluginState, pluginKey } from './utils';

export const createPMPlugin = (
	{ providerFactory }: PMPluginFactoryParams,
	options: CustomAutoformatPluginOptions,
	api?: ExtractInjectionAPI<CustomAutoformatPlugin>,
) => {
	const rules: Array<InputRule> = [];

	return new SafePlugin({
		state: {
			init(): CustomAutoformatState {
				return {
					resolving: [],
					matches: [],
					autoformattingProvider: undefined,
				};
			},

			apply(
				tr: ReadonlyTransaction,
				prevPluginState: CustomAutoformatState,
			): CustomAutoformatState {
				if (!prevPluginState) {
					return prevPluginState;
				}

				// remap positions
				const remappedPluginState: CustomAutoformatState = {
					...prevPluginState,
					resolving: prevPluginState.resolving.map((candidate) => ({
						...candidate,
						start: tr.mapping.map(candidate.start),
						end: tr.mapping.map(candidate.end, -1),
					})),
				};

				const meta: CustomAutoformatAction | undefined = tr.getMeta(pluginKey);
				if (!meta) {
					return remappedPluginState;
				}

				return reducers(remappedPluginState, meta);
			},
		},
		props: {
			handleTextInput(view: EditorView, from: number, to: number, text: string) {
				triggerInputRule(view, rules, from, to, text);
				return false;
			},
			handleKeyDown: keydownHandler({
				Enter: (_state: EditorState, _dispatch?: unknown, view?: EditorView) => {
					if (view) {
						triggerInputRule(view, rules, view.state.selection.from, view.state.selection.to, '');
					}
					return false;
				},
			}),
		},

		view() {
			const handleProvider = (name: string, provider?: Providers['autoformattingProvider']) => {
				if (name !== 'autoformattingProvider' || !provider) {
					return;
				}

				provider.then(async (autoformattingProvider) => {
					const ruleset = await autoformattingProvider.getRules();

					Object.keys(ruleset).forEach((rule) => {
						const inputRule: InputRule = {
							matchTyping: new RegExp('(\\s+|^)' + rule + '(\\s|,|\\.)$'),
							matchEnter: new RegExp('(\\s+|^)' + rule + '()$'),
							handler: buildHandler(rule, ruleset[rule]),
						};

						rules.push(inputRule);
					});
				});
			};

			if (fg('platform_editor_autoformatting_provider_from_plugin_config')) {
				if (options?.autoformattingProvider) {
					handleProvider('autoformattingProvider', options.autoformattingProvider);
				}
			} else {
				providerFactory.subscribe('autoformattingProvider', handleProvider);
			}

			return {
				update(view: EditorView) {
					const currentState = getPluginState(view.state);
					if (!currentState) {
						return;
					}

					// make replacements in document for finished autoformats
					if (currentState.matches) {
						completeReplacements(view, currentState);
					}
				},
				destroy() {
					if (!fg('platform_editor_autoformatting_provider_from_plugin_config')) {
						providerFactory.unsubscribe('autoformattingProvider', handleProvider);
					}
				},
			};
		},

		key: pluginKey,
	});
};

export const setProvider = (provider?: AutoformattingProvider) => (tr: Transaction) => {
	return autoformatAction(tr, { action: 'setProvider', provider });
};

export const customAutoformatPlugin: CustomAutoformatPlugin = ({ api, config: options }) => {
	let previousProvider: AutoformattingProvider | undefined;

	if (fg('platform_editor_autoformatting_provider_from_plugin_config')) {
		if (options?.autoformattingProvider) {
			options.autoformattingProvider.then((provider) => {
				api?.core.actions.execute(({ tr }) => setProvider(provider)(tr));
			});
		}
	}

	return {
		name: 'customAutoformat',

		pmPlugins() {
			return [
				{
					name: 'customAutoformat',
					plugin: (pmPluginFactoryParams) => {
						return createPMPlugin(pmPluginFactoryParams, options, api);
					},
				},
			];
		},

		getSharedState(editorState) {
			if (!editorState) {
				return;
			}
			const { autoformattingProvider } = getPluginState(editorState) ?? {};
			return {
				autoformattingProvider,
			};
		},

		actions: {
			setProvider: async (providerPromise: Promise<AutoformattingProvider>) => {
				const provider = await providerPromise;
				// Prevent someone trying to set the exact same provider twice for performance reasons+
				if (previousProvider === provider || options?.autoformattingProvider === providerPromise) {
					return false;
				}
				previousProvider = provider;
				return api?.core.actions.execute(({ tr }) => setProvider(provider)(tr)) ?? false;
			},
		},
	};
};
