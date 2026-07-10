/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag React.Fragment
 */
import React from 'react';

import { jsx } from '@atlaskit/css';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer/types';
import { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { blockControlsPlugin } from '@atlaskit/editor-plugins/block-controls';
import { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';
import { breakoutPlugin } from '@atlaskit/editor-plugins/breakout';
import { codeBlockPlugin } from '@atlaskit/editor-plugins/code-block';
import { compositionPlugin } from '@atlaskit/editor-plugins/composition';
import { contentInsertionPlugin } from '@atlaskit/editor-plugins/content-insertion';
import { copyButtonPlugin } from '@atlaskit/editor-plugins/copy-button';
import { decorationsPlugin } from '@atlaskit/editor-plugins/decorations';
import { editorDisabledPlugin } from '@atlaskit/editor-plugins/editor-disabled';
import { emojiPlugin } from '@atlaskit/editor-plugins/emoji';
import { expandPlugin } from '@atlaskit/editor-plugins/expand';
import { floatingToolbarPlugin } from '@atlaskit/editor-plugins/floating-toolbar';
import { focusPlugin } from '@atlaskit/editor-plugins/focus';
import { gridPlugin } from '@atlaskit/editor-plugins/grid';
import { guidelinePlugin } from '@atlaskit/editor-plugins/guideline';
import { hyperlinkPlugin } from '@atlaskit/editor-plugins/hyperlink';
import { layoutPlugin } from '@atlaskit/editor-plugins/layout';
import { listPlugin } from '@atlaskit/editor-plugins/list';
import { panelPlugin } from '@atlaskit/editor-plugins/panel';
import { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';
import { rulePlugin } from '@atlaskit/editor-plugins/rule';
import { selectionPlugin } from '@atlaskit/editor-plugins/selection';
import { tablesPlugin } from '@atlaskit/editor-plugins/table';
import { tasksAndDecisionsPlugin } from '@atlaskit/editor-plugins/tasks-and-decisions';
import { textFormattingPlugin } from '@atlaskit/editor-plugins/text-formatting';
import { typeAheadPlugin } from '@atlaskit/editor-plugins/type-ahead';
import { widthPlugin } from '@atlaskit/editor-plugins/width';

/** A user-authored before/after scenario. */
export type CustomScenario = { after: JSONDocNode; before: JSONDocNode; label: string };

export const emptyDoc: JSONDocNode = {
	version: 1,
	type: 'doc',
	content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Edit me…' }] }],
} as JSONDocNode;

const editablePreset = (builder: Parameters<Parameters<typeof usePreset>[0]>[0]) =>
	builder
		.add(basePlugin)
		.add(blockTypePlugin)
		.add(focusPlugin)
		.add(typeAheadPlugin)
		.add(quickInsertPlugin)
		.add(selectionPlugin)
		.add(decorationsPlugin)
		.add(layoutPlugin)
		.add(listPlugin)
		.add([analyticsPlugin, {}])
		.add(contentInsertionPlugin)
		.add(widthPlugin)
		.add(guidelinePlugin)
		.add(textFormattingPlugin)
		.add([tablesPlugin, { tableOptions: { advanced: true, allowHeaderRow: true } }])
		.add(emojiPlugin)
		.add(hyperlinkPlugin)
		.add(panelPlugin)
		.add(rulePlugin)
		.add(tasksAndDecisionsPlugin)
		.add([expandPlugin, { allowInsertion: true }])
		.add(editorDisabledPlugin)
		.add(copyButtonPlugin)
		.add(compositionPlugin)
		.add(codeBlockPlugin)
		.add(blockControlsPlugin)
		.add(breakoutPlugin)
		.add(gridPlugin)
		.add(floatingToolbarPlugin);

/** Imperative handle exposed by {@link MiniEditor} so parents can pull the current doc. */
export type MiniEditorHandle = { getDoc: () => JSONDocNode };

/**
 * A lightweight editable editor used for authoring a custom before/after doc.
 *
 * Exposes an imperative `getDoc()` via ref that reads the *current* editor document
 * straight from shared state. This avoids relying on `onChange` (which is debounced and
 * may not have fired yet when the parent reads the value on "Add").
 */
const MiniEditorInner = React.forwardRef<MiniEditorHandle, { defaultValue: JSONDocNode }>(
	function MiniEditor({ defaultValue }, ref): React.JSX.Element {
		const { preset } = usePreset((builder) => editablePreset(builder), []);
		// Updated on every editor change; read imperatively by the parent on "Add".
		const latestDocRef = React.useRef<JSONDocNode>(defaultValue);

		React.useImperativeHandle(ref, () => ({ getDoc: () => latestDocRef.current }), []);

		return (
			<ComposableEditor
				appearance="comment"
				defaultValue={defaultValue}
				onChange={(editorView) => {
					latestDocRef.current = editorView.state.doc.toJSON() as JSONDocNode;
				}}
				preset={preset}
			/>
		);
	},
);

export const MiniEditor: React.ForwardRefExoticComponent<
	{ defaultValue: JSONDocNode } & React.RefAttributes<MiniEditorHandle>
> = MiniEditorInner;
