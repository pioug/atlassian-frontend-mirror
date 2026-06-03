import React from 'react';

import type { IntlShape } from 'react-intl';

import { ACTION_SUBJECT } from '@atlaskit/editor-common/analytics';
import { ErrorBoundary } from '@atlaskit/editor-common/error-boundary';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import ReactNodeView from '@atlaskit/editor-common/react-node-view';
import type { getPosHandler } from '@atlaskit/editor-common/react-node-view';
import type { ReactComponentProps } from '@atlaskit/editor-common/react-node-view';
import {
	SyncBlockSharedCssClassName,
	SyncBlockLabelSharedCssClassName,
	SyncBlockActionsProvider,
} from '@atlaskit/editor-common/sync-block';
import type {
	ExtractInjectionAPI,
	getPosHandlerNode,
	PMPluginFactoryParams,
} from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView, Decoration, DecorationSource } from '@atlaskit/editor-prosemirror/view';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import { removeSyncedBlockAtPos } from '../editor-commands';
import type { SyncedBlockPlugin, SyncedBlockPluginOptions } from '../syncedBlockPluginType';
import { SyncBlockRendererWrapper } from '../ui/SyncBlockRendererWrapper';
import { SyncBlockSSRReactContextsProvider } from '../ui/SyncBlockSSRReactContextsProvider';

// Event types that should be intercepted (returned as handled) when they
// originate inside the sync block content area, so ProseMirror does not
// convert them into node-level selections or drag operations and the browser
// can perform native text selection/cut instead.
const STOPPED_EVENT_TYPES: readonly string[] = [
	'mousedown',
	'mousemove',
	'mouseup',
	'click',
	'dblclick',
	'selectstart',
];

export interface SyncBlockNodeViewProps extends ReactComponentProps {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
	eventDispatcher: EventDispatcher;
	getPos: getPosHandlerNode;
	intl?: IntlShape;
	isNodeNested?: boolean;
	node: PMNode;
	options: SyncedBlockPluginOptions | undefined;
	portalProviderAPI: PortalProviderAPI;
	syncBlockStore?: SyncBlockStoreManager;
	view: EditorView;
}

export class SyncBlock extends ReactNodeView<SyncBlockNodeViewProps> {
	private options: SyncedBlockPluginOptions | undefined;
	private api?: ExtractInjectionAPI<SyncedBlockPlugin>;
	private syncBlockStore?: SyncBlockStoreManager;
	private intl?: IntlShape;

	constructor(props: SyncBlockNodeViewProps) {
		super(
			props.node,
			props.view,
			props.getPos,
			props.portalProviderAPI,
			props.eventDispatcher,
			props,
		);
		this.options = props.options;
		this.api = props.api;
		this.syncBlockStore = props.syncBlockStore;
		this.intl = props.intl;
	}

	// Stable callback references — defined as arrow properties so they keep a
	// fixed identity across render() calls, avoiding defeats of React.memo.
	// The experiment gate lives in render(); these are always available.

	private removeSyncBlockStable = () => {
		const pos = (this.getPos as getPosHandlerNode)();
		if (pos !== undefined) {
			removeSyncedBlockAtPos(this.api, pos);
		}
	};

	private fetchSyncBlockSourceInfoStable = (sourceAri: string) => {
		// store is guaranteed non-null: render() guards on syncBlockStore
		// before these callbacks can be invoked.
		const store =
			this.api?.syncedBlock?.sharedState.currentState()?.syncBlockStore ?? this.syncBlockStore;
		return store
			? store.referenceManager.fetchSyncBlockSourceInfoBySourceAri(sourceAri)
			: Promise.resolve(undefined);
	};

	unsubscribe: (() => void) | undefined;

	// Stored reference so the listener can be removed in destroy() to
	// avoid a memory leak on every nodeview destruction.
	private dragStartHandler: ((e: Event) => void) | undefined;

	createDomRef(): HTMLElement {
		// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage -- NodeView DOM must be created against active runtime document
		const domRef = document.createElement('div');
		domRef.classList.add(SyncBlockSharedCssClassName.prefix);
		if (fg('platform_synced_block_patch_14')) {
			// Prevent native browser drag on the contentEditable="false" wrapper.
			// Without this, clicking in empty space (outside the contentEditable
			// renderer but inside the domRef) initiates a native element drag.
			domRef.draggable = false;
			this.dragStartHandler = (e: Event) => {
				e.preventDefault();
			};
			// eslint-disable-next-line @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop, @repo/internal/dom-events/no-unsafe-event-listeners
			domRef.addEventListener('dragstart', this.dragStartHandler);
		}
		return domRef;
	}

