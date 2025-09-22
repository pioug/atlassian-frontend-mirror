import React from 'react';

import { SyncBlockSharedCssClassName } from '@atlaskit/editor-common/sync-block';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { SyncedBlockEditorProps } from '../syncedBlockPluginType';

type Props = {
	defaultDocument: JSONDocNode;
	getSyncedBlockEditor: (props: SyncedBlockEditorProps) => React.JSX.Element;
	handleContentChanges: (updatedDoc: PMNode) => void;
	popupsBoundariesElement: HTMLElement;
	popupsMountPoint: HTMLElement;
	setInnerEditorView: (editorView: EditorView) => void;
};

export const SyncBlockEditorWrapperDataId = 'sync-block-plugin-editor-wrapper';

const SyncBlockEditorWrapperComponent = ({
	defaultDocument,
	getSyncedBlockEditor,
	popupsBoundariesElement,
	popupsMountPoint,
	setInnerEditorView,
	handleContentChanges,
}: Props) => {
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
				onChange: (value) => handleContentChanges(value.state.doc),
				onEditorReady: (value) => setInnerEditorView(value.editorView),
			})}
		</div>
	);
};

export const SyncBlockEditorWrapper = React.memo(SyncBlockEditorWrapperComponent);
