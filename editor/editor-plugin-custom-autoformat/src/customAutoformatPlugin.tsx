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

import type { CustomAutoformatPlugin } from './customAutoformatPluginType';
import { buildHandler, completeReplacements } from './pm-plugins/doc';
import type { InputRule } from './pm-plugins/input-rules';
import { triggerInputRule } from './pm-plugins/input-rules';
import reducers from './pm-plugins/reducers';
import { autoformatAction, getPluginState, pluginKey } from './pm-plugins/utils';
import type {
	CustomAutoformatAction,
	CustomAutoformatPluginOptions,
	CustomAutoformatState,
} from './types';

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
							/**
							 * On Shift + Enter, after the first word an Object Replacement Character (/ufffc) is added.
							 * We still want to match strings that start with an Object Replacement Character.
							 */
							// Ignored via go/ees005
							// eslint-disable-next-line require-unicode-regexp
							matchTyping: new RegExp('(\\s+|^|\\ufffc)' + rule + '(\\s|,|\\.)$'),
							// Ignored via go/ees005
							// eslint-disable-next-line require-unicode-regexp
							matchEnter: new RegExp('(\\s+|^)' + rule + '()$'),
							handler: buildHandler(rule, ruleset[rule]),
						};

						rules.push(inputRule);
					});
				});
			};

			if (options?.autoformattingProvider) {
				handleProvider('autoformattingProvider', options.autoformattingProvider);
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

	if (options?.autoformattingProvider) {
		options.autoformattingProvider.then((provider) => {
			api?.core.actions.execute(({ tr }) => setProvider(provider)(tr));
		});
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
