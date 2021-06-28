import React from 'react';
import { ReactWrapper } from 'enzyme';
import { EditorState } from 'prosemirror-state';
import {
  doc,
  date,
  p as paragraph,
  taskList,
  taskItem,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  Preset,
  createProsemirrorEditorFactory,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { uuid } from '@atlaskit/adf-schema';

import { insertDate } from '../../actions';
import DateNodeView from '../../nodeviews/date';

// Editor plugins
import datePlugin from '../../index';
import tasksAndDecisionsPlugin from '../../../tasks-and-decisions';

const getDatePosition = (state: EditorState): number => {
  let datePos: number | undefined;

  state.doc.nodesBetween(0, state.doc.nodeSize - 2, (node, pos) => {
    if (node.type === state.schema.nodes.date) {
      datePos = pos;
      return false;
    }
    return datePos === undefined;
  });

  if (datePos === undefined) {
    throw new Error('Document does not have a Date node.');
  }

  return datePos;
};

describe('date plugin', () => {
  const createEditor = createProsemirrorEditorFactory();

  beforeEach(() => {
    uuid.setStatic('local-decision');
  });

  afterEach(() => {
    uuid.setStatic(false);
  });

  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add(datePlugin)
        .add(tasksAndDecisionsPlugin),
    });
  };

  describe('DateNodeView', () => {
    // These tests don't pass getPos() to nodeView and forces it to rely on
    // selection.$from to determine the parent for the Date node.
    describe('with focus on taskItem', () => {
      it('should set color to red for past dates in action item', () => {
        const { editorView: view } = editor(
          doc(
            taskList({ localId: 'local-highlight' })(
              taskItem({ localId: 'local-highlight' })('Hello World {<>}'),
            ),
          ),
        );
        const date = new Date();
        insertDate({
          year: date.getFullYear(),
          month: date.getMonth(),
          day: date.getDate() - 2,
        })(view.state, view.dispatch);
        const dateNode = mountWithIntl(
          <DateNodeView
            view={view}
            node={view.state.doc.nodeAt(view.state.selection.$from.pos)!}
          />,
        );
        expect(
          dateNode.findWhere((n) => n.prop('color') === 'red').length,
        ).toBeGreaterThan(1);
      });

      it('should not set color to red for past dates in completed action item', () => {
        const { editorView: view } = editor(
          doc(
            taskList({ localId: 'local-highlight' })(
              taskItem({ localId: 'local-highlight', state: 'DONE' })(
                'Hello World {<>}',
              ),
            ),
          ),
        );
        const date = new Date();
        insertDate({
          year: date.getFullYear(),
          month: date.getMonth(),
          day: date.getDate() - 2,
        })(view.state, view.dispatch);
        const dateNode = mountWithIntl(
          <DateNodeView
            view={view}
            node={view.state.doc.nodeAt(view.state.selection.$from.pos)!}
          />,
        );
        expect(
          dateNode.find((n: ReactWrapper) => n.prop('color') === 'red').length,
        ).toEqual(0);
      });
    });

    // These tests pass getPos() to nodeView and gives an accurate
    // position to determine the parent for the Date node.
    describe('with focus off taskItem', () => {
      it('should set color to red for past dates in action item', () => {
        // For some reason, isPastDate() is false unless we use a date
        // before 2017-08-16. It uses todayTimestampInUTC() which constantly
        // returns the wrong date during tests.
        // Date(2014, 10, 12);
        const timestamp = `1415710800000`;

        const { editorView: view } = editor(
          doc(
            paragraph('Paragraph{<>}'),
            taskList({ localId: 'local-highlight' })(
              taskItem({ localId: 'local-highlight' })(
                date({ timestamp }),
                ' is in the past',
              ),
            ),
          ),
        );

        const { state } = view;
        const datePos: number = getDatePosition(state);
        const dateNode = mountWithIntl(
          <DateNodeView
            view={view}
            node={state.doc.nodeAt(datePos)!}
            getPos={() => datePos as number}
          />,
        );

        expect(dateNode.find('Date').prop('color')).toEqual('red');
      });

      it('should not set color to red for past dates in completed action item', () => {
        const timestamp = `${Date.now()}`;
        const { editorView: view } = editor(
          doc(
            paragraph('Paragraph{<>}'),
            taskList({ localId: 'local-highlight' })(
              taskItem({ localId: 'local-highlight', state: 'DONE' })(
                date({ timestamp }),
                ' is today',
              ),
            ),
          ),
        );

        const { state } = view;
        const datePos: number = getDatePosition(state);
        const dateNode = mountWithIntl(
          <DateNodeView
            view={view}
            node={state.doc.nodeAt(datePos)!}
            getPos={() => datePos as number}
          />,
        );

        expect(dateNode.find('Date').prop('color')).toEqual('grey');
      });
    });
  });
});