	/**
	 * Allow mouse and selection events inside the renderer content to pass
	 * through to the browser so that users can select and copy text within a
	 * reference sync block.
	 *
	 * Events that originate inside the sync block content area (but not the label)
	 * are stopped so ProseMirror does not intercept them for node-level selection.
	 * This includes the full click-drag cycle (mousedown, mousemove, mouseup),
	 * click, dblclick, selectstart and cut. The `cut` event is stopped because
	 * mousedown explicitly sets a NodeSelection on the sync block — without
	 * stopping `cut`, a subsequent Ctrl+X would cause ProseMirror to delete the
	 * entire sync block node instead of cutting the user's text selection.
	 *
	 * Copy events are conditionally stopped: when the user has an active native
	 * text selection inside the renderer, `copy` is stopped so the browser handles
	 * it natively (copying the selected text). When there is no text selection
	 * (just a PM NodeSelection), `copy` is NOT stopped so ProseMirror's copy
	 * handler runs and sets the "sync-block-copied" flag for the reference paste flow.
	 *
	 * Events on the SyncBlockLabel are left for ProseMirror to handle, preserving
	 * label click interactions and the floating toolbar.
	 *
	 * The renderer wrapper sets contentEditable="true" to create a re-editable
	 * island inside ProseMirror's contentEditable="false" nodeview, enabling
	 * native text selection and preventing browser drag behaviour.
	 */
	stopEvent(event: Event): boolean {
		if (!fg('platform_synced_block_patch_14')) {
			return false;
		}

		const target = event.target;
		if (!(target instanceof Element)) {
			return false;
		}

		// Stop events inside the sync block content area, but not on the
		// SyncBlockLabel (to preserve label click interactions).
		if (
			target.closest(`.${SyncBlockSharedCssClassName.prefix}`) &&
			!target.closest(`.${SyncBlockLabelSharedCssClassName.labelClassName}`)
		) {
			const eventType = event.type;

			// Stop `copy` only when there is an active native text selection
			// inside the renderer. This lets the browser handle text copy
			// natively. When there is no text selection (just a PM
			// NodeSelection), we let PM handle the copy event so the
			// "sync-block-copied" flag is set for the reference paste flow.
			if (eventType === 'copy') {
				const selection = window.getSelection();
				return !!(selection && selection.toString().length > 0);
			}

			// For `cut`: when text is selected inside the renderer, stop the
			// event and prevent default to avoid the browser removing text from
			// the read-only content. When no text is selected (NodeSelection),
			// let PM handle it so cut deletes the sync block as expected.
			if (eventType === 'cut') {
				const selection = window.getSelection();
				if (selection && selection.toString().length > 0) {
					event.preventDefault();
					return true;
				}
				return false;
			}

			// Stop keyboard events that would cause PM to replace the
			// NodeSelection with typed text (deleting the sync block).
			// Allow modifier-key combos (Cmd+C, Cmd+A, etc.) through.
			// Allow Delete/Backspace through so PM's delete handler can
			// process them (e.g. show offline error flag).
			if (
				(eventType === 'keydown' || eventType === 'keypress') &&
				event instanceof KeyboardEvent &&
				!event.metaKey &&
				!event.ctrlKey &&
				event.key !== 'Delete' &&
				event.key !== 'Backspace'
			) {
				return true;
			}

			if (STOPPED_EVENT_TYPES.includes(eventType)) {
				// Ensure the syncBlock has a NodeSelection so the floating
				// toolbar is visible while the user interacts with the renderer.
				// stopEvent prevents PM from processing the mousedown, so we
				// need to explicitly set the selection ourselves.
				if (
					eventType === 'mousedown' &&
					!(
						this.view.state.selection instanceof NodeSelection &&
						this.view.state.selection.node === this.node
					)
				) {
					if (typeof this.getPos === 'function') {
						const pos = this.getPos();
						if (typeof pos === 'number') {
							try {
								const { tr } = this.view.state;
								this.view.dispatch(tr.setSelection(NodeSelection.create(tr.doc, pos)));
							} catch {
								// pos no longer valid — leave selection unchanged
							}
						}
					}
				}
				return true;
			}
		}
		return false;
	}

