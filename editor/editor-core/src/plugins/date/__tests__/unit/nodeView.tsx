import React from 'react';
import { ReactWrapper } from 'enzyme';
import {
  doc,
  taskList,
  taskItem,
} from '@atlaskit/editor-test-helpers/schema-builder';
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

describe('date plugin', () => {
  const createEditor = createProsemirrorEditorFactory();

  beforeEach(() => {
    uuid.setStatic('local-decision');
  });

  afterEach(() => {
    uuid.setStatic(false);
  });

  const editor = (doc: any) => {
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add(datePlugin)
        .add(tasksAndDecisionsPlugin),
    });
  };

  describe('DateNodeView', () => {
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
        dateNode.findWhere(n => n.prop('color') === 'red').length,
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
});
