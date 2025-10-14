import React from 'react';

import type { DocNode } from '@atlaskit/adf-schema';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import ReactNodeView, { type getPosHandler } from '@atlaskit/editor-common/react-node-view';
import type { ReactComponentProps } from '@atlaskit/editor-common/react-node-view';
import type { RelativeSelectionPos } from '@atlaskit/editor-common/selection';
import { SyncBlockSharedCssClassName } from '@atlaskit/editor-common/sync-block';
import type { ExtractInjectionAPI, PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';
import {
	convertSyncBlockPMNodeToSyncBlockData,
	useFetchDocNode,
	useHandleContentChanges,
	type SyncBlockNode,
} from '@atlaskit/editor-synced-block-provider';

import type { SyncedBlockPlugin, SyncedBlockPluginOptions } from '../syncedBlockPluginType';
import { SyncBlockEditorWrapper, SyncBlockEditorWrapperDataId } from '../ui/SyncBlockEditorWrapper';
import { SyncBlockRendererWrapper } from '../ui/SyncBlockRendererWrapper';

const defaultSyncBlockEditorDocument: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'This is a source sync block. Edit me to update the content.',
				},
			],
		},
	],
};

const defaultSyncBlockRendererDocument: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'This is a reference sync block. Stay tuned for updates...',
				},
			],
		},
	],
};

export interface SyncBlockNodeViewProps extends ReactComponentProps {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
	eventDispatcher: EventDispatcher;
	getPos: getPosHandler;
	isNodeNested?: boolean;
	node: PMNode;
	options: SyncedBlockPluginOptions | undefined;
	portalProviderAPI: PortalProviderAPI;
	syncBlockStore: SyncBlockStoreManager;
	view: EditorView;
}
class SyncBlock extends ReactNodeView<SyncBlockNodeViewProps> {
	private options: SyncedBlockPluginOptions | undefined;
	private fetchIntervalId: number | undefined;
	private syncBlockStore: SyncBlockStoreManager;

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
		this.syncBlockStore = props.syncBlockStore;
		this.syncBlockStore.updateSyncBlockNode(this.node);
	}

	unsubscribe: (() => void) | undefined;

	createDomRef(): HTMLElement {
		const domRef = document.createElement('div');
		domRef.classList.add(SyncBlockSharedCssClassName.prefix);
		return domRef;
	}

	private isSource(): boolean {
		return this.syncBlockStore.isSourceBlock(this.node);
	}

	private setInnerEditorView(editorView: EditorView): void {
		// set inner editor view
		this.syncBlockStore.setSyncBlockNestedEditorView(editorView);
		const nodes: SyncBlockNode[] = [convertSyncBlockPMNodeToSyncBlockData(this.node, false)];

		this.options?.dataProvider?.fetchNodesData(nodes).then((data) => {
			const tr = editorView.state.tr;
			if (data && data[0]?.content) {
				const newNode = editorView.state.schema.nodeFromJSON(data[0].content);
				editorView.dispatch(tr.replaceWith(0, editorView.state.doc.nodeSize - 2, newNode));
			}
		});
	}

	private renderEditor() {
		const fabricEditorPopupScrollParent = this.view.dom.closest(
			'.fabric-editor-popup-scroll-parent',
		);

		if (!(fabricEditorPopupScrollParent instanceof HTMLElement)) {
			return null;
		}

		if (!this.options?.getSyncedBlockEditor) {
			return null;
		}

		return (
			<SyncBlockEditorWrapper
				popupsBoundariesElement={fabricEditorPopupScrollParent}
				popupsMountPoint={fabricEditorPopupScrollParent}
				defaultDocument={defaultSyncBlockEditorDocument}
				useHandleContentChanges={(updatedDoc: PMNode) =>
					useHandleContentChanges(
						updatedDoc,
						this.isSource(),
						this.node,
						this.options?.dataProvider,
					)
				}
				setInnerEditorView={(editorView: EditorView) => this.setInnerEditorView(editorView)}
				getSyncedBlockEditor={this.options?.getSyncedBlockEditor}
			/>
		);
	}

	private renderRenderer() {
		if (!this.options?.getSyncedBlockRenderer) {
			return null;
		}

		// get document node from data provider

		return (
			<SyncBlockRendererWrapper
				useFetchDocNode={() =>
					useFetchDocNode(
						this.view,
						this.node,
						defaultSyncBlockRendererDocument,
						this.options?.dataProvider,
					)
				}
				getSyncedBlockRenderer={this.options?.getSyncedBlockRenderer}
			/>
		);
	}

	render() {
		if (this.isSource()) {
			return this.renderEditor();
		}
		return this.renderRenderer();
	}

	stopEvent(event: Event) {
		const target = event.target as Element | null;
		if (!target) {
			return false;
		}

		const isInNestedEditor =
			target.closest?.(`[data-testid="${SyncBlockEditorWrapperDataId}"]`) != null;

		if (isInNestedEditor) {
			this.selectNode();
			return true;
		}
		return false;
	}

	selectNode() {
		this.selectSyncBlockNode(undefined);
	}

	destroy() {
		if (this.fetchIntervalId) {
			window.clearInterval(this.fetchIntervalId);
		}
		this.syncBlockStore.setSyncBlockNestedEditorView(undefined);
		this.unsubscribe?.();
		super.destroy();
	}

	private selectSyncBlockNode(relativeSelectionPos: RelativeSelectionPos | undefined) {
		const getPos = typeof this.getPos === 'function' ? this.getPos() : 0;
		const selectionAPI = this.reactComponentProps.api?.selection?.actions;
		if (!selectionAPI) {
			return;
		}

		const tr = selectionAPI.selectNearNode({
			selectionRelativeToNode: relativeSelectionPos,
			selection: NodeSelection.create(this.view.state.doc, getPos ?? 0),
		})(this.view.state);
		if (tr) {
			this.view.dispatch(tr);
		}
	}
}

export interface SyncBlockNodeViewProperties {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
	options: SyncedBlockPluginOptions | undefined;
	pmPluginFactoryParams: PMPluginFactoryParams;
	syncBlockStore: SyncBlockStoreManager;
}

export const syncBlockNodeView =
	({ options, pmPluginFactoryParams, api, syncBlockStore }: SyncBlockNodeViewProperties) =>
	(node: PMNode, view: EditorView, getPos: () => number | undefined) => {
		const { portalProviderAPI, eventDispatcher } = pmPluginFactoryParams;

		return new SyncBlock({
			api,
			options,
			node,
			view,
			getPos,
			portalProviderAPI,
			eventDispatcher,
			syncBlockStore,
		}).init();
	};
