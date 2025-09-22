import React, { useEffect } from 'react';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { ToolTipContent } from '@atlaskit/editor-common/keymaps';
import {
	annotationMessages,
	toolbarInsertBlockMessages as messages,
} from '@atlaskit/editor-common/messages';
import { IconEmoji } from '@atlaskit/editor-common/quick-insert';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import type {
	Command,
	ExtractInjectionAPI,
	FloatingToolbarItem,
	PMPluginFactoryParams,
	TypeAheadHandler,
	TypeAheadItem,
} from '@atlaskit/editor-common/types';
import { calculateToolbarPositionAboveSelection } from '@atlaskit/editor-common/utils';
import { type Node as ProseMirrorNode, Fragment } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, SafeStateField, Transaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EmojiDescription, EmojiProvider } from '@atlaskit/emoji';
import {
	EmojiTypeAheadItem,
	preloadEmojiPicker,
	recordSelectionFailedSli,
	recordSelectionSucceededSli,
	SearchSort,
} from '@atlaskit/emoji';
import CommentIcon from '@atlaskit/icon/core/comment';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { createEmojiFragment, insertEmoji } from './editor-commands/insert-emoji';
import type { EmojiPlugin, EmojiPluginOptions, EmojiPluginState } from './emojiPluginType';
import { emojiNodeSpec } from './nodeviews/emojiNodeSpec';
import { EmojiNodeView } from './nodeviews/EmojiNodeView';
import {
	ACTIONS,
	openTypeAhead as openTypeAheadAction,
	setAsciiMap as setAsciiMapAction,
	setInlineEmojiPopupOpen,
	setProvider as setProviderAction,
} from './pm-plugins/actions';
import { inputRulePlugin as asciiInputRulePlugin } from './pm-plugins/ascii-input-rules';
import { InlineEmojiPopup, InlineEmojiPopupOld } from './ui/InlineEmojiPopup';

export const emojiToTypeaheadItem = (
	emoji: EmojiDescription,
	emojiProvider?: EmojiProvider,
): TypeAheadItem => ({
	title: emoji.shortName || '',
	key: emoji.id || emoji.shortName,
	render({ isSelected, onClick, onHover }) {
		return (
			<EmojiTypeAheadItem
				emoji={emoji}
				selected={isSelected}
				onMouseMove={onHover}
				onSelection={onClick}
				emojiProvider={emojiProvider}
			/>
		);
	},
	emoji,
});

export function memoize<
	ResultFn extends (emoji: EmojiDescription, emojiProvider?: EmojiProvider) => TypeAheadItem,
>(fn: ResultFn): { call: ResultFn; clear: () => void } {
	// Cache results here
	const seen = new Map<string, TypeAheadItem>();

	function memoized(emoji: EmojiDescription, emojiProvider?: EmojiProvider): TypeAheadItem {
		// Check cache for hits
		const hit = seen.get(emoji.id || emoji.shortName);

		if (hit) {
			return hit;
		}

		// Generate new result and cache it
		const result = fn(emoji, emojiProvider);
		seen.set(emoji.id || emoji.shortName, result);
		return result;
	}

	return {
		call: memoized as ResultFn,
		clear: seen.clear.bind(seen),
	};
}
const memoizedToItem = memoize(emojiToTypeaheadItem);

const defaultListLimit = 50;
const isFullShortName = (query?: string) =>
	query && query.length > 1 && query.charAt(0) === ':' && query.charAt(query.length - 1) === ':';

type EmojiProviderChangeHandler = {
	result: (res: { emojis: Array<EmojiDescription> }) => void;
};
const TRIGGER = ':';

function delayUntilIdle(cb: Function) {
	if (typeof window === 'undefined') {
		return;
	}
	// eslint-disable-next-line compat/compat
	if (window.requestIdleCallback !== undefined) {
		// eslint-disable-next-line compat/compat
		return window.requestIdleCallback(() => cb(), { timeout: 500 });
	}
	return window.requestAnimationFrame(() => cb());
}

