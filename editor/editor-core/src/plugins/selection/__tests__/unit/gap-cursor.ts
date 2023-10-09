import type { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
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
  mediaSingle,
  media,
  panelNote,
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { insertText } from '@atlaskit/editor-test-helpers/transactions';

import { setTextSelection } from '../../../../index';
import {
  setGapCursorSelection,
  GapCursorSelection,
  Side,
} from '@atlaskit/editor-common/selection';

import type {
  BlockNodesKeys,
  LeafBlockNodesKeys,
  BlockContainerNodesKeys,
} from './_gap-cursor-utils';
import {
  blockNodes,
  leafBlockNodes,
  blockContainerNodes,
} from './_gap-cursor-utils';

import { uuid } from '@atlaskit/adf-schema';
import { gapCursorPluginKey } from '../../pm-plugins/gap-cursor-plugin-key';
import createStub from 'raf-stub';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { mediaPlugin } from '@atlaskit/editor-plugin-media';
import { editorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { focusPlugin } from '@atlaskit/editor-plugin-focus';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { gridPlugin } from '@atlaskit/editor-plugin-grid';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { captionPlugin } from '@atlaskit/editor-plugin-caption';
import selectionPlugin from '../../../selection';
import { copyButtonPlugin } from '@atlaskit/editor-plugin-copy-button';
import { floatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar';

import { hideCaretModifier } from '../../gap-cursor/styles';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { EditorCommand } from '@atlaskit/editor-common/types';

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
                  // added new one ArrowLeft key pressing becasue we have added functionality
                  // for the focusing checkbox input at the action item, and for now need
                  // 2 times press ArrowLeft to move cursor out of list
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
                // added new one ArrowLeft key pressing becasue we have added functionality
                // for the focusing checkbox input at the action item, and for now need
                // 2 times press ArrowLeft to move cursor out of list
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
      // added new one ArrowLeft key pressing becasue we have added functionality
      // for the focusing checkbox input at the action item, and for now need
      // 2 times press ArrowLeft to move cursor out of list
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
    const preset = new Preset<LightEditorPlugin>()
      .add([featureFlagsPlugin, {}])
      .add([analyticsPlugin, {}])
      .add(decorationsPlugin)
      .add(editorDisabledPlugin)
      .add(widthPlugin)
      .add(guidelinePlugin)
      .add(gridPlugin)
      .add(copyButtonPlugin)
      .add(floatingToolbarPlugin)
      .add(focusPlugin)
      .add(captionPlugin)
      .add([mediaPlugin, { allowMediaSingle: true }])
      .add(selectionPlugin);

    const editor = (doc: DocBuilder) => {
      return createProsemirrorEditor<boolean, PluginKey, typeof preset>({
        doc,
        pluginKey: gapCursorPluginKey,
        preset,
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

  describe('when pressing right arrow from inside of a panel', () => {
    it('should hide caret only with gap cursor', () => {
      const { editorView } = editor(doc(panelNote(p('{<>}')), p('text')));

      // Selecting <p />, no gap cursor
      expect(editorView.dom.classList.contains(hideCaretModifier)).toBe(false);

      // Selecting entire panel, no cap cursor
      sendKeyToPm(editorView, 'ArrowRight');
      expect(editorView.dom.classList.contains(hideCaretModifier)).toBe(false);

      // Selecting after the panel, with gap cursor
      sendKeyToPm(editorView, 'ArrowRight');
      expect(editorView.dom.classList.contains(hideCaretModifier)).toBe(true);

      // Selecting second <p />, no cap cursor
      sendKeyToPm(editorView, 'ArrowDown');
      expect(editorView.dom.classList.contains(hideCaretModifier)).toBe(false);
    });
  });

  describe('on calling gap cursor actions', () => {
    describe('displayGapCursor', () => {
      const testDocument = doc(
        code_block({})('1\n2\n3\n4\n5\n6\n'),
        '{<|gap>}',
      );
      it('should toggle plugin state correctly when called', () => {
        const { editorAPI, editorView } = editor(testDocument);

        expect(gapCursorPluginKey.getState(editorView.state)).toStrictEqual({
          selectionIsGapCursor: true,
          displayGapCursor: true,
        });

        // hide cursor
        editorAPI?.core.actions.execute(
          (
            editorAPI?.selection?.commands?.displayGapCursor as (
              toggle: boolean,
            ) => EditorCommand
          )(false),
        );

        expect(gapCursorPluginKey.getState(editorView.state)).toStrictEqual({
          selectionIsGapCursor: true,
          displayGapCursor: false,
        });

        editorAPI?.core.actions.execute(
          (
            editorAPI?.selection?.commands?.displayGapCursor as (
              toggle: boolean,
            ) => EditorCommand
          )(true),
        );

        expect(gapCursorPluginKey.getState(editorView.state)).toStrictEqual({
          selectionIsGapCursor: true,
          displayGapCursor: true,
        });
      });

      it('should keep current selection when hiding gap cursor', () => {
        const { editorAPI, editorView } = editor(testDocument);
        expect(gapCursorPluginKey.getState(editorView.state)).toStrictEqual({
          selectionIsGapCursor: true,
          displayGapCursor: true,
        });

        expect(editorView.state).toEqualDocumentAndSelection(testDocument);

        // hide cursor
        editorAPI?.core.actions.execute(
          (
            editorAPI?.selection?.commands?.displayGapCursor as (
              toggle: boolean,
            ) => EditorCommand
          )(false),
        );

        expect(gapCursorPluginKey.getState(editorView.state)).toStrictEqual({
          selectionIsGapCursor: true,
          displayGapCursor: false,
        });

        expect(
          editorView.state.selection instanceof GapCursorSelection,
        ).toBeTruthy();

        expect(editorView.state).toEqualDocumentAndSelection(testDocument);
      });
    });
  });
});
