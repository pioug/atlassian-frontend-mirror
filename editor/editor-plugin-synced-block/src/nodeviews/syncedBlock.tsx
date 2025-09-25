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
import {
	createSyncBlockNode,
	useFetchDocNode,
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
	view: EditorView;
}
class SyncBlock extends ReactNodeView<SyncBlockNodeViewProps> {
	private isSource: boolean;
	private options: SyncedBlockPluginOptions | undefined;
	private fetchIntervalId: number | undefined;

	constructor(props: SyncBlockNodeViewProps) {
		super(
			props.node,
			props.view,
			props.getPos,
			props.portalProviderAPI,
			props.eventDispatcher,
			props,
		);
		const { resourceId, localId } = props.node.attrs;
		// Temporary solution to identify the source
		this.isSource = resourceId === localId;
		this.options = props.options;
	}

	unsubscribe: (() => void) | undefined;

	createDomRef(): HTMLElement {
		const domRef = document.createElement('div');
		domRef.classList.add(SyncBlockSharedCssClassName.prefix);
		return domRef;
	}

	private handleContentChanges(updatedDoc: PMNode): void {
		if (!this.isSource) {
			return;
		}
		// write data
		const node = createSyncBlockNode(this.node, false);
		this.options?.syncedBlockProvider?.writeNodesData([node], [{ content: updatedDoc.toJSON() }]);
	}

	private setInnerEditorView(editorView: EditorView): void {
		// set inner editor view
		const nodes: SyncBlockNode[] = [createSyncBlockNode(this.node, false)];

		this.options?.syncedBlockProvider?.fetchNodesData(nodes).then((data) => {
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
				handleContentChanges={(updatedDoc: PMNode) => this.handleContentChanges(updatedDoc)}
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
						this.options?.syncedBlockProvider,
					)
				}
				getSyncedBlockRenderer={this.options?.getSyncedBlockRenderer}
			/>
		);
	}

	render() {
		if (this.isSource) {
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
}

export const syncBlockNodeView =
	({ options, pmPluginFactoryParams, api }: SyncBlockNodeViewProperties) =>
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
		}).init();
	};