/**
 * Emoji plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export const emojiPlugin: EmojiPlugin = ({ config: options, api }) => {
	let previousEmojiProvider: EmojiProvider | undefined;
	const typeAhead: TypeAheadHandler = {
		id: TypeAheadAvailableNodes.EMOJI,
		trigger: TRIGGER,
		// Custom regex must have a capture group around trigger
		// so it's possible to use it without needing to scan through all triggers again
		customRegex: '\\(?(:)',
		headless: options ? options.headless : undefined,
		getItems({ query, editorState }) {
			const pluginState = getEmojiPluginState(editorState);
			const emojiProvider = pluginState.emojiProvider;
			if (!emojiProvider) {
				return Promise.resolve([]);
			}

			return new Promise((resolve) => {
				const emojiProviderChangeHandler: EmojiProviderChangeHandler = {
					result(emojiResult) {
						if (!emojiResult || !emojiResult.emojis) {
							resolve([]);
						} else {
							const emojiItems = emojiResult.emojis.map((emoji) =>
								memoizedToItem.call(emoji, emojiProvider),
							);
							resolve(emojiItems);
						}
						emojiProvider.unsubscribe(emojiProviderChangeHandler);
					},
				};

				emojiProvider.subscribe(emojiProviderChangeHandler);

				emojiProvider.filter(TRIGGER.concat(query), {
					limit: defaultListLimit,
					skinTone: emojiProvider.getSelectedTone(),
					sort: !query.length ? SearchSort.UsageFrequency : SearchSort.Default,
				});
			});
		},
		forceSelect({ query, items, editorState }) {
			const { asciiMap } = emojiPluginKey.getState(editorState) || {};
			const normalizedQuery = TRIGGER.concat(query);

			// if the query has space at the end
			// check the ascii map for emojis
			if (
				asciiMap &&
				normalizedQuery.length >= 3 &&
				normalizedQuery.endsWith(' ') &&
				asciiMap.has(normalizedQuery.trim())
			) {
				const emoji = asciiMap.get(normalizedQuery.trim());
				return { title: emoji?.name || '', emoji };
			}

			const matchedItem = isFullShortName(normalizedQuery)
				? items.find((item) => item.title.toLowerCase() === normalizedQuery)
				: undefined;
			return matchedItem;
		},
		selectItem(state, item, insert, { mode }) {
			const emojiPluginState = emojiPluginKey.getState(state) as EmojiPluginState;

			if (
				emojiPluginState.emojiProvider &&
				emojiPluginState.emojiProvider.recordSelection &&
				item.emoji
			) {
				emojiPluginState.emojiProvider
					.recordSelection(item.emoji)
					.then(
						recordSelectionSucceededSli(item.emoji, {
							createAnalyticsEvent:
								api?.analytics?.sharedState.currentState()?.createAnalyticsEvent ?? undefined,
						}),
					)
					.catch(
						recordSelectionFailedSli(item.emoji, {
							createAnalyticsEvent:
								api?.analytics?.sharedState.currentState()?.createAnalyticsEvent ?? undefined,
						}),
					);
			}

			let fragment: Fragment;

			if (fg('editor_inline_comments_paste_insert_nodes')) {
				fragment = createEmojiFragment(state.doc, state.selection.$head, item.emoji);
			} else {
				const { id = '', fallback, shortName } = item.emoji;
				const text = fallback || shortName;

				const emojiNode = state.schema.nodes.emoji.createChecked({
					shortName,
					id,
					text,
				});
				const space = state.schema.text(' ');

				fragment = Fragment.from([emojiNode, space]);
			}

			const tr = insert(fragment);
			api?.analytics?.actions.attachAnalyticsEvent({
				action: ACTION.INSERTED,
				actionSubject: ACTION_SUBJECT.DOCUMENT,
				actionSubjectId: ACTION_SUBJECT_ID.EMOJI,
				attributes: { inputMethod: INPUT_METHOD.TYPEAHEAD },
				eventType: EVENT_TYPE.TRACK,
			})(tr);
			return tr;
		},
	};

	api?.base?.actions.registerMarks(({ tr, node, pos }) => {
		const { doc } = tr;
		const { schema } = doc.type;
		const { emoji: emojiNodeType } = schema.nodes;

		if (node.type === emojiNodeType) {
			const newText = node.attrs.text;
			const currentPos = tr.mapping.map(pos);
			tr.replaceWith(currentPos, currentPos + node.nodeSize, schema.text(newText, node.marks));
		}
	});

	return {
		name: 'emoji',

		nodes() {
			return [{ name: 'emoji', node: emojiNodeSpec() }];
		},

		usePluginHook() {
			useEffect(() => {
				delayUntilIdle(() => {
					preloadEmojiPicker();
				});
			}, []);
		},

		pmPlugins() {
			return [
				{
					name: 'emoji',
					plugin: (pmPluginFactoryParams) => {
						return createEmojiPlugin(pmPluginFactoryParams, options, api);
					},
				},
				{
					name: 'emojiAsciiInputRule',
					plugin: ({ schema }) => asciiInputRulePlugin(schema, api?.analytics?.actions, api),
				},
			];
		},

		getSharedState(editorState) {
			if (!editorState) {
				return undefined;
			}
			const {
				emojiResourceConfig,
				asciiMap,
				emojiProvider,
				inlineEmojiPopupOpen,
				emojiProviderPromise,
			} = emojiPluginKey.getState(editorState) ?? {};

			return {
				emojiResourceConfig,
				asciiMap,
				typeAheadHandler: typeAhead,
				emojiProvider,
				emojiProviderPromise,
				inlineEmojiPopupOpen,
			};
		},

		actions: {
			openTypeAhead: openTypeAheadAction(typeAhead, api),
			setProvider: async (providerPromise) => {
				const provider = await providerPromise;
				// Prevent someone trying to set the exact same provider twice for performance reasons
				if (previousEmojiProvider === provider || options?.emojiProvider === providerPromise) {
					return false;
				}
				previousEmojiProvider = provider;
				return api?.core.actions.execute(({ tr }) => setProviderTr(provider)(tr)) ?? false;
			},
		},

		commands: {
			insertEmoji: insertEmoji(api?.analytics?.actions),
		},

		contentComponent({
			editorView,
			popupsBoundariesElement,
			popupsMountPoint,
			popupsScrollableElement,
		}) {
			if (!api || editorExperiment('platform_editor_controls', 'control') || !editorView) {
				return null;
			}

			if (!editorExperiment('platform_editor_controls_performance_fixes', true)) {
				return (
					<InlineEmojiPopupOld
						api={api}
						editorView={editorView}
						popupsBoundariesElement={popupsBoundariesElement}
						popupsMountPoint={popupsMountPoint}
						popupsScrollableElement={popupsScrollableElement}
						onClose={() => editorView.dispatch(setInlineEmojiPopupOpen(false)(editorView.state.tr))}
					/>
				);
			}

			return (
				<InlineEmojiPopup
					api={api}
					editorView={editorView}
					popupsBoundariesElement={popupsBoundariesElement}
					popupsMountPoint={popupsMountPoint}
					popupsScrollableElement={popupsScrollableElement}
				/>
			);
		},

		pluginsOptions: {
			quickInsert: ({ formatMessage }) => [
				{
					id: 'emoji',
					title: formatMessage(messages.emoji),
					description: formatMessage(messages.emojiDescription),
					priority: 500,
					keyshortcut: ':',
					isDisabledOffline: false,
					icon: () => <IconEmoji />,
					action(insert) {
						if (editorExperiment('platform_editor_controls', 'variant1', { exposure: true })) {
							// Clear slash
							let tr = insert('');
							tr = setInlineEmojiPopupOpen(true)(tr);
							return tr;
						}

						const tr = insert(undefined);
						api?.typeAhead?.actions.openAtTransaction({
							triggerHandler: typeAhead,
							inputMethod: INPUT_METHOD.QUICK_INSERT,
						})(tr);

						return tr;
					},
				},
			],
			typeAhead,
			floatingToolbar: (state, intl) => {
				const isViewMode = () => api?.editorViewMode?.sharedState.currentState()?.mode === 'view';
				if (!isViewMode()) {
					return undefined;
				}
				const onClick: Command = (stateFromClickEvent, dispatch) => {
					if (!api?.annotation) {
						return true;
					}
					if (api?.analytics?.actions) {
						api?.analytics?.actions?.fireAnalyticsEvent({
							action: ACTION.CLICKED,
							actionSubject: ACTION_SUBJECT.BUTTON,
							actionSubjectId: ACTION_SUBJECT_ID.CREATE_INLINE_COMMENT_FROM_HIGHLIGHT_ACTIONS_MENU,
							eventType: EVENT_TYPE.UI,
							attributes: {
								source: 'highlightActionsMenu',
								pageMode: 'edit',
								sourceNode: 'emoji',
							},
						});
					}
					const command = api.annotation?.actions?.setInlineCommentDraftState(
						true,
						INPUT_METHOD.TOOLBAR,
					);
					return command(stateFromClickEvent, dispatch);
				};
				return {
					title: 'Emoji floating toolbar',
					nodeType: [state.schema.nodes.emoji],
					onPositionCalculated: calculateToolbarPositionAboveSelection('Emoji floating toolbar'),
					items: (node: ProseMirrorNode): Array<FloatingToolbarItem<Command>> => {
						const annotationState = api?.annotation?.sharedState.currentState();
						const activeCommentMark = node.marks.find(
							(mark) =>
								mark.type.name === 'annotation' &&
								annotationState?.annotations[mark.attrs.id] === false,
						);
						const showAnnotation =
							annotationState &&
							annotationState.isVisible &&
							!annotationState.bookmark &&
							!annotationState.mouseData.isSelecting &&
							!activeCommentMark &&
							isViewMode();

						if (showAnnotation) {
							return [
								{
									type: 'button',
									showTitle: true,
									testId: 'add-comment-emoji-button',
									icon: CommentIcon,
									title: intl.formatMessage(annotationMessages.createComment),
									onClick,
									tooltipContent: (
										<ToolTipContent
											description={intl.formatMessage(annotationMessages.createComment)}
										/>
									),
									supportsViewMode: true,
								},
							];
						}
						return [];
					},
				};
			},
		},
	};
};

/**
 * Actions
 */

