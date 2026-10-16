import React from 'react';

import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { numberedHeadingsPlugin } from '@atlaskit/editor-plugin-numbered-headings/numberedHeadingsPlugin';
import { toolbarPlugin } from '@atlaskit/editor-plugin-toolbar/toolbar-plugin';
import { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';
import { contentInsertionPlugin } from '@atlaskit/editor-plugins/content-insertion';
import { copyButtonPlugin } from '@atlaskit/editor-plugins/copy-button';
import { decorationsPlugin } from '@atlaskit/editor-plugins/decorations';
import { editorDisabledPlugin } from '@atlaskit/editor-plugins/editor-disabled';
import { expandPlugin } from '@atlaskit/editor-plugins/expand';
import { floatingToolbarPlugin } from '@atlaskit/editor-plugins/floating-toolbar';
import { guidelinePlugin } from '@atlaskit/editor-plugins/guideline';
import { historyPlugin } from '@atlaskit/editor-plugins/history';
import { layoutPlugin } from '@atlaskit/editor-plugins/layout';
import { listPlugin } from '@atlaskit/editor-plugins/list';
import { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';
import { selectionPlugin } from '@atlaskit/editor-plugins/selection';
import { tablesPlugin } from '@atlaskit/editor-plugins/table';
import { textFormattingPlugin } from '@atlaskit/editor-plugins/text-formatting';
import { typeAheadPlugin } from '@atlaskit/editor-plugins/type-ahead';
import { undoRedoPlugin } from '@atlaskit/editor-plugins/undo-redo';
import { widthPlugin } from '@atlaskit/editor-plugins/width';
import { UNSAFE_overrideExperiment } from '@atlaskit/platform-feature-experiments/dev-override';

UNSAFE_overrideExperiment('platform_editor_numbered_headings', { isEnabled: true });

const heading = (level: number, text: string) => ({
	type: 'heading',
	attrs: { level },
	content: [{ type: 'text', text }],
});

const paragraph = (text: string) => ({
	type: 'paragraph',
	content: [{ type: 'text', text }],
});

const defaultValue = {
	type: 'doc',
	version: 1,
	content: [
		heading(1, 'Introduction'),
		paragraph('Use "Numbered headings" in the Text styles menu to turn numbering on or off.'),
		heading(2, 'Background'),
		heading(2, 'Goals'),
		heading(3, 'Primary goal'),
		heading(3, 'Secondary goal'),
		heading(1, 'Design'),
		heading(3, 'A skipped level'),
		{
			type: 'expand',
			attrs: { title: 'Headings inside an expand are numbered too' },
			content: [heading(2, 'Nested heading')],
		},
		heading(1, 'Rollout'),
	],
};

/**
 * Full-page editor with the numbered headings toggle. Toggle numbering from the Text styles menu; the
 * setting lasts for this editor instance and resets when the editor is recreated.
 */
export default function Example(): React.JSX.Element {
	const { preset } = usePreset((builder) =>
		builder
			.add(basePlugin)
			.add([toolbarPlugin, { contextualFormattingEnabled: 'always-pinned' }])
			.add(historyPlugin)
			.add(typeAheadPlugin)
			.add(undoRedoPlugin)
			.add([analyticsPlugin, {}])
			.add(editorDisabledPlugin)
			.add(blockTypePlugin)
			.add(textFormattingPlugin)
			.add(listPlugin)
			.add(decorationsPlugin)
			.add(copyButtonPlugin)
			.add(floatingToolbarPlugin)
			.add(quickInsertPlugin)
			.add(selectionPlugin)
			.add(widthPlugin)
			.add(contentInsertionPlugin)
			.add(guidelinePlugin)
			.add(tablesPlugin)
			.add(layoutPlugin)
			.add([expandPlugin, { allowInsertion: true, appearance: 'full-page' }])
			.add(numberedHeadingsPlugin),
	);

	return <ComposableEditor appearance="full-page" preset={preset} defaultValue={defaultValue} />;
}
