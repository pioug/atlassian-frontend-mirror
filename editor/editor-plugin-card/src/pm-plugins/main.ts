import rafSchedule from 'raf-schd';

import { getInlineNodeViewProducer } from '@atlaskit/editor-common/react-node-view';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { DATASOURCE_INNER_CONTAINER_CLASSNAME } from '@atlaskit/editor-common/styles';
import type { ExtractInjectionAPI, PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { DATASOURCE_DEFAULT_LAYOUT } from '@atlaskit/linking-common';

import type { cardPlugin } from '../index';
import { InlineCardNodeView } from '../nodeviews/inlineCard';
import { lazyBlockCardView } from '../nodeviews/lazy-block-card';
import { lazyEmbedCardView } from '../nodeviews/lazy-embed-card';
import { lazyInlineCardView } from '../nodeviews/lazy-inline-card';
import type { CardPluginOptions, CardPluginState } from '../types';
import { eventsFromTransaction } from '../ui/analytics/events-from-tr';
import { isDatasourceTableLayout } from '../ui/LayoutButton/utils';
import { isLocalStorageKeyDiscovered } from '../ui/local-storage';

import {
	clearOverlayCandidate,
	setCardLayoutAndDatasourceTableRef,
	setDatasourceTableRef,
} from './actions';
import { pluginKey } from './plugin-key';
import reducer from './reducers';
import { handleProvider, resolveWithProvider } from './util/resolve';
import { getNewRequests, getPluginState, getPluginStateWithUpdatedPos } from './util/state';
import { isBlockSupportedAtPosition, isEmbedSupportedAtPosition } from './utils';

const LOCAL_STORAGE_DISCOVERY_KEY_SMART_LINK = 'smart-link-upgrade-pulse';

const handleAwarenessOverlay = (view: EditorView): void => {
	const currentState = getPluginState(view.state);
	const overlayCandidatePos = currentState?.overlayCandidatePosition;
	if (overlayCandidatePos) {
		currentState.removeOverlay?.();
		const tr = view.state.tr;
		clearOverlayCandidate(tr);
		view.dispatch(tr);
	}
};

export const createPlugin =
	(
		options: CardPluginOptions,
		pluginInjectionApi: ExtractInjectionAPI<typeof cardPlugin> | undefined,
	) =>
	(pmPluginFactoryParams: PMPluginFactoryParams): SafePlugin<CardPluginState> => {
		const {
			editorAppearance,
			allowResizing,
			useAlternativePreloader,
			fullWidthMode,
			actionOptions,
			cardPluginEvents,
			showUpgradeDiscoverability,
			allowEmbeds,
			allowBlockCards,
			onClickCallback,
			isPageSSRed,
			provider,
			CompetitorPrompt,
		} = options;

		const enableInlineUpgradeFeatures = !!showUpgradeDiscoverability;

		const inlineCardViewProducer = getInlineNodeViewProducer({
			pmPluginFactoryParams,
			Component: InlineCardNodeView,
			extraComponentProps: {
				useAlternativePreloader,
				actionOptions,
				enableInlineUpgradeFeatures,
				allowEmbeds,
				allowBlockCards,
				pluginInjectionApi,
				onClickCallback,
				isPageSSRed,
				provider,
				CompetitorPrompt,
			},
		});

		return new SafePlugin({
			state: {
				// @ts-ignore - Workaround for help-center local consumption

				init(): CardPluginState {
					return {
						requests: [],
						provider: null,
						cards: [],
						datasourceStash: {},
						showLinkingToolbar: false,
						smartLinkEvents: undefined,
						editorAppearance,
						showDatasourceModal: false,
						datasourceModalType: undefined,
						datasourceTableRef: undefined,
						layout: undefined,
					};
				},

				// @ts-ignore - Workaround for help-center local consumption

				apply(tr, pluginState: CardPluginState, prevEditorState: EditorState) {
					// Update all the positions of outstanding requests and
					// cards in the plugin state.
					const pluginStateWithUpdatedPos = getPluginStateWithUpdatedPos(pluginState, tr);

					// apply any actions
					const meta = tr.getMeta(pluginKey);

					if (cardPluginEvents) {
						const events = eventsFromTransaction(tr, prevEditorState);
						cardPluginEvents.push(...events);
					}

					if (!meta) {
						if (pluginState.datasourceTableRef) {
							if (!(tr.selection instanceof NodeSelection) || !tr.selection.node.attrs.datasource) {
								// disable resize button when switching from datasource to block card
								return {
									...pluginStateWithUpdatedPos,
									datasourceTableRef: undefined,
								};
							}
						}
					}

					if (!meta) {
						return pluginStateWithUpdatedPos;
					}

					if (!enableInlineUpgradeFeatures) {
						return reducer(pluginStateWithUpdatedPos, meta);
					}

					const newState = reducer(pluginStateWithUpdatedPos, meta);

					// the code below is related to the "Inline Switcher" project, for more information pls see EDM-7984
					const isSingleInlineLink =
						pluginState?.requests?.length === 1 && pluginState.requests[0].appearance === 'inline';

					const isSmartLinkPulseDiscovered = isLocalStorageKeyDiscovered(
						LOCAL_STORAGE_DISCOVERY_KEY_SMART_LINK,
					);

					if (meta.type !== 'RESOLVE' || !isSingleInlineLink) {
						return newState;
					}

					const linkPosition = pluginState.requests[0].pos;
					const canBeUpgradedToBlock =
						allowBlockCards && isBlockSupportedAtPosition(linkPosition, prevEditorState, 'inline');
					const canBeUpgradedToEmbed =
						allowEmbeds && isEmbedSupportedAtPosition(linkPosition, prevEditorState, 'inline');

					if (canBeUpgradedToBlock || canBeUpgradedToEmbed) {
						newState.overlayCandidatePosition = linkPosition;
					}

					if (!isSmartLinkPulseDiscovered && canBeUpgradedToEmbed) {
						newState.inlineCardAwarenessCandidatePosition = linkPosition;
					}

					return newState;
				},
			},

			// @ts-ignore - Workaround for help-center local consumption

			filterTransaction(tr: Transaction) {
				const isOutsideClicked = tr.getMeta('outsideProsemirrorEditorClicked');

				if (isOutsideClicked) {
					const isInlineEditingActive = document.getElementById('sllv-active-inline-edit');
					if (isInlineEditingActive) {
						return false;
					}
				}
				return true;
			},

			// @ts-ignore - Workaround for help-center local consumption

			view(view: EditorView) {
				const domAtPos = view.domAtPos.bind(view);
				const rafCancellationCallbacks: Function[] = [];

				if (options.provider) {
					handleProvider('cardProvider', options.provider, view);
				}

				return {
					// @ts-ignore - Workaround for help-center local consumption

					update(view: EditorView, prevState: EditorState) {
						const currentState = getPluginState(view.state);
						const oldState = getPluginState(prevState);

						const { state, dispatch } = view;
						const { selection, tr, schema } = state;

						const isBlockCardSelected =
							selection instanceof NodeSelection && selection.node?.type === schema.nodes.blockCard;

						if (isBlockCardSelected) {
							// Ignored via go/ees005
							// eslint-disable-next-line @atlaskit/editor/no-as-casting
							const datasourceTableRef = // Ignored via go/ees005
								// eslint-disable-next-line @atlaskit/editor/no-as-casting
								(findDomRefAtPos(selection.from, domAtPos) as HTMLElement)?.querySelector(
									`.${DATASOURCE_INNER_CONTAINER_CLASSNAME}`,
								) as HTMLElement;

							const { node } = selection;

							const isDatasource = !!node?.attrs?.datasource;

							const shouldUpdateTableRef =
								datasourceTableRef && currentState?.datasourceTableRef !== datasourceTableRef;

							if (isDatasource && shouldUpdateTableRef) {
								// since we use the plugin state, which is a shared state, we need to update the datasourceTableRef, layout on each selection
								const layout = isDatasourceTableLayout(node.attrs.layout)
									? node.attrs.layout
									: DATASOURCE_DEFAULT_LAYOUT;

								const isNested = selection.$anchor.depth > 0;

								// we want to disable resize button when datasource table is nested by not setting then datasourceTableRef on selection
								if (!isNested) {
									// we use cardAction to set the same meta, hence, we will need to combine both layout+datasourceTableRef in one transaction
									dispatch(
										setCardLayoutAndDatasourceTableRef({
											datasourceTableRef,
											layout,
										})(tr),
									);
								}
							}
						} else {
							if (currentState?.datasourceTableRef) {
								dispatch(setDatasourceTableRef(undefined)(tr));
							}
						}

						if (currentState && currentState.provider) {
							// Find requests in this state that weren't in the old one.
							const newRequests = getNewRequests(oldState, currentState);
							// Ask the CardProvider to resolve all new requests.
							const { provider } = currentState;
							// @ts-ignore - Workaround for help-center local consumption

							newRequests.forEach((request) => {
								/**
								 * Queue each asynchronous resolve request on separate frames.
								 * ---
								 * NB: The promise for each request is queued to take place on separate animation frames. This avoids
								 * the scenario debugged and discovered in EDM-668, wherein the queuing of too many promises in quick succession
								 * leads to the browser's macrotask queue being overwhelmed, locking interactivity of the browser tab.
								 * By using this approach, the browser is free to schedule the resolution of the promises below in between rendering/network/
								 * other tasks as per common implementations of the JavaScript event loop in browsers.
								 */
								const invoke = rafSchedule(() =>
									resolveWithProvider(
										view,
										provider,
										request,
										options,
										pluginInjectionApi?.analytics?.actions,
										pluginInjectionApi?.analytics?.sharedState.currentState()
											?.createAnalyticsEvent ?? undefined,
									),
								);
								rafCancellationCallbacks.push(invoke.cancel);
								invoke();
							});
						}

						/**
						 * If there have been any events queued, flush them
						 * so subscribers can now be notified and dispatch
						 * analytics events
						 */
						cardPluginEvents?.flush();
					},

					// @ts-ignore - Workaround for help-center local consumption

					destroy() {
						// Cancel any outstanding raf callbacks.
						// @ts-ignore - Workaround for help-center local consumption

						rafCancellationCallbacks.forEach((cancellationCallback) => cancellationCallback());
					},
				};
			},

			props: {
				// @ts-ignore - Workaround for help-center local consumption

				nodeViews: {
					inlineCard: lazyInlineCardView({
						inlineCardViewProducer,
						isPageSSRed,
						// no need provider here, it's in the inlineCardViewProducer.extraComponentProps
					}),
					blockCard: lazyBlockCardView({
						pmPluginFactoryParams,
						actionOptions,
						pluginInjectionApi,
						onClickCallback,
						allowDatasource: options.allowDatasource,
						inlineCardViewProducer,
						isPageSSRed,
						provider,
						CompetitorPrompt: options.CompetitorPrompt,
					}),
					embedCard: lazyEmbedCardView({
						allowResizing,
						fullWidthMode,
						pmPluginFactoryParams,
						pluginInjectionApi,
						actionOptions,
						onClickCallback: options.onClickCallback,
						isPageSSRed,
						provider,
						CompetitorPrompt: options.CompetitorPrompt,
					}),
				},
				...(enableInlineUpgradeFeatures && {
					// @ts-ignore - Workaround for help-center local consumption

					handleKeyDown: (view: EditorView): boolean => {
						handleAwarenessOverlay(view);
						return false;
					},
					// @ts-ignore - Workaround for help-center local consumption

					handleClick: (view: EditorView): boolean => {
						handleAwarenessOverlay(view);
						return false;
					},
				}),
			},

			key: pluginKey,
		});
	};
