/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { WithEditorActions, type EditorActions } from '@atlaskit/editor-core';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { EditorContext } from '@atlaskit/editor-core/editor-context';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { token } from '@atlaskit/tokens';

import { useNestedEditorPreset } from './useNestedEditorPreset';

const reduceNestedEditorPadding = css({
	// Reduce the padding between the Sync Block editor and the content
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'& .appearance-full-page': {
		paddingTop: 0,
		paddingRight: token('space.400'),
		paddingBottom: 0,
		paddingLeft: token('space.400'),
	},
});

const updateEditorScrollParentOverflow = css({
	// Update the scroll parent of the nested editor so we don't have a scrollbar for the Sync Block editor
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'& .fabric-editor-popup-scroll-parent': {
		overflowY: 'auto',
	},
});

const reduceEditorWhitespace = css({
	// Reduce the padding around the Sync Block editor to ensure it appears inline with the content
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'& .ak-editor-content-area-region': {
		paddingTop: 0,
		paddingBottom: 0,

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'& .ProseMirror > p:last-child': {
			marginBottom: 0,
		},
	},
});

export type SyncedBlockEditorProps = {
	defaultDocument: JSONDocNode;
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
	popupsBoundariesElement: HTMLElement;
	popupsMountPoint: HTMLElement;
};

const SyncedBlockEditorComponent = ({
	defaultDocument,
	popupsMountPoint,
	popupsBoundariesElement,
	onEditorReady,
	onChange,
}: SyncedBlockEditorProps & { editorActions: EditorActions }) => {
	const { preset, fullPageEditorFeatureFlags } = useNestedEditorPreset();

	return (
		<div
			data-testid="sync-block-editor-wrapper"
			css={[updateEditorScrollParentOverflow, reduceNestedEditorPadding, reduceEditorWhitespace]}
		>
			<ComposableEditor
				appearance="full-width"
				preset={preset}
				popupsBoundariesElement={popupsBoundariesElement}
				popupsMountPoint={popupsMountPoint}
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
						popupsMountPoint={props.popupsMountPoint}
						popupsBoundariesElement={props.popupsBoundariesElement}
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
			popupsMountPoint={props.popupsMountPoint}
			popupsBoundariesElement={props.popupsBoundariesElement}
			onEditorReady={props.onEditorReady}
			onChange={props.onChange}
		/>
	);
};
