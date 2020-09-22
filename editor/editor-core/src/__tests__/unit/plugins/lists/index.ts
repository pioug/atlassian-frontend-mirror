import { pluginKey } from '../../../../plugins/lists/pm-plugins/main';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import randomId from '@atlaskit/editor-test-helpers/random-id';

import {
  doc,
  h1,
  ol,
  ul,
  li,
  p,
  panel,
  media,
  mediaSingle,
  br,
  code_block,
  underline,
  layoutSection,
  layoutColumn,
  breakout,
  table,
  tr,
  td,
} from '@atlaskit/editor-test-helpers/schema-builder';

import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import simulatePlatform, {
  Platforms,
} from '@atlaskit/editor-test-helpers/simulatePlatform';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { EditorView } from 'prosemirror-view';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  toggleOrderedList,
  toggleBulletList,
} from '../../../../plugins/lists/commands';
import { insertMediaAsMediaSingle } from '../../../../plugins/media/utils/media-single';
import { INPUT_METHOD } from '../../../../plugins/analytics';

describe('lists', () => {
  const createEditor = createEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: any) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
    return createEditor({
      doc,
      editorProps: {
        appearance: 'full-page',
        allowAnalyticsGASV3: true,
        allowPanel: true,
        allowBreakout: true,
        allowLayouts: { allowBreakout: true },
        allowTables: true,
        media: { allowMediaSingle: true },
        quickInsert: true,
      },
      createAnalyticsEvent,
      pluginKey,
    });
  };

  const testCollectionName = `media-plugin-mock-collection-${randomId()}`;
  const temporaryFileId = `temporary:${randomId()}`;

  describe('keymap', () => {
    describe('when hit enter', () => {
      it('should split list item', () => {
        const { editorView } = editor(doc(ul(li(p('text{<>}')))));
        sendKeyToPm(editorView, 'Enter');
        expect(editorView.state.doc).toEqualDocument(
          doc(ul(li(p('text')), li(p()))),
        );
      });
    });

    describe('when hit Tab', () => {
      let editorView: EditorView;
      beforeEach(() => {
        ({ editorView } = editor(doc(ol(li(p('text')), li(p('text{<>}'))))));
        sendKeyToPm(editorView, 'Tab');
      });

      it('should create a sublist', () => {
        expect(editorView.state.doc).toEqualDocument(
          doc(ol(li(p('text'), ol(li(p('text{<>}')))))),
        );
      });

      it('should call indent analytics V3 event', () => {
        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: 'formatted',
          actionSubject: 'text',
          eventType: 'track',
          actionSubjectId: 'indentation',
          attributes: expect.objectContaining({
            inputMethod: 'keyboard',
            previousIndentationLevel: 1,
            newIndentLevel: 2,
            direction: 'indent',
            indentType: 'list',
          }),
        });
      });
    });

    describe('when hit Backspace', () => {
      const backspaceCheck = (beforeDoc: any, afterDoc: any) => {
        const { editorView } = editor(beforeDoc);
        sendKeyToPm(editorView, 'Backspace');

        const expectedDoc = afterDoc(editorView.state.schema);
        expect(editorView.state.doc.toJSON()).toEqual(expectedDoc.toJSON());

        const { state } = editorView;
        if (expectedDoc.refs['<']) {
          expect(state.selection.from).toEqual(expectedDoc.refs['<']);
          expect(state.selection.to).toEqual(expectedDoc.refs['>']);
        } else {
          expect(state.selection.from).toEqual(expectedDoc.refs['<>']);
          expect(state.selection.empty).toBe(true);
        }
      };

      it('should remove empty paragraph', () => {
        backspaceCheck(
          doc(ol(li(p('text')), li(p('{<>}')))),
          doc(ol(li(p('text{<>}')))),
        );
      });

      it('should move paragraph content back to previous list item', () => {
        backspaceCheck(
          doc(ol(li(p('text')), li(p('{<>}second text')))),
          doc(ol(li(p('text{<>}second text')))),
        );
      });

      it('should remove nested empty paragraph', () => {
        backspaceCheck(
          doc(ol(li(p('text'), ol(li(p('{<>}')))))),
          doc(ol(li(p('text{<>}')))),
        );
      });

      it('should move paragraph content back to previous outdented list item', () => {
        backspaceCheck(
          doc(ol(li(p('text'), ol(li(p('{<>}subtext')))))),
          doc(ol(li(p('text{<>}subtext')))),
        );
      });

      it('should move paragraph content back to previous (nested) list item', () => {
        backspaceCheck(
          doc(ol(li(p('text'), ol(li(p('text'))))), p('{<>}after')),
          doc(ol(li(p('text'), ol(li(p('text{<>}after')))))),
        );
      });

      it('keeps nodes same level as backspaced list item together in same list', () => {
        backspaceCheck(
          doc(
            ol(li(p('{<>}A'), ol(li(p('B')))), li(p('C'))),

            p('after'),
          ),
          doc(
            p('{<>}A'),
            ol(li(p('B')), li(p('C'))),

            p('after'),
          ),
        );
      });

      it('merges two single-level lists when the middle paragraph is backspaced', () => {
        backspaceCheck(
          doc(
            ol(li(p('A')), li(p('B'))),

            p('{<>}middle'),

            ol(li(p('C')), li(p('D'))),
          ),
          doc(ol(li(p('A')), li(p('B{<>}middle')), li(p('C')), li(p('D')))),
        );
      });

      it('merges two double-level lists when the middle paragraph is backspaced', () => {
        backspaceCheck(
          doc(
            ol(li(p('A'), ol(li(p('B')))), li(p('C'))),

            p('{<>}middle'),

            ol(li(p('D'), ol(li(p('E')))), li(p('F'))),
          ),
          doc(
            ol(
              li(p('A'), ol(li(p('B')))),
              li(p('C{<>}middle')),
              li(p('D'), ol(li(p('E')))),
              li(p('F')),
            ),
          ),
        );
      });

      it('moves directly to previous list item if it was empty', () => {
        backspaceCheck(
          doc(
            ol(li(p('nice')), li(p('')), li(p('{<>}text'))),

            p('after'),
          ),
          doc(
            ol(li(p('nice')), li(p('{<>}text'))),

            p('after'),
          ),
        );
      });

      it('moves directly to previous list item if it was empty, but with two paragraphs', () => {
        backspaceCheck(
          doc(
            ol(li(p('nice')), li(p('')), li(p('{<>}text'), p('double'))),

            p('after'),
          ),
          doc(
            ol(li(p('nice')), li(p('{<>}text'), p('double'))),

            p('after'),
          ),
        );
      });

      it('backspaces paragraphs within a list item rather than the item itself', () => {
        backspaceCheck(
          doc(
            ol(li(p('')), li(p('nice'), p('{<>}two'))),

            p('after'),
          ),
          doc(
            ol(li(p('')), li(p('nice{<>}two'))),

            p('after'),
          ),
        );
      });

      it('backspaces line breaks correctly within list items, with content after', () => {
        backspaceCheck(
          doc(
            ol(li(p('')), li(p('nice'), p('two', br(), '{<>}three'))),

            p('after'),
          ),
          doc(
            ol(li(p('')), li(p('nice'), p('two{<>}three'))),

            p('after'),
          ),
        );
      });

      it('backspaces line breaks correctly within list items, with content before', () => {
        backspaceCheck(
          doc(
            ol(li(p('')), li(p('nice'), p('two', br(), br(), '{<>}'))),

            p('after'),
          ),
          doc(
            ol(li(p('')), li(p('nice'), p('two', br(), '{<>}'))),

            p('after'),
          ),
        );
      });

      it('moves text from after list to below mediaSingle in list item', () => {
        backspaceCheck(
          doc(
            ol(
              li(p('')),
              li(
                p('nice'),
                mediaSingle({ layout: 'center' })(
                  media({
                    id: temporaryFileId,
                    type: 'file',
                    collection: testCollectionName,
                    __fileMimeType: 'image/png',
                  })(),
                ),
                p(''),
              ),
            ),

            p('{<>}after'),
          ),
          doc(
            ol(
              li(p('')),
              li(
                p('nice'),
                mediaSingle({ layout: 'center' })(
                  media({
                    id: temporaryFileId,
                    type: 'file',
                    collection: testCollectionName,
                    __fileMimeType: 'image/png',
                  })(),
                ),
                p('{<>}after'),
              ),
            ),
          ),
        );
      });

      it('selects mediaSingle in list if inside the empty paragraph after', () => {
        backspaceCheck(
          doc(
            ol(
              li(p('')),
              li(
                p('nice'),
                mediaSingle({ layout: 'center' })(
                  media({
                    id: temporaryFileId,
                    type: 'file',
                    collection: testCollectionName,
                    __fileMimeType: 'image/png',
                  })(),
                ),
                p('{<>}'),
              ),
            ),

            p('after'),
          ),
          doc(
            ol(
              li(p('')),
              li(
                p('nice'),
                '{<}',
                mediaSingle({ layout: 'center' })(
                  media({
                    id: temporaryFileId,
                    type: 'file',
                    collection: testCollectionName,
                    __fileMimeType: 'image/png',
                  })(),
                ),
                '{>}',
              ),
            ),
            p('after'),
          ),
        );
      });

      it('backspaces mediaSingle in list if selected', () => {
        backspaceCheck(
          doc(
            ol(
              li(p('')),
              li(
                p('nice{<}'),
                mediaSingle({ layout: 'center' })(
                  media({
                    id: temporaryFileId,
                    type: 'file',
                    collection: testCollectionName,
                    __fileMimeType: 'image/png',
                  })(),
                ),
                '{>}',
              ),
            ),
            p('after'),
          ),
          doc(ol(li(p('')), li(p('nice'))), p('{<>}after')),
        );
      });
    });

    describe('when hit Shift-Tab', () => {
      let editorView: EditorView;
      beforeEach(() => {
        ({ editorView } = editor(doc(ol(li(p('One'), ul(li(p('Two{<>}'))))))));
        sendKeyToPm(editorView, 'Shift-Tab');
      });

      it('should outdent the list', () => {
        expect(editorView.state.doc).toEqualDocument(
          doc(ol(li(p('One')), li(p('Two{<>}')))),
        );
      });

      it('should call outdent analytics V3 event', () => {
        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: 'formatted',
          actionSubject: 'text',
          eventType: 'track',
          actionSubjectId: 'indentation',
          attributes: expect.objectContaining({
            inputMethod: 'keyboard',
            previousIndentationLevel: 2,
            newIndentLevel: 1,
            direction: 'outdent',
            indentType: 'list',
          }),
        });
      });
    });

    describe('when hit Cmd-Shift-7', () => {
      simulatePlatform(Platforms.Mac);

      let editorView: EditorView;
      beforeEach(() => {
        ({ editorView } = editor(doc(p('One{<>}'))));
        sendKeyToPm(editorView, 'Cmd-Shift-7');
      });

      it('should create a list', () => {
        expect(editorView.state.doc).toEqualDocument(doc(ol(li(p('One')))));
      });

      it('should call numbered list analytics V3 event', () => {
        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: 'formatted',
          actionSubject: 'text',
          eventType: 'track',
          actionSubjectId: 'numberedList',
          attributes: expect.objectContaining({
            inputMethod: 'keyboard',
          }),
        });
      });
    });

    describe('when hit Cmd-Shift-8', () => {
      simulatePlatform(Platforms.Mac);

      let editorView: EditorView;
      beforeEach(() => {
        ({ editorView } = editor(doc(p('One{<>}'))));
        sendKeyToPm(editorView, 'Cmd-Shift-8');
      });

      it('should create a list', () => {
        expect(editorView.state.doc).toEqualDocument(doc(ul(li(p('One')))));
      });

      it('should call numbered list analytics V3 event', () => {
        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: 'formatted',
          actionSubject: 'text',
          eventType: 'track',
          actionSubjectId: 'bulletedList',
          attributes: expect.objectContaining({
            inputMethod: 'keyboard',
          }),
        });
      });
    });
  });

  describe('quick insert', () => {
    describe('Numbered list', () => {
      let editorView: EditorView;
      let sel: number;

      beforeEach(() => {
        ({ editorView, sel } = editor(doc(p('{<>}'))));

        insertText(editorView, '/Numbered List', sel);
        sendKeyToPm(editorView, 'Enter');
      });

      it('should insert a numbered list', () => {
        expect(editorView.state.doc).toEqualDocument(doc(ol(li(p('{<>}')))));
      });

      it('should fire Analytics GAS V3 events', () => {
        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: 'formatted',
          actionSubject: 'text',
          eventType: 'track',
          actionSubjectId: 'numberedList',
          attributes: expect.objectContaining({
            inputMethod: 'quickInsert',
          }),
        });
      });
    });

    describe('Unordered list', () => {
      let editorView: EditorView;
      let sel: number;

      beforeEach(() => {
        ({ editorView, sel } = editor(doc(p('{<>}'))));

        insertText(editorView, '/bullet', sel);
        sendKeyToPm(editorView, 'Enter');
      });

      it('should insert an unordered list', () => {
        expect(editorView.state.doc).toEqualDocument(doc(ul(li(p('{<>}')))));
      });

      it('should fire Analytics GAS V3 events when inserting a unordered list', () => {
        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: 'formatted',
          actionSubject: 'text',
          eventType: 'track',
          actionSubjectId: 'bulletedList',
          attributes: expect.objectContaining({
            inputMethod: 'quickInsert',
          }),
        });
      });
    });
  });

  describe('API', () => {
    it('should allow toggling between normal text and ordered list', () => {
      const { editorView } = editor(doc(p('t{a}ex{b}t')));

      toggleOrderedList(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(ol(li(p('text')))));
      toggleOrderedList(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });

    it('should allow toggling between normal text and bullet list', () => {
      const { editorView } = editor(doc(p('t{<}ex{>}t')));

      toggleBulletList(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(ul(li(p('text')))));
      toggleBulletList(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });

    it('should allow toggling between ordered and bullet list', () => {
      const { editorView } = editor(doc(ol(li(p('t{<}ex{>}t')))));

      toggleBulletList(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(ul(li(p('text')))));
      toggleBulletList(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });

    it('should make sure that it is enabled when selecting ordered list', () => {
      const { pluginState } = editor(doc(ol(li(p('te{<>}xt')))));

      expect(pluginState).toHaveProperty('orderedListActive', true);
      expect(pluginState).toHaveProperty('orderedListDisabled', false);
      expect(pluginState).toHaveProperty('bulletListActive', false);
      expect(pluginState).toHaveProperty('bulletListDisabled', false);
    });

    it('should be disabled when selecting h1', () => {
      const { pluginState } = editor(doc(h1('te{<>}xt')));

      expect(pluginState).toHaveProperty('orderedListActive', false);
      expect(pluginState).toHaveProperty('orderedListDisabled', true);
      expect(pluginState).toHaveProperty('bulletListActive', false);
      expect(pluginState).toHaveProperty('bulletListDisabled', true);
    });

    describe('toggling a list', () => {
      it("shouldn't affect text selection", () => {
        const { editorView } = editor(doc(p('hello{<>}')));

        toggleBulletList(editorView);
        // If the text is not selected, pressing enter will
        // create a new paragraph. If it is selected the
        // 'hello' text will be removed
        sendKeyToPm(editorView, 'Enter');

        expect(editorView.state.doc).toEqualDocument(
          doc(ul(li(p('hello')), li(p('')))),
        );
      });
    });

    describe('untoggling a list', () => {
      const expectedOutput = doc(
        ol(li(p('One'))),
        p('Two'),
        p('Three'),
        ol(li(p('Four'))),
      );

      it('should allow untoggling part of a list based on selection', () => {
        const { editorView } = editor(
          doc(
            ol(li(p('One')), li(p('{<}Two')), li(p('Three{>}')), li(p('Four'))),
          ),
        );

        toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(expectedOutput);
      });

      it('should untoggle empty paragraphs in a list', () => {
        const { editorView } = editor(
          doc(ol(li(p('{<}One')), li(p('Two')), li(p()), li(p('Three{>}')))),
        );

        toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          doc(p('One'), p('Two'), p(), p('Three')),
        );
      });

      it('should untoggle all list items with different ancestors in selection', () => {
        const { editorView } = editor(
          doc(
            ol(li(p('One')), li(p('{<}Two')), li(p('Three'))),
            ol(li(p('One{>}')), li(p('Two'))),
          ),
        );

        toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          doc(
            ol(li(p('One'))),
            p('Two'),
            p('Three'),
            p('One'),
            ol(li(p('Two'))),
          ),
        );
      });

      it('should untoggle list item in the last column of a table cell', () => {
        const { editorView } = editor(
          doc(table()(tr(td()(p('')), td()(ol(li(p('One{<>}'))))))),
        );

        toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          doc(table()(tr(td()(p('')), td()(p('One{<>}'))))),
        );
      });
    });

    describe('converting a list', () => {
      it('should allow converting part of a list based on selection', () => {
        const expectedOutput = doc(
          ol(li(p('One'))),
          ul(li(p('Two')), li(p('Three'))),
          ol(li(p('Four'))),
        );
        const { editorView } = editor(
          doc(
            ol(li(p('One')), li(p('{<}Two')), li(p('Three{>}')), li(p('Four'))),
          ),
        );

        toggleBulletList(editorView);
        expect(editorView.state.doc).toEqualDocument(expectedOutput);
      });

      it('should convert selection inside panel to list', () => {
        const expectedOutput = doc(panel()(ul(li(p('text')))));
        const { editorView } = editor(doc(panel()(p('te{<>}xt'))));

        toggleBulletList(editorView);
        expect(editorView.state.doc).toEqualDocument(expectedOutput);
      });

      it('should allow converting part of a list based on selection that starts at the end of previous line', () => {
        const expectedOutput = doc(
          ol(li(p('One'))),
          ul(li(p('Two')), li(p('Three'))),
          ol(li(p('Four'))),
        );
        const { editorView } = editor(
          doc(
            ol(li(p('One{<}')), li(p('Two')), li(p('Three{>}')), li(p('Four'))),
          ),
        ); // When selection starts on previous (empty) node

        toggleBulletList(editorView);
        expect(editorView.state.doc).toEqualDocument(expectedOutput);
      });

      it('should convert selection to a list when the selection starts with a paragraph and ends inside a list', () => {
        const expectedOutput = doc(
          ol(li(p('One')), li(p('Two')), li(p('Three')), li(p('Four'))),
        );
        const { editorView } = editor(
          doc(p('{<}One'), ol(li(p('Two{>}')), li(p('Three')), li(p('Four')))),
        );

        toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(expectedOutput);
      });

      it('should convert selection to a list when the selection contains a list but starts and end with paragraphs', () => {
        const expectedOutput = doc(
          ol(li(p('One')), li(p('Two')), li(p('Three')), li(p('Four'))),
        );
        const { editorView } = editor(
          doc(p('{<}One'), ol(li(p('Two')), li(p('Three'))), p('Four{>}')),
        );

        toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(expectedOutput);
      });

      it('should convert selection to a list when the selection starts inside a list and ends with a paragraph', () => {
        const expectedOutput = doc(
          ol(li(p('One')), li(p('Two')), li(p('Three')), li(p('Four'))),
        );
        const { editorView } = editor(
          doc(ol(li(p('One')), li(p('{<}Two')), li(p('Three'))), p('Four{>}')),
        );

        toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(expectedOutput);
      });

      it('should convert selection to a list and keep empty paragraphs', () => {
        const expectedOutput = doc(
          ul(li(p('One')), li(p('Two')), li(p()), li(p('Three'))),
        );
        const { editorView } = editor(
          doc(ol(li(p('{<}One')), li(p('Two')), li(p()), li(p('Three{>}')))),
        );

        toggleBulletList(editorView);
        expect(editorView.state.doc).toEqualDocument(expectedOutput);
      });

      it('should convert selection to list when there is an empty paragraph between non empty two', () => {
        const expectedOutput = doc(ul(li(p('One')), li(p()), li(p('Three'))));
        const { editorView } = editor(doc(p('{<}One'), p(), p('Three{>}')));

        toggleBulletList(editorView);
        expect(editorView.state.doc).toEqualDocument(expectedOutput);
      });

      it('should convert selection to a list when it is a paragraph with supported marks', () => {
        const expectedOutput = doc(
          ul(li(p('One')), li(p(underline('Two'))), li(p('Three'))),
        );
        const { editorView } = editor(
          doc(p('{<}One'), p(underline('Two')), p('Three{>}')),
        );

        toggleBulletList(editorView);
        expect(editorView.state.doc).toEqualDocument(expectedOutput);
      });

      it('should retain breakout marks on ancestor when toggling list within a layout', () => {
        const expectedOutput = doc(
          breakout({ mode: 'wide' })(
            layoutSection(
              layoutColumn({ width: 33.33 })(p('')),
              layoutColumn({ width: 33.33 })(ul(li(p('One')))),
              layoutColumn({ width: 33.33 })(p('')),
            ),
          ),
        );

        const { editorView } = editor(
          doc(
            breakout({ mode: 'wide' })(
              layoutSection(
                layoutColumn({ width: 33.33 })(p('')),
                layoutColumn({ width: 33.33 })(p('{<}One{>}')),
                layoutColumn({ width: 33.33 })(p('')),
              ),
            ),
          ),
        );

        toggleBulletList(editorView);
        expect(editorView.state.doc).toEqualDocument(expectedOutput);
      });

      it('should toggle list item in the last column of a table cell', () => {
        const { editorView } = editor(
          doc(table()(tr(td()(p('')), td()(p('One{<>}'))))),
        );

        toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          doc(table()(tr(td()(p('')), td()(ol(li(p('One{<>}'))))))),
        );
      });
    });

    describe('joining lists', () => {
      const expectedOutputForPreviousList = doc(
        ol(
          li(p('One')),
          li(p('Two')),
          li(p('Three')),
          li(p('Four')),
          li(p('Five')),
        ),
        p('Six'),
      );
      const expectedOutputForNextList = doc(
        p('One'),
        ol(
          li(p('Two')),
          li(p('Three')),
          li(p('Four')),
          li(p('Five')),
          li(p('Six')),
        ),
      );
      const expectedOutputForPreviousAndNextList = doc(
        ol(
          li(p('One')),
          li(p('Two')),
          li(p('Three')),
          li(p('Four')),
          li(p('Five')),
          li(p('Six')),
        ),
      );

      it("should join with previous list if it's of the same type", () => {
        const { editorView } = editor(
          doc(
            ol(li(p('One')), li(p('Two')), li(p('Three'))),
            p('{<}Four'),
            p('Five{>}'),
            p('Six'),
          ),
        );

        toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          expectedOutputForPreviousList,
        );
      });

      it("should join with previous list if it's of the same type and selection starts at the end of previous line", () => {
        const { editorView } = editor(
          doc(
            ol(li(p('One')), li(p('Two')), li(p('Three{<}'))),
            p('Four'),
            p('Five{>}'),
            p('Six'),
          ),
        ); // When selection starts on previous (empty) node

        toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          expectedOutputForPreviousList,
        );
      });

      it("should not join with previous list if it's not of the same type", () => {
        const { editorView } = editor(
          doc(
            ol(li(p('One')), li(p('Two')), li(p('Three'))),
            p('{<}Four'),
            p('Five{>}'),
            p('Six'),
          ),
        );

        toggleBulletList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          doc(
            ol(li(p('One')), li(p('Two')), li(p('Three'))),
            ul(li(p('Four')), li(p('Five'))),
            p('Six'),
          ),
        );
      });

      it("should not join with previous list if it's not of the same type and selection starts at the end of previous line", () => {
        const { editorView } = editor(
          doc(
            ol(li(p('One')), li(p('Two')), li(p('Three{<}'))),
            p('Four'),
            p('Five{>}'),
            p('Six'),
          ),
        ); // When selection starts on previous (empty) node

        toggleBulletList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          doc(
            ol(li(p('One')), li(p('Two')), li(p('Three'))),
            ul(li(p('Four')), li(p('Five'))),
            p('Six'),
          ),
        );
      });

      it("should join with next list if it's of the same type", () => {
        const { editorView } = editor(
          doc(
            p('One'),
            p('{<}Two'),
            p('Three{>}'),
            ol(li(p('Four')), li(p('Five')), li(p('Six'))),
          ),
        );

        toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(expectedOutputForNextList);
      });

      it("should join with next list if it's of the same type and selection starts at the end of previous line", () => {
        const { editorView } = editor(
          doc(
            p('One{<}'),
            p('Two'),
            p('Three{>}'),
            ol(li(p('Four')), li(p('Five')), li(p('Six'))),
          ),
        );

        toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(expectedOutputForNextList);
      });

      it("should not join with next list if it isn't of the same type", () => {
        const { editorView } = editor(
          doc(
            p('One'),
            p('{<}Two'),
            p('Three{>}'),
            ol(li(p('Four')), li(p('Five')), li(p('Six'))),
          ),
        );

        toggleBulletList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('One'),
            ul(li(p('Two')), li(p('Three'))),
            ol(li(p('Four')), li(p('Five')), li(p('Six'))),
          ),
        );
      });

      it("should not join with next list if it isn't of the same type and selection starts at the end of previous line", () => {
        const { editorView } = editor(
          doc(
            p('One{<}'),
            p('Two'),
            p('Three{>}'),
            ol(li(p('Four')), li(p('Five')), li(p('Six'))),
          ),
        );

        toggleBulletList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('One'),
            ul(li(p('Two')), li(p('Three'))),
            ol(li(p('Four')), li(p('Five')), li(p('Six'))),
          ),
        );
      });

      it("should join with previous and next list if they're of the same type", () => {
        const { editorView } = editor(
          doc(
            ol(li(p('One')), li(p('Two'))),
            p('{<}Three'),
            p('Four{>}'),
            ol(li(p('Five')), li(p('Six'))),
          ),
        );

        toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          expectedOutputForPreviousAndNextList,
        );
      });

      it("should join with previous and next list if they're of the same type and selection starts at the end of previous line", () => {
        const { editorView } = editor(
          doc(
            ol(li(p('One')), li(p('Two{<}'))),
            p('Three'),
            p('Four{>}'),
            ol(li(p('Five')), li(p('Six'))),
          ),
        );

        toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          expectedOutputForPreviousAndNextList,
        );
      });

      it("should not join with previous and next list if they're not of the same type", () => {
        const { editorView } = editor(
          doc(
            ol(li(p('One')), li(p('Two'))),
            p('{<}Three'),
            p('Four{>}'),
            ol(li(p('Five')), li(p('Six'))),
          ),
        );

        toggleBulletList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          doc(
            ol(li(p('One')), li(p('Two'))),
            ul(li(p('Three')), li(p('Four'))),
            ol(li(p('Five')), li(p('Six'))),
          ),
        );
      });

      it("should not join with previous and next list if they're not of the same type and selectoin starts at the end of previous line", () => {
        const { editorView } = editor(
          doc(
            ol(li(p('One')), li(p('Two{<}'))),
            p('Three'),
            p('Four{>}'),
            ol(li(p('Five')), li(p('Six'))),
          ),
        );

        toggleBulletList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          doc(
            ol(li(p('One')), li(p('Two'))),
            ul(li(p('Three')), li(p('Four'))),
            ol(li(p('Five')), li(p('Six'))),
          ),
        );
      });
    });

    describe('Nested Lists', () => {
      describe('When gap cursor is inside listItem before codeBlock', () => {
        it('should increase the depth of list item when Tab key press', () => {
          const { editorView } = editor(
            doc(
              ol(
                li(p('text')),
                li('{<gap|>}', code_block()('text')),
                li(p('text')),
              ),
            ),
          );
          expect(editorView.state.selection.$from.depth).toEqual(2);

          sendKeyToPm(editorView, 'Tab');
          expect(editorView.state.selection.$from.depth).toEqual(4);
        });

        it('should decrease the depth of list item when Shift-Tab key press', () => {
          const { editorView } = editor(
            doc(
              ol(
                li(p('text'), ol(li('{<gap|>}', code_block()('text')))),
                li(p('text')),
              ),
            ),
          );
          expect(editorView.state.selection.$from.depth).toEqual(4);

          sendKeyToPm(editorView, 'Shift-Tab');
          expect(editorView.state.selection.$from.depth).toEqual(2);
        });
      });

      it('should increase the depth of list item when Tab key press', () => {
        const { editorView } = editor(
          doc(ol(li(p('text')), li(p('te{<>}xt')), li(p('text')))),
        );
        expect(editorView.state.selection.$from.depth).toEqual(3);

        sendKeyToPm(editorView, 'Tab');

        expect(editorView.state.selection.$from.depth).toEqual(5);
      });

      it("shouldn't increase the depth of list item when Tab key press when at 6 levels indentation", () => {
        const { editorView } = editor(
          doc(
            ol(
              li(
                p('first'),
                ol(
                  li(
                    p('second'),
                    ol(
                      li(
                        p('third'),
                        ol(
                          li(
                            p('fourth'),
                            ol(
                              li(
                                p('fifth'),
                                ol(li(p('sixth'), p('maybe seventh{<>}'))),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        );

        expect(editorView.state.selection.$from.depth).toEqual(13);

        sendKeyToPm(editorView, 'Tab');

        expect(editorView.state.selection.$from.depth).toEqual(13);
      });

      it("shouldn't increase the depth of list item when Tab key press when a child list at 6 levels indentation", () => {
        const { editorView } = editor(
          doc(
            ol(
              li(
                p('first'),
                ol(
                  li(
                    p('second'),
                    ol(
                      li(
                        p('third'),
                        ol(
                          li(
                            p('fourth'),
                            ol(
                              li(p('fifth')),
                              li(p('{<}fifth{>}'), ol(li(p('sixth')))),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        );

        expect(editorView.state.selection.$from.depth).toEqual(11);

        sendKeyToPm(editorView, 'Tab');

        expect(editorView.state.selection.$from.depth).toEqual(11);
      });

      it('should nest the list item when Tab key press', () => {
        const { editorView } = editor(
          doc(ol(li(p('text')), li(p('te{<>}xt')), li(p('text')))),
        );

        sendKeyToPm(editorView, 'Tab');

        expect(editorView.state.doc).toEqualDocument(
          doc(ol(li(p('text'), ol(li(p('te{<>}xt')))), li(p('text')))),
        );
      });

      it('should decrease the depth of list item when Shift-Tab key press', () => {
        const { editorView } = editor(
          doc(ol(li(p('text'), ol(li(p('te{<>}xt')))), li(p('text')))),
        );
        expect(editorView.state.selection.$from.depth).toEqual(5);

        sendKeyToPm(editorView, 'Shift-Tab');

        expect(editorView.state.selection.$from.depth).toEqual(3);
      });

      it('should lift the list item when Shift-Tab key press', () => {
        const { editorView } = editor(
          doc(ol(li(p('text'), ol(li(p('te{<>}xt')))), li(p('text')))),
        );

        sendKeyToPm(editorView, 'Shift-Tab');

        expect(editorView.state.doc).toEqualDocument(
          doc(ol(li(p('text')), li(p('te{<>}xt')), li(p('text')))),
        );
      });

      it('should lift nested and same level list items correctly', () => {
        const { editorView } = editor(
          doc(
            ol(li(p('some{<>}text'), ol(li(p('B')))), li(p('C'))),

            p('after'),
          ),
        );

        sendKeyToPm(editorView, 'Shift-Tab');

        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('some{<>}text'),
            ol(li(p('B')), li(p('C'))),

            p('after'),
          ),
        );
      });

      it('should lift the list item when Enter key press is done on empty list-item', () => {
        const { editorView } = editor(
          doc(ol(li(p('text'), ol(li(p('{<>}')))), li(p('text')))),
        );

        sendKeyToPm(editorView, 'Enter');

        expect(editorView.state.doc).toEqualDocument(
          doc(ol(li(p('text')), li(p('{<>}')), li(p('text')))),
        );
      });
    });

    describe('Enter key-press', () => {
      describe('when Enter key is pressed on empty nested list item', () => {
        it('should create new list item in parent list', () => {
          const { editorView } = editor(
            doc(ol(li(p('text'), ol(li(p('{<>}')))), li(p('text')))),
          );

          sendKeyToPm(editorView, 'Enter');

          expect(editorView.state.doc).toEqualDocument(
            doc(ol(li(p('text')), li(p('{<>}')), li(p('text')))),
          );
        });
      });

      describe('when Enter key is pressed on non-empty nested list item', () => {
        it('should created new nested list item', () => {
          const { editorView } = editor(
            doc(ol(li(p('text'), ol(li(p('test{<>}')))), li(p('text')))),
          );

          sendKeyToPm(editorView, 'Enter');

          expect(editorView.state.doc).toEqualDocument(
            doc(
              ol(
                li(p('text'), ol(li(p('test')), li(p('{<>}')))),
                li(p('text')),
              ),
            ),
          );
        });
      });

      describe('when Enter key is pressed on non-empty top level list item', () => {
        it('should created new list item at top level', () => {
          const { editorView } = editor(
            doc(ol(li(p('text')), li(p('test{<>}')), li(p('text')))),
          );

          sendKeyToPm(editorView, 'Enter');

          expect(editorView.state.doc).toEqualDocument(
            doc(ol(li(p('text')), li(p('test')), li(p('{<>}')), li(p('text')))),
          );
        });
      });

      describe('when Enter key is pressed on non-empty top level list item inside panel', () => {
        it('should created new list item at top level', () => {
          const { editorView } = editor(
            doc(panel()(ol(li(p('text')), li(p('test{<>}')), li(p('text'))))),
          );

          sendKeyToPm(editorView, 'Enter');

          expect(editorView.state.doc).toEqualDocument(
            doc(
              panel()(
                ol(li(p('text')), li(p('test')), li(p('{<>}')), li(p('text'))),
              ),
            ),
          );
        });
      });

      describe('when Enter key is pressed on empty top level list item', () => {
        it('should create new paragraph outside the list', () => {
          const { editorView } = editor(
            doc(ol(li(p('text')), li(p('{<>}')), li(p('text')))),
          );

          sendKeyToPm(editorView, 'Enter');

          expect(editorView.state.doc).toEqualDocument(
            doc(ol(li(p('text'))), p('{<>}'), ol(li(p('text')))),
          );
        });
      });

      describe('when Enter key is pressed on empty top level list item inside panel', () => {
        it('should create new paragraph outside the list', () => {
          const { editorView } = editor(
            doc(panel()(ol(li(p('text')), li(p('{<>}')), li(p('text'))))),
          );

          sendKeyToPm(editorView, 'Enter');

          expect(editorView.state.doc).toEqualDocument(
            doc(panel()(ol(li(p('text'))), p('{<>}'), ol(li(p('text'))))),
          );
        });
      });
    });

    describe('Toggle - nested list scenarios - to lift items out of list', () => {
      it('should be possible to toggle a simple nested list', () => {
        const { editorView } = editor(
          doc(ol(li(p('text'), ol(li(p('text{<>}')))), li(p('text')))),
        );

        toggleOrderedList(editorView);

        expect(editorView.state.doc).toEqualDocument(
          doc(ol(li(p('text'))), p('text{<>}'), ol(li(p('text')))),
        );
      });

      it('should be possible to toggle an empty nested list item', () => {
        const { editorView } = editor(
          doc(ol(li(p('text'), ol(li(p('{<>}')))), li(p('text')))),
        );

        toggleOrderedList(editorView);

        expect(editorView.state.doc).toEqualDocument(
          doc(ol(li(p('text'))), p('{<>}'), ol(li(p('text')))),
        );
      });

      it('should be possible to toggle a selection across different depths in the list', () => {
        const { editorView } = editor(
          doc(ol(li(p('te{<}xt'), ol(li(p('text{>}')))), li(p('text')))),
        );

        toggleOrderedList(editorView);

        expect(editorView.state.doc).toEqualDocument(
          doc(p('te{<}xt'), p('text{>}'), ol(li(p('text')))),
        );
      });

      it('should be possible to toggle a selection across lists with different parent lists', () => {
        const { editorView } = editor(
          doc(
            ol(li(p('te{<}xt'), ol(li(p('text'))))),
            ol(li(p('te{>}xt'), ol(li(p('text'))))),
          ),
        );

        toggleOrderedList(editorView);

        expect(editorView.state.doc).toEqualDocument(
          doc(p('te{<}xt'), p('text'), p('te{>}xt'), ol(li(p('text')))),
        );
      });

      it('should be create a new list for children of lifted list item', () => {
        const { editorView } = editor(
          doc(
            ol(
              li(p('text'), ol(li(p('te{<>}xt'), ol(li(p('text')))))),
              li(p('text')),
            ),
          ),
        );

        toggleOrderedList(editorView);

        expect(editorView.state.doc).toEqualDocument(
          doc(
            ol(li(p('text'))),
            p('te{<>}xt'),
            ol(li(p('text')), li(p('text'))),
          ),
        );
      });

      it('should only change type to bullet list when toggling orderedList to bulletList', () => {
        const { editorView } = editor(
          doc(
            ol(
              li(p('text'), ol(li(p('text'), ol(li(p('te{<>}xt')))))),
              li(p('text')),
            ),
          ),
        );

        toggleBulletList(editorView);

        expect(editorView.state.doc).toEqualDocument(
          doc(
            ol(
              li(p('text'), ol(li(p('text'), ul(li(p('te{<>}xt')))))),
              li(p('text')),
            ),
          ),
        );
      });
    });

    describe('when adding media inside list', () => {
      it('should add media as media single', () => {
        const { editorView } = editor(
          doc(ul(li(p('Three')), li(p('Four{<>}')))),
        );

        insertMediaAsMediaSingle(
          editorView,
          media({
            id: temporaryFileId,
            type: 'file',
            collection: testCollectionName,
            __fileMimeType: 'image/png',
          })()(editorView.state.schema),
          INPUT_METHOD.PICKER_CLOUD,
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(
            ul(
              li(p('Three')),
              li(
                p('Four'),
                mediaSingle({ layout: 'center' })(
                  media({
                    id: temporaryFileId,
                    type: 'file',
                    collection: testCollectionName,
                    __fileMimeType: 'image/png',
                  })(),
                ),
              ),
            ),
          ),
        );
      });

      it('should not add non images inside lists', () => {
        const { editorView } = editor(
          doc(ul(li(p('Three')), li(p('Four{<>}')))),
        );

        insertMediaAsMediaSingle(
          editorView,
          media({
            id: temporaryFileId,
            type: 'file',
            collection: testCollectionName,
            __fileMimeType: 'pdf',
          })()(editorView.state.schema),
          INPUT_METHOD.PICKER_CLOUD,
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(ul(li(p('Three')), li(p('Four{<>}')))),
        );
      });
    });
  });
});
