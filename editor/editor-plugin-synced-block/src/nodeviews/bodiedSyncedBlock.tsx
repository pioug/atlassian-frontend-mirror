import React, { useEffect, useState } from 'react';

import { ACTION_SUBJECT, ACTION_SUBJECT_ID } from '@atlaskit/editor-common/analytics';
import { ErrorBoundary } from '@atlaskit/editor-common/error-boundary';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { getPosHandler } from '@atlaskit/editor-common/react-node-view';
import { BodiedSyncBlockSharedCssClassName } from '@atlaskit/editor-common/sync-block';
import type {
	ExtractInjectionAPI,
	getPosHandlerNode,
	PMPluginFactoryParams,
} from '@atlaskit/editor-common/types';
import { isOfflineMode, type Mode } from '@atlaskit/editor-plugin-connectivity';
import {
	DOMSerializer,
	type DOMOutputSpec,
	type Node as PMNode,
} from '@atlaskit/editor-prosemirror/model';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import type {
	SyncBlockSourceInfo,
	SyncBlockStoreManager,
} from '@atlaskit/editor-synced-block-provider';
import type { SourceSyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider/syncBlockStoreManager';

import type { SyncedBlockPlugin, SyncedBlockPluginOptions } from '../syncedBlockPluginType';
import { getUnpublishedSourceType } from '../ui/getUnpublishedSourceType';
import { SyncBlockLabel } from '../ui/SyncBlockLabel';

import { isEmptySourceSyncBlock } from './isEmptySourceSyncBlock';

export interface BodiedSyncBlockNodeViewProperties {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
	pluginOptions: SyncedBlockPluginOptions | undefined;
	pmPluginFactoryParams: PMPluginFactoryParams;
	syncBlockStore?: SyncBlockStoreManager;
}

const toDOM = (node: PMNode): DOMOutputSpec => [
	'div',
	{
		class: `${BodiedSyncBlockSharedCssClassName.prefix} bodiedSyncBlockView-content-wrap`,
		localid: node.attrs.localId,
		resourceid: node.attrs.resourceId,
	},
	[
		'div',
		{
			class: BodiedSyncBlockSharedCssClassName.content,
			contenteditable: 'true',
		},
		0,
	],
];

export const SourceSyncBlockLabel = ({
	localId,
	resourceId,
	sourceManager,
}: {
	localId: string;
	resourceId: string;
	sourceManager?: SourceSyncBlockStoreManager;
}): React.JSX.Element => {
	const isSamePageSyncEnabled = isExperimentEnabled('editor-synced-block-same-page-sync');
	const [isUnpublished, setIsUnpublished] = useState(
		() =>
			isSamePageSyncEnabled &&
			sourceManager?.getLocalSourceSnapshot(resourceId)?.status === 'unpublished',
	);
	const [sourceInfo, setSourceInfo] = useState<SyncBlockSourceInfo>();

	useEffect(() => {
		if (!isSamePageSyncEnabled) {
			return;
		}
		let isMounted = true;
		void sourceManager?.getSyncBlockSourceInfo(localId).then((nextSourceInfo) => {
			if (isMounted) {
				setSourceInfo(nextSourceInfo);
			}
		});
		const unsubscribe = sourceManager?.subscribeToLocalSource(resourceId, (snapshot) =>
			setIsUnpublished(snapshot?.status === 'unpublished'),
		);
		return () => {
			isMounted = false;
			unsubscribe?.();
		};
	}, [isSamePageSyncEnabled, localId, resourceId, sourceManager]);

	return (
		<SyncBlockLabel
			isSource={true}
			localId={localId}
			unpublishedInfo={
				isSamePageSyncEnabled && isUnpublished
					? {
							sourceType: getUnpublishedSourceType({
								sourceAri: sourceInfo?.sourceAri,
								sourceProduct: sourceInfo?.productType,
							}),
							variant: 'source',
						}
					: undefined
			}
		/>
	);
};

export class BodiedSyncBlock implements NodeView {
	dom: HTMLElement;
	contentDOM: HTMLElement;
	node: PMNode;
	view: EditorView;
	getPos: getPosHandlerNode;
	nodeViewPortalProviderAPI: PortalProviderAPI;
	private api?: ExtractInjectionAPI<SyncedBlockPlugin>;
	private cleanupConnectivityModeListener?: () => void;
	private cleanupViewModeListener?: () => void;
	private labelKey: string;
	constructor(
		node: PMNode,
		view: EditorView,
		getPos: getPosHandlerNode,
		api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined,
		nodeViewPortalProviderAPI: PortalProviderAPI,
		sourceManager?: SourceSyncBlockStoreManager,
	) {
		this.node = node;
		this.view = view;
		this.getPos = getPos;
		this.api = api;
		this.nodeViewPortalProviderAPI = nodeViewPortalProviderAPI;
		// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage -- NodeView serialization must target active runtime document
		const { dom, contentDOM } = DOMSerializer.renderSpec(document, toDOM(this.node));
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		this.dom = dom as HTMLElement;
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		this.contentDOM = contentDOM as HTMLElement;

		// Render the label into a separate container so portal implementations that
		// write directly into the target do not clobber contentDOM. This also covers
		// SSR, where the portal's renderToStaticMarkup + innerHTML would clobber it.
		// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage -- NodeView DOM must be created against active runtime document
		const labelContainer = document.createElement('div');
		this.dom.appendChild(labelContainer);

		this.labelKey = crypto.randomUUID();
		this.nodeViewPortalProviderAPI.render(
			() => (
				<ErrorBoundary
					component={ACTION_SUBJECT.SYNCED_BLOCK}
					componentId={ACTION_SUBJECT_ID.SYNCED_BLOCK_LABEL}
					dispatchAnalyticsEvent={this.api?.analytics?.actions.fireAnalyticsEvent}
					fallbackComponent={null}
				>
					<SourceSyncBlockLabel
						localId={node.attrs.localId}
						resourceId={node.attrs.resourceId}
						sourceManager={sourceManager}
					/>
				</ErrorBoundary>
			),
			labelContainer,
			this.labelKey,
		);
		this.updateContentEditable({});
		this.updateEmptyClass();
		this.handleConnectivityModeChange();
		this.handleViewModeChange();

		// Cache is populated in state.init() and updated in appendTransaction,
		// so no additional updateSyncBlockData call is needed here.
	}

	private updateContentEditable({
		nextConnectivityMode,
		nextViewMode,
	}: {
		nextConnectivityMode?: Mode;
		nextViewMode?: 'view' | 'edit';
	}): void {
		const connectivityMode =
			nextConnectivityMode ?? this.api?.connectivity?.sharedState?.currentState()?.mode;
		const viewMode = nextViewMode ?? this.api?.editorViewMode?.sharedState?.currentState()?.mode;

		const isOnline = !isOfflineMode(connectivityMode);
		const isEditMode = viewMode !== 'view';
		const shouldBeEditable = isOnline && isEditMode;

		this.contentDOM.setAttribute('contenteditable', shouldBeEditable ? 'true' : 'false');
	}

	private handleConnectivityModeChange(): void {
		if (this.api?.connectivity) {
			this.cleanupConnectivityModeListener = this.api.connectivity.sharedState.onChange(
				({ nextSharedState }) => {
					this.updateContentEditable({ nextConnectivityMode: nextSharedState.mode });
				},
			);
		}
	}

	private handleViewModeChange(): void {
		if (this.api?.editorViewMode) {
			this.cleanupViewModeListener = this.api.editorViewMode.sharedState.onChange(
				({ nextSharedState }) => {
					this.updateContentEditable({ nextViewMode: nextSharedState?.mode });
				},
			);
		}
	}

	/**
	 * Marks the block as empty so the source placeholder can be shown purely from document state.
	 * See `isEmptySourceSyncBlock` for why the DOM is not used to decide this.
	 */
	private updateEmptyClass(): void {
		this.dom.classList.toggle(
			BodiedSyncBlockSharedCssClassName.empty,
			isEmptySourceSyncBlock(this.node),
		);
	}

	update(node: PMNode): boolean {
		if (this.node.type !== node.type) {
			return false;
		}

		// Cache updates are handled in appendTransaction where we can
		// filter out non-user changes (remote collab, table auto-scale, etc.)
		this.node = node;
		this.updateEmptyClass();

		return true;
	}

	ignoreMutation(mutation: MutationRecord | { target: Node; type: 'selection' }): boolean {
		if (mutation.type === 'selection') {
			return false;
		}
		return true;
	}

	destroy(): void {
		this.cleanupConnectivityModeListener?.();
		this.cleanupViewModeListener?.();
		this.nodeViewPortalProviderAPI.remove(this.labelKey);
	}
}

export const bodiedSyncBlockNodeView = (
	props: BodiedSyncBlockNodeViewProperties,
): ((node: PMNode, view: EditorView, getPos: getPosHandler) => NodeView) => {
	const {
		api,
		pmPluginFactoryParams: { nodeViewPortalProviderAPI },
		syncBlockStore,
	} = props;

	return (node: PMNode, view: EditorView, getPos: getPosHandler): NodeView => {
		return new BodiedSyncBlock(
			node,
			view,
			getPos as getPosHandlerNode,
			api,
			nodeViewPortalProviderAPI,
			syncBlockStore?.sourceManager,
		);
	};
};
