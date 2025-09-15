import React from 'react';

import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { WithEditorActions, type EditorActions } from '@atlaskit/editor-core';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { EditorContext } from '@atlaskit/editor-core/editor-context';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { EditorView } from '@atlaskit/editor-prosemirror/dist/types/view';

import { useNestedEditorPreset } from './useNestedEditorPreset';

export type SyncedBlockEditorProps = {
	boundariesElement: HTMLElement;
	defaultDocument: JSONDocNode;
	mountPoint: HTMLElement;
	onChange: (
		editorView: EditorView,
		meta: {
			/**
			 * Indicates whether or not the change may be unnecessary to listen to (dirty
			 * changes can generally be ignored).
			 *
			 * This might be changes to media attributes for example when it gets updated
			 * due to initial setup.
			 *
			 * We still fire these events however to avoid a breaking change.
			 */
			isDirtyChange: boolean;
			source: 'local' | 'remote';
		},
	) => void;
	onEditorReady: ({
		editorView,
		eventDispatcher,
	}: {
		editorView: EditorView;
		eventDispatcher: EventDispatcher;
	}) => void;
};

const SyncedBlockEditorComponent = ({
	defaultDocument,
	mountPoint,
	boundariesElement,
	onEditorReady,
	onChange,
}: SyncedBlockEditorProps & { editorActions: EditorActions }) => {
	const { preset, fullPageEditorFeatureFlags } = useNestedEditorPreset();

	return (
		<div data-testid="sync-block-editor-wrapper">
			<ComposableEditor
				appearance="chromeless"
				preset={preset}
				popupsBoundariesElement={boundariesElement || undefined}
				popupsMountPoint={mountPoint || undefined}
				defaultValue={defaultDocument}
				skipValidation
				onChange={onChange}
				onEditorReady={(editorActions: EditorActions) => {
					const editorView = editorActions._privateGetEditorView();
					const eventDispatcher = editorActions._privateGetEventDispatcher();
					if (editorView && eventDispatcher) {
						onEditorReady({ editorView, eventDispatcher });
					}
				}}
				featureFlags={fullPageEditorFeatureFlags}
			/>
		</div>
	);
};

const SyncedBlockEditor = (props: SyncedBlockEditorProps) => {
	return (
		<EditorContext>
			<WithEditorActions
				render={(editorActions: EditorActions) => (
					<SyncedBlockEditorComponent
						defaultDocument={props.defaultDocument}
						mountPoint={props.mountPoint}
						boundariesElement={props.boundariesElement}
						onEditorReady={props.onEditorReady}
						onChange={props.onChange}
						editorActions={editorActions}
					/>
				)}
			/>
		</EditorContext>
	);
};

export const getSyncedBlockEditor = (props: SyncedBlockEditorProps): React.JSX.Element => {
	return (
		<SyncedBlockEditor
			defaultDocument={props.defaultDocument}
			mountPoint={props.mountPoint}
			boundariesElement={props.boundariesElement}
			onEditorReady={props.onEditorReady}
			onChange={props.onChange}
		/>
	);
};
