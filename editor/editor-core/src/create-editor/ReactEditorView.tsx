import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';
import uuid from 'uuid/v4';

import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import type {
	AnalyticsDispatch,
	AnalyticsEventPayload,
	DispatchAnalyticsEvent,
	FireAnalyticsCallback,
} from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	fireAnalyticsEvent,
	PLATFORMS,
} from '@atlaskit/editor-common/analytics';
import { createDispatch, EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { useConstructor, usePreviousState } from '@atlaskit/editor-common/hooks';
import { nodeVisibilityManager } from '@atlaskit/editor-common/node-visibility';
import { getEnabledFeatureFlagKeys } from '@atlaskit/editor-common/normalize-feature-flags';
import { measureRender } from '@atlaskit/editor-common/performance/measure-render';
import { getResponseEndTime } from '@atlaskit/editor-common/performance/navigation';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type {
	AllEditorPresetPluginTypes,
	EditorPresetBuilder,
} from '@atlaskit/editor-common/preset';
import { EditorPluginInjectionAPI } from '@atlaskit/editor-common/preset';
import {
	processRawValue,
	processRawValueWithoutValidation,
} from '@atlaskit/editor-common/process-raw-value';
import type {
	ContextIdentifierProvider,
	ProviderFactory,
} from '@atlaskit/editor-common/provider-factory';
import type { OptionalPlugin, PublicPluginAPI, Transformer } from '@atlaskit/editor-common/types';
import { ReactEditorViewContext } from '@atlaskit/editor-common/ui-react';
import {
	analyticsEventKey,
	getAnalyticsEventSeverity,
} from '@atlaskit/editor-common/utils/analytics';
import { isEmptyDocument } from '@atlaskit/editor-common/utils/document';
import type { CardPlugin } from '@atlaskit/editor-plugins/card';
import type { ContextIdentifierPlugin } from '@atlaskit/editor-plugins/context-identifier';
import { type CustomAutoformatPlugin } from '@atlaskit/editor-plugins/custom-autoformat';
import { type EmojiPlugin } from '@atlaskit/editor-plugins/emoji';
import type { MediaPlugin } from '@atlaskit/editor-plugins/media';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Plugin, Transaction } from '@atlaskit/editor-prosemirror/state';
import { EditorState, Selection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { DirectEditorProps } from '@atlaskit/editor-prosemirror/view';
import { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { abortAll, getActiveInteraction } from '@atlaskit/react-ufo/interaction-metrics';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { useProviders } from '../composable-editor/hooks/useProviders';
import type { EditorConfig, EditorProps } from '../types';
import type { EditorViewStateUpdatedCallbackProps } from '../types/editor-config';
import type { EditorNextProps } from '../types/editor-props';
import { createFeatureFlagsFromProps } from '../utils/feature-flags-from-props';
import { getNodesCount } from '../utils/getNodesCount';
import { isFullPage } from '../utils/is-full-page';
import { RenderTracking } from '../utils/performance/components/RenderTracking';
import measurements from '../utils/performance/measure-enum';

import {
	PROSEMIRROR_RENDERED_DEGRADED_SEVERITY_THRESHOLD,
	PROSEMIRROR_RENDERED_NORMAL_SEVERITY_THRESHOLD,
} from './consts';
import { createErrorReporter, createPMPlugins, processPluginsList } from './create-editor';
import createPluginsList from './create-plugins-list';
import { createSchema } from './create-schema';
import { editorMessages } from './messages';
import { focusEditorElement } from './ReactEditorView/focusEditorElement';
import { getUAPrefix } from './ReactEditorView/getUAPrefix';
import { handleEditorFocus } from './ReactEditorView/handleEditorFocus';
import { useDispatchTransaction } from './ReactEditorView/useDispatchTransaction';
import { useFireFullWidthEvent } from './ReactEditorView/useFireFullWidthEvent';

const EDIT_AREA_ID = 'ak-editor-textarea';

export interface EditorViewProps extends WrappedComponentProps {
	editorProps: (EditorProps | EditorNextProps) & {
		preset?: EditorNextProps['preset'];
	};
	createAnalyticsEvent?: CreateUIAnalyticsEvent;
	providerFactory: ProviderFactory;
	portalProviderAPI: PortalProviderAPI;
	nodeViewPortalProviderAPI: PortalProviderAPI;
	disabled?: boolean;
	render?: (props: {
		editor: JSX.Element;
		view?: EditorView;
		config: EditorConfig;
		eventDispatcher: EventDispatcher;
		transformer?: Transformer<string>;
		dispatchAnalyticsEvent: DispatchAnalyticsEvent;
		editorRef: React.RefObject<HTMLDivElement>;
		// We can't know this type at runtime
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		editorAPI: PublicPluginAPI<any> | undefined;
	}) => JSX.Element;
	onEditorCreated: (instance: {
		view: EditorView;
		config: EditorConfig;
		eventDispatcher: EventDispatcher;
		transformer?: Transformer<string>;
	}) => void;
	onEditorDestroyed: (instance: {
		view: EditorView;
		config: EditorConfig;
		eventDispatcher: EventDispatcher;
		transformer?: Transformer<string>;
	}) => void;
	preset: EditorPresetBuilder<string[], AllEditorPresetPluginTypes[]>;
}

interface CreateEditorStateOptions {
	props: EditorViewProps;
	doc?: string | Object | PMNode;
	resetting?: boolean;
	selectionAtStart?: boolean;
}

type ReactEditorViewPlugins = [
	OptionalPlugin<ContextIdentifierPlugin>,
	OptionalPlugin<MediaPlugin>,
	OptionalPlugin<CardPlugin>,
	OptionalPlugin<EmojiPlugin>,
	OptionalPlugin<CustomAutoformatPlugin>,
];

export function ReactEditorView(props: EditorViewProps) {
	const {
		preset,
		editorProps: {
			appearance: nextAppearance,
			disabled,
			featureFlags: editorPropFeatureFlags,
			errorReporterHandler,
			defaultValue,
			shouldFocus,
			__livePage,
		},
		onEditorCreated,
		onEditorDestroyed,
	} = props;
	const [editorAPI, setEditorAPI] = useState<PublicPluginAPI<ReactEditorViewPlugins> | undefined>(
		undefined,
	);
	const editorRef = useRef<HTMLDivElement | null>(null);
	const viewRef = useRef<EditorView | undefined>();
	const focusTimeoutId = useRef<number | undefined | void>();
	// ProseMirror is instantiated prior to the initial React render cycle,
	// so we allow transactions by default, to avoid discarding the initial one.
	const canDispatchTransactions = useRef(true);

	const editorId = useRef<string>(uuid());
	const eventDispatcher = useMemo(() => new EventDispatcher(), []);
	const config = useRef<EditorConfig>({
		nodes: [],
		marks: [],
		pmPlugins: [],
		contentComponents: [],
		pluginHooks: [],
		primaryToolbarComponents: [],
		secondaryToolbarComponents: [],
		onEditorViewStateUpdatedCallbacks: [],
	});
	const contentTransformer = useRef<Transformer<string> | undefined>(undefined);
	const featureFlags = useMemo(
		() => createFeatureFlagsFromProps(editorPropFeatureFlags),
		[editorPropFeatureFlags],
	);
	const getEditorState = useCallback(() => viewRef.current?.state, []);
	const getEditorView = useCallback(() => viewRef.current, []);
	const dispatch = useMemo(() => createDispatch(eventDispatcher), [eventDispatcher]);
	const errorReporter = useMemo(
		() => createErrorReporter(errorReporterHandler),
		[errorReporterHandler],
	);

	const handleAnalyticsEvent: FireAnalyticsCallback = useCallback(
		(payload) => {
			fireAnalyticsEvent(props.createAnalyticsEvent)(payload);
		},
		[props.createAnalyticsEvent],
	);

	const dispatchAnalyticsEvent = useCallback(
		(payload: AnalyticsEventPayload): void => {
			const dispatch: AnalyticsDispatch = createDispatch(eventDispatcher);
			dispatch(analyticsEventKey, {
				payload,
			});
		},
		[eventDispatcher],
	);

	const pluginInjectionAPI = useRef<EditorPluginInjectionAPI>(
		new EditorPluginInjectionAPI({
			getEditorState: getEditorState,
			getEditorView: getEditorView,
			fireAnalyticsEvent: handleAnalyticsEvent,
		}),
	);

	const createEditorState = useCallback(
		(options: CreateEditorStateOptions): EditorState => {
			let schema;
			if (viewRef.current) {
				if (options.resetting) {
					/**
					 * ReactEditorView currently does NOT handle dynamic schema,
					 * We are reusing the existing schema, and rely on #reconfigureState
					 * to update `this.config`
					 */
					schema = viewRef.current.state.schema;
				} else {
					/**
					 * There's presently a number of issues with changing the schema of a
					 * editor inflight. A significant issue is that we lose the ability
					 * to keep track of a user's history as the internal plugin state
					 * keeps a list of Steps to undo/redo (which are tied to the schema).
					 * Without a good way to do work around this, we prevent this for now.
					 */
					// eslint-disable-next-line no-console
					console.warn('The editor does not support changing the schema dynamically.');
					return viewRef.current.state;
				}
			} else {
				config.current = processPluginsList(
					createPluginsList(options.props.preset, props.editorProps, pluginInjectionAPI.current),
				);
				schema = createSchema(config.current);
				setEditorAPI(pluginInjectionAPI.current.api());
			}

			const { contentTransformerProvider } = options.props.editorProps;

			const plugins = createPMPlugins({
				schema,
				dispatch: dispatch,
				errorReporter: errorReporter,
				editorConfig: config.current,
				eventDispatcher: eventDispatcher,
				providerFactory: options.props.providerFactory,
				portalProviderAPI: props.portalProviderAPI,
				nodeViewPortalProviderAPI: props.nodeViewPortalProviderAPI,
				dispatchAnalyticsEvent: dispatchAnalyticsEvent,
				featureFlags,
				getIntl: () => props.intl,
				onEditorStateUpdated: fg('platform_editor_catch_missing_injection_states')
					? pluginInjectionAPI.current.onEditorViewUpdated
					: undefined,
			});

			contentTransformer.current = contentTransformerProvider
				? contentTransformerProvider(schema)
				: undefined;

			const api = pluginInjectionAPI.current.api();

			// If we have a doc prop, we need to process it into a PMNode
			let doc;
			if (options.doc) {
				// if the collabEdit API is set, skip this validation due to potential pm validation errors
				// from docs that end up with invalid marks after processing (See #hot-111702 for more details)
				if (
					(api?.collabEdit !== undefined && fg('editor_load_conf_collab_docs_without_checks')) ||
					options.props.editorProps.skipValidation
				) {
					doc = processRawValueWithoutValidation(schema, options.doc, dispatchAnalyticsEvent);
				} else {
					doc = processRawValue(
						schema,
						options.doc,
						options.props.providerFactory,
						options.props.editorProps.sanitizePrivateContent,
						contentTransformer.current,
						dispatchAnalyticsEvent,
					);
				}
			}

			const isViewMode = api?.editorViewMode?.sharedState.currentState().mode === 'view';

			let selection: Selection | undefined;

			if (doc) {
				if (isViewMode) {
					const emptySelection = new TextSelection(doc.resolve(0));
					return EditorState.create({
						schema,
						plugins: plugins as Plugin[],
						doc,
						selection: emptySelection,
					});
				} else {
					selection = options.selectionAtStart ? Selection.atStart(doc) : Selection.atEnd(doc);
				}
			}

			// Workaround for ED-3507: When media node is the last element, scrollIntoView throws an error
			const patchedSelection = selection
				? Selection.findFrom(selection.$head, -1, true) || undefined
				: undefined;

			return EditorState.create({
				schema,
				plugins: plugins as Plugin[],
				doc,
				selection: patchedSelection,
			});
		},
		[
			errorReporter,
			featureFlags,
			props.intl,
			props.portalProviderAPI,
			props.nodeViewPortalProviderAPI,
			props.editorProps,
			dispatchAnalyticsEvent,
			eventDispatcher,
			dispatch,
		],
	);

	const initialEditorState = useMemo(
		() =>
			createEditorState({
				props,
				doc: defaultValue,
				// ED-4759: Don't set selection at end for full-page editor - should be at start.
				selectionAtStart: isFullPage(nextAppearance),
			}),
		// This is only used for the initial state - afterwards we will have `viewRef` available for use
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const getCurrentEditorState = useCallback(() => {
		return viewRef.current?.state ?? initialEditorState;
	}, [initialEditorState]);

	const blur = useCallback(() => {
		if (!viewRef.current) {
			return;
		}

		if (viewRef.current.dom instanceof HTMLElement && viewRef.current.hasFocus()) {
			viewRef.current.dom.blur();
		}

		// The selectionToDOM method uses the document selection to determine currently selected node
		// We need to mimic blurring this as it seems doing the above is not enough.
		// @ts-expect-error
		const sel = (viewRef.current.root as DocumentOrShadowRoot).getSelection();
		if (sel) {
			sel.removeAllRanges();
		}
	}, []);

	const resetEditorState = useCallback(
		({ doc, shouldScrollToBottom }: { doc: string; shouldScrollToBottom: boolean }) => {
			if (!viewRef.current) {
				return;
			}

			// We cannot currently guarantee when all the portals will have re-rendered during a reconfigure
			// so we blur here to stop ProseMirror from trying to apply selection to detached nodes or
			// nodes that haven't been re-rendered to the document yet.
			blur();

			const newEditorState = createEditorState({
				props: props,
				doc: doc,
				resetting: true,
				selectionAtStart: !shouldScrollToBottom,
			});
			viewRef.current.updateState(newEditorState);
			props.editorProps.onChange?.(viewRef.current, { source: 'local', isDirtyChange: false });
		},
		[blur, createEditorState, props],
	);

	// Initialise phase
	// Using constructor hook so we setup and dispatch analytics before anything else
	useConstructor(() => {
		// This needs to be before initialising editorState because
		// we dispatch analytics events in plugin initialisation
		eventDispatcher.on(analyticsEventKey, handleAnalyticsEvent);
		eventDispatcher.on('resetEditorState', resetEditorState);

		dispatchAnalyticsEvent({
			action: ACTION.STARTED,
			actionSubject: ACTION_SUBJECT.EDITOR,
			attributes: {
				platform: PLATFORMS.WEB,
				featureFlags: featureFlags ? getEnabledFeatureFlagKeys(featureFlags) : [],
				accountLocale: props.intl?.locale,
				browserLocale: window.navigator.language,
			},
			eventType: EVENT_TYPE.UI,
		});
	});

	useLayoutEffect(() => {
		// Transaction dispatching is already enabled by default prior to
		// mounting, but we reset it here, just in case the editor view
		// instance is ever recycled (mounted again after unmounting) with
		// the same key.
		// AND since React 18 effects may run multiple times so we need to ensure
		// this is reset so that transactions are still allowed.
		// Although storing mounted state is an anti-pattern in React,
		// we do so here so that we can intercept and abort asynchronous
		// ProseMirror transactions when a dismount is imminent.
		canDispatchTransactions.current = true;
		return () => {
			// We can ignore any transactions from this point onwards.
			// This serves to avoid potential runtime exceptions which could arise
			// from an async dispatched transaction after it's unmounted.
			canDispatchTransactions.current = false;
		};
	}, []);

	// Cleanup
	useLayoutEffect(() => {
		return () => {
			const focusTimeoutIdCurrent = focusTimeoutId.current;
			if (focusTimeoutIdCurrent) {
				clearTimeout(focusTimeoutIdCurrent);
			}

			if (viewRef.current) {
				// Destroy the state if the Editor is being unmounted
				const editorState = viewRef.current.state;
				editorState.plugins.forEach((plugin) => {
					const state = plugin.getState(editorState);
					if (state && state.destroy) {
						state.destroy();
					}
				});
			}

			eventDispatcher.destroy();
			// this.view will be destroyed when React unmounts in handleEditorViewRef
		};
	}, [eventDispatcher]);

	const reconfigureState = useCallback(
		(props: EditorViewProps) => {
			if (!viewRef.current) {
				return;
			}

			// We cannot currently guarantee when all the portals will have re-rendered during a reconfigure
			// so we blur here to stop ProseMirror from trying to apply selection to detached nodes or
			// nodes that haven't been re-rendered to the document yet.
			blur();

			const editorPlugins = createPluginsList(
				props.preset,
				props.editorProps,
				pluginInjectionAPI.current,
			);

			config.current = processPluginsList(editorPlugins);

			const state = viewRef.current.state;

			const plugins = createPMPlugins({
				schema: state.schema,
				dispatch: dispatch,
				errorReporter: errorReporter,
				editorConfig: config.current,
				eventDispatcher: eventDispatcher,
				providerFactory: props.providerFactory,
				portalProviderAPI: props.portalProviderAPI,
				nodeViewPortalProviderAPI: props.nodeViewPortalProviderAPI,
				dispatchAnalyticsEvent: dispatchAnalyticsEvent,
				featureFlags,
				getIntl: () => props.intl,
				onEditorStateUpdated: fg('platform_editor_catch_missing_injection_states')
					? pluginInjectionAPI.current.onEditorViewUpdated
					: undefined,
			});

			const newState = state.reconfigure({ plugins: plugins as Plugin[] });

			// need to update the state first so when the view builds the nodeviews it is
			// using the latest plugins
			viewRef.current.updateState(newState);

			return viewRef.current.update({ ...viewRef.current.props, state: newState });
		},
		[blur, dispatchAnalyticsEvent, eventDispatcher, dispatch, errorReporter, featureFlags],
	);

	const onEditorViewUpdated = useCallback(
		({
			originalTransaction,
			transactions,
			oldEditorState,
			newEditorState,
		}: EditorViewStateUpdatedCallbackProps) => {
			if (!fg('platform_editor_catch_missing_injection_states')) {
				pluginInjectionAPI.current.onEditorViewUpdated({
					newEditorState,
					oldEditorState,
				});
			}

			config.current?.onEditorViewStateUpdatedCallbacks.forEach((entry) => {
				entry.callback({
					originalTransaction,
					transactions,
					oldEditorState,
					newEditorState,
				});
			});
		},
		[],
	);

	const dispatchTransaction = useDispatchTransaction({
		onChange: props.editorProps.onChange,
		dispatchAnalyticsEvent,
		onEditorViewUpdated,
		isRemoteReplaceDocumentTransaction:
			pluginInjectionAPI.current.api()?.collabEdit?.actions?.isRemoteReplaceDocumentTransaction,
	});

	// Ignored via go/ees007
	// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
	// TODO: Remove these when we deprecate these props from editor-props - smartLinks is unfortunately still used in some places, we can sidestep this problem if we move everyone across to ComposableEditor and deprecate Editor
	const UNSAFE_cards = (props.editorProps as EditorProps).UNSAFE_cards;
	const smartLinks = (props.editorProps as EditorProps).smartLinks;

	// Temporary to replace provider factory while migration to `ComposableEditor` occurs
	useProviders({
		editorApi: editorAPI,
		contextIdentifierProvider: props.editorProps.contextIdentifierProvider,
		mediaProvider: (props.editorProps as EditorProps).media?.provider,
		mentionProvider: props.editorProps.mentionProvider,
		cardProvider:
			(props.editorProps as EditorProps).linking?.smartLinks?.provider ||
			(smartLinks && smartLinks.provider) ||
			(UNSAFE_cards && UNSAFE_cards.provider),
		emojiProvider: props.editorProps.emojiProvider,
		autoformattingProvider: props.editorProps.autoformattingProvider,
		taskDecisionProvider: props.editorProps.taskDecisionProvider,
	});

	const getDirectEditorProps = useCallback(
		(state?: EditorState): DirectEditorProps => {
			return {
				state: state ?? getCurrentEditorState(),
				dispatchTransaction: (tr: Transaction) => {
					// Block stale transactions:
					// Prevent runtime exceptions from async transactions that would attempt to
					// update the DOM after React has unmounted the Editor.

					if (canDispatchTransactions.current) {
						dispatchTransaction(viewRef.current, tr);
					}
				},
				// Disables the contentEditable attribute of the editor if the editor is disabled
				editable: (_state) => !disabled,
				attributes: { 'data-gramm': 'false' },
			};
		},
		[dispatchTransaction, disabled, getCurrentEditorState],
	);

	const createEditorView = useCallback(
		(node: HTMLDivElement) => {
			// Creates the editor-view from this.editorState. If an editor has been mounted
			// previously, this will contain the previous state of the editor.
			const view = new EditorView({ mount: node }, getDirectEditorProps());
			viewRef.current = view;

			measureRender(
				measurements.PROSEMIRROR_RENDERED,
				({ duration, startTime, distortedDuration }) => {
					const proseMirrorRenderedSeverity = getAnalyticsEventSeverity(
						duration,
						PROSEMIRROR_RENDERED_NORMAL_SEVERITY_THRESHOLD,
						PROSEMIRROR_RENDERED_DEGRADED_SEVERITY_THRESHOLD,
					);

					if (viewRef.current) {
						const nodes = getNodesCount(viewRef.current.state.doc);
						const ttfb = getResponseEndTime();

						const contextIdentifier = pluginInjectionAPI.current
							.api()
							.base?.sharedState.currentState() as ContextIdentifierProvider | undefined;

						dispatchAnalyticsEvent({
							action: ACTION.PROSEMIRROR_RENDERED,
							actionSubject: ACTION_SUBJECT.EDITOR,
							attributes: {
								duration,
								startTime,
								nodes,
								ttfb,
								severity: proseMirrorRenderedSeverity,
								objectId: contextIdentifier?.objectId,
								distortedDuration,
							},
							eventType: EVENT_TYPE.OPERATIONAL,
						});
					}
				},
			);
			pluginInjectionAPI.current.onEditorViewUpdated({
				newEditorState: viewRef.current.state,
				oldEditorState: undefined,
			});
			return view;
		},
		[getDirectEditorProps, dispatchAnalyticsEvent],
	);

	const [editorView, setEditorView] = useState<EditorView | undefined>(undefined);

	// Detects if the editor is nested inside an extension - ie. it is a Legacy Content Extension (LCE)
	const isNestedEditor = useRef<boolean | null>(null);
	const isNestedEditorCalculated = useRef(false);
	if (fg('platform_editor_lce_scrolltop_mitigation')) {
		if (editorRef.current !== null && !isNestedEditorCalculated.current) {
			isNestedEditor.current = !!editorRef.current?.closest('.extension-editable-area');
			isNestedEditorCalculated.current = true;
		}
	}

	const originalScrollToRestore = React.useRef(
		!isNestedEditor.current &&
			isFullPage(props.editorProps.appearance) &&
			fg('platform_editor_reduce_scroll_jump_on_editor_start')
			? document.querySelector('[data-editor-scroll-container]')?.scrollTop
			: undefined,
	);

	const mitigateScrollJump =
		// The feature gate here is being used to avoid potential bugs with the scroll restoration code
		// moving it to the end of the expression negates the point of the feature gate
		// eslint-disable-next-line @atlaskit/platform/no-preconditioning
		isFullPage(props.editorProps.appearance) &&
		fg('platform_editor_reduce_scroll_jump_on_editor_start') &&
		originalScrollToRestore.current &&
		originalScrollToRestore.current !== 0;

	useLayoutEffect(() => {
		if (
			shouldFocus &&
			editorView?.props.editable?.(editorView.state) &&
			fg('platform_editor_react_18_autofocus_fix')
		) {
			if (fg('platform_editor_reduce_scroll_jump_on_editor_start')) {
				if (!mitigateScrollJump) {
					const liveDocWithContent =
						(__livePage ||
							expValEquals('platform_editor_no_cursor_on_edit_page_init', 'isEnabled', true)) &&
						!isEmptyDocument(editorView.state.doc);
					if (!liveDocWithContent) {
						focusTimeoutId.current = handleEditorFocus(editorView);
					}

					if (
						expValEquals('platform_editor_no_cursor_on_edit_page_init', 'isEnabled', true) &&
						fg('cc_editor_focus_before_editor_on_load')
					) {
						if (!disabled && shouldFocus && !isEmptyDocument(editorView.state.doc)) {
							focusEditorElement(editorId.current);
						}
					}
				}
			} else {
				const liveDocWithContent =
					(__livePage ||
						expValEquals('platform_editor_no_cursor_on_edit_page_init', 'isEnabled', true)) &&
					!isEmptyDocument(editorView.state.doc);
				if (!liveDocWithContent) {
					focusTimeoutId.current = handleEditorFocus(editorView);
				}
			}
		}
	}, [editorView, shouldFocus, __livePage, mitigateScrollJump, disabled]);

	const scrollElement = React.useRef<Element | null>();
	const possibleListeners = React.useRef([] as [event: string, handler: () => void][]);

	React.useEffect(() => {
		return () => {
			if (fg('cc_editor_abort_ufo_load_on_editor_scroll')) {
				if (scrollElement.current) {
					// eslint-disable-next-line react-hooks/exhaustive-deps
					for (const possibleListener of possibleListeners.current) {
						// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
						scrollElement.current?.removeEventListener(...possibleListener);
					}
				}
				scrollElement.current = null;
			}
		};
	}, []);

	const handleEditorViewRef = useCallback(
		(node: HTMLDivElement) => {
			if (fg('cc_editor_abort_ufo_load_on_editor_scroll')) {
				if (node) {
					scrollElement.current = document.querySelector('[data-editor-scroll-container]');

					const cleanupListeners = () => {
						// eslint-disable-next-line react-hooks/exhaustive-deps
						for (const possibleListener of possibleListeners.current) {
							// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
							scrollElement.current?.removeEventListener(...possibleListener);
						}
					};

					if (scrollElement.current) {
						const wheelAbortHandler = () => {
							const activeInteraction = getActiveInteraction();

							if (
								activeInteraction &&
								['edit-page', 'live-edit'].includes(activeInteraction.ufoName)
							) {
								abortAll('new_interaction', `wheel-on-editor-element`);
							}
							cleanupListeners();
						};
						// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
						scrollElement.current.addEventListener('wheel', wheelAbortHandler);
						possibleListeners.current.push(['wheel', wheelAbortHandler]);

						const scrollAbortHandler = () => {
							const activeInteraction = getActiveInteraction();

							if (
								activeInteraction &&
								['edit-page', 'live-edit'].includes(activeInteraction.ufoName)
							) {
								abortAll('new_interaction', `scroll-on-editor-element`);
							}
							cleanupListeners();
						};
						// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
						scrollElement.current.addEventListener('scroll', scrollAbortHandler);
						possibleListeners.current.push(['scroll', scrollAbortHandler]);
					}
				}
			}

			if (!viewRef.current && node) {
				nodeVisibilityManager(node).initialiseNodeObserver();

				const view = createEditorView(node);

				if (fg('platform_editor_reduce_scroll_jump_on_editor_start')) {
					if (mitigateScrollJump) {
						const scrollElement = document.querySelector('[data-editor-scroll-container]');

						scrollElement?.scrollTo({
							top: originalScrollToRestore.current,
							behavior: 'instant',
						});
					}
				}

				onEditorCreated({
					view,
					config: config.current,
					eventDispatcher: eventDispatcher,
					transformer: contentTransformer.current,
				});

				if (fg('platform_editor_react_18_autofocus_fix')) {
					/**
					 * Defer using startTransition when it is available (in React 18) to fix
					 * autofocus bug where React 18's concurrent rendering mode interferes with
					 * setTimeout used in handleEditorFocus, causing autofocus to break.
					 */
					const react18OnlyStartTransition =
						(
							React as unknown as {
								startTransition?: (fn: () => void) => void;
							}
						)?.startTransition ?? ((fn: () => void) => fn());

					react18OnlyStartTransition(() => {
						// Force React to re-render so consumers get a reference to the editor view
						setEditorView(view);
					});
				} else {
					if (shouldFocus && view.props.editable && view.props.editable(view.state)) {
						if (fg('platform_editor_reduce_scroll_jump_on_editor_start')) {
							if (!mitigateScrollJump) {
								const isLivePageWithContent =
									(__livePage ||
										expValEquals(
											'platform_editor_no_cursor_on_edit_page_init',
											'isEnabled',
											true,
										)) &&
									!isEmptyDocument(view.state.doc);

								if (
									!isLivePageWithContent &&
									shouldFocus &&
									view.props.editable &&
									view.props.editable(view.state)
								) {
									focusTimeoutId.current = handleEditorFocus(view);
								}

								if (
									expValEquals('platform_editor_no_cursor_on_edit_page_init', 'isEnabled', true) &&
									fg('cc_editor_focus_before_editor_on_load')
								) {
									if (
										shouldFocus &&
										view.props.editable &&
										view.props.editable(view.state) &&
										!isEmptyDocument(view.state.doc)
									) {
										focusEditorElement(editorId.current);
									}
								}
							}
						} else {
							const isLivePageWithContent =
								(__livePage ||
									expValEquals('platform_editor_no_cursor_on_edit_page_init', 'isEnabled', true)) &&
								!isEmptyDocument(view.state.doc);
							if (
								!isLivePageWithContent &&
								shouldFocus &&
								view.props.editable &&
								view.props.editable(view.state)
							) {
								focusTimeoutId.current = handleEditorFocus(view);
							}
						}
					}

					// Force React to re-render so consumers get a reference to the editor view
					setEditorView(view);
				}
			} else if (viewRef.current && !node) {
				// When the appearance is changed, React will call handleEditorViewRef with node === null
				// to destroy the old EditorView, before calling this method again with node === div to
				// create the new EditorView
				onEditorDestroyed({
					view: viewRef.current,
					config: config.current,
					eventDispatcher: eventDispatcher,
					transformer: contentTransformer.current,
				});

				const wasAnalyticsDisconnected = !eventDispatcher.has(
					analyticsEventKey,
					handleAnalyticsEvent,
				);
				// If we disabled event listening for some reason we should re-enable it temporarily while we destroy
				// the view for any analytics that occur there.
				if (wasAnalyticsDisconnected) {
					eventDispatcher.on(analyticsEventKey, handleAnalyticsEvent);
					viewRef.current.destroy(); // Destroys the dom node & all node views
					eventDispatcher.off(analyticsEventKey, handleAnalyticsEvent);
				} else {
					viewRef.current.destroy(); // Destroys the dom node & all node views
				}

				nodeVisibilityManager(viewRef.current.dom).disconnect();

				viewRef.current = undefined;
			}
		},
		[
			createEditorView,
			onEditorCreated,
			eventDispatcher,
			shouldFocus,
			__livePage,
			onEditorDestroyed,
			handleAnalyticsEvent,
			mitigateScrollJump,
		],
	);

	const createEditor = useCallback(
		(assistiveLabel?: string, assistiveDescribedBy?: string) => {
			return (
				<>
					{fg('cc_editor_focus_before_editor_on_load') && (
						<div
							tabIndex={-1}
							data-focus-id={editorId.current}
							data-testid="react-editor-view-inital-focus-element"
						/>
					)}
					<div
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						className={`ProseMirror ${getUAPrefix()}`}
						key="ProseMirror"
						ref={handleEditorViewRef}
						aria-label={
							assistiveLabel || props.intl.formatMessage(editorMessages.editorAssistiveLabel)
						}
						// setting aria-multiline to true when not mobile appearance.
						//  because somehow mobile tests are failing when it set.
						//  don't know why that is happening.
						// Created https://product-fabric.atlassian.net/jira/servicedesk/projects/DTR/queues/issue/DTR-1675
						//  to investigate further.
						aria-multiline={true}
						role="textbox"
						id={EDIT_AREA_ID}
						aria-describedby={assistiveDescribedBy}
						data-editor-id={editorId.current}
						data-vc-ignore-if-no-layout-shift={true}
					/>
				</>
			);
		},
		[handleEditorViewRef, props.intl],
	);

	const previousPreset = usePreviousState(preset);

	useLayoutEffect(() => {
		if (previousPreset && previousPreset !== preset) {
			reconfigureState(props);
		}
	}, [reconfigureState, previousPreset, preset, props]);

	const previousDisabledState = usePreviousState(disabled);

	useLayoutEffect(() => {
		if (viewRef.current && previousDisabledState !== disabled) {
			// Disables the contentEditable attribute of the editor if the editor is disabled
			viewRef.current.setProps({
				editable: (_state) => !disabled,
			} as DirectEditorProps);

			const isLivePageWithContent =
				(__livePage ||
					expValEquals('platform_editor_no_cursor_on_edit_page_init', 'isEnabled', true)) &&
				!isEmptyDocument(viewRef.current.state.doc);
			if (!disabled && shouldFocus && !isLivePageWithContent) {
				focusTimeoutId.current = handleEditorFocus(viewRef.current);
			}

			if (
				expValEquals('platform_editor_no_cursor_on_edit_page_init', 'isEnabled', true) &&
				fg('cc_editor_focus_before_editor_on_load')
			) {
				if (!disabled && shouldFocus && !isEmptyDocument(viewRef.current.state.doc)) {
					focusEditorElement(editorId.current);
				}
			}
		}
	}, [disabled, shouldFocus, previousDisabledState, __livePage]);

	useFireFullWidthEvent(nextAppearance, dispatchAnalyticsEvent);

	const editor = useMemo(
		() => createEditor(props.editorProps.assistiveLabel, props.editorProps.assistiveDescribedBy),
		// `createEditor` changes a little too frequently - we don't want to recreate the editor view in this case
		// We should follow-up
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[props.editorProps.assistiveLabel, props.editorProps.assistiveDescribedBy],
	);

	// Render tracking is firing too many events in Jira so we are disabling them for now. See - https://product-fabric.atlassian.net/browse/ED-25616
	// Also firing too many events for the legacy content macro, so disabling for now. See - https://product-fabric.atlassian.net/browse/ED-26650
	const renderTrackingEnabled =
		!fg('platform_editor_disable_rerender_tracking_jira') && !featureFlags.lcmPreventRenderTracking;

	return (
		<ReactEditorViewContext.Provider
			value={{
				editorRef: editorRef,
				editorView: viewRef.current,
				popupsMountPoint: props.editorProps.popupsMountPoint,
			}}
		>
			{renderTrackingEnabled && (
				<RenderTracking
					componentProps={props}
					action={ACTION.RE_RENDERED}
					actionSubject={ACTION_SUBJECT.REACT_EDITOR_VIEW}
					handleAnalyticsEvent={handleAnalyticsEvent}
					useShallow={true}
				/>
			)}

			{props.render
				? props.render?.({
						editor,
						view: viewRef.current,
						config: config.current,
						eventDispatcher: eventDispatcher,
						transformer: contentTransformer.current,
						dispatchAnalyticsEvent: dispatchAnalyticsEvent,
						editorRef: editorRef,
						editorAPI: editorAPI,
					}) ?? editor
				: editor}
		</ReactEditorViewContext.Provider>
	);
}

export default injectIntl(ReactEditorView);
