import type { CreateUIAnalyticsEvent, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { safeInsert } from '@atlaskit/editor-common/insert';
import type { DocBuilder, PublicPluginAPI } from '@atlaskit/editor-common/types';
import { annotationPlugin } from '@atlaskit/editor-plugin-annotation';
import { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';
import { captionPlugin } from '@atlaskit/editor-plugins/caption';
import { codeBlockPlugin } from '@atlaskit/editor-plugins/code-block';
import { compositionPlugin } from '@atlaskit/editor-plugins/composition';
import { contentInsertionPlugin } from '@atlaskit/editor-plugins/content-insertion';
import { copyButtonPlugin } from '@atlaskit/editor-plugins/copy-button';
import { decorationsPlugin } from '@atlaskit/editor-plugins/decorations';
import { editorDisabledPlugin } from '@atlaskit/editor-plugins/editor-disabled';
import { floatingToolbarPlugin } from '@atlaskit/editor-plugins/floating-toolbar';
import { focusPlugin } from '@atlaskit/editor-plugins/focus';
import { gridPlugin } from '@atlaskit/editor-plugins/grid';
import { guidelinePlugin } from '@atlaskit/editor-plugins/guideline';
import { layoutPlugin } from '@atlaskit/editor-plugins/layout';
import { listPlugin } from '@atlaskit/editor-plugins/list';
import { mediaPlugin } from '@atlaskit/editor-plugins/media';
import { panelPlugin } from '@atlaskit/editor-plugins/panel';
import { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';
import { rulePlugin } from '@atlaskit/editor-plugins/rule';
import { selectionPlugin } from '@atlaskit/editor-plugins/selection';
import { typeAheadPlugin } from '@atlaskit/editor-plugins/type-ahead';
import { widthPlugin } from '@atlaskit/editor-plugins/width';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { inlineCommentProvider } from '@atlaskit/editor-test-helpers/annotation';
import type { TypeAheadTool } from '@atlaskit/editor-test-helpers/create-editor';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
	createProsemirrorEditorFactory,
	Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
	code_block,
	doc,
	hr,
	layoutColumn,
	layoutSection,
	li,
	p,
	panel,
	ul,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';

describe('@atlaskit/editor-core/utils insert', () => {
	const createEditor = createProsemirrorEditorFactory();
	let createAnalyticsEvent: CreateUIAnalyticsEvent;
	createAnalyticsEvent = jest.fn(() => ({ fire() {} }) as UIAnalyticsEvent);
	const editor = (doc: DocBuilder) => {
		return createEditor({
			doc,
			preset: new Preset<LightEditorPlugin>()
				.add([analyticsPlugin, { createAnalyticsEvent }])
				.add(editorDisabledPlugin)
				.add(widthPlugin)
				.add(guidelinePlugin)
				.add(gridPlugin)
				.add(decorationsPlugin)
				.add(copyButtonPlugin)
				.add(floatingToolbarPlugin)
				.add(focusPlugin)
				.add(compositionPlugin)
				.add(contentInsertionPlugin)
				.add(layoutPlugin)
				.add(panelPlugin)
				.add(rulePlugin)
				.add(typeAheadPlugin)
				.add(selectionPlugin)
				.add([annotationPlugin, { inlineComment: { ...inlineCommentProvider } }])
				.add([mediaPlugin, { allowMediaSingle: true }])
				.add(listPlugin)
				.add([quickInsertPlugin, {}])
				.add(captionPlugin)
				.add([codeBlockPlugin, { appearance: 'full-page' }]),
		});
	};

	describe('whitelist', () => {
		it('should return null if content is not in the whitelist', () => {
			const { editorView } = editor(doc(p('{<>}')));
			const result = safeInsert(
				editorView.state.schema.nodes.codeBlock.createChecked(),
				editorView.state.selection.from,
			)(editorView.state.tr);
			expect(result).toBeNull();
			expect(editorView.state.doc).toEqualDocument(doc(p('{<>}')));
		});
	});

	describe('leaf', () => {
		describe('block', () => {
			describe('horizontal rule', () => {
				const insertFromToolbar = ({
					editorView,
					editorAPI,
				}: {
					editorView: EditorView;
					editorAPI: PublicPluginAPI<[typeof rulePlugin]> | undefined;
				}) => {
					const { state, dispatch } = editorView;
					editorAPI?.rule?.actions?.insertHorizontalRule(INPUT_METHOD.TOOLBAR)(state, dispatch);
				};
				const insertFromQuickInsert = async ({
					typeAheadTool,
				}: {
					typeAheadTool: TypeAheadTool;
				}) => {
					await typeAheadTool.searchQuickInsert('divider')?.insert({ index: 0 });
				};

				describe('input rule (--- command)', () => {
					it('empty paragraph', () => {
						const { editorView, sel } = editor(doc(p('{<>}')));
						insertText(editorView, '---', sel);
						expect(editorView.state).toEqualDocumentAndSelection(doc(hr(), '{<|gap>}'));
					});

					it('before text', () => {
						const { editorView, sel } = editor(doc(p('{<>}onetwo')));
						insertText(editorView, '---', sel);
						expect(editorView.state).toEqualDocumentAndSelection(
							doc(hr(), '{<|gap>}', p('onetwo')),
						);
					});

					describe('within invalid parent', () => {
						it('start of the first line', () => {
							const { editorView, sel } = editor(doc(panel()(p('{<>}onetwo'), p('three'))));
							insertText(editorView, '---', sel);
							expect(editorView.state).toEqualDocumentAndSelection(
								doc(hr(), '{<|gap>}', panel()(p('onetwo'), p('three'))),
							);
						});

						it('start of the last line', () => {
							const { editorView, sel } = editor(doc(panel()(p('onetwo'), p('{<>}three'))));
							insertText(editorView, '---', sel);
							expect(editorView.state).toEqualDocumentAndSelection(
								doc(panel()(p('onetwo')), hr(), '{<|gap>}', panel()(p('three'))),
							);
						});

						it('start of the last line (empty paragraph)', () => {
							const { editorView, sel } = editor(doc(panel()(p('onetwo'), p('three'), p('{<>}'))));
							insertText(editorView, '---', sel);
							expect(editorView.state).toEqualDocumentAndSelection(
								doc(panel()(p('onetwo'), p('three'), p()), hr()),
							);
						});
					});
				});

				describe('inconsistent behaviour', () => {
					describe('toolbar only', () => {
						it('within text', () => {
							const editorInstance = editor(doc(p('one{<>}two')));
							insertFromToolbar(editorInstance);
							expect(editorInstance.editorView.state).toEqualDocumentAndSelection(
								doc(p('one'), hr(), p('{<>}two')),
							);
						});

						it('within valid parent (layout)', () => {
							const editorInstance = editor(
								doc(
									layoutSection(
										layoutColumn({ width: 50 })(p('one{<>}two')),
										layoutColumn({ width: 50 })(p('three')),
									),
								),
							);

							insertFromToolbar(editorInstance);
							expect(editorInstance.editorView.state).toEqualDocumentAndSelection(
								doc(
									layoutSection(
										layoutColumn({ width: 50 })(p('one'), hr(), p('{<>}two')),
										layoutColumn({ width: 50 })(p('three')),
									),
								),
							);
						});

						it('middle of line', () => {
							const editorInstance = editor(doc(panel()(p('one{<>} two'), p('three'))));
							insertFromToolbar(editorInstance);
							expect(editorInstance.editorView.state).toEqualDocumentAndSelection(
								doc(panel()(p('one two'), p('three')), hr()),
							);
						});

						it('within nested parents', () => {
							const editorInstance = editor(doc(panel()(ul(li(code_block()('one{<>} two'))))));
							insertFromToolbar(editorInstance);
							expect(editorInstance.editorView.state).toEqualDocumentAndSelection(
								doc(
									panel()(ul(li(code_block()('one')))),
									hr(),
									panel()(ul(li(code_block()('{<>} two')))),
								),
							);
						});

						describe('quick insert only', () => {
							it('within text', async () => {
								const editorInstance = editor(doc(p('one {<>} two')));
								await insertFromQuickInsert(editorInstance);
								expect(editorInstance.editorView.state).toEqualDocumentAndSelection(
									doc(p('one  two'), hr()),
								);
							});

							it('within valid parent (layout)', async () => {
								const editorInstance = editor(
									doc(
										layoutSection(
											layoutColumn({ width: 50 })(p('one {<>} two')),
											layoutColumn({ width: 50 })(p('three')),
										),
									),
								);

								await insertFromQuickInsert(editorInstance);
								expect(editorInstance.editorView.state).toEqualDocumentAndSelection(
									doc(
										layoutSection(
											layoutColumn({ width: 50 })(p('one  two'), hr()),
											layoutColumn({ width: 50 })(p('{<>}three')),
										),
									),
								);
							});

							it('middle of line', async () => {
								const editorInstance = editor(doc(panel()(p('one {<>} two'), p('three'))));
								await insertFromQuickInsert(editorInstance);
								expect(editorInstance.editorView.state).toEqualDocumentAndSelection(
									doc(panel()(p('one  two'), p('three')), hr()),
								);
							});

							describe('list', () => {
								describe('single', () => {
									it('end of single line', async () => {
										const editorInstance = editor(doc(ul(li(p('onetwo {<>}')))));
										await insertFromQuickInsert(editorInstance);
										expect(editorInstance.editorView.state).toEqualDocumentAndSelection(
											doc(ul(li(p('onetwo '))), hr()),
										);
									});
								});
								describe('simple', () => {
									it('end of end line', async () => {
										const editorInstance = editor(
											doc(ul(li(p('one')), li(p('two')), li(p('three {<>}')))),
										);
										await insertFromQuickInsert(editorInstance);
										expect(editorInstance.editorView.state).toEqualDocumentAndSelection(
											doc(ul(li(p('one')), li(p('two')), li(p('three {<>}'))), hr()),
										);
									});
								});
							});
						});
					});

					[
						{
							insertMethod: 'toolbar',
							insertAction: insertFromToolbar,
						},
						{
							insertMethod: 'quick insert',
							insertAction: insertFromQuickInsert,
						},
					].forEach(({ insertMethod, insertAction }) => {
						describe(insertMethod, () => {
							it('empty paragraph', async () => {
								const editorInstance = editor(doc(p('{<>}')));
								await insertAction(editorInstance);
								expect(editorInstance.editorView.state).toEqualDocumentAndSelection(
									doc(hr(), '{<|gap>}'),
								);
							});

							it('before text', async () => {
								const editorInstance = editor(doc(p('{<>}onetwo')));
								await insertAction(editorInstance);
								expect(editorInstance.editorView.state).toEqualDocumentAndSelection(
									doc(hr(), '{<|gap>}', p('onetwo')),
								);
							});

							it('after text', async () => {
								const editorInstance = editor(doc(p('onetwo {<>}')));
								await insertAction(editorInstance);
								expect(editorInstance.editorView.state).toEqualDocumentAndSelection(
									doc(p('onetwo '), hr(), '{<|gap>}'),
								);
							});

							describe('within invalid parent', () => {
								it('start of first line', async () => {
									const editorInstance = editor(doc(panel()(p('{<>}onetwo'), p('three'))));
									await insertAction(editorInstance);
									expect(editorInstance.editorView.state).toEqualDocumentAndSelection(
										doc(hr(), '{<|gap>}', panel()(p('onetwo'), p('three'))),
									);
								});

								it('start of first line (empty)', async () => {
									const editorInstance = editor(doc(panel()(p('{<>}'), p('onetwo'), p('three'))));
									await insertAction(editorInstance);
									expect(editorInstance.editorView.state).toEqualDocumentAndSelection(
										doc(hr(), '{<|gap>}', panel()(p(''), p('onetwo'), p('three'))),
									);
								});

								it('end of first line', async () => {
									const editorInstance = editor(doc(panel()(p('onetwo {<>}'), p('three'))));
									await insertAction(editorInstance);
									expect(editorInstance.editorView.state).toEqualDocumentAndSelection(
										doc(panel()(p('onetwo ')), hr(), '{<|gap>}', panel()(p('three'))),
									);
								});

								it('start of last line', async () => {
									const editorInstance = editor(doc(panel()(p('onetwo'), p('{<>}three'))));
									await insertAction(editorInstance);
									expect(editorInstance.editorView.state).toEqualDocumentAndSelection(
										doc(panel()(p('onetwo')), hr(), '{<|gap>}', panel()(p('three'))),
									);
								});

								it('end of last line', async () => {
									const editorInstance = editor(doc(panel()(p('onetwo'), p('three {<>}'))));
									await insertAction(editorInstance);
									expect(editorInstance.editorView.state).toEqualDocumentAndSelection(
										doc(panel()(p('onetwo'), p('three ')), hr(), '{<|gap>}'),
									);
								});

								it('empty paragraph', async () => {
									const editorInstance = editor(doc(panel()(p('{<>}'))));
									await insertAction(editorInstance);
									expect(editorInstance.editorView.state).toEqualDocumentAndSelection(
										doc(panel()(p('')), hr(), '{<|gap>}'),
									);
								});
							});
						});
					});
				});
			});
		});
	});
});
