import React from 'react';

import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { useUniversalPreset } from '@atlaskit/editor-core/preset-universal';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { blockCollapsePlugin } from '@atlaskit/editor-plugins/block-collapse/blockCollapsePlugin';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type EditorActions from '../src/actions';
import type { EditorProps } from '../src/types/editor-props';

type WindowForSparseSpike = Window & {
	__editorApi?: unknown;
	__editorView?: EditorView | null;
};

const makeParagraph = (index: number) => ({
	content: [{ text: `Sparse anchor paragraph ${index}`, type: 'text' }],
	attrs: { localId: `sparse-paragraph-${index}` },
	type: 'paragraph',
});

const makeDocument = (large: boolean) => ({
	version: 1,
	type: 'doc',
	content: [
		{
			attrs: { level: 1, localId: 'sparse-heading-1' },
			content: [{ text: 'Sparse block controls', type: 'text' }],
			type: 'heading',
		},
		makeParagraph(1),
		{
			attrs: { panelType: 'info' },
			content: [makeParagraph(2)],
			type: 'panel',
		},
		{
			content: [
				{
					content: [makeParagraph(3)],
					type: 'listItem',
				},
			],
			type: 'bulletList',
		},
		{
			attrs: { layout: 'default', localId: 'sparse-table-1' },
			content: [
				{
					content: [
						{ content: [makeParagraph(4)], type: 'tableCell' },
						{ content: [makeParagraph(5)], type: 'tableCell' },
					],
					type: 'tableRow',
				},
			],
			type: 'table',
		},
		...(large ? Array.from({ length: 1000 }, (_, index) => makeParagraph(index + 6)) : []),
	],
});

const RawEditor = ({ large }: { large: boolean }): React.JSX.Element => {
	const props: EditorProps = React.useMemo(
		() => ({
			allowPanel: true,
			allowTables: true,
			appearance: 'full-page',
			defaultValue: makeDocument(large),
		}),
		[large],
	);
	const universalPreset = useUniversalPreset({
		props,
		initialPluginConfiguration: {
			blockControlsPlugin: { enabled: true, rightSideControlsEnabled: true },
			blockMenuPlugin: { enabled: true },
			quickInsertPlugin: { blockControlButtonEnabled: true },
		},
	});
	const { editorApi, preset } = usePreset(
		() => universalPreset.add(blockCollapsePlugin),
		[universalPreset],
	);

	React.useEffect(() => {
		(window as WindowForSparseSpike).__editorApi = editorApi;
		return () => {
			(window as WindowForSparseSpike).__editorApi = undefined;
		};
	}, [editorApi]);

	const onEditorReady = React.useCallback((actions: EditorActions) => {
		(window as WindowForSparseSpike).__editorView = actions._privateGetEditorView();
	}, []);
	const onDestroy = React.useCallback(() => {
		(window as WindowForSparseSpike).__editorView = null;
	}, []);

	return (
		<ComposableEditor
			{...props}
			preset={preset}
			onDestroy={onDestroy}
			onEditorReady={onEditorReady}
		/>
	);
};

export default function SparseBlockControlsExample(): React.JSX.Element {
	const [large, setLarge] = React.useState(false);

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Example-only layout.
		<div style={{ height: '100vh', overflow: 'auto' }}>
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Example-only controls.
				style={{ padding: 16 }}
			>
				<button type="button" onClick={() => setLarge((current) => !current)}>
					{large ? 'Load compact document' : 'Load 1000-block document'}
				</button>
				<span>{large ? '1000 blocks loaded' : 'Compact mixed-block document'}</span>
			</div>
			<RawEditor key={String(large)} large={large} />
		</div>
	);
}
