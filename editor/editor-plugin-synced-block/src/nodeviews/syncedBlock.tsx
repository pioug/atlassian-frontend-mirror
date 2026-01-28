import React from 'react';

import { ACTION_SUBJECT } from '@atlaskit/editor-common/analytics';
import { ErrorBoundary } from '@atlaskit/editor-common/error-boundary';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import ReactNodeView, { type getPosHandler } from '@atlaskit/editor-common/react-node-view';
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
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	type SyncBlockStoreManager,
	useFetchSyncBlockData,
	useFetchSyncBlockTitle,
} from '@atlaskit/editor-synced-block-provider';
import { fg } from '@atlaskit/platform-feature-flags';

import { removeSyncedBlockAtPos } from '../editor-commands';
import type { SyncedBlockPlugin, SyncedBlockPluginOptions } from '../syncedBlockPluginType';
import { SyncBlockRendererWrapper } from '../ui/SyncBlockRendererWrapper';

export interface SyncBlockNodeViewProps extends ReactComponentProps {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
	eventDispatcher: EventDispatcher;
	getPos: getPosHandlerNode;
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
	}

	unsubscribe: (() => void) | undefined;

	createDomRef(): HTMLElement {
		const domRef = document.createElement('div');
		domRef.classList.add(SyncBlockSharedCssClassName.prefix);
		return domRef;
	}

	render({ getPos }: SyncBlockNodeViewProps) {
		if (!this.options?.syncedBlockRenderer) {
			return null;
		}

		const { resourceId, localId } = this.node.attrs;

		if (!resourceId || !localId) {
			return null;
		}

		const initialSyncBlockStore = fg('platform_synced_block_dogfooding')
			? this.syncBlockStore
			: undefined;

		const syncBlockStore =
			this.api?.syncedBlock?.sharedState.currentState()?.syncBlockStore ?? initialSyncBlockStore;

		if (!syncBlockStore) {
			return null;
		}

		// get document node from data provider
		return fg('platform_synced_block_dogfooding') ? (
			<ErrorBoundary
				component={ACTION_SUBJECT.SYNCED_BLOCK}
				dispatchAnalyticsEvent={this.api?.analytics?.actions.fireAnalyticsEvent}
				fallbackComponent={null}
			>
				<SyncBlockActionsProvider
					removeSyncBlock={() => {
						const pos = getPos();
						if (pos !== undefined) {
							removeSyncedBlockAtPos(this.api, pos);
						}
					}}
					fetchSyncBlockSourceInfo={(sourceAri: string) =>
						syncBlockStore.referenceManager.fetchSyncBlockSourceInfoBySourceAri(sourceAri)
					}
				>
					<SyncBlockRendererWrapper
						localId={this.node.attrs.localId}
						syncedBlockRenderer={this.options?.syncedBlockRenderer}
						useFetchSyncBlockTitle={() => useFetchSyncBlockTitle(syncBlockStore, this.node)}
						useFetchSyncBlockData={() =>
							useFetchSyncBlockData(
								syncBlockStore,
								resourceId,
								localId,
								this.api?.analytics?.actions?.fireAnalyticsEvent,
							)
						}
						api={this.api}
					/>
				</SyncBlockActionsProvider>
			</ErrorBoundary>
		) : (
			<SyncBlockRendererWrapper
				localId={this.node.attrs.localId}
				syncedBlockRenderer={this.options?.syncedBlockRenderer}
				useFetchSyncBlockTitle={() => useFetchSyncBlockTitle(syncBlockStore, this.node)}
				useFetchSyncBlockData={() =>
					useFetchSyncBlockData(
						syncBlockStore,
						resourceId,
						localId,
						this.api?.analytics?.actions?.fireAnalyticsEvent,
					)
				}
				api={this.api}
			/>
		);
	}

	destroy() {
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