const setAsciiMap =
	(asciiMap: Map<string, EmojiDescription>): Command =>
	(state, dispatch) => {
		if (dispatch) {
			const tr = setAsciiMapAction(asciiMap)(state.tr);
			dispatch(tr);
		}
		return true;
	};

/**
 *
 * Wrapper to call `onLimitReached` when a specified number of calls of that function
 * have been made within a time period.
 *
 * Note: It does not rate limit
 *
 * @param fn Function to wrap
 * @param limitTime Time limit in milliseconds
 * @param limitCount Number of function calls before `onRateReached` is called (per time period)
 * @returns Wrapped function
 */
export function createRateLimitReachedFunction<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	LimitedFunction extends (...args: any[]) => any,
>(
	fn: Function,
	limitTime: number,
	limitCount: number,
	onLimitReached: () => void,
): (...args: Parameters<LimitedFunction>) => ReturnType<LimitedFunction> | undefined {
	let lastCallTime = 0;
	let callCount = 0;

	return function wrappedFn(
		...args: Parameters<LimitedFunction>
	): ReturnType<LimitedFunction> | undefined {
		const now = Date.now();
		if (now - lastCallTime < limitTime) {
			if (++callCount > limitCount) {
				onLimitReached?.();
			}
		} else {
			lastCallTime = now;
			callCount = 1;
		}
		return fn(...args);
	};
}

