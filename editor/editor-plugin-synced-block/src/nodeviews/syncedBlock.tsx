import React from 'react';

import type { DocNode } from '@atlaskit/adf-schema';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import ReactNodeView, { type getPosHandler } from '@atlaskit/editor-common/react-node-view';
import type { ReactComponentProps } from '@atlaskit/editor-common/react-node-view';
import type { RelativeSelectionPos } from '@atlaskit/editor-common/selection';
import type { ExtractInjectionAPI, PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

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
		return domRef;
	}

	private handleContentChanges(_updatedDoc: PMNode): void {
		// write data
	}

	private setInnerEditorView(_editorView: EditorView): void {
		// set inner editor view
	}

	private renderEditor() {
		const popupsBoundariesElement = this.dom.closest('.fabric-editor-popup-scroll-parent');

		if (!(popupsBoundariesElement instanceof HTMLElement)) {
			return null;
		}

		if (!this.options?.getSyncedBlockEditor) {
			return null;
		}

		return (
			<SyncBlockEditorWrapper
				popupsBoundariesElement={popupsBoundariesElement}
				popupsMountPoint={this.dom}
				defaultDocument={defaultSyncBlockEditorDocument}
				handleContentChanges={this.handleContentChanges}
				setInnerEditorView={this.setInnerEditorView}
				getSyncedBlockEditor={this.options?.getSyncedBlockEditor}
			/>
		);
	}

	private renderRenderer() {
		if (!this.options?.getSyncedBlockRenderer) {
			return null;
		}

		// get document node from data provider
		const docNode = defaultSyncBlockRendererDocument;

		return (
			<SyncBlockRendererWrapper
				docNode={docNode}
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
