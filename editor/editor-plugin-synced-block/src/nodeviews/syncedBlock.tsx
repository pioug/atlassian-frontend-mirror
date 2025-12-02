import React from 'react';

import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import ReactNodeView, { type getPosHandler } from '@atlaskit/editor-common/react-node-view';
import type { ReactComponentProps } from '@atlaskit/editor-common/react-node-view';
import { SyncBlockSharedCssClassName } from '@atlaskit/editor-common/sync-block';
import type { ExtractInjectionAPI, PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	useFetchSyncBlockData,
	useFetchSyncBlockTitle,
} from '@atlaskit/editor-synced-block-provider';

import type { SyncedBlockPlugin, SyncedBlockPluginOptions } from '../syncedBlockPluginType';
import { SyncBlockRendererWrapper } from '../ui/SyncBlockRendererWrapper';

export interface SyncBlockNodeViewProps extends ReactComponentProps {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
	eventDispatcher: EventDispatcher;
	getPos: getPosHandler;
	isNodeNested?: boolean;
	node: PMNode;
	options: SyncedBlockPluginOptions | undefined;
	portalProviderAPI: PortalProviderAPI;
	view: EditorView;
}

class SyncBlock extends ReactNodeView<SyncBlockNodeViewProps> {
	private options: SyncedBlockPluginOptions | undefined;
	private api?: ExtractInjectionAPI<SyncedBlockPlugin>;

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
	}

	unsubscribe: (() => void) | undefined;

	createDomRef(): HTMLElement {
		const domRef = document.createElement('div');
		domRef.classList.add(SyncBlockSharedCssClassName.prefix);
		return domRef;
	}

	render() {
		if (!this.options?.syncedBlockRenderer) {
			return null;
		}

		const { resourceId, localId } = this.node.attrs;

		if (!resourceId || !localId) {
			return null;
		}

		const syncBlockStore = this.api?.syncedBlock?.sharedState.currentState()?.syncBlockStore;

		if (!syncBlockStore) {
			return null;
		}

		// get document node from data provider
		return (
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
			getPos,
			portalProviderAPI,
			eventDispatcher,
		}).init();
	};
