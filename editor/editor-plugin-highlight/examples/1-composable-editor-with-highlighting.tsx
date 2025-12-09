import React from 'react';

import { AnnotationTypes } from '@atlaskit/adf-schema';
import { AnnotationUpdateEmitter } from '@atlaskit/editor-common/annotation';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { emojiPlugin } from '@atlaskit/editor-plugin-emoji';
import { primaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';
import { annotationPlugin } from '@atlaskit/editor-plugins/annotation';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { contentInsertionPlugin } from '@atlaskit/editor-plugins/content-insertion';
import { copyButtonPlugin } from '@atlaskit/editor-plugins/copy-button';
import { decorationsPlugin } from '@atlaskit/editor-plugins/decorations';
import { editorDisabledPlugin } from '@atlaskit/editor-plugins/editor-disabled';
import { floatingToolbarPlugin } from '@atlaskit/editor-plugins/floating-toolbar';
import { guidelinePlugin } from '@atlaskit/editor-plugins/guideline';
import { highlightPlugin } from '@atlaskit/editor-plugins/highlight';
import { historyPlugin } from '@atlaskit/editor-plugins/history';
import { insertBlockPlugin } from '@atlaskit/editor-plugins/insert-block';
import { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';
import { selectionPlugin } from '@atlaskit/editor-plugins/selection';
import { selectionToolbarPlugin } from '@atlaskit/editor-plugins/selection-toolbar';
import { statusPlugin } from '@atlaskit/editor-plugins/status';
import { type TablePluginOptions, tablesPlugin } from '@atlaskit/editor-plugins/table';
import { textColorPlugin } from '@atlaskit/editor-plugins/text-color';
import { textFormattingPlugin } from '@atlaskit/editor-plugins/text-formatting';
import { typeAheadPlugin } from '@atlaskit/editor-plugins/type-ahead';
import { undoRedoPlugin } from '@atlaskit/editor-plugins/undo-redo';
import { widthPlugin } from '@atlaskit/editor-plugins/width';
import {
	ExampleCreateInlineCommentComponent,
	ExampleViewInlineCommentComponent,
} from '@atlaskit/editor-test-helpers/example-helpers';
import { getEmojiProvider } from '@atlaskit/util-data-test/get-emoji-provider';

const highlightAdfDoc = {
	type: 'doc',
	version: 1,
	content: [
		{
			type: 'paragraph',
			content: [
				{
					text: 'Highlights: ',
					type: 'text',
				},
				{
					text: 'Light Gray',
					type: 'text',
					marks: [{ type: 'backgroundColor', attrs: { color: '#dcdfe4' } }],
				},
				{ text: ', ', type: 'text' },
				{
					text: 'Light Teal',
					type: 'text',
					marks: [{ type: 'backgroundColor', attrs: { color: '#c6edfb' } }],
				},
				{ text: ', ', type: 'text' },
				{
					text: 'Light Lime',
					type: 'text',
					marks: [{ type: 'backgroundColor', attrs: { color: '#d3f1a7' } }],
				},
				{ text: ', ', type: 'text' },
				{
					text: 'Light Orange',
					type: 'text',
					marks: [{ type: 'backgroundColor', attrs: { color: '#fedec8' } }],
				},
				{ text: ', ', type: 'text' },
				{
					text: 'Light Magenta',
					type: 'text',
					marks: [{ type: 'backgroundColor', attrs: { color: '#fdd0ec' } }],
				},
				{ text: ', ', type: 'text' },
				{
					text: 'Light Purple',
					type: 'text',
					marks: [{ type: 'backgroundColor', attrs: { color: '#dfd8fd' } }],
				},
				{ text: ', ', type: 'text' },
				{
					text: 'Custom: black',
					type: 'text',
					marks: [{ type: 'backgroundColor', attrs: { color: '#000000' } }],
				},
				{ text: ', ', type: 'text' },
				{
					text: 'Custom: white',
					type: 'text',
					marks: [{ type: 'backgroundColor', attrs: { color: '#ffffff' } }],
				},
				{ text: ', ', type: 'text' },
				{
					text: 'Custom: red',
					type: 'text',
					marks: [{ type: 'backgroundColor', attrs: { color: '#c9372c' } }],
				},
				{ text: ', ', type: 'text' },
				{
					text: 'Custom: yellow',
					type: 'text',
					marks: [{ type: 'backgroundColor', attrs: { color: '#f8e6a0' } }],
				},
				{
					text: ', No highlight',
					type: 'text',
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'this is ',
				},
				{
					type: 'status',
					attrs: {
						text: 'some ',
						color: 'neutral',
						localId: '1d3d429b-a8d9-4340-beb0-0647bd0b20d4',
						style: '',
					},
				},
				{
					type: 'emoji',
					attrs: {
						shortName: ':slight_smile:',
						id: '1f642',
						text: '🙂',
					},
				},
				{
					type: 'text',
					text: ' text with ',
					marks: [{ type: 'backgroundColor', attrs: { color: '#fdd0ec' } }],
				},
				{
					type: 'text',
					text: 'inline',
					marks: [
						{ type: 'backgroundColor', attrs: { color: '#dfd8fd' } },
						{
							type: 'annotation',
							attrs: {
								id: 'annotation-id',
								annotationType: AnnotationTypes.INLINE_COMMENT,
							},
						},
					],
				},
				{
					type: 'text',
					text: ' nodes',
					marks: [
						{
							type: 'annotation',
							attrs: {
								id: 'annotation-id',
								annotationType: AnnotationTypes.INLINE_COMMENT,
							},
						},
					],
				},
			],
		},
		{
			type: 'table',
			attrs: {
				isNumberColumnEnabled: false,
				layout: 'default',
				localId: '7c2ef57c-0a6d-43bf-822c-67803b11f46f',
				width: 760,
			},
			content: [
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableHeader',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											text: 'Highlight in table',
											type: 'text',
											marks: [
												{
													type: 'backgroundColor',
													attrs: { color: '#c6edfb' },
												},
											],
										},
									],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
					],
				},
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableCell',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
					],
				},
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableCell',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
					],
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Highlight ',
					marks: [
						{
							type: 'backgroundColor',
							attrs: {
								color: '#c6edfb',
							},
						},
					],
				},
				{
					type: 'text',
					text: 'over',
					marks: [
						{
							type: 'backgroundColor',
							attrs: {
								color: '#c6edfb',
							},
						},
						{
							type: 'annotation',
							attrs: {
								id: 'annotation-id',
								annotationType: AnnotationTypes.INLINE_COMMENT,
							},
						},
					],
				},
				{
					type: 'text',
					text: ' comment',
					marks: [
						{
							type: 'backgroundColor',
							attrs: {
								color: '#c6edfb',
							},
						},
					],
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Comment ',
					marks: [
						{
							type: 'annotation',
							attrs: {
								id: 'annotation-id',
								annotationType: AnnotationTypes.INLINE_COMMENT,
							},
						},
					],
				},
				{
					type: 'text',
					text: 'over',
					marks: [
						{
							type: 'backgroundColor',
							attrs: {
								color: '#d3f1a7',
							},
						},
						{
							type: 'annotation',
							attrs: {
								id: 'annotation-id',
								annotationType: AnnotationTypes.INLINE_COMMENT,
							},
						},
					],
				},
				{
					type: 'text',
					text: ' highlight',
					marks: [
						{
							type: 'annotation',
							attrs: {
								id: 'annotation-id',
								annotationType: AnnotationTypes.INLINE_COMMENT,
							},
						},
					],
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Partially ',
					marks: [
						{
							type: 'backgroundColor',
							attrs: {
								color: '#fedec8',
							},
						},
					],
				},
				{
					type: 'text',
					text: 'overlapping',
					marks: [
						{
							type: 'backgroundColor',
							attrs: {
								color: '#fedec8',
							},
						},
						{
							type: 'annotation',
							attrs: {
								id: 'annotation-id',
								annotationType: AnnotationTypes.INLINE_COMMENT,
							},
						},
					],
				},
				{
					type: 'text',
					text: ' comment',
					marks: [
						{
							type: 'annotation',
							attrs: {
								id: 'annotation-id',
								annotationType: AnnotationTypes.INLINE_COMMENT,
							},
						},
					],
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Adjacent ',
					marks: [
						{
							type: 'backgroundColor',
							attrs: {
								color: '#d3f1a7',
							},
						},
					],
				},
				{
					type: 'text',
					text: 'highlights',
					marks: [
						{
							type: 'backgroundColor',
							attrs: {
								color: '#c6edfb',
							},
						},
					],
				},
				{
					type: 'text',
					text: ' example',
					marks: [
						{
							type: 'backgroundColor',
							attrs: {
								color: '#fedec8',
							},
						},
					],
				},
			],
		},
	],
};

