import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { TypeAheadTool } from '@atlaskit/editor-test-helpers/create-editor';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import {
  doc,
  p,
  hr,
  panel,
  layoutColumn,
  layoutSection,
  ul,
  li,
  code_block,
  mediaSingle,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { insertText } from '@atlaskit/editor-test-helpers/transactions';

import { safeInsert } from '@atlaskit/editor-common/insert';
import { insertMediaSingleNode } from '../../../plugins/media/utils/media-single';
import { INPUT_METHOD } from '../../../plugins/analytics';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import {
  temporaryMediaWithDimensions,
  temporaryFileId,
  testCollectionName,
} from '../plugins/media/_utils';
import type { PublicPluginAPI } from '@atlaskit/editor-common/types';

import layoutPlugin from '../../../plugins/layout';
import panelPlugin from '../../../plugins/panel';
import { rulePlugin } from '@atlaskit/editor-plugin-rule';
import typeAheadPlugin from '../../../plugins/type-ahead';
import quickInsertPlugin from '../../../plugins/quick-insert';
import { editorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import floatingToolbarPlugin from '../../../plugins/floating-toolbar';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import codeBlockPlugin from '../../../plugins/code-block';
import { gridPlugin } from '@atlaskit/editor-plugin-grid';
import mediaPlugin from '../../../plugins/media';
import { listPlugin } from '@atlaskit/editor-plugin-list';
import { focusPlugin } from '@atlaskit/editor-plugin-focus';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { compositionPlugin } from '@atlaskit/editor-plugin-composition';
import type {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';

describe('@atlaskit/editor-core/utils insert', () => {
  const createEditor = createProsemirrorEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;
  createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, { newInsertionBehaviour: true }])
        .add([analyticsPlugin, { createAnalyticsEvent }])
        .add(editorDisabledPlugin)
        .add(widthPlugin)
        .add(guidelinePlugin)
        .add(gridPlugin)
        .add(decorationsPlugin)
        .add(floatingToolbarPlugin)
        .add(focusPlugin)
        .add(compositionPlugin)
        .add(contentInsertionPlugin)
        .add(layoutPlugin)
        .add(panelPlugin)
        .add(rulePlugin)
        .add([typeAheadPlugin, { createAnalyticsEvent }])
        .add([mediaPlugin, { allowMediaSingle: true }])
        .add(listPlugin)
        .add([quickInsertPlugin, {}])
        .add([codeBlockPlugin, { appearance: 'full-page' }]),
    });
  };

  const insertDummyMedia = (editorView: EditorView) =>
    insertMediaSingleNode(
      editorView,
      {
        id: temporaryFileId,
        status: 'preview',
        dimensions: {
          width: 256,
          height: 128,
        },
      },
      INPUT_METHOD.PICKER_CLOUD,
      testCollectionName,
      undefined,
      true,
    );

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

  describe('insert within a list', () => {
    it('should return null', () => {
      const { editorView } = editor(doc(ul(li(p('{<>}one')), li(p('three')))));

      const tr = safeInsert(
        editorView.state.schema.nodes.rule.createChecked(),
        editorView.state.selection.from,
      )(editorView.state.tr);

      expect(tr).not.toBeNull();
    });
  });

  describe('leaf', () => {
    describe('block', () => {
      describe('media single', () => {
        it('before text', () => {
          const { editorView } = editor(doc(p('{<>}onetwo')));
          insertDummyMedia(editorView);

          expect(editorView.state).toEqualDocumentAndSelection(
            doc(
              mediaSingle({ layout: 'center' })(temporaryMediaWithDimensions()),
              p('onetwo'),
            ),
          );
        });

        it('after text', () => {
          const { editorView } = editor(doc(p('onetwo{<>}')));
          insertDummyMedia(editorView);

          expect(editorView.state).toEqualDocumentAndSelection(
            doc(
              p('onetwo'),
              mediaSingle({ layout: 'center' })(temporaryMediaWithDimensions()),
            ),
          );
        });

        it('within valid parent (layout)', () => {
          const { editorView } = editor(
            doc(
              layoutSection(
                layoutColumn({ width: 50 })(p('{<>}onetwo')),
                layoutColumn({ width: 50 })(p('three')),
              ),
            ),
          );

          insertDummyMedia(editorView);
          expect(editorView.state).toEqualDocumentAndSelection(
            doc(
              layoutSection(
                layoutColumn({ width: 50 })(
                  mediaSingle({
                    layout: 'center',
                  })(temporaryMediaWithDimensions()),
                  p('onetwo'),
                ),
                layoutColumn({ width: 50 })(p('three')),
              ),
            ),
          );
        });

        describe('within invalid parent', () => {
          it('start of paragraph', () => {
            const { editorView } = editor(doc(panel()(p('{<>}onetwo'))));
            insertDummyMedia(editorView);

            expect(editorView.state.doc).toEqualDocument(
              doc(
                mediaSingle({
                  layout: 'center',
                })(temporaryMediaWithDimensions()),
                panel()(p('onetwo')),
              ),
            );
          });

          it('end of paragraph', () => {
            const { editorView } = editor(doc(panel()(p('onetwo'))));
            insertDummyMedia(editorView);
            expect(editorView.state).toEqualDocumentAndSelection(
              doc(
                panel()(p('onetwo')),
                mediaSingle({
                  layout: 'center',
                })(temporaryMediaWithDimensions()),
              ),
            );
          });
        });
      });

      describe('horizontal rule', () => {
        const insertFromToolbar = ({
          editorView,
          editorAPI,
        }: {
          editorView: EditorView;
          editorAPI: PublicPluginAPI<[typeof rulePlugin]> | undefined;
        }) => {
          const { state, dispatch } = editorView;
          editorAPI?.rule.actions?.insertHorizontalRule(INPUT_METHOD.TOOLBAR)(
            state,
            dispatch,
          );
        };
        const insertFromQuickInsert = async ({
          typeAheadTool,
        }: {
          typeAheadTool: TypeAheadTool;
        }) => {
          await typeAheadTool
            .searchQuickInsert('divider')
            ?.insert({ index: 0 });
        };

        describe('input rule (--- command)', () => {
          it('empty paragraph', () => {
            const { editorView, sel } = editor(doc(p('{<>}')));
            insertText(editorView, '---', sel);
            expect(editorView.state).toEqualDocumentAndSelection(
              doc(hr(), '{<|gap>}'),
            );
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
              const { editorView, sel } = editor(
                doc(panel()(p('{<>}onetwo'), p('three'))),
              );
              insertText(editorView, '---', sel);
              expect(editorView.state).toEqualDocumentAndSelection(
                doc(hr(), '{<|gap>}', panel()(p('onetwo'), p('three'))),
              );
            });

            it('start of the last line', () => {
              const { editorView, sel } = editor(
                doc(panel()(p('onetwo'), p('{<>}three'))),
              );
              insertText(editorView, '---', sel);
              expect(editorView.state).toEqualDocumentAndSelection(
                doc(
                  panel()(p('onetwo')),
                  hr(),
                  '{<|gap>}',
                  panel()(p('three')),
                ),
              );
            });

            it('start of the last line (empty paragraph)', () => {
              const { editorView, sel } = editor(
                doc(panel()(p('onetwo'), p('three'), p('{<>}'))),
              );
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
              expect(
                editorInstance.editorView.state,
              ).toEqualDocumentAndSelection(doc(p('one'), hr(), p('{<>}two')));
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
              expect(
                editorInstance.editorView.state,
              ).toEqualDocumentAndSelection(
                doc(
                  layoutSection(
                    layoutColumn({ width: 50 })(p('one'), hr(), p('{<>}two')),
                    layoutColumn({ width: 50 })(p('three')),
                  ),
                ),
              );
            });

            it('middle of line', () => {
              const editorInstance = editor(
                doc(panel()(p('one{<>} two'), p('three'))),
              );
              insertFromToolbar(editorInstance);
              expect(
                editorInstance.editorView.state,
              ).toEqualDocumentAndSelection(
                doc(panel()(p('one two'), p('three')), hr()),
              );
            });

            it('within nested parents', () => {
              const editorInstance = editor(
                doc(panel()(ul(li(code_block()('one{<>} two'))))),
              );
              insertFromToolbar(editorInstance);
              expect(
                editorInstance.editorView.state,
              ).toEqualDocumentAndSelection(
                doc(
                  panel()(ul(li(code_block()('one')))),
                  hr(),
                  panel()(ul(li(code_block()('{<>} two')))),
                ),
              );
            });

            describe('list', () => {
              describe('single', () => {
                it('middle of first line', () => {
                  const editorInstance = editor(
                    doc(ul(li(p('on{<>}e')), li(p('two')), li(p('three')))),
                  );
                  insertFromToolbar(editorInstance);
                  expect(
                    editorInstance.editorView.state,
                  ).toEqualDocumentAndSelection(
                    doc(
                      ul(li(p('on'))),
                      hr(),
                      ul(li(p('{<>}e')), li(p('two')), li(p('three'))),
                    ),
                  );
                });

                it('middle of single line', () => {
                  const editorInstance = editor(doc(ul(li(p('one{<>}two')))));
                  insertFromToolbar(editorInstance);
                  expect(
                    editorInstance.editorView.state,
                  ).toEqualDocumentAndSelection(
                    doc(ul(li(p('one'))), hr(), ul(li(p('{<>}two')))),
                  );
                });
              });

              describe('simple', () => {
                it('end of first line', () => {
                  const editorInstance = editor(
                    doc(ul(li(p('one {<>}')), li(p('two')), li(p('three')))),
                  );
                  insertFromToolbar(editorInstance);
                  expect(
                    editorInstance.editorView.state,
                  ).toEqualDocumentAndSelection(
                    doc(
                      ul(li(p('one '))),
                      hr(),
                      ul(li(p('{<>}two')), li(p('three'))),
                    ),
                  );
                });

                it('middle of middle line', () => {
                  const editorInstance = editor(
                    doc(ul(li(p('one')), li(p('tw{<>}o')), li(p('three')))),
                  );
                  insertFromToolbar(editorInstance);
                  expect(
                    editorInstance.editorView.state,
                  ).toEqualDocumentAndSelection(
                    doc(
                      ul(li(p('one')), li(p('tw'))),
                      hr(),
                      ul(li(p('{<>}o')), li(p('three'))),
                    ),
                  );
                });

                it('middle of end line', () => {
                  const editorInstance = editor(
                    doc(ul(li(p('one')), li(p('two')), li(p('thr{<>}ee')))),
                  );
                  insertFromToolbar(editorInstance);
                  expect(
                    editorInstance.editorView.state,
                  ).toEqualDocumentAndSelection(
                    doc(
                      ul(li(p('one')), li(p('two')), li(p('thr'))),
                      hr(),
                      ul(li(p('{<>}ee'))),
                    ),
                  );
                });
              });
            });
          });

          describe('quick insert only', () => {
            it('within text', async () => {
              const editorInstance = editor(doc(p('one {<>} two')));
              await insertFromQuickInsert(editorInstance);
              expect(
                editorInstance.editorView.state,
              ).toEqualDocumentAndSelection(doc(p('one  two'), hr()));
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
              expect(
                editorInstance.editorView.state,
              ).toEqualDocumentAndSelection(
                doc(
                  layoutSection(
                    layoutColumn({ width: 50 })(p('one  two'), hr()),
                    layoutColumn({ width: 50 })(p('{<>}three')),
                  ),
                ),
              );
            });

            it('middle of line', async () => {
              const editorInstance = editor(
                doc(panel()(p('one {<>} two'), p('three'))),
              );
              await insertFromQuickInsert(editorInstance);
              expect(
                editorInstance.editorView.state,
              ).toEqualDocumentAndSelection(
                doc(panel()(p('one  two'), p('three')), hr()),
              );
            });

            describe('list', () => {
              describe('single', () => {
                it('end of single line', async () => {
                  const editorInstance = editor(doc(ul(li(p('onetwo {<>}')))));
                  await insertFromQuickInsert(editorInstance);
                  expect(
                    editorInstance.editorView.state,
                  ).toEqualDocumentAndSelection(
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
                  expect(
                    editorInstance.editorView.state,
                  ).toEqualDocumentAndSelection(
                    doc(
                      ul(li(p('one')), li(p('two')), li(p('three {<>}'))),
                      hr(),
                    ),
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
              expect(
                editorInstance.editorView.state,
              ).toEqualDocumentAndSelection(doc(hr(), '{<|gap>}'));
            });

            it('before text', async () => {
              const editorInstance = editor(doc(p('{<>}onetwo')));
              await insertAction(editorInstance);
              expect(
                editorInstance.editorView.state,
              ).toEqualDocumentAndSelection(doc(hr(), '{<|gap>}', p('onetwo')));
            });

            it('after text', async () => {
              const editorInstance = editor(doc(p('onetwo {<>}')));
              await insertAction(editorInstance);
              expect(
                editorInstance.editorView.state,
              ).toEqualDocumentAndSelection(
                doc(p('onetwo '), hr(), '{<|gap>}'),
              );
            });

            describe('within invalid parent', () => {
              it('start of first line', async () => {
                const editorInstance = editor(
                  doc(panel()(p('{<>}onetwo'), p('three'))),
                );
                await insertAction(editorInstance);
                expect(
                  editorInstance.editorView.state,
                ).toEqualDocumentAndSelection(
                  doc(hr(), '{<|gap>}', panel()(p('onetwo'), p('three'))),
                );
              });

              it('start of first line (empty)', async () => {
                const editorInstance = editor(
                  doc(panel()(p('{<>}'), p('onetwo'), p('three'))),
                );
                await insertAction(editorInstance);
                expect(
                  editorInstance.editorView.state,
                ).toEqualDocumentAndSelection(
                  doc(
                    hr(),
                    '{<|gap>}',
                    panel()(p(''), p('onetwo'), p('three')),
                  ),
                );
              });

              it('end of first line', async () => {
                const editorInstance = editor(
                  doc(panel()(p('onetwo {<>}'), p('three'))),
                );
                await insertAction(editorInstance);
                expect(
                  editorInstance.editorView.state,
                ).toEqualDocumentAndSelection(
                  doc(
                    panel()(p('onetwo ')),
                    hr(),
                    '{<|gap>}',
                    panel()(p('three')),
                  ),
                );
              });

              it('start of last line', async () => {
                const editorInstance = editor(
                  doc(panel()(p('onetwo'), p('{<>}three'))),
                );
                await insertAction(editorInstance);
                expect(
                  editorInstance.editorView.state,
                ).toEqualDocumentAndSelection(
                  doc(
                    panel()(p('onetwo')),
                    hr(),
                    '{<|gap>}',
                    panel()(p('three')),
                  ),
                );
              });

              it('end of last line', async () => {
                const editorInstance = editor(
                  doc(panel()(p('onetwo'), p('three {<>}'))),
                );
                await insertAction(editorInstance);
                expect(
                  editorInstance.editorView.state,
                ).toEqualDocumentAndSelection(
                  doc(panel()(p('onetwo'), p('three ')), hr(), '{<|gap>}'),
                );
              });

              it('empty paragraph', async () => {
                const editorInstance = editor(doc(panel()(p('{<>}'))));
                await insertAction(editorInstance);
                expect(
                  editorInstance.editorView.state,
                ).toEqualDocumentAndSelection(
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
