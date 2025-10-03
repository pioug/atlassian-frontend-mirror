import React, { useState } from 'react';

import { SyncBlockSharedCssClassName } from '@atlaskit/editor-common/sync-block';
import { JSONTransformer, type JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { SyncedBlockEditorProps } from '../syncedBlockPluginType';

type Props = {
	defaultDocument: JSONDocNode;
	getSyncedBlockEditor: (props: SyncedBlockEditorProps) => React.JSX.Element;
	popupsBoundariesElement: HTMLElement;
	popupsMountPoint: HTMLElement;
	setInnerEditorView: (editorView: EditorView) => void;
	useHandleContentChanges: (updatedDoc: PMNode) => void;
};

export const SyncBlockEditorWrapperDataId = 'sync-block-plugin-editor-wrapper';

const SyncBlockEditorWrapperComponent = ({
	defaultDocument,
	getSyncedBlockEditor,
	popupsBoundariesElement,
	popupsMountPoint,
	setInnerEditorView,
	useHandleContentChanges,
}: Props) => {
	const [updatedDoc, setUpdatedDoc] = useState<PMNode>(
		new JSONTransformer().parse(defaultDocument),
	);

	useHandleContentChanges(updatedDoc);
	return (
		<div
			data-testid={SyncBlockEditorWrapperDataId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={SyncBlockSharedCssClassName.editor}
		>
			{getSyncedBlockEditor({
				popupsBoundariesElement,
				defaultDocument,
				popupsMountPoint,
				onChange: (value) => setUpdatedDoc(value.state.doc),
				onEditorReady: (value) => setInnerEditorView(value.editorView),
			})}
		</div>
	);
};

export const SyncBlockEditorWrapper = React.memo(SyncBlockEditorWrapperComponent);
