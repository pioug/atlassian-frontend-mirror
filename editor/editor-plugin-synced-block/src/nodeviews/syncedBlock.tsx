/* eslint-disable @atlaskit/ui-styling-standard/enforce-style-prop */
import React, { useMemo, useRef, useState } from 'react';

import type { DocNode } from '@atlaskit/adf-schema';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import ReactNodeView from '@atlaskit/editor-common/react-node-view';
import type { PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { SyncedBlockPluginOptions } from '../syncedBlockPluginType';

export type SyncBlockNodeViewProps = {
	config: SyncedBlockPluginOptions | undefined;
};

export const defaultSyncBlockDocument: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'This is a synced block. Edit the source to update the content.',
				},
			],
		},
	],
};

const SyncBlockEditorWrapperDataId = 'sync-block-plugin-editor-wrapper';

export const SyncBlockPluginComponent = ({
	config,
	dom,
}: {
	config: SyncedBlockPluginOptions | undefined;
	dom: HTMLElement;
}) => {
	const innerEditorView = useRef<EditorView | null>(null);

	/* Tmp solution to demonstrate the synced block renderer */
	const [rendererDocument, setRendererDocument] = useState<DocNode>(defaultSyncBlockDocument);

	const onChange = (
		editorView: EditorView,
		_meta: { isDirtyChange: boolean; source: 'local' | 'remote' },
	): void => {
		const content: DocNode['content'] = (editorView.state.doc.toJSON() as DocNode).content;
		const rendererDocument: DocNode = {
			version: 1,
			type: 'doc',
			content,
		};
		setRendererDocument(rendererDocument);
	};

	const onEditorReady = ({
		editorView,
	}: {
		editorView: EditorView;
		eventDispatcher: EventDispatcher;
	}): void => {
		innerEditorView.current = editorView || null;
	};
	const boundariesElement = useMemo(() => {
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		return dom.closest('.fabric-editor-popup-scroll-parent');
	}, [dom]);

	if (!boundariesElement || !(boundariesElement instanceof HTMLElement)) {
		return null;
	}

	if (!config?.getSyncedBlockEditor || !config?.getSyncedBlockRenderer) {
		return null;
	}

	return (
		<div data-testid={SyncBlockEditorWrapperDataId}>
			{config.getSyncedBlockEditor({
				boundariesElement: boundariesElement,
				defaultDocument: defaultSyncBlockDocument,
				mountPoint: dom,
				onChange: onChange,
				onEditorReady: onEditorReady,
			})}
			<div
				style={{
					width: '100%',
					height: '1px',
					// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
					backgroundColor: 'purple',
				}}
			/>
			{/* Tmp solution to demonstrate the synced block renderer */}
			{config.getSyncedBlockRenderer({
				docNode: rendererDocument,
			})}
		</div>
	);
};

class SyncBlock extends ReactNodeView<SyncBlockNodeViewProps> {
	unsubscribe: (() => void) | undefined;

	createDomRef(): HTMLElement {
		const domRef = document.createElement('div');
		domRef.setAttribute('style', 'border: purple solid 1px;');
		return domRef;
	}

	render() {
		return <SyncBlockPluginComponent config={this.reactComponentProps.config} dom={this.dom} />;
	}

	stopEvent(event: Event) {
		const target = event.target as Element | null;
		if (!target) {
			return false;
		}
		return target.closest?.(`[data-testid="${SyncBlockEditorWrapperDataId}"]`) != null;
	}

	destroy() {
		this.unsubscribe?.();
		super.destroy();
	}
}

export interface SyncBlockNodeViewProperties {
	config: SyncedBlockPluginOptions | undefined;
	pmPluginFactoryParams: PMPluginFactoryParams;
}

export const syncBlockNodeView =
	({ config, pmPluginFactoryParams }: SyncBlockNodeViewProperties) =>
	(node: PMNode, view: EditorView, getPos: () => number | undefined) => {
		const { portalProviderAPI, eventDispatcher } = pmPluginFactoryParams;
		const reactComponentProps: SyncBlockNodeViewProps = {
			config,
		};

		return new SyncBlock(
			node,
			view,
			getPos,
			portalProviderAPI,
			eventDispatcher,
			reactComponentProps,
			undefined,
		).init();
	};
