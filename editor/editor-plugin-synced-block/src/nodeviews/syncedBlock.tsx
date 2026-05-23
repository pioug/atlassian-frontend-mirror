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
	SyncBlockActionsProvider,
} from '@atlaskit/editor-common/sync-block';
import type {
	ExtractInjectionAPI,
	getPosHandlerNode,
	PMPluginFactoryParams,
} from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView, Decoration, DecorationSource } from '@atlaskit/editor-prosemirror/view';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import { removeSyncedBlockAtPos } from '../editor-commands';
import type { SyncedBlockPlugin, SyncedBlockPluginOptions } from '../syncedBlockPluginType';
import { SyncBlockRendererWrapper } from '../ui/SyncBlockRendererWrapper';
import { SyncBlockSSRReactContextsProvider } from '../ui/SyncBlockSSRReactContextsProvider';

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

	createDomRef(): HTMLElement {
		// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage -- NodeView DOM must be created against active runtime document
		const domRef = document.createElement('div');
		domRef.classList.add(SyncBlockSharedCssClassName.prefix);
		return domRef;
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