const emitter = new AnnotationUpdateEmitter();

const Editor = (): React.JSX.Element => {
	const tableOptions = {
		tableOptions: {
			advanced: true,
			allowNumberColumn: true,
			allowHeaderRow: true,
			allowHeaderColumn: true,
			permittedLayouts: 'all',
		},
		allowContextualMenu: true,
	} as TablePluginOptions;

	const { preset } = usePreset((builder) =>
		builder
			.add(basePlugin)
			.add(historyPlugin)
			.add([analyticsPlugin, {}])
			.add(typeAheadPlugin)
			.add(primaryToolbarPlugin)
			.add(undoRedoPlugin)
			.add(textFormattingPlugin)
			.add(textColorPlugin)
			.add(statusPlugin)
			.add(contentInsertionPlugin)
			.add(widthPlugin)
			.add(guidelinePlugin)
			.add(selectionPlugin)
			.add([selectionToolbarPlugin, { preferenceToolbarAboveSelection: true }])
			.add(quickInsertPlugin)
			.add([tablesPlugin, tableOptions])
			.add([
				insertBlockPlugin,
				{
					allowTables: true,
					allowExpand: true,
					tableSelectorSupported: true,
				},
			])
			.add([
				annotationPlugin,
				{
					inlineComment: {
						createComponent: ExampleCreateInlineCommentComponent,
						viewComponent: ExampleViewInlineCommentComponent,
						updateSubscriber: emitter,
						getState: async (annotationsIds: string[]) => {
							return annotationsIds.map((id) => ({
								id,
								annotationType: 'inlineComment',
								state: { resolved: false },
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
							})) as any;
						},
						disallowOnWhitespace: true,
					},
				},
			])
			.add(decorationsPlugin)
			.add(copyButtonPlugin)
			.add(editorDisabledPlugin)
			.add(floatingToolbarPlugin)
			.add(emojiPlugin)
			.add(highlightPlugin),
	);

	return (
		<ComposableEditor
			appearance="full-page"
			preset={preset}
			defaultValue={highlightAdfDoc}
			emojiProvider={getEmojiProvider()}
		/>
	);
};

export default Editor;
