import React, { useCallback, useLayoutEffect, useMemo, useRef, useState, useEffect } from 'react';

import { injectIntl } from 'react-intl';
import type { WrappedComponentProps, WithIntlProps } from 'react-intl';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
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
import { isSSR } from '@atlaskit/editor-common/core-utils';
import { createDispatch, EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { useConstructor, usePreviousState } from '@atlaskit/editor-common/hooks';
import { isPerformanceAPIAvailable } from '@atlaskit/editor-common/is-performance-api-available';
import { nodeVisibilityManager } from '@atlaskit/editor-common/node-visibility';
import { getEnabledFeatureFlagKeys } from '@atlaskit/editor-common/normalize-feature-flags';
import { measureRender } from '@atlaskit/editor-common/performance/measure-render';
import {
	getRequestToResponseTime,
	getResponseEndTime,
} from '@atlaskit/editor-common/performance/navigation';
import {
	profileSSROperation,
	SSRRenderMeasure,
} from '@atlaskit/editor-common/performance/ssr-measures';
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
import type { PublicPluginAPI, Transformer } from '@atlaskit/editor-common/types';
import { ReactEditorViewContext } from '@atlaskit/editor-common/ui-react';
import {
	analyticsEventKey,
	getAnalyticsEventSeverity,
} from '@atlaskit/editor-common/utils/analytics';
import { isEmptyDocument } from '@atlaskit/editor-common/utils/document';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Plugin, Transaction } from '@atlaskit/editor-prosemirror/state';
import { EditorState, Selection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { DirectEditorProps } from '@atlaskit/editor-prosemirror/view';
import { EditorView } from '@atlaskit/editor-prosemirror/view';
import { EditorSSRRenderer } from '@atlaskit/editor-ssr-renderer';
import { fg } from '@atlaskit/platform-feature-flags';
import { getInteractionId } from '@atlaskit/react-ufo/interaction-id-context';
import { abortAll, getActiveInteraction } from '@atlaskit/react-ufo/interaction-metrics';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import { useProviders } from '../composable-editor/hooks/useProviders';
import type { EditorConfig, EditorViewStateUpdatedCallbackProps } from '../types/editor-config';
import type { EditorNextProps, EditorProps } from '../types/editor-props';
import { createFeatureFlagsFromProps } from '../utils/feature-flags-from-props';
import { getNodesCountWithExtensionKeys } from '../utils/getNodesCountWithExtensionKeys';
import { getNodesVisibleInViewport } from '../utils/getNodesVisibleInViewport';
import { isChromeless } from '../utils/is-chromeless';
import { isFullPage } from '../utils/is-full-page';
import { RenderTracking } from '../utils/performance/components/RenderTracking';
import measurements from '../utils/performance/measure-enum';

import {
	PROSEMIRROR_RENDERED_DEGRADED_SEVERITY_THRESHOLD,
	PROSEMIRROR_RENDERED_NORMAL_SEVERITY_THRESHOLD,
} from './consts';
import { processPluginsList } from './create-editor';
import createPluginsList from './create-plugins-list';
import { createSchema } from './create-schema';
import { createErrorReporter } from './createErrorReporter';
import { createPMPlugins } from './createPMPlugins';
import { filterPluginsForReconfigure } from './filter-plugins-for-reconfigure';
import { editorMessages } from './messages';
import { focusEditorElement } from './ReactEditorView/focusEditorElement';
import { getUAPrefix } from './ReactEditorView/getUAPrefix';
import { handleEditorFocus } from './ReactEditorView/handleEditorFocus';
import { useDispatchTransaction } from './ReactEditorView/useDispatchTransaction';
import { useFireFullWidthEvent } from './ReactEditorView/useFireFullWidthEvent';

const EDIT_AREA_ID = 'ak-editor-textarea';
const SSR_TRACE_SEGMENT_NAME = 'reactEditorView';
const bootStartTime = isPerformanceAPIAvailable() ? performance.now() : undefined;

export interface EditorViewProps extends WrappedComponentProps {
	createAnalyticsEvent?: CreateUIAnalyticsEvent;
	disabled?: boolean;
	editorProps: (EditorProps | EditorNextProps) & {
		preset?: EditorNextProps['preset'];
	};
	nodeViewPortalProviderAPI: PortalProviderAPI;
	onEditorCreated: (instance: {
		config: EditorConfig;
		eventDispatcher: EventDispatcher;
		transformer?: Transformer<string>;
		view: EditorView;
	}) => void;
	onEditorDestroyed: (instance: {
		config: EditorConfig;
		eventDispatcher: EventDispatcher;
		transformer?: Transformer<string>;
		view: EditorView;
	}) => void;
	onSSRMeasure?: (measure: {
		endTimestamp: number;
		segmentName: string;
		startTimestamp: number;
	}) => void;
	portalProviderAPI: PortalProviderAPI;
	preset: EditorPresetBuilder<string[], AllEditorPresetPluginTypes[]>;
	providerFactory: ProviderFactory;
	render?: (props: {
		config: EditorConfig;
		dispatchAnalyticsEvent: DispatchAnalyticsEvent;
		editor: JSX.Element;
		// We can't know this type at runtime
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		editorAPI: PublicPluginAPI<any> | undefined;
		editorRef: React.RefObject<HTMLDivElement>;
		eventDispatcher: EventDispatcher;
		transformer?: Transformer<string>;
		view?: EditorView;
	}) => JSX.Element;
}

interface CreateEditorStateOptions {
	doc?: string | Object | PMNode;
	props: EditorViewProps;
	resetting?: boolean;
	selectionAtStart?: boolean;
}

// `markdown↔rich` toggles drop different node/mark sets, so the unique
// name set is enough to detect when a destructive rebuild is needed.
function sameNames(a: Iterable<string>, b: Iterable<string>): boolean {
	const setA = new Set(a);
	const setB = new Set(b);
	if (setA.size !== setB.size) {
		return false;
	}
	for (const name of setA) {
		if (!setB.has(name)) {
			return false;
		}
	}
	return true;
}

function schemaShapeChanged(
	current: Schema,
	next: { marks: ReadonlyArray<{ name: string }>; nodes: ReadonlyArray<{ name: string }> },
): boolean {
	return (
		!sameNames(
			Object.keys(current.nodes),
			next.nodes.map((n) => n.name),
		) ||
		!sameNames(
			Object.keys(current.marks),
			next.marks.map((m) => m.name),
		)
	);
}

export function ReactEditorView(props: EditorViewProps): React.JSX.Element {
	// Should be always the first statement in the component
	const firstRenderStartTimestampRef = useRef(performance.now());

	const {
		preset,
		editorProps: {
			onSSRMeasure,
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

	const ssrEditorStateRef = useRef<EditorState | undefined>(undefined);
	const editorRef = useRef<HTMLDivElement | null>(null);
	const viewRef = useRef<EditorView | undefined>();
	const focusTimeoutId = useRef<number | undefined | void>();
	// ProseMirror is instantiated prior to the initial React render cycle,
	// so we allow transactions by default, to avoid discarding the initial one.
	const canDispatchTransactions = useRef(true);

	// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
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
	const getEditorState = useCallback(() => ssrEditorStateRef.current ?? viewRef.current?.state, []);
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
			appearance: nextAppearance,
		}),
	);

	const parseDoc = useCallback(
		(
			schema: Schema,
			api: ReturnType<typeof pluginInjectionAPI.current.api> | undefined,
			options: {
				doc?: CreateEditorStateOptions['doc'];
				props: Pick<CreateEditorStateOptions['props'], 'providerFactory' | 'editorProps'>;
			},
		): PMNode | undefined => {
			if (!options.doc) {
				return undefined;
			}

			// if the collabEdit API is set, skip this validation due to potential pm validation errors
			// from docs that end up with invalid marks after processing (See #hot-111702 for more details)
			if (isSSR() || api?.collabEdit !== undefined || options.props.editorProps.skipValidation) {
				return processRawValueWithoutValidation(schema, options.doc, dispatchAnalyticsEvent);
			} else {
				return processRawValue(
					schema,
					options.doc,
					options.props.providerFactory,
					options.props.editorProps.sanitizePrivateContent,
					contentTransformer.current,
					dispatchAnalyticsEvent,
				);
			}
		},
		[dispatchAnalyticsEvent],
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
					createPluginsList(
						options.props.preset,
						'allowBlockType' in props.editorProps ? props.editorProps : {},
						pluginInjectionAPI.current,
					),
				);
				if (expValEquals('platform_editor_appearance_shared_state', 'isEnabled', true)) {
					config.current.pmPlugins.push(...pluginInjectionAPI.current.getInternalPMPlugins());
				}

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
				onEditorStateUpdated: pluginInjectionAPI.current.onEditorViewUpdated,
			});

			contentTransformer.current = contentTransformerProvider
				? contentTransformerProvider(schema)
				: undefined;

			const api = pluginInjectionAPI.current.api();

			// If we have a doc prop, we need to process it into a PMNode
			const doc = parseDoc(schema, api, options);

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
			parseDoc,
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
		() => {
			if (isSSR()) {
				// We don't need to create initial state in SSR, it would be done by EditorSSRRenderer,
				// so we can save some CPU time here.
				return undefined;
			}

			return createEditorState({
				props,
				doc: defaultValue,
				// ED-4759: Don't set selection at end for full-page editor - should be at start.
				selectionAtStart: isFullPage(nextAppearance),
			});
		},
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
		if (isSSR()) {
			return;
		}

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
		if (isSSR()) {
			// No cleanup in SSR should happened because SSR doesn't render a real editor.
			return;
		}

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

	// Bumped after `reconfigureState` so the render prop re-reads the
	// in-place-mutated `config.current` (contentComponents / toolbar
	// components from the rebuilt preset).
	const [, bumpConfigVersion] = useState(0);

	// Preset reference last processed by reconfigureState. Used to skip the
	// destructive work (plugin filter, schema rebuild) when reconfigure is
	// called with the same preset.
	const lastProcessedPresetRef = useRef<unknown>(null);

	const reconfigureState = useCallback(
		(props: EditorViewProps) => {
			if (!viewRef.current) {
				return;
			}

			// We cannot currently guarantee when all the portals will have re-rendered during a reconfigure
			// so we blur here to stop ProseMirror from trying to apply selection to detached nodes or
			// nodes that haven't been re-rendered to the document yet.
			blur();

			// Snapshot plugin names registered before createPluginsList runs, so
			// we can tell which plugins are newly added by the new preset vs.
			// which ones already coexisted with the current schema.
			const previousPluginNames = new Set(pluginInjectionAPI.current.getRegisteredPluginNames());

			let editorPlugins = createPluginsList(
				props.preset,
				'allowBlockType' in props.editorProps ? props.editorProps : {},
				pluginInjectionAPI.current,
			);

			// Capture once, before either downstream block updates the ref —
			// both the filter and the schema rebuild are destructive and only
			// want to run when the preset has actually changed.
			const presetChanged = lastProcessedPresetRef.current !== props.preset;

			// Build a candidate config from the *unfiltered* plugin list so we can
			// decide whether the schema rebuild path will run. Both the rebuild
			// decision and the drop-filter decision below depend on this answer,
			// so it has to be computed up-front.
			const buildConfig = (plugins: typeof editorPlugins) => {
				const c = processPluginsList(plugins);
				if (expValEquals('platform_editor_appearance_shared_state', 'isEnabled', true)) {
					c.pmPlugins.push(...pluginInjectionAPI.current.getInternalPMPlugins());
				}
				return c;
			};

			let nextConfig = buildConfig(editorPlugins);

			// `state.reconfigure` preserves the original schema, so a preset
			// toggle that should change schema (markdown↔rich) needs a fresh
			// `EditorState`. Resets all plugin state including undo history.
			//
			// Compare schema *shape* (node + mark name sets) rather than preset
			// identity: consumers commonly recreate the preset object on every
			// parent re-render, and a destructive rebuild on a no-op identity
			// change tears down all plugin state (e.g. unmounts the AI palette).
			const shouldRebuildSchema =
				presetChanged &&
				schemaShapeChanged(viewRef.current.state.schema, nextConfig) &&
				expValEqualsNoExposure('cc-markdown-mode', 'isEnabled', true);

			// `state.reconfigure` keeps the original schema, so switching presets
			// can leave the editor inconsistent in two ways:
			//   1. The new preset may add plugins that reference schema nodes or
			//      marks the original schema doesn't have.
			//   2. Plugins registered by a previous preset can linger in the
			//      injection API even when the new preset doesn't re-register
			//      them, so listeners still fire against a state that no longer
			//      has their pmPlugin.
			//
			// When the schema is being rebuilt below, the new schema is built
			// from the *unfiltered* plugin list — so dropping plugins whose
			// nodes/marks the OLD schema lacks would wrongly remove the very
			// plugins the rebuild is meant to admit. Skip the drop step in that
			// case (purpose 1) but always reconcile the injection API
			// (purpose 2). When NOT rebuilding, run both — even under the
			// `cc-markdown-mode` experiment, otherwise no-op preset identity
			// changes would silently leave a broken plugin/schema mismatch.
			if (presetChanged && fg('platform_editor_reconfigure_filter_plugins')) {
				let dropped: ReturnType<typeof filterPluginsForReconfigure>['dropped'] = [];
				if (!shouldRebuildSchema) {
					const result = filterPluginsForReconfigure(
						editorPlugins,
						viewRef.current.state.schema,
						previousPluginNames,
					);
					if (result.dropped.length > 0) {
						editorPlugins = result.kept;
						// Plugin list changed — rebuild candidate config to match.
						nextConfig = buildConfig(editorPlugins);
					}
					dropped = result.dropped;
				}

				const keptPluginNames = new Set(
					editorPlugins.map((p) => p?.name).filter((n): n is string => Boolean(n)),
				);
				const evictedFromApi = pluginInjectionAPI.current.retainPlugins(keptPluginNames);

				if (dropped.length > 0 || evictedFromApi.length > 0) {
					// eslint-disable-next-line no-console
					console.warn('[reconfigureState] Cleanup summary:', {
						dropped,
						evictedFromApi,
					});
				}
			}

			config.current = nextConfig;

			const state = viewRef.current.state;

			let newState: EditorState;

			if (shouldRebuildSchema) {
				const newSchema = createSchema(config.current);

				let newDoc: PMNode;
				try {
					newDoc = PMNode.fromJSON(newSchema, state.doc.toJSON());
				} catch (e) {
					// eslint-disable-next-line no-console
					console.error(
						'[reconfigureState] Failed to migrate doc to new schema; resetting to empty doc',
						e,
					);
					const empty = newSchema.topNodeType.createAndFill();
					if (!empty) {
						throw new Error(
							'reconfigureState: doc migration failed and new schema cannot create an empty top node',
						);
					}
					newDoc = empty;
				}

				let newSelection: Selection;
				try {
					newSelection = Selection.fromJSON(newDoc, state.selection.toJSON());
				} catch {
					// Old selection's positions / node types may not map onto the new schema.
					newSelection = Selection.atStart(newDoc);
				}

				const plugins = createPMPlugins({
					schema: newSchema,
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
					onEditorStateUpdated: pluginInjectionAPI.current.onEditorViewUpdated,
				});

				newState = EditorState.create({
					schema: newSchema,
					doc: newDoc,
					selection: newSelection,
					plugins: plugins as Plugin[],
				});
			} else {
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
					onEditorStateUpdated: pluginInjectionAPI.current.onEditorViewUpdated,
				});

				newState = state.reconfigure({ plugins: plugins as Plugin[] });
			}

			if (presetChanged) {
				lastProcessedPresetRef.current = props.preset;
			}

			// need to update the state first so when the view builds the nodeviews it is
			// using the latest plugins
			viewRef.current.updateState(newState);

			const result = viewRef.current.update({ ...viewRef.current.props, state: newState });

			// The new collab-edit plugin instance starts with `isReady=false`.
			// The rebind path in editor-plugin-collab-edit's initialize.ts is
			// gated on `provider.getInitPayload`, which the Confluence NCS
			// provider does not implement, so the placeholder spinner would
			// never clear. Re-seeding here is safe: the prior state must have
			// had `isReady=true` for the user to have triggered the toggle.
			//
			// Must run AFTER `view.update({ state: newState })`: that call resets
			// the view's state to the captured `newState` reference, so a
			// dispatch placed before it would advance `view.state` to a value
			// that `update` then silently overwrites — discarding the meta and
			// leaving `isReady=false`.
			if (shouldRebuildSchema) {
				// `state.collabEditPlugin$` is the property PM derives from the
				// collab plugin's PluginKey; cast through `unknown` to read it.
				const collabState = (
					viewRef.current.state as unknown as {
						collabEditPlugin$?: { isReady?: boolean };
					}
				).collabEditPlugin$;
				if (collabState && collabState.isReady !== true) {
					viewRef.current.dispatch(viewRef.current.state.tr.setMeta('collabInitialised', true));
				}
			}

			// EDITOR-6702: gated until we have a broader gate; reconfigure is a
			// low-level path so use NoExposure.
			if (expValEqualsNoExposure('cc-markdown-mode', 'isEnabled', true)) {
				// Force a render so PluginSlot picks up the new preset's content
				// components against the new state.
				bumpConfigVersion((v) => v + 1);
			}

			return result;
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
			config.current?.onEditorViewStateUpdatedCallbacks.forEach((entry: EditorConfig['onEditorViewStateUpdatedCallbacks'][number]) => {
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
		editorApi: pluginInjectionAPI.current.api(),
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
			const stateToUse = state ?? getCurrentEditorState();
			if (!stateToUse) {
				// This should not be happened, because initialState is only inavailable in SSR,
				// but in SSR this function should never be called.
				// In SSR we should use EditorSSRRenderer instead usual ProseMirror editor.
				throw new Error('No editor state found');
			}

			return {
				state: stateToUse,
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
						const { nodes, extensionKeys } = getNodesCountWithExtensionKeys(
							viewRef.current.state.doc,
						);
						const ttfb = getResponseEndTime();
						const requestToResponseTime = getRequestToResponseTime();

						const contextIdentifier = pluginInjectionAPI.current
							.api()
							.base?.sharedState.currentState() as ContextIdentifierProvider | undefined;

						const nodesInViewport = getNodesVisibleInViewport(viewRef.current.dom);

						const nodeSize = viewRef.current.state.doc.nodeSize;
						const { totalNodes, nodeSizeBucket } = expValEquals(
							'cc_editor_insm_doc_size_stats',
							'isEnabled',
							true,
						)
							? {
									totalNodes: Object.values(nodes).reduce((acc, curr) => acc + curr, 0),
									// Computed on client for dimension bucketing in Statsig
									nodeSizeBucket: (() => {
										switch (true) {
											case nodeSize < 10000:
												return '<10000';
											case nodeSize < 20000:
												return '<20000';
											case nodeSize < 30000:
												return '<30000';
											case nodeSize < 40000:
												return '<40000';
											case nodeSize < 50000:
												return '<50000';
											default:
												return '50000+';
										}
									})(),
								}
							: {};

						const interaction = getActiveInteraction();
						const pageLoadType = interaction?.type;
						const pageType = interaction?.routeName;
						const timings = (() => {
							if (requestToResponseTime === undefined && bootStartTime === undefined) {
								return undefined;
							}

							const timingValues: {
								bootToRender?: number;
								'requestStart->responseEnd'?: number;
							} = {};

							if (requestToResponseTime !== undefined) {
								timingValues['requestStart->responseEnd'] = Math.round(requestToResponseTime);
							}

							if (bootStartTime !== undefined) {
								timingValues.bootToRender = Math.round(startTime - bootStartTime);
							}

							return timingValues;
						})();

						const attributes = {
							duration,
							startTime,
							nodes,
							nodesInViewport,
							nodeSize,
							nodeSizeBucket,
							totalNodes,
							ttfb,
							severity: proseMirrorRenderedSeverity,
							objectId: contextIdentifier?.objectId,
							distortedDuration,
							pageLoadType,
							pageType,
							timings,
							extensionKeys,
							ufoInteractionId: getInteractionId().current,
						};

						dispatchAnalyticsEvent({
							action: ACTION.PROSEMIRROR_RENDERED,
							actionSubject: ACTION_SUBJECT.EDITOR,
							attributes,
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
	if (editorRef.current !== null && !isNestedEditorCalculated.current) {
		isNestedEditor.current = !!editorRef.current?.closest('.extension-editable-area');
		isNestedEditorCalculated.current = true;
	}

	const originalScrollToRestore = React.useRef(
		!isNestedEditor.current && isFullPage(props.editorProps.appearance)
			? document.querySelector('[data-editor-scroll-container]')?.scrollTop
			: undefined,
	);

	const mitigateScrollJump =
		// The feature gate here is being used to avoid potential bugs with the scroll restoration code
		// moving it to the end of the expression negates the point of the feature gate
		// eslint-disable-next-line @atlaskit/platform/no-preconditioning
		isFullPage(props.editorProps.appearance) &&
		originalScrollToRestore.current &&
		originalScrollToRestore.current !== 0;

	useLayoutEffect(() => {
		if (isSSR()) {
			// We don't need to focus anything in SSR.
			return;
		}

		if (shouldFocus && editorView?.props.editable?.(editorView.state)) {
			if (!mitigateScrollJump) {
				const liveDocWithContent =
					(__livePage ||
						expValEquals('platform_editor_no_cursor_on_edit_page_init', 'isEnabled', true)) &&
					!isEmptyDocument(editorView.state.doc);

				if (!liveDocWithContent) {
					focusTimeoutId.current = handleEditorFocus(editorView);
				}

				if (isChromeless(props.editorProps.appearance)) {
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
		}
	}, [
		editorView,
		shouldFocus,
		__livePage,
		mitigateScrollJump,
		disabled,
		props.editorProps.appearance,
	]);

	const scrollElement = React.useRef<Element | null>();
	const possibleListeners = React.useRef([] as [event: string, handler: () => void][]);

	useEffect(() => {
		if (isSSR()) {
			// No event listeners should be attached to scroll element in SSR.
			return;
		}

		return () => {
			if (scrollElement.current) {
				// eslint-disable-next-line react-hooks/exhaustive-deps
				for (const possibleListener of possibleListeners.current) {
					// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
					scrollElement.current?.removeEventListener(...possibleListener);
				}
			}
			scrollElement.current = null;
		};
	}, []);

	const handleEditorViewRef = useCallback(
		(node: HTMLDivElement) => {
			if (node) {
				// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage
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

			if (!viewRef.current && node) {
				nodeVisibilityManager(node).initialiseNodeObserver();

				const view = createEditorView(node);

				if (mitigateScrollJump) {
					const scrollElement = document.querySelector('[data-editor-scroll-container]');

					scrollElement?.scrollTo({
						top: originalScrollToRestore.current,
						behavior: 'instant',
					});
				}

				onEditorCreated({
					view,
					config: config.current,
					eventDispatcher: eventDispatcher,
					transformer: contentTransformer.current,
				});

				React.startTransition(() => {
					// Force React to re-render so consumers get a reference to the editor view
					setEditorView(view);
				});
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
			onEditorDestroyed,
			handleAnalyticsEvent,
			mitigateScrollJump,
		],
	);

	const isPageAppearance = isFullPage(nextAppearance) || nextAppearance === 'max';

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
							assistiveLabel ||
							(isPageAppearance
								? props.intl.formatMessage(editorMessages.fullPageEditorAssistiveLabel)
								: props.intl.formatMessage(editorMessages.editorAssistiveLabel))
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
						data-ssr-placeholder="editor-view"
						data-ssr-placeholder-replace="editor-view"
						// eslint-disable-next-line react/no-danger -- needed for SSR and hydration so react keeps the HTML untouched
						dangerouslySetInnerHTML={{ __html: '' }}
					/>
				</>
			);
		},
		[handleEditorViewRef, isPageAppearance, props.intl],
	);

	const previousPreset = usePreviousState(preset);

	useLayoutEffect(() => {
		if (isSSR()) {
			// No state reconfiguration is supported in SSR.
			return;
		}

		if (previousPreset && previousPreset !== preset) {
			reconfigureState(props);
		}
	}, [reconfigureState, previousPreset, preset, props]);

	const previousDisabledState = usePreviousState(disabled);

	useLayoutEffect(() => {
		if (isSSR()) {
			// We don't need to focus anything in SSR.
			return;
		}

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

	useLayoutEffect(() => {
		if (expValEquals('platform_editor_appearance_shared_state', 'isEnabled', true)) {
			pluginInjectionAPI.current.api()?.core?.actions?.updateAppearance(nextAppearance);
		}
	}, [nextAppearance]);

	useFireFullWidthEvent(nextAppearance, dispatchAnalyticsEvent);

	// This function uses as prop as `<EditorSSRRenderer>` so, that should be memoized,
	// to avoid extra rerenders.
	const buildDoc = useCallback(
		(schema: Schema) => {
			return parseDoc(schema, undefined, {
				// Don't pass all props here, use only what you need to keep hook dependencies more stable.
				// Check what `parseDoc` consumes and pass only needed data.
				props: {
					providerFactory: props.providerFactory,
					editorProps: {
						sanitizePrivateContent: props.editorProps.sanitizePrivateContent,
					},
				},
				doc: defaultValue,
			});
		},
		[defaultValue, parseDoc, props.editorProps.sanitizePrivateContent, props.providerFactory],
	);

	// We need to check `allowBlockType` in props, because it is now exist in EditorNextProps type.
	const { allowBlockType } =
		'allowBlockType' in props.editorProps
			? props.editorProps
			: ({ allowBlockType: undefined } satisfies EditorProps);

	// In separate memo, because some props like `props.intl` that need only for rendering
	// changes many times, but we don't want to process plugins and ADF document for each unnecessary changes.
	const ssrDeps = useMemo(() => {
		if (!isSSR()) {
			return null;
		}

		const doCreatePluginList = () =>
			createPluginsList(
				props.preset,
				// Don't pass props.editorProps directly, because editoProps in the dependency will lead to
				// multiple repaints, because props.editorPros is not stable object.
				{ allowBlockType },
				pluginInjectionAPI.current,
			);
		const plugins = profileSSROperation(
			`${SSR_TRACE_SEGMENT_NAME}/createPluginsList`,
			doCreatePluginList,
			onSSRMeasure,
		);

		const doCreateSchema = () => createSchema(processPluginsList(plugins));
		const schema = profileSSROperation(
			`${SSR_TRACE_SEGMENT_NAME}/createSchema`,
			doCreateSchema,
			onSSRMeasure,
		);

		const doBuildDoc = () => buildDoc(schema);
		const doc = profileSSROperation(`${SSR_TRACE_SEGMENT_NAME}/buildDoc`, doBuildDoc, onSSRMeasure);

		return { plugins, schema, doc };
	}, [allowBlockType, buildDoc, props.preset, onSSRMeasure]);

	const { assistiveLabel, assistiveDescribedBy } = props.editorProps;
	const handleSsrEditorStateChanged = useCallback(
		(state: EditorState) => {
			ssrEditorStateRef.current = state;
			// Notify listeners about the initial SSR state
			pluginInjectionAPI.current.onEditorViewUpdated({
				newEditorState: state,
				oldEditorState: undefined,
			});
		},
		[pluginInjectionAPI],
	);
	const memoizedReactEditorViewContext = useMemo(
		() => ({
			editorRef,
			// Use a getter so that consumers always read the live viewRef.current at access
			// time, not a stale snapshot captured when this memo was created.
			get editorView() {
				return viewRef.current;
			},
			popupsMountPoint: props.editorProps.popupsMountPoint,
		}),
		// viewRef is intentionally omitted from the deps array — it's a stable ref object; the getter reads
		// .current lazily so there's no stale-closure risk.
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[editorRef, props.editorProps.popupsMountPoint],
	);
	// eslint-disable-next-line @atlassian/perf-linting/no-inline-context-value, @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017
	const reactEditorViewContext = expValEquals(
		'platform_editor_perf_lint_cleanup',
		'isEnabled',
		true,
	)
		? memoizedReactEditorViewContext
		: {
				editorRef,
				editorView: viewRef.current,
				popupsMountPoint: props.editorProps.popupsMountPoint,
			};

	const ssrEditor = useMemo(() => {
		if (!ssrDeps) {
			return null;
		}

		return (
			<EditorSSRRenderer
				intl={props.intl}
				doc={ssrDeps.doc}
				schema={ssrDeps.schema}
				plugins={ssrDeps.plugins}
				portalProviderAPI={props.portalProviderAPI}
				// IMPORTANT: Keep next props in sync with div that renders a real ProseMirror editor.
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={`ProseMirror ${getUAPrefix()}`}
				key="ProseMirror"
				aria-label={
					assistiveLabel ||
					(isPageAppearance
						? props.intl.formatMessage(editorMessages.fullPageEditorAssistiveLabel)
						: props.intl.formatMessage(editorMessages.editorAssistiveLabel))
				}
				id={EDIT_AREA_ID}
				aria-describedby={assistiveDescribedBy}
				data-editor-id={editorId.current}
				onSSRMeasure={onSSRMeasure}
				// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
				onEditorStateChanged={
					expValEquals('platform_editor_perf_lint_cleanup', 'isEnabled', true)
						? handleSsrEditorStateChanged
						: (state) => {
								ssrEditorStateRef.current = state;
								// Notify listeners about the initial SSR state
								pluginInjectionAPI.current.onEditorViewUpdated({
									newEditorState: state,
									oldEditorState: undefined,
								});
							}
				}
			/>
		);
	}, [
		ssrDeps,
		props.intl,
		props.portalProviderAPI,
		assistiveLabel,
		isPageAppearance,
		assistiveDescribedBy,
		onSSRMeasure,
		handleSsrEditorStateChanged,
	]);

	const editor = useMemo(
		() => {
			// SSR editor will be available only in SSR environment,
			// in a browser `ssrEditor` will be `null`, and we will render a normal one ProseMirror.
			if (ssrEditor) {
				return ssrEditor;
			}

			return createEditor(props.editorProps.assistiveLabel, props.editorProps.assistiveDescribedBy);
		},
		// `createEditor` changes a little too frequently - we don't want to recreate the editor view in this case
		// We should follow-up
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[props.editorProps.assistiveLabel, props.editorProps.assistiveDescribedBy, ssrEditor],
	);

	// Render tracking is firing too many events in Jira so we are disabling them for now. See - https://product-fabric.atlassian.net/browse/ED-25616
	// Also firing too many events for the legacy content macro, so disabling for now. See - https://product-fabric.atlassian.net/browse/ED-26650
	const renderTrackingEnabled =
		!fg('platform_editor_disable_rerender_tracking_jira') && !featureFlags.lcmPreventRenderTracking;

	return (
		<SSRRenderMeasure
			segmentName={SSR_TRACE_SEGMENT_NAME}
			startTimestampRef={firstRenderStartTimestampRef}
			onSSRMeasure={onSSRMeasure}
		>
			<ReactEditorViewContext.Provider value={reactEditorViewContext}>
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
					? (props.render?.({
							editor,
							view: viewRef.current,
							config: config.current,
							eventDispatcher: eventDispatcher,
							transformer: contentTransformer.current,
							dispatchAnalyticsEvent: dispatchAnalyticsEvent,
							editorRef: editorRef,
							editorAPI: pluginInjectionAPI.current.api(),
						}) ?? editor)
					: editor}
			</ReactEditorViewContext.Provider>
		</SSRRenderMeasure>
	);
}

// Preserving exact type generated by TypeScript
// eslint-disable-next-line @typescript-eslint/ban-types
export default injectIntl(ReactEditorView) as React.FC<WithIntlProps<EditorViewProps>> & {
	WrappedComponent: React.ComponentType<EditorViewProps>;
};
