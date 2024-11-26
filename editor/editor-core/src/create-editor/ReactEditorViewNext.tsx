import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { injectIntl } from 'react-intl-next';
import type { WrappedComponentProps } from 'react-intl-next';
import uuid from 'uuid/v4';

import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	fireAnalyticsEvent,
	PLATFORMS,
} from '@atlaskit/editor-common/analytics';
import type {
	AnalyticsDispatch,
	AnalyticsEventPayload,
	DispatchAnalyticsEvent,
	FireAnalyticsCallback,
} from '@atlaskit/editor-common/analytics';
import { useConstructor, usePreviousState } from '@atlaskit/editor-common/hooks';
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
import {
	analyticsEventKey,
	getAnalyticsEventSeverity,
} from '@atlaskit/editor-common/utils/analytics';
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

import { useProviders } from '../composable-editor/hooks/useProviders';
import { createDispatch, EventDispatcher } from '../event-dispatcher';
import type { EditorConfig, EditorProps } from '../types';
import type { EditorViewStateUpdatedCallbackProps } from '../types/editor-config';
import type { EditorNextProps } from '../types/editor-props';
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
import { createFeatureFlagsFromProps } from './feature-flags-from-props';
import { editorMessages } from './messages';
import { getUAPrefix } from './ReactEditorView/getUAPrefix';
import { handleEditorFocus } from './ReactEditorView/handleEditorFocus';
import { useDispatchTransaction } from './ReactEditorView/useDispatchTransaction';
import { useFireFullWidthEvent } from './ReactEditorView/useFireFullWidthEvent';
import { usePluginPerformanceObserver } from './ReactEditorView/usePluginPerformanceObserver';
import ReactEditorViewContext from './ReactEditorViewContext';

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

function ReactEditorView(props: EditorViewProps) {
	const {
		preset,
		editorProps: {
			appearance: nextAppearance,
			disabled,
			featureFlags: editorPropFeatureFlags,
			errorReporterHandler,
			defaultValue,
		},
	} = props;
	const [editorAPI, setEditorAPI] = useState<PublicPluginAPI<ReactEditorViewPlugins> | undefined>(
		undefined,
	);
	const editorRef = useRef<HTMLDivElement | null>(null);
	const viewRef = useRef<EditorView | undefined>();
	const focusTimeoutId = useRef<number | undefined>();
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

	useLayoutEffect(() => {
		setEditorAPI(pluginInjectionAPI.current.api());
	}, []);

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
				if (api?.collabEdit !== undefined && fg('editor_load_conf_collab_docs_without_checks')) {
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

			// We cannot currently guarentee when all the portals will have re-rendered during a reconfigure
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
			props.editorProps.onChange?.(viewRef.current, { source: 'local' });
		},
		[blur, createEditorState, props],
	);

	// Initialise phase
	// Using constructor hook so we setup and dispatch analytics before anything else
	useConstructor(() => {
		dispatchAnalyticsEvent({
			action: ACTION.STARTED,
			actionSubject: ACTION_SUBJECT.EDITOR,
			attributes: {
				platform: PLATFORMS.WEB,
				featureFlags: featureFlags ? getEnabledFeatureFlagKeys(featureFlags) : [],
			},
			eventType: EVENT_TYPE.UI,
		});
		// Transaction dispatching is already enabled by default prior to
		// mounting, but we reset it here, just in case the editor view
		// instance is ever recycled (mounted again after unmounting) with
		// the same key.
		// Although storing mounted state is an anti-pattern in React,
		// we do so here so that we can intercept and abort asynchronous
		// ProseMirror transactions when a dismount is imminent.
		canDispatchTransactions.current = true;
		// This needs to be before initialising editorState because
		// we dispatch analytics events in plugin initialisation
		eventDispatcher.on(analyticsEventKey, handleAnalyticsEvent);
		eventDispatcher.on('resetEditorState', resetEditorState);
	});

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

			// We cannot currently guarentee when all the portals will have re-rendered during a reconfigure
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

			// ED-25839: Investigate if we also want to migrate this API to use `onEditorStateUpdated` in `createPMPlugins`
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
	});

	// TODO: Remove these when we deprecate these props from editor-props - smartLinks is unfortunately still used in some places, we can sidestep this problem if we move everyone across to ComposableEditor and deprecate Editor
	const UNSAFE_cards = (props.editorProps as EditorProps).UNSAFE_cards;
	const smartLinks = (props.editorProps as EditorProps).smartLinks;

	// Temporary to replace provider factory while migration to `ComposableEditor` occurs
	useProviders({
		editorApi: editorAPI,
		contextIdentifierProvider: props.editorProps.contextIdentifierProvider,
		mediaProvider: (props.editorProps as EditorProps).media?.provider,
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
					// Prevent runtime exeptions from async transactions that would attempt to
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

			// Creates the editor-view from this.editorState. If an editor has been mounted
			// previously, this will contain the previous state of the editor.
			const view = new EditorView({ mount: node }, getDirectEditorProps());
			viewRef.current = view;
			pluginInjectionAPI.current.onEditorViewUpdated({
				newEditorState: viewRef.current.state,
				oldEditorState: undefined,
			});
			return view;
		},
		[getDirectEditorProps, dispatchAnalyticsEvent],
	);

	const [_, setEditorView] = useState<EditorView | undefined>(undefined);

	const {
		onEditorCreated,
		onEditorDestroyed,
		editorProps: { shouldFocus },
	} = props;

	const handleEditorViewRef = useCallback(
		(node: HTMLDivElement) => {
			if (!viewRef.current && node) {
				const view = createEditorView(node);

				onEditorCreated({
					view,
					config: config.current,
					eventDispatcher: eventDispatcher,
					transformer: contentTransformer.current,
				});

				if (shouldFocus && view.props.editable && view.props.editable(view.state)) {
					focusTimeoutId.current = handleEditorFocus(view);
				}

				// Force React to re-render so consumers get a reference to the editor view
				setEditorView(view);
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

				viewRef.current = undefined;
			}
		},
		[
			createEditorView,
			handleAnalyticsEvent,
			onEditorDestroyed,
			onEditorCreated,
			shouldFocus,
			eventDispatcher,
		],
	);

	const createEditor = useCallback(
		(assistiveLabel?: string, assistiveDescribedBy?: string) => {
			return (
				<div
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={getUAPrefix()}
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
				/>
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

			if (!disabled && shouldFocus) {
				focusTimeoutId.current = handleEditorFocus(viewRef.current);
			}
		}
	}, [disabled, shouldFocus, previousDisabledState]);

	useFireFullWidthEvent(nextAppearance, dispatchAnalyticsEvent);

	usePluginPerformanceObserver(getCurrentEditorState, pluginInjectionAPI, dispatchAnalyticsEvent);

	const editor = useMemo(
		() => createEditor(props.editorProps.assistiveLabel, props.editorProps.assistiveDescribedBy),
		// `createEditor` changes a little too frequently - we don't want to recreate the editor view in this case
		// We should follow-up
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[props.editorProps.assistiveLabel, props.editorProps.assistiveDescribedBy],
	);

	return (
		<ReactEditorViewContext.Provider
			value={{
				editorRef: editorRef,
				editorView: viewRef.current,
				popupsMountPoint: props.editorProps.popupsMountPoint,
			}}
		>
			<RenderTracking
				componentProps={props}
				action={ACTION.RE_RENDERED}
				actionSubject={ACTION_SUBJECT.REACT_EDITOR_VIEW}
				handleAnalyticsEvent={handleAnalyticsEvent}
				useShallow={true}
			/>
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