// At this stage console.error only
const logRateWarning = () => {
	if (process.env.NODE_ENV === 'development') {
		// eslint-disable-next-line no-console
		console.error(
			'The emoji provider injected in the Editor is being reloaded frequently, this will cause a slow Editor experience.',
		);
	}
};

const setProviderTr: (provider?: EmojiProvider) => (tr: Transaction) => Transaction =
	createRateLimitReachedFunction(
		(provider?: EmojiProvider) => (tr: Transaction) => setProviderAction(provider)(tr),
		// If we change the emoji provider more than three times every 5 seconds we should warn.
		// This seems like a really long time but the performance can be that laggy that we don't
		// even get 3 events in 3 seconds and miss this indicator.
		5000,
		3,
		logRateWarning,
	);

const setProvider: ((provider?: EmojiProvider) => Command) | undefined =
	(provider?: EmojiProvider): Command =>
	(state, dispatch) => {
		if (dispatch) {
			const tr = setProviderTr(provider)(state.tr);
			dispatch(tr);
		}
		return true;
	};

export const emojiPluginKey = new PluginKey<EmojiPluginState>('emojiPlugin');

function getEmojiPluginState(state: EditorState) {
	return (emojiPluginKey.getState(state) || {}) as EmojiPluginState;
}

function createEmojiPlugin(
	pmPluginFactoryParams: PMPluginFactoryParams,
	options?: EmojiPluginOptions,
	api?: ExtractInjectionAPI<EmojiPlugin>,
) {
	return new SafePlugin<EmojiPluginState>({
		key: emojiPluginKey,
		state: {
			init() {
				if (
					options?.emojiProvider &&
					editorExperiment('platform_editor_prevent_toolbar_layout_shifts', true)
				) {
					return {
						emojiProviderPromise: options.emojiProvider,
					};
				}
				return {};
			},
			apply(tr, pluginState) {
				const { action, params } = tr.getMeta(emojiPluginKey) || {
					action: null,
					params: null,
				};

				let newPluginState = pluginState;

				switch (action) {
					case ACTIONS.SET_PROVIDER:
						newPluginState = {
							...pluginState,
							emojiProvider: params.provider,
							emojiProviderPromise: editorExperiment(
								'platform_editor_prevent_toolbar_layout_shifts',
								true,
							)
								? Promise.resolve(params.provider)
								: undefined,
						};
						pmPluginFactoryParams.dispatch(emojiPluginKey, newPluginState);
						return newPluginState;
					case ACTIONS.SET_ASCII_MAP:
						newPluginState = {
							...pluginState,
							asciiMap: params.asciiMap,
						};
						pmPluginFactoryParams.dispatch(emojiPluginKey, newPluginState);
						return newPluginState;
					case ACTIONS.SET_INLINE_POPUP:
						newPluginState = {
							...pluginState,
							inlineEmojiPopupOpen: params.open,
						};
						pmPluginFactoryParams.dispatch(emojiPluginKey, newPluginState);
						return newPluginState;
				}

				return newPluginState;
			},
		} as SafeStateField<EmojiPluginState>,
		props: {
			nodeViews: {
				emoji: (node) => {
					return new EmojiNodeView(node, {
						intl: pmPluginFactoryParams.getIntl(),
						api,
						emojiNodeDataProvider: options?.emojiNodeDataProvider,
					});
				},
			},
		},
		view(editorView) {
			const providerHandler = (name: string, providerPromise?: Promise<EmojiProvider>) => {
				switch (name) {
					case 'emojiProvider':
						if (!providerPromise) {
							return setProvider?.(undefined)?.(editorView.state, editorView.dispatch);
						}

						providerPromise
							.then((provider) => {
								setProvider?.(provider)?.(editorView.state, editorView.dispatch);
								provider.getAsciiMap().then((asciiMap) => {
									setAsciiMap(asciiMap)(editorView.state, editorView.dispatch);
								});
							})
							.catch(() => setProvider?.(undefined)?.(editorView.state, editorView.dispatch));
						break;
				}
				return;
			};

			if (options?.emojiProvider) {
				providerHandler('emojiProvider', options.emojiProvider);
			}

			return {
				destroy() {
					if (pmPluginFactoryParams.providerFactory) {
						pmPluginFactoryParams.providerFactory.unsubscribe('emojiProvider', providerHandler);
					}
				},
			};
		},
	});
}