	validUpdate(currentNode: PMNode, newNode: PMNode): boolean {
		// Only consider as the valid update if the localId and resourceId are the same
		// This prevents PM reusing the same node view for different sync block node in live page transition
		return (
			currentNode.attrs.localId === newNode.attrs.localId &&
			currentNode.attrs.resourceId === newNode.attrs.resourceId
		);
	}

	update(
		node: PMNode,
		decorations: ReadonlyArray<Decoration>,
		innerDecorations?: DecorationSource,
	): boolean {
		return super.update(node, decorations, innerDecorations, this.validUpdate);
	}

	render({ getPos }: SyncBlockNodeViewProps): React.JSX.Element | null {
		if (!this.options?.syncedBlockRenderer) {
			return null;
		}

		const { resourceId, localId } = this.node.attrs;

		if (!resourceId || !localId) {
			return null;
		}

		const syncBlockStore =
			this.api?.syncedBlock?.sharedState.currentState()?.syncBlockStore ?? this.syncBlockStore;

		if (!syncBlockStore) {
			return null;
		}

		// Use expValEqualsNoExposure — the exposure is already fired once at plugin
		// creation time in syncedBlockPlugin.tsx and main.ts createPlugin().
		const isPerfEnabled = expValEqualsNoExposure('editor_synced_block_perf', 'isEnabled', true);

		// get document node from data provider
		return (
			<SyncBlockSSRReactContextsProvider intl={this.intl}>
				<ErrorBoundary
					component={ACTION_SUBJECT.SYNCED_BLOCK}
					dispatchAnalyticsEvent={this.api?.analytics?.actions.fireAnalyticsEvent}
					fallbackComponent={null}
				>
					<SyncBlockActionsProvider
						// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
						removeSyncBlock={
							isPerfEnabled
								? this.removeSyncBlockStable
								: () => {
										const pos = getPos();
										if (pos !== undefined) {
											removeSyncedBlockAtPos(this.api, pos);
										}
									}
						}
						// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
						fetchSyncBlockSourceInfo={
							isPerfEnabled
								? this.fetchSyncBlockSourceInfoStable
								: (sourceAri: string) =>
										syncBlockStore.referenceManager.fetchSyncBlockSourceInfoBySourceAri(sourceAri)
						}
					>
						<SyncBlockRendererWrapper
							localId={localId}
							resourceId={resourceId}
							node={this.node}
							syncBlockStore={syncBlockStore}
							syncedBlockRenderer={this.options?.syncedBlockRenderer}
							api={this.api}
						/>
					</SyncBlockActionsProvider>
				</ErrorBoundary>
			</SyncBlockSSRReactContextsProvider>
		);
	}

	destroy(): void {
		this.unsubscribe?.();
		if (this.dragStartHandler) {
			// eslint-disable-next-line @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop, @repo/internal/dom-events/no-unsafe-event-listeners
			this.dom?.removeEventListener('dragstart', this.dragStartHandler);
			this.dragStartHandler = undefined;
		}
		super.destroy();
	}
}

export interface SyncBlockNodeViewProperties {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
	options: SyncedBlockPluginOptions | undefined;
	pmPluginFactoryParams: PMPluginFactoryParams;
}

export const syncBlockNodeView: (
	props: SyncBlockNodeViewProperties,
) => (
	node: PMNode,
	view: EditorView,
	getPos: getPosHandler,
) => ReactNodeView<SyncBlockNodeViewProps> =
	({ options, pmPluginFactoryParams, api }: SyncBlockNodeViewProperties) =>
	(
		node: PMNode,
		view: EditorView,
		getPos: getPosHandler,
	): ReactNodeView<SyncBlockNodeViewProps> => {
		const { portalProviderAPI, eventDispatcher } = pmPluginFactoryParams;

		return new SyncBlock({
			api,
			options,
			node,
			view,
			getPos: getPos as getPosHandlerNode,
			portalProviderAPI,
			eventDispatcher,
		}).init();
	};
