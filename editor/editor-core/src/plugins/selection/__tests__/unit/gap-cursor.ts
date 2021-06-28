import { TextSelection, PluginKey } from 'prosemirror-state';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  blockquote,
  table,
  tr,
  td,
  tdCursor,
  h1,
  code_block,
  DocBuilder,
  mediaSingle,
  media,
} from '@atlaskit/editor-test-helpers/doc-builder';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';

import { setTextSelection } from '../../../../index';
import { setGapCursorSelection } from '../../../../utils';
import {
  GapCursorSelection,
  Side,
} from '../../../selection/gap-cursor-selection';

import {
  blockNodes,
  leafBlockNodes,
  BlockNodesKeys,
  LeafBlockNodesKeys,
  blockContainerNodes,
  BlockContainerNodesKeys,
} from './_gap-cursor-utils';

import { uuid } from '@atlaskit/adf-schema';
import { gapCursorPluginKey } from '../../pm-plugins/gap-cursor-plugin-key';
import createStub from 'raf-stub';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import mediaPlugin from '../../../media';
import selectionPlugin from '../../../selection';

describe('gap-cursor', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: {
        allowExtension: true,
        allowTables: true,
        allowTasksAndDecisions: true,
        allowRule: true,
        allowPanel: true,
        media: { allowMediaSingle: true },
      },
      pluginKey: gapCursorPluginKey,
    });

  describe('when block nodes do not allow gap cursor', () => {
    describe('on specific nodes', () => {
      it('should not create a GapCursor selection for paragraph', () => {
        const { editorView } = editor(doc(p('{<>}')));
        sendKeyToPm(editorView, 'ArrowLeft');
        expect(editorView.state.selection instanceof TextSelection).toBe(true);
      });
      it('should not create a GapCursor selection for heading', () => {
        const { editorView } = editor(doc(h1('{<>}')));
        sendKeyToPm(editorView, 'ArrowLeft');
        expect(editorView.state.selection instanceof TextSelection).toBe(true);
      });
      it('should not create a GapCursor selection for blockquote', () => {
        const { editorView } = editor(doc(blockquote(p('{<>}'))));
        sendKeyToPm(editorView, 'ArrowLeft');
        expect(editorView.state.selection instanceof TextSelection).toBe(true);
      });
    });

    describe('when selection moving to preceding block node', () => {
      (Object.keys(blockNodes) as BlockNodesKeys).forEach((nodeName) => {
        describe(nodeName, () => {
          it(`should create TextSelection on preceding ${nodeName}`, () => {
            const { editorView } = editor(
              doc(
                (blockNodes[nodeName] as any)(),
                (blockNodes[nodeName] as any)({ selected: true }),
              ),
            );
            sendKeyToPm(editorView, 'ArrowUp');
            expect(editorView.state.selection instanceof TextSelection).toBe(
              true,
            );
          });
        });
      });
    });

    describe('when selection moving to following block node', () => {
      (Object.keys(blockNodes) as BlockNodesKeys).forEach((nodeName) => {
        describe(nodeName, () => {
          it(`should create TextSelection on following ${nodeName}`, () => {
            const { editorView } = editor(
              doc(
                (blockNodes[nodeName] as any)({ selected: true }),
                (blockNodes[nodeName] as any)(),
              ),
            );
            sendKeyToPm(editorView, 'ArrowDown');
            expect(editorView.state.selection instanceof TextSelection).toBe(
              true,
            );
          });
        });
      });
    });
  });

  describe('when block nodes allow gap cursor', () => {
    ['ArrowLeft', 'ArrowRight'].forEach((direction) => {
      describe(`when pressing ${direction}`, () => {
        describe('when cursor is inside of a content block node', () => {
          (Object.keys(blockNodes) as BlockNodesKeys)
            .filter((blockNode) => blockNode !== 'table') // table has custom behaviour to set a cell selection in this case
            .forEach((nodeName) => {
              describe(nodeName, () => {
                it('should set GapCursorSelection', () => {
                  const { editorView } = editor(
                    doc((blockNodes[nodeName] as any)()),
                  );
                  sendKeyToPm(editorView, direction);
                  expect(
                    editorView.state.selection instanceof GapCursorSelection,
                  ).toBe(true);

                  const expectedSide =
                    direction === 'ArrowLeft' ? Side.LEFT : Side.RIGHT;
                  expect(
                    (editorView.state.selection as GapCursorSelection).side,
                  ).toEqual(expectedSide);
                });
              });
            });

          (Object.keys(blockContainerNodes) as BlockContainerNodesKeys).forEach(
            (nodeName) => {
              describe(nodeName, () => {
                it('should set GapCursorSelection', () => {
                  const { editorView } = editor(
                    doc((blockContainerNodes[nodeName] as any)()),
                  );
                  sendKeyToPm(editorView, direction);
                  sendKeyToPm(editorView, direction);
                  expect(
                    editorView.state.selection instanceof GapCursorSelection,
                  ).toBe(true);

                  const expectedSide =
                    direction === 'ArrowLeft' ? Side.LEFT : Side.RIGHT;
                  expect(
                    (editorView.state.selection as GapCursorSelection).side,
                  ).toEqual(expectedSide);
                });
              });
            },
          );
        });

        describe('when cursor is before or after a leaf block node', () => {
          (Object.keys(leafBlockNodes) as LeafBlockNodesKeys).forEach(
            (nodeName) => {
              describe(nodeName, () => {
                it('should set GapCursorSelection', () => {
                  const content =
                    direction === 'ArrowLeft'
                      ? doc(leafBlockNodes[nodeName], p('{<>}'))
                      : doc(p('{<>}'), leafBlockNodes[nodeName]);

                  const { editorView } = editor(content);
                  sendKeyToPm(editorView, direction);
                  expect(
                    editorView.state.selection instanceof GapCursorSelection,
                  ).toBe(true);

                  const expectedSide =
                    direction === 'ArrowLeft' ? Side.RIGHT : Side.LEFT;
                  expect(
                    (editorView.state.selection as GapCursorSelection).side,
                  ).toEqual(expectedSide);
                });
              });
            },
          );
        });
      });

      describe('when cursor is after a block node', () => {
        describe(`when pressing Backspace`, () => {
          (Object.keys(blockNodes) as BlockNodesKeys).forEach((nodeName) => {
            describe(nodeName, () => {
              it(`should delete the ${nodeName}`, () => {
                const { editorView, refs } = editor(
                  doc((blockNodes[nodeName] as any)(), '{pos}'),
                );
                setGapCursorSelection(editorView, refs.pos, Side.RIGHT);
                sendKeyToPm(editorView, 'Backspace');

                expect(editorView.state.doc).toEqualDocument(doc(p('')));
                expect(
                  editorView.state.selection instanceof TextSelection,
                ).toBe(true);
              });
            });
          });
          (Object.keys(leafBlockNodes) as LeafBlockNodesKeys).forEach(
            (nodeName) => {
              describe(nodeName, () => {
                it(`should delete the ${nodeName}`, () => {
                  const { editorView, refs } = editor(
                    doc(leafBlockNodes[nodeName], '{pos}'),
                  );
                  setGapCursorSelection(editorView, refs.pos, Side.RIGHT);
                  sendKeyToPm(editorView, 'Backspace');

                  expect(editorView.state.doc).toEqualDocument(doc(p('')));
                  expect(
                    editorView.state.selection instanceof TextSelection,
                  ).toBe(true);
                });
              });
            },
          );
        });
      });

      describe('when cursor is before a block node', () => {
        describe(`when pressing Delete`, () => {
          (Object.keys(blockNodes) as BlockNodesKeys).forEach((nodeName) => {
            describe(nodeName, () => {
              it(`should delete the ${nodeName}`, () => {
                const { editorView, refs } = editor(
                  doc('{pos}', (blockNodes[nodeName] as any)()),
                );
                setGapCursorSelection(editorView, refs.pos, Side.LEFT);
                sendKeyToPm(editorView, 'Delete');

                expect(editorView.state.doc).toEqualDocument(doc(p('')));
                expect(
                  editorView.state.selection instanceof TextSelection,
                ).toBe(true);
              });
            });
          });
          (Object.keys(leafBlockNodes) as LeafBlockNodesKeys).forEach(
            (nodeName) => {
              describe(nodeName, () => {
                it(`should delete the ${nodeName}`, () => {
                  const { editorView, refs } = editor(
                    doc('{pos}', leafBlockNodes[nodeName]),
                  );
                  setGapCursorSelection(editorView, refs.pos, Side.LEFT);
                  sendKeyToPm(editorView, 'Delete');

                  expect(editorView.state.doc).toEqualDocument(doc(p('')));
                  expect(
                    editorView.state.selection instanceof TextSelection,
                  ).toBe(true);
                });
              });
            },
          );
        });
      });
    });

    describe('when pressing ArrowUp', () => {
      describe('when cursor is inside first content block node of document', () => {
        (Object.keys(blockNodes) as BlockNodesKeys).forEach((nodeName) => {
          describe(nodeName, () => {
            it('should set GapCursorSelection', () => {
              const { editorView } = editor(
                doc((blockNodes[nodeName] as any)()),
              );
              sendKeyToPm(editorView, 'ArrowUp');
              expect(
                editorView.state.selection instanceof GapCursorSelection,
              ).toBe(true);
              expect(
                (editorView.state.selection as GapCursorSelection).side,
              ).toEqual(Side.LEFT);
            });
          });
        });
      });
    });

    describe('when pressing ArrowLeft', () => {
      describe('when cursor is inside first content block node of document', () => {
        (Object.keys(blockNodes) as BlockNodesKeys)
          .filter((blockNode) => blockNode !== 'table') // table has custom behaviour to set a cell selection in this case
          .forEach((nodeName) => {
            describe(nodeName, () => {
              it('should set GapCursorSelection', () => {
                const { editorView } = editor(
                  doc((blockNodes[nodeName] as any)()),
                );
                sendKeyToPm(editorView, 'ArrowLeft');
                expect(
                  editorView.state.selection instanceof GapCursorSelection,
                ).toBe(true);
                expect(
                  (editorView.state.selection as GapCursorSelection).side,
                ).toEqual(Side.LEFT);
              });
            });
          });
      });
    });
  });

  describe('when inside of a table', () => {
    describe('when cursor is at a cell to the right', () => {
      describe('when pressing ArrowLeft', () => {
        (Object.keys(blockNodes) as BlockNodesKeys).forEach((nodeName) => {
          if (!/table|bodiedExtension/.test(nodeName)) {
            describe(nodeName, () => {
              it('should set GapCursorSelection', () => {
                const { editorView } = editor(
                  doc(
                    table()(
                      tr(td()((blockNodes[nodeName] as any)()), tdCursor),
                    ),
                  ),
                );
                sendKeyToPm(editorView, 'ArrowLeft');
                expect(
                  editorView.state.selection instanceof GapCursorSelection,
                ).toBe(true);
                expect(
                  (editorView.state.selection as GapCursorSelection).side,
                ).toEqual(Side.RIGHT);
              });
            });
          }
        });

        (Object.keys(leafBlockNodes) as LeafBlockNodesKeys).forEach(
          (nodeName) => {
            describe(nodeName, () => {
              it('should set GapCursorSelection', () => {
                const { editorView } = editor(
                  doc(table()(tr(td()(leafBlockNodes[nodeName]), tdCursor))),
                );
                sendKeyToPm(editorView, 'ArrowLeft');
                expect(
                  editorView.state.selection instanceof GapCursorSelection,
                ).toBe(true);
                expect(
                  (editorView.state.selection as GapCursorSelection).side,
                ).toEqual(Side.RIGHT);
              });
            });
          },
        );
      });
    });

    describe('when cursor is at a cell to the left', () => {
      describe('when pressing ArrowRight', () => {
        (Object.keys(blockNodes) as BlockNodesKeys).forEach((nodeName) => {
          if (!/table|bodiedExtension/.test(nodeName)) {
            describe(nodeName, () => {
              it('should set GapCursorSelection', () => {
                const { editorView, refs } = editor(
                  doc(
                    table()(
                      tr(
                        td()(p('{nextPos}')),
                        td()((blockNodes[nodeName] as any)()),
                      ),
                    ),
                  ),
                );
                const { nextPos } = refs;
                setTextSelection(editorView, nextPos);
                sendKeyToPm(editorView, 'ArrowRight');
                expect(
                  editorView.state.selection instanceof GapCursorSelection,
                ).toBe(true);
                expect(
                  (editorView.state.selection as GapCursorSelection).side,
                ).toEqual(Side.LEFT);
              });
            });
          }
        });

        (Object.keys(leafBlockNodes) as LeafBlockNodesKeys).forEach(
          (nodeName) => {
            describe(nodeName, () => {
              it('should set GapCursorSelection', () => {
                const { editorView, refs } = editor(
                  doc(
                    table()(
                      tr(td()(p('{nextPos}')), td()(leafBlockNodes[nodeName])),
                    ),
                  ),
                );
                const { nextPos } = refs;
                setTextSelection(editorView, nextPos);
                sendKeyToPm(editorView, 'ArrowRight');
                expect(
                  editorView.state.selection instanceof GapCursorSelection,
                ).toBe(true);
                expect(
                  (editorView.state.selection as GapCursorSelection).side,
                ).toEqual(Side.LEFT);
              });
            });
          },
        );
      });
    });
  });

  describe('when hit backspace at the start of the node on the left', () => {
    it('should put gapcursor on the right of the previous node', () => {
      const { editorView } = editor(
        doc(
          blockContainerNodes['decisionList'](),
          blockNodes['taskList']({ selected: true }),
        ),
      );
      sendKeyToPm(editorView, 'ArrowLeft');
      expect(editorView.state.selection instanceof GapCursorSelection).toBe(
        true,
      );
      expect((editorView.state.selection as GapCursorSelection).side).toEqual(
        Side.LEFT,
      );
      sendKeyToPm(editorView, 'Backspace');
      expect((editorView.state.selection as GapCursorSelection).side).toEqual(
        Side.RIGHT,
      );
    });
  });

  describe('when inside of a code block', () => {
    it.each(['ArrowUp', 'ArrowDown'])(
      'should not create gap cursor when pressing %s in the middle of code block',
      (key) => {
        const { editorView } = editor(
          doc(code_block({})('1\n2\n3\n4\n{<>}5\n6\n')),
        );
        sendKeyToPm(editorView, key);
        expect(
          editorView.state.selection instanceof GapCursorSelection,
        ).not.toBe(true);
      },
    );
  });

  describe('when pressing shift-return', () => {
    beforeEach(() => {
      uuid.setStatic('local-uuid');
      uuid.setStatic('uniqueId');
    });

    afterEach(() => {
      uuid.setStatic(false);
    });
    (Object.keys(blockNodes) as BlockNodesKeys).forEach((nodeName) => {
      describe(nodeName, () => {
        it(`should create a paragraph below the ${nodeName}`, () => {
          const { editorView, refs } = editor(
            doc(blockNodes[nodeName]({ id: 'local-uuid' }), '{pos}'),
          );
          setGapCursorSelection(editorView, refs.pos, Side.RIGHT);
          sendKeyToPm(editorView, 'Shift-Enter');
          insertText(editorView, 'text ');
          const expectedDoc = doc(
            blockNodes[nodeName]({ id: 'local-uuid' }),
            p('text {<>}'),
          );
          expect(editorView.state.doc).toEqualDocument(expectedDoc);
          expect(editorView.state.selection instanceof TextSelection).toBe(
            true,
          );
        });
      });
    });
  });

  describe('selection at front of document', () => {
    const createProsemirrorEditor = createProsemirrorEditorFactory();
    let stub: any;
    let rafSpy: any;
    const editor = (doc: DocBuilder) => {
      return createProsemirrorEditor<boolean, PluginKey>({
        doc,
        pluginKey: gapCursorPluginKey,
        preset: new Preset<LightEditorPlugin>()
          .add([mediaPlugin, { allowMediaSingle: true }])
          .add(selectionPlugin),
      });
    };

    beforeEach(() => {
      stub = createStub();
      rafSpy = jest
        // @ts-ignore
        .spyOn(global, 'requestAnimationFrame')
        .mockImplementation((stub as any).add);
    });

    afterEach(() => {
      rafSpy.mockRestore();
    });

    it('should change selection to gap cursor if media is first', () => {
      const { editorView } = editor(
        doc(
          mediaSingle()(
            media({
              id: 'a559980d-cd47-43e2-8377-27359fcb905f',
              type: 'file',
              collection: 'MediaServicesSample',
            })(),
          ),
          p('Line text'),
        ),
      );
      stub.step();
      expect(editorView.state).toEqualDocumentAndSelection(
        doc(
          '{<gap|>}',
          mediaSingle()(
            media({
              id: 'a559980d-cd47-43e2-8377-27359fcb905f',
              type: 'file',
              collection: 'MediaServicesSample',
            })(),
          ),
          p('Line text'),
        ),
      );
    });

    it('should leave selection as text selection if node is not first', () => {
      const { editorView } = editor(doc(p('Praesent ullamcorper natoque')));
      stub.step();
      expect(editorView.state.selection).toBeInstanceOf(TextSelection);
    });
  });
});
