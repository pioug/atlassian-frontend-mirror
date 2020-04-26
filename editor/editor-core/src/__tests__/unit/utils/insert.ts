import { NodeType } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';

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
} from '@atlaskit/editor-test-helpers/schema-builder';

import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';

import { safeInsert } from '../../../utils/insert';
import { insertMediaSingleNode } from '../../../plugins/media/utils/media-single';
import { INPUT_METHOD } from '../../../plugins/analytics';
import {
  temporaryMediaWithDimensions,
  temporaryFileId,
  testCollectionName,
} from '../plugins/media/_utils';

const safeInsertNode = (node: NodeType, editorView: EditorView) => {
  const { state, dispatch } = editorView;
  const tr = safeInsert(node.createChecked(), state.selection.from)(state.tr);
  if (tr) {
    dispatch(tr);
  }
};

describe('@atlaskit/editor-core/utils insert', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: any) => {
    return createEditor({
      doc,
      editorProps: {
        allowPanel: true,
        allowRule: true,
        allowLayouts: true,
        allowNewInsertionBehaviour: true,
        quickInsert: true,
        media: {
          allowMediaSingle: true,
        },
      },
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

      expect(tr).toBeNull();
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
              p(),
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
                  mediaSingle({ layout: 'center' })(
                    temporaryMediaWithDimensions(),
                  ),
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
                mediaSingle({ layout: 'center' })(
                  temporaryMediaWithDimensions(),
                ),
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
                mediaSingle({ layout: 'center' })(
                  temporaryMediaWithDimensions(),
                ),
              ),
            );
          });
        });
      });

      describe('horizontal rule', () => {
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
                doc(panel()(p('onetwo'), p('three'), p()), hr(), '{<|gap>}'),
              );
            });
          });
        });

        [
          {
            insertMethod: 'toolbar',
            insertAction: ({ editorView }: { editorView: EditorView }) =>
              safeInsertNode(editorView.state.schema.nodes.rule, editorView),
          },
          {
            insertMethod: 'quick insert',
            insertAction: ({
              editorView,
              sel,
            }: {
              editorView: EditorView;
              sel: number;
            }) => {
              insertText(editorView, `/divider`, sel);
              sendKeyToPm(editorView, 'Enter');
            },
          },
        ].forEach(({ insertMethod, insertAction }) => {
          describe(insertMethod, () => {
            it('empty paragraph', () => {
              const editorInstance = editor(doc(p('{<>}')));
              insertAction(editorInstance);
              expect(
                editorInstance.editorView.state,
              ).toEqualDocumentAndSelection(doc(hr(), '{<|gap>}'));
            });

            it('before text', () => {
              const editorInstance = editor(doc(p('{<>}onetwo')));
              insertAction(editorInstance);
              expect(
                editorInstance.editorView.state,
              ).toEqualDocumentAndSelection(doc(hr(), '{<|gap>}', p('onetwo')));
            });

            it.skip('within text', () => {
              const editorInstance = editor(doc(p('one{<>}two')));
              insertAction(editorInstance);
              expect(
                editorInstance.editorView.state,
              ).toEqualDocumentAndSelection(
                doc(p('one'), hr(), '{<|gap>}', p('two')),
              );
            });

            it('after text', () => {
              const editorInstance = editor(doc(p('onetwo {<>}')));
              insertAction(editorInstance);
              expect(
                editorInstance.editorView.state,
              ).toEqualDocumentAndSelection(
                doc(p('onetwo '), hr(), '{<|gap>}'),
              );
            });

            it.skip('within valid parent (layout)', () => {
              const editorInstance = editor(
                doc(
                  layoutSection(
                    layoutColumn({ width: 50 })(p('one{<>}two')),
                    layoutColumn({ width: 50 })(p('three')),
                  ),
                ),
              );

              insertAction(editorInstance);
              expect(
                editorInstance.editorView.state,
              ).toEqualDocumentAndSelection(
                doc(
                  layoutSection(
                    layoutColumn({ width: 50 })(
                      p('one'),
                      hr(),
                      '{<|gap>}',
                      p('two'),
                    ),
                    layoutColumn({ width: 50 })(p('three')),
                  ),
                ),
              );
            });

            describe('within invalid parent', () => {
              it('start of first line', () => {
                const editorInstance = editor(
                  doc(panel()(p('{<>}onetwo'), p('three'))),
                );
                insertAction(editorInstance);
                expect(
                  editorInstance.editorView.state,
                ).toEqualDocumentAndSelection(
                  doc(hr(), '{<|gap>}', panel()(p('onetwo'), p('three'))),
                );
              });

              it.skip('start of first line (empty)', () => {
                const editorInstance = editor(
                  doc(panel()(p('{<>}'), p('onetwo'), p('three'))),
                );
                insertAction(editorInstance);
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

              it.skip('middle of line', () => {
                const editorInstance = editor(
                  doc(panel()(p('one{<>}two'), p('three'))),
                );
                insertAction(editorInstance);
                expect(
                  editorInstance.editorView.state,
                ).toEqualDocumentAndSelection(
                  doc(
                    panel()(p('one')),
                    hr(),
                    '{<|gap>}',
                    panel()(p('two'), p('three')),
                  ),
                );
              });

              it('end of first line', () => {
                const editorInstance = editor(
                  doc(panel()(p('onetwo {<>}'), p('three'))),
                );
                insertAction(editorInstance);
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

              it('start of last line', () => {
                const editorInstance = editor(
                  doc(panel()(p('onetwo'), p('{<>}three'))),
                );
                insertAction(editorInstance);
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

              it('end of last line', () => {
                const editorInstance = editor(
                  doc(panel()(p('onetwo'), p('three {<>}'))),
                );
                insertAction(editorInstance);
                expect(
                  editorInstance.editorView.state,
                ).toEqualDocumentAndSelection(
                  doc(panel()(p('onetwo'), p('three ')), hr(), '{<|gap>}'),
                );
              });

              it('empty paragraph', () => {
                const editorInstance = editor(doc(panel()(p('{<>}'))));
                insertAction(editorInstance);
                expect(
                  editorInstance.editorView.state,
                ).toEqualDocumentAndSelection(
                  doc(panel()(p('')), hr(), '{<|gap>}'),
                );
              });
            });

            it.skip('within nested parents', () => {
              const editorInstance = editor(
                doc(panel()(ul(li(code_block()('one{<>}two'))))),
              );
              insertAction(editorInstance);
              expect(
                editorInstance.editorView.state,
              ).toEqualDocumentAndSelection(
                doc(
                  panel()(ul(li(code_block()('one')))),
                  hr(),
                  '{<|gap>}',
                  panel()(ul(li(code_block()('two')))),
                ),
              );
            });

            describe.skip('list', () => {
              describe('single', () => {
                it('start of single line', () => {
                  const editorInstance = editor(doc(ul(li(p('{<>}onetwo')))));
                  insertAction(editorInstance);
                  expect(
                    editorInstance.editorView.state,
                  ).toEqualDocumentAndSelection(
                    doc(hr(), '{<|gap>}', ul(li(p('onetwo')))),
                  );
                });

                it.skip('middle of single line', () => {
                  const editorInstance = editor(doc(ul(li(p('one{<>}two')))));
                  insertAction(editorInstance);
                  expect(
                    editorInstance.editorView.state,
                  ).toEqualDocumentAndSelection(
                    doc(ul(li(p('one'))), hr(), '{<|gap>}', ul(li(p('two')))),
                  );
                });

                it('end of single line', () => {
                  const editorInstance = editor(doc(ul(li(p('onetwo {<>}')))));
                  insertAction(editorInstance);
                  expect(
                    editorInstance.editorView.state,
                  ).toEqualDocumentAndSelection(
                    doc(ul(li(p('onetwo '))), hr(), '{<|gap>}'),
                  );
                });
              });

              describe('simple', () => {
                it('start of first line', () => {
                  const editorInstance = editor(
                    doc(ul(li(p('{<>}one')), li(p('two')), li(p('three')))),
                  );
                  insertAction(editorInstance);
                  expect(
                    editorInstance.editorView.state,
                  ).toEqualDocumentAndSelection(
                    doc(
                      hr(),
                      '{<|gap>}',
                      ul(li(p('one')), li(p('two')), li(p('three'))),
                    ),
                  );
                });

                it.skip('middle of first line', () => {
                  const editorInstance = editor(
                    doc(ul(li(p('on{<>}e')), li(p('two')), li(p('three')))),
                  );
                  insertAction(editorInstance);
                  expect(
                    editorInstance.editorView.state,
                  ).toEqualDocumentAndSelection(
                    doc(
                      ul(li(p('on'))),
                      hr(),
                      '{<|gap>}',
                      ul(li(p('e')), li(p('two')), li(p('three'))),
                    ),
                  );
                });

                it('end of first line', () => {
                  const editorInstance = editor(
                    doc(ul(li(p('one {<>}')), li(p('two')), li(p('three')))),
                  );
                  insertAction(editorInstance);
                  expect(
                    editorInstance.editorView.state,
                  ).toEqualDocumentAndSelection(
                    doc(
                      ul(li(p('one '))),
                      hr(),
                      '{<|gap>}',
                      ul(li(p('two')), li(p('three'))),
                    ),
                  );
                });

                it('start of middle line', () => {
                  const editorInstance = editor(
                    doc(ul(li(p('one')), li(p('{<>}two')), li(p('three')))),
                  );
                  insertAction(editorInstance);
                  expect(
                    editorInstance.editorView.state,
                  ).toEqualDocumentAndSelection(
                    doc(
                      ul(li(p('one'))),
                      hr(),
                      '{<|gap>}',
                      ul(li(p('two')), li(p('three'))),
                    ),
                  );
                });

                it.skip('middle of middle line', () => {
                  const editorInstance = editor(
                    doc(ul(li(p('one')), li(p('tw{<>}o')), li(p('three')))),
                  );
                  insertAction(editorInstance);
                  expect(
                    editorInstance.editorView.state,
                  ).toEqualDocumentAndSelection(
                    doc(
                      ul(li(p('one')), li(p('tw'))),
                      hr(),
                      '{<|gap>}',
                      ul(li(p('o')), li(p('three'))),
                    ),
                  );
                });

                it('end of middle line', () => {
                  const editorInstance = editor(
                    doc(ul(li(p('one')), li(p('two {<>}')), li(p('three')))),
                  );
                  insertAction(editorInstance);
                  expect(
                    editorInstance.editorView.state,
                  ).toEqualDocumentAndSelection(
                    doc(
                      ul(li(p('one')), li(p('two '))),
                      hr(),
                      '{<|gap>}',
                      ul(li(p('three'))),
                    ),
                  );
                });

                it('start of last line', () => {
                  const editorInstance = editor(
                    doc(ul(li(p('one')), li(p('two')), li(p('{<>}three')))),
                  );
                  insertAction(editorInstance);
                  expect(
                    editorInstance.editorView.state,
                  ).toEqualDocumentAndSelection(
                    doc(
                      ul(li(p('one')), li(p('two'))),
                      hr(),
                      '{<|gap>}',
                      ul(li(p('three'))),
                    ),
                  );
                });

                it.skip('middle of end line', () => {
                  const editorInstance = editor(
                    doc(ul(li(p('one')), li(p('two')), li(p('thr{<>}ee')))),
                  );
                  insertAction(editorInstance);
                  expect(
                    editorInstance.editorView.state,
                  ).toEqualDocumentAndSelection(
                    doc(
                      ul(li(p('one')), li(p('two')), li(p('thr'))),
                      hr(),
                      '{<|gap>}',
                      ul(li(p('ee'))),
                    ),
                  );
                });

                it('end of end line', () => {
                  const editorInstance = editor(
                    doc(ul(li(p('one')), li(p('two')), li(p('three {<>}')))),
                  );
                  insertAction(editorInstance);
                  expect(
                    editorInstance.editorView.state,
                  ).toEqualDocumentAndSelection(
                    doc(
                      ul(li(p('one')), li(p('two')), li(p('three '))),
                      hr(),
                      '{<|gap>}',
                    ),
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
