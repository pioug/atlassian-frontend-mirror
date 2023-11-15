// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  h1,
  indentation,
  ul,
  li,
  ol,
  taskList,
  taskItem,
  layoutSection,
  layoutColumn,
  panel,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { getIndentationButtonsState } from '../../pm-plugins/indentation-buttons';

describe('Indentation buttons state', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      editorProps: {
        showIndentationButtons: true,
        allowIndentation: true,
        allowTextAlignment: true,
        allowTasksAndDecisions: true,
        allowNestedTasks: true,
        allowLayouts: true,
        allowPanel: true,
      },
    });
  };

  const setupEditor = (doc: DocBuilder) => {
    const { editorView, editorAPI } = editor(doc);
    const indentationState = getIndentationButtonsState(
      editorView.state,
      true,
      editorAPI?.taskDecision.sharedState.currentState(),
      editorAPI?.indentation.sharedState.currentState(),
      editorAPI?.list.actions?.isInsideListItem as (
        tr: Transaction,
      ) => boolean | undefined,
    );
    return indentationState;
  };

  describe('Top-level headings and paragraphs', () => {
    it.each([h1, p])('should enable indent button for node', (nodeBuilder) => {
      const { indentDisabled } = setupEditor(
        doc(nodeBuilder('{<>}this is a document')),
      );
      expect(indentDisabled).toBeFalsy();
    });

    it.each([h1, p])(
      'should disable outdent button if node is not indented',
      (nodeBuilder) => {
        const { outdentDisabled } = setupEditor(
          doc(nodeBuilder('this is a document{<>}')),
        );
        expect(outdentDisabled).toBeTruthy();
      },
    );

    it.each([h1, p])(
      'should enable outdent button if node is indented',
      (nodeBuilder) => {
        const { outdentDisabled } = setupEditor(
          doc(indentation({ level: 1 })(nodeBuilder('{<>}hello'))),
        );
        expect(outdentDisabled).toBeFalsy();
      },
    );

    it.each([h1, p])(
      'should disable indent button if node is already indented 6 times',
      (nodeBuilder) => {
        const { indentDisabled } = setupEditor(
          doc(indentation({ level: 6 })(nodeBuilder('hello{<>}'))),
        );
        expect(indentDisabled).toBeTruthy();
      },
    );
  });

  describe('Content inside of layout columns', () => {
    it('should enable indent button if in paragraph', () => {
      const { indentDisabled } = setupEditor(
        doc(
          layoutSection(
            layoutColumn({ width: 50 })(p('hello world{<>}')),
            layoutColumn({ width: 50 })(p()),
          ),
        ),
      );
      expect(indentDisabled).toBeFalsy();
    });

    it('should disable indent button if in first list item', () => {
      const { indentDisabled } = setupEditor(
        doc(
          layoutSection(
            layoutColumn({ width: 50 })(
              ul(li(p('one{<>}')), li(p('two')), li(p('three'))),
            ),
            layoutColumn({ width: 50 })(p()),
          ),
        ),
      );
      expect(indentDisabled).toBeTruthy();
    });

    it('should disable indent button if in a nested block node', () => {
      const { indentDisabled } = setupEditor(
        doc(
          layoutSection(
            layoutColumn({ width: 50 })(panel({ type: 'info' })(p('text{<>}'))),
            layoutColumn({ width: 50 })(p()),
          ),
        ),
      );
      expect(indentDisabled).toBeTruthy();
    });
  });

  describe('Lists and task lists', () => {
    describe('selection is in the first item of a list', () => {
      const listDoc = doc(ul(li(p('first{<>}'))));
      const taskListDoc = doc(taskList()(taskItem()('Hello World {<>}')));

      it.each([listDoc, taskListDoc])('should disable indent button', (doc) => {
        const { indentDisabled } = setupEditor(doc);
        expect(indentDisabled).toBeTruthy();
      });
    });

    describe("selection is in second list item and item isn't indented", () => {
      const listDoc = doc(ul(li(p('first')), li(p('second{<>}'))));
      const taskListDoc = doc(
        taskList()(taskItem()('Hello World'), taskItem()('Hello World{<>}')),
      );

      it.each([listDoc, taskListDoc])('should enable indent button', (doc) => {
        const { indentDisabled } = setupEditor(doc);
        expect(indentDisabled).toBeFalsy();
      });
    });

    describe('selection is in an indented list item', () => {
      const listDoc = doc(ul(li(p('first'), ul(li(p('second{<>}'))))));
      const taskListDoc = doc(
        taskList()(taskItem()('First'), taskList()(taskItem()('Second{<>}'))),
      );

      it.each([listDoc, taskListDoc])('should enable outdent button', (doc) => {
        const { outdentDisabled } = setupEditor(doc);
        expect(outdentDisabled).toBeFalsy();
      });
    });

    describe('selection is in a list item that has been indented 6 times', () => {
      const listDoc = doc(
        ol()(
          li(
            p('one'),
            ol()(
              li(
                p('two'),
                ol()(
                  li(
                    p('three'),
                    ol()(
                      li(
                        p('four'),
                        ol()(
                          li(p('five'), ol()(li(p('six{<>}')), li(p('seven')))),
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
      const taskListDoc = doc(
        taskList()(
          taskItem()('One'),
          taskList()(
            taskItem()('Two'),
            taskList()(
              taskItem()('Three'),
              taskList()(
                taskItem()('Four'),
                taskList()(
                  taskItem()('Five'),
                  taskList()(taskItem()('Six{<>}')),
                ),
              ),
            ),
          ),
        ),
      );

      it.each([listDoc, taskListDoc])('should disable indent button', (doc) => {
        const { indentDisabled } = setupEditor(doc);
        expect(indentDisabled).toBeTruthy();
      });
    });

    describe('TaskList', () => {
      it('should disable outdent button if in first TaskList item', () => {
        const { outdentDisabled } = setupEditor(
          doc(taskList()(taskItem()('Hello World {<>}'))),
        );
        expect(outdentDisabled).toBeTruthy();
      });
    });

    describe('Lists', () => {
      it('should enable outdent button if selection is in first listItem of a list', () => {
        const { outdentDisabled } = setupEditor(doc(ul(li(p('first{<>}')))));
        expect(outdentDisabled).toBeFalsy();
      });
    });
  });
});
